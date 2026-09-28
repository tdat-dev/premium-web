#!/usr/bin/env node
// Copyright (c) 2026 ByteWaker. Licensed under Apache-2.0.
// Part of build-premium-website: https://github.com/tdat-dev/premium-web
// Redistribution must retain this notice, LICENSE, and NOTICE.

import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const VERSION = '1.1.0';
const SUPPORTED = new Set([
  '.html', '.htm', '.css', '.scss', '.sass', '.less',
  '.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.vue', '.svelte', '.astro',
]);
const IGNORED_DIRS = new Set([
  '.git', '.next', '.nuxt', '.output', '.svelte-kit',
  'node_modules', 'dist', 'build', 'coverage', 'vendor',
]);
const MAX_FILE_BYTES = 2 * 1024 * 1024;

const boundaries = [
  'This audit is lexical and regex-based; it can produce false positives and false negatives.',
  'It does not render the site, understand brand strategy, inspect runtime state, verify rights, or judge visual quality.',
  'BLOCKER_CANDIDATE means a human must check a possible production-gate defect; it is not an automatic blocker.',
  'ADVISORY means a familiar implementation or generator fingerprint deserves contextual review; it is not a ban.',
  'The audit cannot decide originality, beauty, Awwwards caliber, monetary value, production readiness, or release.',
];

function usage() {
  return [
    'Usage: node audit-ai-slop.mjs [target-directory] [--json]',
    'Scans supported text-based frontend files without modifying them.',
  ].join('\n');
}

function lineAt(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function excerpt(source, index, length = 100) {
  const start = Math.max(0, source.lastIndexOf('\n', index - 1) + 1);
  const endOfLine = source.indexOf('\n', index);
  const end = endOfLine === -1 ? source.length : endOfLine;
  return source.slice(start, end).trim().slice(0, length);
}

async function collectFiles(root) {
  const files = [];

  async function walk(directory) {
    const entries = await readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.') && entry.isDirectory() && !['.storybook'].includes(entry.name)) continue;
      if (entry.isDirectory() && IGNORED_DIRS.has(entry.name)) continue;

      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && SUPPORTED.has(path.extname(entry.name).toLowerCase())) {
        const info = await stat(fullPath);
        if (info.size <= MAX_FILE_BYTES) files.push(fullPath);
      }
    }
  }

  await walk(root);
  return files;
}

function addRegexFindings(findings, { source, file, root, level, id, pattern, message }) {
  const regex = new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
  for (const match of source.matchAll(regex)) {
    findings.push({
      level,
      id,
      file: path.relative(root, file).replaceAll('\\', '/'),
      line: lineAt(source, match.index),
      evidence: excerpt(source, match.index),
      message,
      manual_review_required: true,
    });
  }
}

function auditFile(source, file, root, findings) {
  addRegexFindings(findings, {
    source, file, root,
    level: 'BLOCKER_CANDIDATE',
    id: 'RUNTIME_HIDDEN_CONTENT',
    pattern: /(?:opacity\s*:\s*0\b|visibility\s*:\s*hidden\b|autoAlpha\s*:\s*0\b)/gi,
    message: 'Content may start hidden. Verify that essential information and actions remain available when animation or JavaScript fails.',
  });

  for (const match of source.matchAll(/<img\b[^>]*>/gis)) {
    if (!/\balt\s*=/.test(match[0])) {
      findings.push({
        level: 'BLOCKER_CANDIDATE',
        id: 'IMAGE_WITHOUT_ALT_ATTRIBUTE',
        file: path.relative(root, file).replaceAll('\\', '/'),
        line: lineAt(source, match.index),
        evidence: match[0].replace(/\s+/g, ' ').slice(0, 120),
        message: 'An HTML image lacks an alt attribute. Determine whether it needs meaningful alt text or an explicit empty alt.',
        manual_review_required: true,
      });
    }
  }

  addRegexFindings(findings, {
    source, file, root,
    level: 'BLOCKER_CANDIDATE',
    id: 'PLACEHOLDER_ASSET_OR_PROOF',
    pattern: /(?:src|poster)\s*=\s*["'][^"']*(?:placeholder|todo|replace-me)[^"']*["']|(?:TODO|FIXME)\s*:\s*(?:asset|testimonial|customer|metric|proof)/gi,
    message: 'A placeholder asset or proof marker may remain. Verify the asset, claim source, and completion status.',
  });

  addRegexFindings(findings, {
    source, file, root,
    level: 'ADVISORY',
    id: 'GENERIC_TRANSFORMATION_COPY',
    pattern: /\b(?:unlock|elevate|reimagine|revolutioni[sz]e|seamless|next[- ]generation|future of|empower|transform your|supercharge)\b/gi,
    message: 'Generic transformation language detected. Apply the fact/source and competitor-swap review before retaining it.',
  });

  addRegexFindings(findings, {
    source, file, root,
    level: 'ADVISORY',
    id: 'AI_TONE_COPY',
    pattern: /\b(?:robust|cutting[- ]edge|world[- ]class|best[- ]in[- ]class|game[- ]?changer|effortless|holistic|comprehensive solution|peace of mind|at your fingertips|in today['’]s (?:fast[- ]paced )?world|look no further|say goodbye to|whether you['’]re|it['’]s not just|giải pháp toàn diện|trải nghiệm đỉnh cao|nâng tầm|khẳng định vị thế|đồng hành cùng|bứt phá|kiến tạo)\b/gi,
    message: 'AI-tone word or phrase (see copy-voice.md ban lists). Rewrite in the audience\'s own words or cut.',
  });

  const rel = path.relative(root, file).replaceAll('\\', '/');
  const isMarkup = /\.(?:html?|vue|svelte|astro|jsx|tsx)$/i.test(file);
  // Visible copy: markup minus scripts, styles, comments, and tags. Lexical approximation.
  const visible = isMarkup
    ? source
        .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;|&#160;/g, ' ')
        .replace(/\s+/g, ' ')
    : '';

  // Em-dash is the loudest AI punctuation tell. copy-voice.md allows at most one per page.
  // Count only connector dashes between words; a lone dash in a table cell is an empty-value glyph (copy-voice prefers the en dash there).
  const visibleDashes = isMarkup ? (visible.match(/[\p{L}\p{N},.)]\s*—\s*[\p{L}\p{N}(]/gu) ?? []).length : 0;
  const sourceDashes = (source.match(/—/g) ?? []).length;
  if (isMarkup && visibleDashes >= 1) {
    findings.push({
      level: 'BLOCKER_CANDIDATE',
      id: 'EM_DASH_IN_COPY',
      file: rel,
      line: null,
      evidence: `${visibleDashes} em-dashes (—) in visible copy`,
      message: 'copy-voice.md bans the em-dash in copy. Rewrite with commas, full stops, colons, or parentheses; this is a P1 copy defect until resolved.',
      manual_review_required: true,
    });
  } else if (!isMarkup && sourceDashes >= 1) {
    findings.push({
      level: 'ADVISORY',
      id: 'EM_DASH_OVERUSE',
      file: rel,
      line: null,
      evidence: `${sourceDashes} em-dashes (—)`,
      message: 'Em-dash is the loudest AI punctuation tell and is banned in copy (copy-voice.md). Check whether these reach visible text.',
      manual_review_required: true,
    });
  }

  addRegexFindings(findings, {
    source, file, root,
    level: 'BLOCKER_CANDIDATE',
    id: 'UNSOURCED_POPULARITY_CLAIM',
    pattern: /(?:most popular|best[- ]?sell(?:er|ing)|customer favou?rite|fan favou?rite|#1 choice|phổ biến nhất|bán chạy nhất|được chọn nhiều nhất|được yêu thích nhất|lựa chọn số 1|nhiều người chọn nhất|hàng đầu việt nam)/gi,
    message: 'Popularity or ranking claim. Without a sales/usage source in the fact map this is fabricated proof (P0). Use an honest recommendation instead, e.g. "Hợp với cửa hàng xuất trên 20 hoá đơn/tháng".',
  });

  addRegexFindings(findings, {
    source, file, root,
    level: 'BLOCKER_CANDIDATE',
    id: 'PLACEHOLDER_IDENTITY_OR_DATA',
    pattern: /\b(?:Acme|John Doe|Jane Doe|Lorem ipsum|Company Name|Your Company|Test User|Nguyễn Văn A|Trần Thị B|Lê Văn C|Sarah Chen|Alex Rivera|Jordan Lee|Priya Patel|Marcus Chen|Emily Zhang|Northwind|Contoso|Globex|Initech|Meridian|Umbrella Corp|Stark Industries)\b/g,
    message: 'Placeholder identity or data. Fixtures must read as one real, internally consistent situation (names, dates, counts, statuses agree).',
  });

  const eyebrowClasses = (source.match(/class(?:Name)?\s*=\s*["'][^"']*\b(?:eyebrow|kicker|overline|section-label|pretitle|subheading-caps)\b/gi) ?? []).length;
  if (eyebrowClasses >= 3) {
    findings.push({
      level: 'ADVISORY',
      id: 'EYEBROW_SCAFFOLD',
      file: rel,
      line: null,
      evidence: `${eyebrowClasses} eyebrow/kicker labels`,
      message: 'An uppercase label above most sections is scaffold grammar (craft-rules ban 6). Keep at most one deliberate kicker system or remove.',
      manual_review_required: true,
    });
  }

  const statClasses = (source.match(/class(?:Name)?\s*=\s*["'][^"']*\b(?:stats?|metric|counter|figure-num|big-number|fact-num|number-row|kpi-value)\b/gi) ?? []).length;
  if (statClasses >= 3 && !/role\s*=\s*["']application["']|\bdashboard\b|<table\b/i.test(source)) {
    findings.push({
      level: 'ADVISORY',
      id: 'NUMBER_ROW_TEMPLATE',
      file: rel,
      line: null,
      evidence: `${statClasses} stat/metric elements on a non-application page`,
      message: 'A row of big numerals with small labels is the hero-metric template (craft-rules ban 4) even when the numbers are true. Put numbers inside sentences, a ledger, or a comparison.',
      manual_review_required: true,
    });
  }

  if (isMarkup) {
    // Stock AI cadence constructions in headings.
    const heads = [...source.matchAll(/<h[1-4]\b[^>]*>([\s\S]*?)<\/h[1-4]>/gi)].map((m) => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).filter((t) => t.length > 3);
    const constructions = [
      ['count antithesis', /\b(?:two|three|four|one|hai|ba|bốn|một)\s+\p{L}+(?:\s\p{L}+)?,\s*(?:one|a single|một)\s+\p{L}+/iu],
      ['X, not Y', /,\s*(?:not|never|không phải|chứ không phải)\s+(?:a |an |the |là )?\p{L}+/iu],
      ['not X but Y', /\b(?:not just|not only|không chỉ(?: là)?)\b[^.]{0,40}\b(?:but|mà còn|mà là)\b/iu],
      ['mirrored pair', /^(\p{L}+)\s[^.!?]{2,40}[.!?]\s+\1\s[^.!?]{2,40}[.!?]$/u],
      ['three-beat', /^[\p{L}\s]{2,18}[.,]\s+[\p{L}\s]{2,18}[.,]\s+[\p{L}\s]{2,18}\.$/u],
    ];
    const hits = [];
    for (const h of heads) for (const [name, re] of constructions) if (re.test(h)) hits.push(`${name}: "${h.slice(0, 50)}"`);
    if (hits.length >= 2) {
      findings.push({
        level: 'ADVISORY',
        id: 'AI_CADENCE_CONSTRUCTION',
        file: rel,
        line: null,
        evidence: hits.slice(0, 5).join('; '),
        message: 'Headings use stock AI constructions (count antithesis, "X, not Y", mirrored pairs, three-beat). Rewrite as plain statements the client would say; vary shape.',
        manual_review_required: true,
      });
    }
  }

  if (/prefers-color-scheme\s*:\s*dark/i.test(source)) {
    findings.push({
      level: 'ADVISORY',
      id: 'AUTO_DARK_THEME',
      file: rel,
      line: null,
      evidence: 'prefers-color-scheme: dark',
      message: 'Automatic OS theme switching needs a recorded decision and complete tokens for every state; otherwise remove it and ship one theme.',
      manual_review_required: true,
    });
  }

  if (isMarkup && visible.length > 400) {
    const words = visible.toLowerCase().replace(/[.,:;!?()“”"'«»]/g, ' ').split(/\s+/).filter(Boolean);
    const counts = new Map();
    for (let i = 0; i + 4 <= words.length; i++) {
      const gram = words.slice(i, i + 4).join(' ');
      if (/\d/.test(gram) || gram.length < 14) continue;
      counts.set(gram, (counts.get(gram) ?? 0) + 1);
    }
    const repeated = [...counts].filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (repeated.length) {
      findings.push({
        level: 'ADVISORY',
        id: 'REPEATED_PHRASE',
        file: rel,
        line: null,
        evidence: repeated.map(([g, n]) => `"${g}" ×${n}`).join('; '),
        message: 'A phrase repeats across the page. Say each fact once where it matters; repetition reads as generated filler.',
        manual_review_required: true,
      });
    }
  }

  const revealTargets = (source.match(/(?:class(?:Name)?\s*=\s*["'][^"']*\b(?:reveal|fade-?in|fade-?up|animate-?in|js-reveal|scroll-reveal|appear)\b|\bdata-(?:reveal|aos|animate|sal)\b)/gi) ?? []).length;
  if (revealTargets >= 5 && /IntersectionObserver|ScrollTrigger|data-aos|sal\(/.test(source)) {
    findings.push({
      level: 'BLOCKER_CANDIDATE',
      id: 'SCROLL_REVEAL_EVERYWHERE',
      file: path.relative(root, file).replaceAll('\\', '/'),
      line: null,
      evidence: `${revealTargets} scroll-reveal targets`,
      message: 'Most blocks share one entrance animation (craft-rules ban 14, RR-15). Keep at most one entrance choreography tied to a content relationship; this is not a false positive because the opacity is "decorative".',
      manual_review_required: true,
    });
  }

  const fadeMatches = source.match(/(?:fade[-_ ]?up|data-aos\s*=\s*["']fade-up["']|\by\s*:\s*[-+]?\d+[^\n]{0,80}\bopacity\s*:\s*0)/gi) ?? [];
  if (fadeMatches.length >= 3) {
    findings.push({
      level: 'ADVISORY',
      id: 'REPEATED_FADE_UP',
      file: path.relative(root, file).replaceAll('\\', '/'),
      line: null,
      evidence: `${fadeMatches.length} fade/slide entrance markers`,
      message: 'Repeated entrance presets may be substituting for content-specific motion. Review purpose, reduced motion, and runtime fallback.',
      manual_review_required: true,
    });
  }

  const effectSignals = [
    ['gradient', /(?:linear|radial|conic)-gradient\s*\(/i],
    ['backdrop blur', /backdrop-filter\s*:\s*[^;]*blur/i],
    ['glow', /box-shadow\s*:\s*[^;]*(?:rgba?\(|#[0-9a-f]{3,8})/i],
    ['large radius', /border-radius\s*:\s*(?:[2-9]\d|\d{3,})px/i],
    ['cursor effect', /(?:cursor\s*:\s*none|custom[-_ ]cursor|magnetic|tilt|parallax)/i],
    ['grain/noise', /(?:grain|noise|dither)(?:\.png|\.webp|\b)/i],
  ].filter(([, pattern]) => pattern.test(source)).map(([name]) => name);

  if (effectSignals.length >= 3) {
    findings.push({
      level: 'ADVISORY',
      id: 'SURFACE_EFFECT_ACCUMULATION',
      file: path.relative(root, file).replaceAll('\\', '/'),
      line: null,
      evidence: effectSignals.join(', '),
      message: 'Several fashionable surface effects coexist. Confirm a semantic or brand role for each and test the design with nonessential effects removed.',
      manual_review_required: true,
    });
  }

  const lower = source.toLowerCase();
  const stackSignals = [
    ['hero', /\bhero\b/],
    ['logo cloud', /logo[-_ ]?cloud|trusted[-_ ]?by/],
    ['feature cards', /feature[-_ ]?(?:card|grid)|features-section/],
    ['stats', /stats?[-_ ]?(?:section|grid)|metrics-section/],
    ['testimonials', /testimonials?/],
    ['pricing', /pricing/],
    ['faq', /\bfaq\b|frequently asked/],
  ].filter(([, pattern]) => pattern.test(lower)).map(([name]) => name);

  if (stackSignals.length >= 5) {
    findings.push({
      level: 'ADVISORY',
      id: 'GENERATOR_LANDING_STACK',
      file: path.relative(root, file).replaceAll('\\', '/'),
      line: null,
      evidence: stackSignals.join(', '),
      message: 'A familiar landing-page section stack is present. Verify that content dependencies, not generator defaults, determine the sequence.',
      manual_review_required: true,
    });
  }

  const splitHeroSignals = [
    /\bhero\b/i.test(source),
    /(?:grid-template-columns\s*:\s*repeat\(2|grid-cols-2|two-column|split[-_ ]hero)/i.test(source),
    /(?:eyebrow|badge|pill)/i.test(source),
    /(?:primary[-_ ]?cta|secondary[-_ ]?cta|cta[-_ ]?group)/i.test(source),
    /(?:browser[-_ ]?mockup|device[-_ ]?mockup|hero[-_ ]?(?:image|media|visual))/i.test(source),
  ].filter(Boolean).length;

  if (splitHeroSignals >= 4) {
    findings.push({
      level: 'ADVISORY',
      id: 'GENERIC_SPLIT_HERO_FINGERPRINT',
      file: path.relative(root, file).replaceAll('\\', '/'),
      line: null,
      evidence: `${splitHeroSignals} split-hero lexical signals`,
      message: 'A saturated split-hero fingerprint may be present. Review adjacency, message hierarchy, product evidence, and alternatives.',
      manual_review_required: true,
    });
  }

  const usesThree = /(?:from\s*["']three["']|require\s*\(\s*["']three["']|@react-three\/fiber)/i.test(source);
  if (usesThree && !/(?:fallback|webgl.*(?:fail|unsupported|lost)|reduced[-_ ]motion|prefers-reduced-motion)/i.test(source)) {
    findings.push({
      level: 'ADVISORY',
      id: 'THREE_WITHOUT_VISIBLE_FALLBACK_MARKER',
      file: path.relative(root, file).replaceAll('\\', '/'),
      line: null,
      evidence: 'Three.js/WebGL import without a nearby lexical fallback marker',
      message: 'Verify intrinsic 3D value, low-capability behavior, context loss, reduced motion, and static fallback in the rendered product.',
      manual_review_required: true,
    });
  }
}

function humanReport(report) {
  const lines = [];
  lines.push(`audit-ai-slop ${report.version}`);
  lines.push(`Target: ${report.target}`);
  lines.push(`Files scanned: ${report.files_scanned}`);
  lines.push(`BLOCKER_CANDIDATE: ${report.summary.BLOCKER_CANDIDATE}`);
  lines.push(`ADVISORY: ${report.summary.ADVISORY}`);
  lines.push('');
  lines.push('Detector boundaries:');
  for (const boundary of report.detector_boundaries) lines.push(`- ${boundary}`);

  if (report.findings.length) {
    lines.push('');
    lines.push('Findings:');
    for (const finding of report.findings) {
      const location = finding.line ? `${finding.file}:${finding.line}` : finding.file;
      lines.push(`- [${finding.level}] ${finding.id} ${location}`);
      lines.push(`  ${finding.message}`);
      lines.push(`  Evidence: ${finding.evidence}`);
    }
  }

  return lines.join('\n');
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    process.stdout.write(`${usage()}\n`);
    return;
  }

  const json = args.includes('--json');
  const targetArg = args.find((arg) => !arg.startsWith('-')) ?? '.';
  const target = path.resolve(targetArg);
  const info = await stat(target);
  if (!info.isDirectory()) throw new Error(`Target is not a directory: ${target}`);

  const files = await collectFiles(target);
  const findings = [];
  for (const file of files) {
    const source = await readFile(file, 'utf8');
    auditFile(source, file, target, findings);
  }

  const report = {
    tool: 'audit-ai-slop',
    version: VERSION,
    target,
    generated_at: new Date().toISOString(),
    files_scanned: files.length,
    summary: {
      BLOCKER_CANDIDATE: findings.filter((item) => item.level === 'BLOCKER_CANDIDATE').length,
      ADVISORY: findings.filter((item) => item.level === 'ADVISORY').length,
    },
    detector_boundaries: boundaries,
    findings,
    release_decision: 'NOT_EVALUATED_BY_THIS_TOOL',
  };

  process.stdout.write(`${json ? JSON.stringify(report, null, 2) : humanReport(report)}\n`);
}

main().catch((error) => {
  process.stderr.write(`audit-ai-slop: ${error.message}\n`);
  process.exitCode = 1;
});

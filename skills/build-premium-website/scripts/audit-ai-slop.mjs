#!/usr/bin/env node

import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const VERSION = '1.0.0';
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

#!/usr/bin/env node
// Copyright (c) 2026 ByteWaker. Licensed under Apache-2.0.
// Part of build-premium-website: https://github.com/tdat-dev/premium-web
// Redistribution must retain this notice, LICENSE, and NOTICE.
//
// Render a page in headless Chromium over raw CDP (no npm packages) and measure the
// defects agents most often miss by eye: horizontal overflow, text contrast, word
// stacking, content hidden without JavaScript, broken images, and JS errors.
// Screenshots: desktop full page + 3 scroll frames (sticky/fixed shown truthfully) + mobile full page.
//
// usage: node render-check.mjs <file.html | http(s)://url> [outDir] [--json]
// browser: set CHROME_PATH, otherwise common Chrome/Edge/Chromium locations are tried.

import { spawn, execSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const VERSION = '1.4.0';
const args = process.argv.slice(2);
const asJson = args.includes('--json');
const positional = args.filter((a) => !a.startsWith('--'));
if (!positional[0]) {
  console.log('Usage: node render-check.mjs <file.html | url> [outDir] [--json]');
  process.exit(2);
}
const target = /^https?:\/\//.test(positional[0]) ? positional[0] : pathToFileURL(path.resolve(positional[0])).href;
const outDir = path.resolve(positional[1] ?? 'render-check-out');
mkdirSync(outDir, { recursive: true });

function findBrowser() {
  const env = process.env.CHROME_PATH || process.env.PUPPETEER_EXECUTABLE_PATH;
  if (env && existsSync(env)) return env;
  const c = [];
  if (process.platform === 'win32') {
    for (const base of [process.env['PROGRAMFILES'], process.env['PROGRAMFILES(X86)'], process.env.LOCALAPPDATA].filter(Boolean)) {
      c.push(path.join(base, 'Google/Chrome/Application/chrome.exe'), path.join(base, 'Microsoft/Edge/Application/msedge.exe'), path.join(base, 'Chromium/Application/chrome.exe'));
    }
  } else if (process.platform === 'darwin') {
    c.push('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge');
  } else {
    for (const bin of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge']) {
      try { const p = execSync(`command -v ${bin}`, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); if (p) c.push(p); } catch {}
    }
  }
  const pw = process.platform === 'darwin' ? path.join(homedir(), 'Library/Caches/ms-playwright') : process.platform === 'win32' ? path.join(process.env.LOCALAPPDATA ?? '', 'ms-playwright') : path.join(homedir(), '.cache/ms-playwright');
  if (existsSync(pw)) {
    for (const d of readdirSync(pw).filter((n) => /^chromium-\d+$/.test(n)).sort().reverse()) {
      for (const sub of ['chrome-win64/chrome.exe', 'chrome-win/chrome.exe', 'chrome-linux/chrome', 'chrome-linux64/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) c.push(path.join(pw, d, sub));
    }
  }
  return c.find((p) => existsSync(p));
}

const browser = findBrowser();
if (!browser) {
  console.error('render-check: no Chrome/Edge/Chromium found. Set CHROME_PATH. Rendering evidence is then an open gap, not a pass.');
  process.exit(3);
}

const port = 9400 + Math.floor(Math.random() * 400);
const profile = mkdtempSync(path.join(tmpdir(), 'render-check-'));
const proc = spawn(browser, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--remote-allow-origins=*', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--no-first-run', '--force-color-profile=srgb', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const keepAlive = setInterval(() => {}, 1000);

async function pageWs() {
  for (let i = 0; i < 75; i++) {
    try { const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); const p = list.find((t) => t.type === 'page'); if (p) return p.webSocketDebuggerUrl; } catch {}
    await sleep(200);
  }
  throw new Error('browser did not expose a page target');
}

const ws = new WebSocket(await pageWs());
await new Promise((r, j) => { ws.addEventListener('open', r, { once: true }); ws.addEventListener('error', j, { once: true }); });
let seq = 0; const pending = new Map(); const jsErrors = []; const assertFailures = []; const navErrors = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'assert') assertFailures.push((d.params.args ?? []).map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 160) || 'console.assert failed');
  if (d.method === 'Runtime.exceptionThrown') jsErrors.push(d.params.exceptionDetails?.exception?.description?.split('\n')[0] ?? d.params.exceptionDetails?.text);
});
const send = (method, params = {}) => new Promise((res, rej) => { const id = ++seq; pending.set(id, (d) => (d.error ? rej(new Error(`${method}: ${d.error.message}`)) : res(d.result))); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error('in-page script failed: ' + (r.exceptionDetails.exception?.description ?? r.exceptionDetails.text)); return r.result.value; };

await send('Page.enable'); await send('Runtime.enable');

// In-page measurement. Runs after load and a full scroll pass.
const MEASURE = `(() => {
  const cv = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const rgba = (c) => { cv.clearRect(0,0,1,1); cv.fillStyle = '#000'; cv.fillStyle = c; cv.fillRect(0,0,1,1); const d = cv.getImageData(0,0,1,1).data; return [d[0], d[1], d[2], d[3] / 255]; };
  const over = (top, bot) => { const a = top[3]; return [top[0]*a + bot[0]*(1-a), top[1]*a + bot[1]*(1-a), top[2]*a + bot[2]*(1-a), 1]; };
  const lum = ([r,g,b]) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); }; return 0.2126*f(r) + 0.7152*f(g) + 0.0722*f(b); };
  const ratio = (a, b) => { const L1 = lum(a), L2 = lum(b); return (Math.max(L1,L2) + 0.05) / (Math.min(L1,L2) + 0.05); };
  const label = (el) => { let s = el.tagName.toLowerCase(); if (el.id) s += '#' + el.id; else if (el.classList.length) s += '.' + [...el.classList].slice(0,2).join('.'); return s; };
  const effOpacity = (el) => { let o = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity); return o; };
  const bgOf = (el) => {
    const layers = [];
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
      const cs = getComputedStyle(n);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; // image/gradient: unknown
      const c = rgba(cs.backgroundColor); if (c[3] > 0) { layers.push(c); if (c[3] >= 0.999) break; }
    }
    let base = [255,255,255,1];
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return base;
  };
  const textEls = [...document.body.querySelectorAll('*')].filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1));
  const contrast = [], stacking = [], hidden = [];
  for (const el of textEls) {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    const text = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\\s+/g, ' ').trim();
    if (!text) continue;
    const op = effOpacity(el);
    if (cs.visibility === 'hidden' || op < 0.1) { if (r.width > 0 && r.height > 0 && text.length > 3) hidden.push({ el: label(el), text: text.slice(0, 60) }); continue; }
    if (r.width === 0 || r.height === 0 || cs.display === 'none') continue;
    if (el.closest('[aria-hidden="true"]')) continue;
    // Text laid over media (a sibling img/video/canvas/picture under the same container) cannot be measured here.
    const overMedia = (() => { let n = el.parentElement; for (let d = 0; n && d < 4; d++, n = n.parentElement) { for (const m of n.querySelectorAll('img,video,canvas,picture,svg image')) { if (m.contains(el)) continue; const q = m.getBoundingClientRect(); if (q.left < r.right && q.right > r.left && q.top < r.bottom && q.bottom > r.top) return true; } } return false; })();
    const bg = overMedia ? null : bgOf(el);
    if (bg) {
      const fg = over(rgba(cs.color), bg); const size = parseFloat(cs.fontSize); const bold = parseInt(cs.fontWeight, 10) >= 700;
      const need = size >= 24 || (bold && size >= 18.66) ? 3 : 4.5; const cr = ratio(fg, bg);
      if (cr + 0.01 < need) contrast.push({ el: label(el), text: text.slice(0, 50), ratio: +cr.toFixed(2), need, fontPx: size });
    }
    // Count rendered lines from text-node rects, not element height (table cells stretch to the row).
    const tops = new Set();
    for (const n of el.childNodes) { if (n.nodeType !== 3 || !n.textContent.trim()) continue; const rg = document.createRange(); rg.selectNodeContents(n); for (const q of rg.getClientRects()) if (q.width > 1) tops.add(Math.round(q.top / 4)); }
    const lines = tops.size;
    if (lines >= 3 && text.length >= 12 && text.length / lines < 10 && cs.writingMode.startsWith('horizontal') && !el.closest('pre,code,kbd,samp')) stacking.push({ el: label(el), text: text.slice(0, 50), lines, width: Math.round(r.width) });
  }
  // Slop signals: warm-neutral body, nested boxes, emoji used as icons.
  const toOklch = ([r, g, b]) => {
    const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const [R, G, B] = [lin(r), lin(g), lin(b)];
    const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), q = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
    const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * q, A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * q, Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * q;
    return { L, C: Math.hypot(A, Bb), H: (Math.atan2(Bb, A) * 180 / Math.PI + 360) % 360 };
  };
  const pageBg = (() => { for (const n of [document.body, document.documentElement]) { const c = rgba(getComputedStyle(n).backgroundColor); if (c[3] > 0.5) return c; } return [255, 255, 255, 1]; })();
  const bgLch = toOklch(pageBg);
  const warmNeutralBody = bgLch.L >= 0.84 && bgLch.L <= 0.97 && bgLch.C < 0.06 && bgLch.C > 0.008 && bgLch.H >= 40 && bgLch.H <= 100;
  const vw = window.__rcWidth || innerWidth;
  const boxed = (el) => {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    if (r.width * r.height < 6000 || r.width > vw * 0.9 || r.height < 48) return false;
    if (/^(INPUT|TEXTAREA|SELECT|BUTTON|TD|TH|TR|TABLE|IMG|SVG|VIDEO|CANVAS|LI)$/.test(el.tagName)) return false;
    const border = ['Top', 'Right', 'Bottom', 'Left'].every((sd) => parseFloat(cs['border' + sd + 'Width']) > 0 && rgba(cs['border' + sd + 'Color'])[3] > 0.1);
    const own = rgba(cs.backgroundColor); const parentBg = el.parentElement ? bgOf(el.parentElement) : null;
    const filled = own[3] > 0.5 && parentBg && Math.abs(own[0] - parentBg[0]) + Math.abs(own[1] - parentBg[1]) + Math.abs(own[2] - parentBg[2]) > 12;
    const shadow = cs.boxShadow && cs.boxShadow !== 'none';
    return border || filled || shadow;
  };
  const nested = [];
  for (const el of document.body.querySelectorAll('div,section,article,aside,form,fieldset,header,footer,nav,main,ul,details')) {
    if (!boxed(el)) continue;
    let depth = 1; for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) if (boxed(n)) depth++;
    if (depth >= 3) nested.push({ el: label(el), depth });
  }
  const emoji = [];
  for (const el of textEls) {
    const t = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('');
    if (/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2728}]/u.test(t) && el.getBoundingClientRect().width > 0) emoji.push({ el: label(el), text: t.trim().slice(0, 30) });
  }
  // Text collisions: visible text boxes overlapping other text or SVG marks (labels printed through dots, captions under panels).
  const textBoxes = [];
  for (const el of textEls) {
    const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || cs.display === 'none' || effOpacity(el) < 0.1) continue;
    // Skip screen-reader-only text and text clipped away by an overflow ancestor.
    let srOnly = false, clipBox = null;
    for (let n = el, d = 0; n && n.nodeType === 1 && d < 12; n = n.parentElement, d++) {
      const ns = getComputedStyle(n); const nr = n.getBoundingClientRect();
      if ((ns.clip && ns.clip !== 'auto') || (ns.clipPath && ns.clipPath !== 'none' && ns.clipPath.startsWith('inset(50%')) || (nr.width <= 2 && nr.height <= 2)) { srOnly = true; break; }
      if (d > 0 && ns.overflow !== 'visible') clipBox = clipBox ? { left: Math.max(clipBox.left, nr.left), right: Math.min(clipBox.right, nr.right), top: Math.max(clipBox.top, nr.top), bottom: Math.min(clipBox.bottom, nr.bottom) } : { left: nr.left, right: nr.right, top: nr.top, bottom: nr.bottom };
    }
    if (srOnly) continue;
    const closedDetails = el.closest('details:not([open])'); if (closedDetails && !el.closest('summary')) continue;
    // Fixed and sticky layers (tab bars, headers, floating buttons) legitimately sit over scrolling content.
    let layered = false; for (let n = el; n && n.nodeType === 1; n = n.parentElement) { const pz = getComputedStyle(n).position; if (pz === 'fixed' || pz === 'sticky') { layered = true; break; } } if (layered) continue;
    for (const n of el.childNodes) { if (n.nodeType !== 3 || !n.textContent.trim()) continue; const rg = document.createRange(); rg.selectNodeContents(n); for (const q of rg.getClientRects()) { if (q.width <= 4 || q.height <= 4) continue; if (clipBox) { const vis = Math.max(0, Math.min(q.right, clipBox.right) - Math.max(q.left, clipBox.left)) * Math.max(0, Math.min(q.bottom, clipBox.bottom) - Math.max(q.top, clipBox.top)); if (vis < 0.5 * q.width * q.height) continue; } textBoxes.push({ el, r: q }); } }
  }
  const area = (a) => Math.max(0, a.right - a.left) * Math.max(0, a.bottom - a.top);
  const inter = (a, b) => area({ left: Math.max(a.left, b.left), right: Math.min(a.right, b.right), top: Math.max(a.top, b.top), bottom: Math.min(a.bottom, b.bottom) });
  const collisions = [];
  for (let i = 0; i < textBoxes.length && collisions.length < 30; i++) for (let j = i + 1; j < textBoxes.length; j++) {
    const A = textBoxes[i], B = textBoxes[j]; if (A.el === B.el || A.el.contains(B.el) || B.el.contains(A.el)) continue;
    const ov = inter(A.r, B.r); const ovH = Math.min(A.r.bottom, B.r.bottom) - Math.max(A.r.top, B.r.top);
    // Tight display leading makes line boxes overlap slightly; a real collision overlaps most of the shorter line's height.
    if (ov > 0.25 * Math.min(area(A.r), area(B.r)) && ovH > 0.5 * Math.min(A.r.height, B.r.height)) { collisions.push({ el: label(A.el) + ' x ' + label(B.el), text: (A.el.textContent.trim().slice(0, 20) + ' / ' + B.el.textContent.trim().slice(0, 20)) }); break; }
  }
  for (const mark of document.querySelectorAll('svg circle, svg ellipse, svg polygon, svg rect')) {
    const m = mark.getBoundingClientRect(); if (m.width < 3 || m.width > 60 || m.height > 60) continue;
    for (const t of textBoxes) { if (t.el.closest('svg') !== mark.closest('svg') && !t.el.closest('svg')) { /* html label over svg mark */ }
      const ov = inter(m, t.r); if (ov > 0.3 * area(m)) { collisions.push({ el: label(t.el) + ' x svg-mark', text: t.el.textContent.trim().slice(0, 30) }); break; } }
    if (collisions.length >= 30) break;
  }
  // Clipped content: containers that cut their content off (hidden/clip overflow, no ellipsis, not a scroller).
  const clipped = [];
  for (const el of document.body.querySelectorAll('*')) {
    const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const ox = cs.overflowX, oy = cs.overflowY; const r = el.getBoundingClientRect(); if (r.width < 40 || r.height < 16) continue;
    if (el.closest('[aria-hidden="true"], details:not([open])') || cs.textOverflow === 'ellipsis' || /line-clamp/.test(cs.cssText) || cs.webkitLineClamp !== 'none' && cs.webkitLineClamp) continue;
    const cutX = (ox === 'hidden' || ox === 'clip') && el.scrollWidth > el.clientWidth + 4;
    const cutY = (oy === 'hidden' || oy === 'clip') && el.scrollHeight > el.clientHeight + 4 && el.clientHeight > 0 && !/^(0px)$/.test(cs.maxHeight);
    // On desktop, a data table that needs horizontal scrolling hides decision columns: report it too.
    const wideDesk = (window.__rcWidth || innerWidth) >= 1200 && (ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth + 16 && el.querySelector('table, [role=grid], [role=table]');
    if (wideDesk) { clipped.push({ el: label(el), lost: 'table needs horizontal scroll at desktop (' + (el.scrollWidth - el.clientWidth) + 'px hidden)' }); continue; }
    if (!cutX && !cutY) continue;
    // Only report when real text or a control sits in the cut-off part.
    const box = el.getBoundingClientRect(); let lost = null;
    for (const d of el.querySelectorAll('button, a, input, select, td, th, p, span, li, h2, h3, h4')) {
      const q = d.getBoundingClientRect(); if (q.width === 0 || q.height === 0 || !d.textContent.trim()) continue;
      if ((cutX && q.left >= box.right - 2) || (cutY && q.top >= box.bottom - 2)) { lost = d; break; }
    }
    if (lost) clipped.push({ el: label(el), lost: label(lost) + ' "' + lost.textContent.trim().slice(0, 30) + '"' });
    if (clipped.length >= 20) break;
  }
  // Navigation that exists but renders no visible link at desktop width (e.g. trapped in a closed <details>).
  const navHidden = [];
  if ((window.__rcWidth || innerWidth) >= 1200) for (const nav of document.querySelectorAll('nav, [role=navigation]')) {
    const links = [...nav.querySelectorAll('a[href], button')]; if (links.length < 2) continue;
    const shown = links.filter((a) => { const q = a.getBoundingClientRect(); return q.width > 0 && q.height > 0 && getComputedStyle(a).visibility !== 'hidden'; });
    if (shown.length === 0) navHidden.push(label(nav) + ' (' + links.length + ' links, none visible)');
  }
  // A closed <details> whose <summary> is hidden can never be opened: its links are unreachable.
  for (const d of document.querySelectorAll('details:not([open])')) {
    const sum = d.querySelector(':scope > summary'); const links = d.querySelectorAll('a[href], button');
    if (links.length < 2) continue;
    const sr = sum ? sum.getBoundingClientRect() : { width: 0, height: 0 };
    if (!sum || sr.width === 0 || sr.height === 0 || getComputedStyle(sum).display === 'none') navHidden.push(label(d) + ' (closed details, summary hidden, ' + links.length + ' links unreachable)');
  }
  // Progress indicators whose label says progress was made but whose fill has no width.
  const progressEmpty = [];
  for (const pb of document.querySelectorAll('[role=progressbar], progress, meter')) {
    const now = parseFloat(pb.getAttribute('aria-valuenow') ?? pb.value ?? 0), max = parseFloat(pb.getAttribute('aria-valuemax') ?? pb.max ?? 100) || 100;
    if (!(now / max > 0.03) || pb.tagName === 'PROGRESS' || pb.tagName === 'METER') continue;
    const fills = [...pb.querySelectorAll('*')].filter((c) => rgba(getComputedStyle(c).backgroundColor)[3] > 0.1 || getComputedStyle(c).backgroundImage !== 'none');
    const own = rgba(getComputedStyle(pb).backgroundImage !== 'none' ? '#000' : 'transparent')[3] > 0;
    if (!own && fills.length && fills.every((c) => c.getBoundingClientRect().width < 1)) progressEmpty.push(label(pb) + ' (' + Math.round(now / max * 100) + '% but fill is 0px)');
  }
  // Human-factors floors (WCAG 2.2 AA): target size 2.5.8, accessible names 1.1.1/2.4.4/4.1.2, placeholder-as-label, page language and title.
  const shown = (el) => { if (el.closest('[aria-hidden="true"], [inert], details:not([open]) > :not(summary)')) return false; const cs = getComputedStyle(el); const r = el.getBoundingClientRect(); return cs.visibility !== 'hidden' && cs.display !== 'none' && r.width > 2 && r.height > 2 && effOpacity(el) >= 0.1; };
  const nameOf = (el) => {
    const lb = el.getAttribute('aria-labelledby'); if (lb) { const t = lb.split(' ').map((id) => document.getElementById(id)?.textContent || '').join(' ').trim(); if (t) return t; }
    const al = (el.getAttribute('aria-label') || '').trim(); if (al) return al;
    if (el.labels && el.labels.length) { const t = [...el.labels].map((l) => l.textContent).join(' ').trim(); if (t) return t; }
    if (el.tagName === 'INPUT' && /^(submit|button|reset)$/.test(el.type)) return (el.value || '').trim();
    if (el.tagName === 'INPUT' && el.type === 'image') return (el.alt || '').trim();
    if (!/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) { const t = (el.innerText || el.textContent || '').trim(); if (t) return t; const alt = [...el.querySelectorAll('img[alt], svg title, [aria-label]')].map((n) => n.getAttribute('alt') || n.getAttribute('aria-label') || n.textContent).join(' ').trim(); if (alt) return alt; }
    return (el.getAttribute('title') || '').trim();
  };
  const unnamed = [], placeholderLabels = [];
  for (const el of document.body.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, [role=button], [role=link], [role=tab], [role=checkbox], [role=radio], [role=switch], [role=menuitem], [role=combobox], [role=textbox]')) {
    if (!shown(el) && !(el.labels && [...el.labels].some(shown))) continue;
    if (nameOf(el)) continue;
    if (el.getAttribute('placeholder')) placeholderLabels.push({ el: label(el), text: el.getAttribute('placeholder').slice(0, 40) });
    else unnamed.push({ el: label(el), text: (el.outerHTML || '').slice(0, 60) });
  }
  const targetSel = 'a[href], button, input:not([type=hidden]), select, textarea, summary, [role=button], [role=link], [role=tab], [role=checkbox], [role=radio], [role=switch], [role=menuitem], [tabindex]:not([tabindex="-1"])';
  const targets = [];
  for (const el of document.body.querySelectorAll(targetSel)) {
    let box = el;
    // A visually hidden native input is operated through its label: measure the label.
    if (el.tagName === 'INPUT' && !shown(el)) { box = el.labels && [...el.labels].find(shown); if (!box) continue; }
    else if (!shown(el)) continue;
    if (targets.some((t) => t.box === box)) continue;
    const r = box.getBoundingClientRect();
    // 2.5.8 inline exception: a link inside a sentence or block of text.
    const block = el.closest('p, li, td, dd, dt, blockquote, figcaption, label, small, legend, caption');
    const inline = el.tagName === 'A' && getComputedStyle(el).display.startsWith('inline') && block && block !== el && (block.textContent || '').trim().length > (el.textContent || '').trim().length + 3;
    targets.push({ el, box, r, inline });
  }
  const dist = (x, y, r) => Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
  const smallTargets = [];
  for (const t of targets) {
    if (t.inline || (t.r.width >= 24 && t.r.height >= 24)) continue;
    const cx = (t.r.left + t.r.right) / 2, cy = (t.r.top + t.r.bottom) / 2;
    // 2.5.8 spacing exception: a 24px circle on the target touches no other target and no other undersized target's circle.
    const crowded = targets.some((u) => { if (u === t || u.box.contains(t.box) || t.box.contains(u.box)) return false; if (dist(cx, cy, u.r) < 12) return true; const small = u.r.width < 24 || u.r.height < 24; return small && !u.inline && Math.hypot(cx - (u.r.left + u.r.right) / 2, cy - (u.r.top + u.r.bottom) / 2) < 24; });
    if (crowded) smallTargets.push({ el: label(t.box), size: Math.round(t.r.width) + 'x' + Math.round(t.r.height), text: nameOf(t.el).slice(0, 30) });
    if (smallTargets.length >= 40) break;
  }
  const imgNoAlt = [...document.images].filter((i) => !i.hasAttribute('alt') && !i.closest('[aria-hidden="true"]') && i.getAttribute('role') !== 'presentation' && i.getBoundingClientRect().width > 0).map((i) => (i.getAttribute('src') || '').slice(-60));
  const docBasics = [];
  if (!(document.documentElement.getAttribute('lang') || '').trim()) docBasics.push('html has no lang (3.1.1; Vietnamese pages need lang="vi" for screen readers and hyphenation)');
  if (!(document.title || '').trim()) docBasics.push('page has no <title> (2.4.2)');
  if (!document.querySelector('h1, [role=heading][aria-level="1"]')) docBasics.push('no h1: the page has no top heading for screen-reader navigation');
  if (document.querySelector('meta[name=viewport][content*="user-scalable=no"], meta[name=viewport][content*="maximum-scale=1"]')) docBasics.push('viewport blocks zoom (1.4.4)');
  const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getBoundingClientRect().width > 0).map((i) => i.getAttribute('src'));
  const doc = document.documentElement;
  return { pageHeight: doc.scrollHeight, overflowX: Math.max(0, doc.scrollWidth - (window.__rcWidth || innerWidth)), contrast, stacking, hidden, broken, warmNeutralBody, bodyOklch: bgLch, nested: nested.slice(0, 20), emoji: emoji.slice(0, 20), collisions, clipped, navHidden, progressEmpty, unnamed: unnamed.slice(0, 30), placeholderLabels: placeholderLabels.slice(0, 20), smallTargets, imgNoAlt: imgNoAlt.slice(0, 20), docBasics, textLength: (document.body.innerText || "").trim().length };
})()`;

// Controls that look interactive but have no click/key listener on themselves or any ancestor.
async function deadControls() {
  const { result } = await send('Runtime.evaluate', { expression: `(() => { const sel = 'button:not([type=submit]):not([disabled]), [role=button], [role=tab], [role=switch], [aria-pressed], [aria-expanded]'; return [...document.querySelectorAll(sel)].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !el.closest('form button[type=submit], summary, label') && el.tagName !== 'SUMMARY' && !el.hasAttribute('popovertarget') && !el.hasAttribute('commandfor'); }).slice(0, 120); })()` });
  if (!result.objectId) return [];
  const props = await send('Runtime.getProperties', { objectId: result.objectId, ownProperties: true });
  const els = props.result.filter((p) => /^\d+$/.test(p.name) && p.value?.objectId).map((p) => p.value.objectId);
  const seen = new Map(); const dead = [];
  const winObj = (await send('Runtime.evaluate', { expression: 'window' })).result.objectId;
  const winHas = (await send('DOMDebugger.getEventListeners', { objectId: winObj })).listeners.some((l) => /^(click|pointerdown|pointerup|mousedown|keydown|touchstart)$/.test(l.type));
  for (const oid of els) {
    let cur = oid; let found = winHas; let depth = 0;
    while (cur && !found && depth < 40) {
      let has = seen.get(cur);
      if (has === undefined) { const ls = (await send('DOMDebugger.getEventListeners', { objectId: cur })).listeners; has = ls.some((l) => /^(click|pointerdown|pointerup|mousedown|keydown|touchstart|change|input)$/.test(l.type)); seen.set(cur, has); }
      if (has) { found = true; break; }
      const parent = await send('Runtime.callFunctionOn', { objectId: cur, functionDeclaration: 'function(){ return this.parentNode; }' });
      cur = parent.result.objectId; depth++;
    }
    if (!found) { const d = await send('Runtime.callFunctionOn', { objectId: oid, functionDeclaration: 'function(){ let s = this.tagName.toLowerCase(); if (this.id) s += "#" + this.id; else if (this.classList.length) s += "." + [...this.classList].slice(0,2).join("."); return s + " \\"" + (this.textContent || this.getAttribute("aria-label") || "").trim().slice(0, 30) + "\\""; }', returnByValue: true }); dead.push(d.result.value); }
  }
  return dead;
}

// Real keyboard pass: press Tab through the page and check each focus stop is visible (2.4.7),
// not entirely covered by a fixed/sticky layer (2.4.11), and not an invisible element (closed menu links).
async function keyboardPass(limit = 60) {
  await evaluate(`(() => {
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); scrollTo(0, 0);
    const sig = (el, p) => { if (!el || el.nodeType !== 1) return ''; const cs = getComputedStyle(el, p); return [cs.outlineStyle, cs.outlineWidth, cs.outlineColor, cs.boxShadow, cs.borderColor, cs.backgroundColor, cs.color, cs.textDecorationLine, cs.opacity, cs.transform].join('|'); };
    window.__rcFull = (el) => [sig(el), sig(el, '::before'), sig(el, '::after'), sig(el.parentElement), sig(el.parentElement && el.parentElement.parentElement)].join('#');
    window.__rcBase = new Map(); for (const el of document.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex]')) window.__rcBase.set(el, window.__rcFull(el));
    window.__rcSeen = new Set(); return true; })()`);
  const issues = { invisible: [], obscured: [], hidden: [] }; let stops = 0;
  for (let i = 0; i < limit; i++) {
    for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9, nativeVirtualKeyCode: 9 });
    await sleep(90);
    const s = await evaluate(`(async () => {
      const el = document.activeElement; if (!el || el === document.body || el === document.documentElement) return { end: true };
      if (window.__rcSeen.has(el)) return { end: true }; window.__rcSeen.add(el);
      if (el.tagName === 'IFRAME') return { skip: true };
      let name = el.tagName.toLowerCase(); if (el.id) name += '#' + el.id; else if (el.classList.length) name += '.' + [...el.classList].slice(0, 2).join('.');
      name += ' "' + ((el.getAttribute('aria-label') || el.innerText || el.value || '') + '').trim().slice(0, 30) + '"';
      // Wait out smooth scrolling and focus transitions (skip links sliding in) before judging.
      const wait = (ms) => new Promise((res) => setTimeout(res, ms)); let prev = '';
      for (let k = 0; k < 12; k++) { const q = el.getBoundingClientRect(); const key = [q.left, q.top, q.width, q.height, getComputedStyle(el).opacity].map((v) => Math.round(v * 10)).join(','); if (key === prev) break; prev = key; await wait(80); }
      // A flow element just below the fold is reachable: bring it into view the way a browser would. Fixed/offset drawers stay where they are.
      { const q = el.getBoundingClientRect(); if (q.top >= innerHeight || q.bottom <= 0) { el.scrollIntoView({ block: 'nearest', behavior: 'instant' }); await wait(60); } }
      const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); let op = 1; for (let n = el; n && n.nodeType === 1; n = n.parentElement) op *= parseFloat(getComputedStyle(n).opacity);
      const hidden = r.width < 2 || r.height < 2 || cs.visibility === 'hidden' || op < 0.1 || r.bottom <= 0 || r.right <= 0 || r.top >= innerHeight || r.left >= innerWidth;
      let covered = 0, sampled = 0;
      if (!hidden) for (const [fx, fy] of [[0.5, 0.5], [0.15, 0.2], [0.85, 0.2], [0.15, 0.8], [0.85, 0.8]]) {
        const x = r.left + r.width * fx, y = r.top + r.height * fy; if (x < 0 || y < 0 || x >= innerWidth || y >= innerHeight) continue; sampled++;
        const hit = document.elementFromPoint(x, y); if (!hit || hit === el || el.contains(hit) || hit.contains(el)) continue;
        for (let n = hit; n && n.nodeType === 1; n = n.parentElement) { const pz = getComputedStyle(n).position; if (pz === 'fixed' || pz === 'sticky') { covered++; break; } }
      }
      const base = window.__rcBase.get(el); const invisible = !hidden && base !== undefined && base === window.__rcFull(el);
      return { name, hidden, obscured: sampled > 0 && covered === sampled, invisible };
    })()`);
    if (s.end) break; if (s.skip) continue; stops++;
    if (s.hidden) issues.hidden.push(s.name); else if (s.obscured) issues.obscured.push(s.name); else if (s.invisible) issues.invisible.push(s.name);
  }
  await evaluate('(() => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); scrollTo(0, 0); return true; })()');
  return { stops, ...issues };
}

async function run(name, width, height, mobile, { js = true, shots = true } = {}) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  await send('Emulation.setScriptExecutionDisabled', { value: !js });
  const nav = await send('Page.navigate', { url: target });
  if (nav.errorText) navErrors.push(`${name}: ${nav.errorText}`);
  await sleep(3000);
  // Snapshot opacity/transform below the fold before scrolling; elements that change on scroll are scroll-animated.
  if (js) await evaluate(`(() => { const vh = innerHeight; window.__rcPre = []; for (const el of document.body.querySelectorAll('section,article,div,p,h1,h2,h3,h4,figure,img,li,blockquote,ul,ol,a,span')) { const r = el.getBoundingClientRect(); if (r.top < vh || r.height < 8) continue; const cs = getComputedStyle(el); window.__rcPre.push([el, cs.opacity, cs.transform]); } return window.__rcPre.length; })()`);
  // Scroll through once so observer-driven content settles, then return to top (timers do not run with JS disabled).
  if (js) await send('Runtime.evaluate', { expression: `(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=${Math.round(height / 2)}){scrollTo(0,y);await new Promise(r=>setTimeout(r,100));}scrollTo(0,0);})()`, awaitPromise: true });
  await sleep(1000);
  // Mobile emulation can widen innerWidth to fit overflowing content; measure against the emulated width.
  await evaluate(`window.__rcWidth = ${width}`);
  const m = await evaluate(MEASURE);
  // Re-measure contrast in the viewport at several scroll depths: scroll-linked color changes only show there.
  if (js && m.pageHeight > height * 1.5) {
    for (const f of [0.2, 0.4, 0.6, 0.8]) {
      await send('Runtime.evaluate', { expression: `scrollTo(0,${Math.round((m.pageHeight - height) * f)})` }); await sleep(500);
      const vis = await evaluate(MEASURE.replace('const textEls = [...document.body.querySelectorAll(\'*\')]', 'const textEls = [...document.body.querySelectorAll(\'*\')].filter((e) => { const q = e.getBoundingClientRect(); return q.bottom > 0 && q.top < innerHeight; })'));
      for (const c of vis.contrast) if (!m.contrast.some((x) => x.el === c.el && x.text === c.text)) m.contrast.push({ ...c, atScroll: f });
    }
    await send('Runtime.evaluate', { expression: 'scrollTo(0,0)' });
  }
  m.deadControls = js && !mobile ? await deadControls() : [];
  m.keyboard = js && !mobile ? await keyboardPass() : { stops: 0, invisible: [], obscured: [], hidden: [] };
  m.scrollAnimated = js ? await evaluate(`(() => { const changed = (window.__rcPre || []).filter(([el, op, tf]) => { const cs = getComputedStyle(el); return Math.abs(parseFloat(cs.opacity) - parseFloat(op)) > 0.2 || cs.transform !== tf; }).map(([el]) => el); return changed.filter((el) => !changed.some((o) => o !== el && o.contains(el))).length; })()`) : 0;
  const files = [];
  if (shots) {
    const h = Math.min(m.pageHeight, 12000);
    const full = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: h, scale: 1 } });
    const f = path.join(outDir, `${name}.png`); writeFileSync(f, Buffer.from(full.data, 'base64')); files.push(f);
    if (m.pageHeight > height * 1.5) {
      for (const p of [0.25, 0.5, 0.75]) {
        await send('Runtime.evaluate', { expression: `scrollTo(0,${Math.round((m.pageHeight - height) * p)})` }); await sleep(600);
        const fr = await send('Page.captureScreenshot', { format: 'png' });
        const ff = path.join(outDir, `${name}-scroll${p * 100}.png`); writeFileSync(ff, Buffer.from(fr.data, 'base64')); files.push(ff);
      }
    }
  }
  return { name, width, ...m, files };
}

const desktop = await run('desktop', 1440, 900, false);
const mobile = await run('mobile', 390, 844, true);
const nojs = await run('nojs-desktop', 1440, 900, false, { js: false, shots: true });
await send('Emulation.setScriptExecutionDisabled', { value: false });

const dedupe = (arr) => { const seen = new Set(); return arr.filter((x) => { const k = x.el + '|' + x.text; if (seen.has(k)) return false; seen.add(k); return true; }); };
const report = {
  version: VERSION,
  target,
  browser,
  summary: {
    overflow_desktop: desktop.overflowX,
    overflow_mobile: mobile.overflowX,
    js_errors: jsErrors.length,
    contrast_failures: dedupe([...desktop.contrast, ...mobile.contrast]).length,
    word_stacking: dedupe([...desktop.stacking, ...mobile.stacking]).length,
    hidden_without_js: nojs.hidden.length,
    hidden_with_js: desktop.hidden.length,
    broken_images: new Set([...desktop.broken, ...mobile.broken]).size,
    scroll_animated: desktop.scrollAnimated,
    nested_boxes: new Set([...desktop.nested, ...mobile.nested].map((x) => x.el)).size,
    emoji_icons: new Set([...desktop.emoji, ...mobile.emoji].map((x) => x.el + x.text)).size,
    warm_neutral_body: desktop.warmNeutralBody ? 1 : 0,
    dead_controls: desktop.deadControls.length,
    text_collisions: new Set([...desktop.collisions, ...mobile.collisions].map((x) => x.el + x.text)).size,
    clipped_content: new Set([...desktop.clipped, ...mobile.clipped].map((x) => x.el + x.lost)).size,
    assert_failures: assertFailures.length,
    nav_hidden_desktop: desktop.navHidden.length,
    progress_empty: new Set([...desktop.progressEmpty, ...mobile.progressEmpty]).size,
    blank_page: navErrors.length || desktop.textLength < 40 ? 1 : 0,
    small_targets: new Set([...desktop.smallTargets, ...mobile.smallTargets].map((x) => x.el + x.text)).size,
    unnamed_controls: new Set([...desktop.unnamed, ...mobile.unnamed].map((x) => x.el + x.text)).size,
    placeholder_labels: new Set([...desktop.placeholderLabels, ...mobile.placeholderLabels].map((x) => x.el + x.text)).size,
    img_missing_alt: new Set([...desktop.imgNoAlt, ...mobile.imgNoAlt]).size,
    doc_basics: desktop.docBasics.length,
    focus_stops: desktop.keyboard.stops,
    focus_invisible: desktop.keyboard.invisible.length,
    focus_obscured: desktop.keyboard.obscured.length,
    focus_hidden: desktop.keyboard.hidden.length,
  },
  details: {
    jsErrors,
    contrast: dedupe([...desktop.contrast, ...mobile.contrast]).slice(0, 40),
    stacking: dedupe([...desktop.stacking, ...mobile.stacking]).slice(0, 20),
    hiddenWithoutJs: nojs.hidden.slice(0, 30),
    hiddenWithJs: desktop.hidden.slice(0, 30),
    brokenImages: [...new Set([...desktop.broken, ...mobile.broken])],
    bodyOklch: desktop.bodyOklch,
    nestedBoxes: [...desktop.nested, ...mobile.nested].slice(0, 12),
    emojiIcons: [...desktop.emoji, ...mobile.emoji].slice(0, 12),
    deadControls: desktop.deadControls.slice(0, 20),
    textCollisions: [...desktop.collisions, ...mobile.collisions].slice(0, 20),
    clippedContent: [...desktop.clipped, ...mobile.clipped].slice(0, 20),
    assertFailures: assertFailures.slice(0, 20),
    navHiddenDesktop: desktop.navHidden,
    progressEmpty: [...new Set([...desktop.progressEmpty, ...mobile.progressEmpty])],
    smallTargets: [...desktop.smallTargets, ...mobile.smallTargets.map((x) => ({ ...x, at: 'mobile' }))].slice(0, 40),
    unnamedControls: [...desktop.unnamed, ...mobile.unnamed].slice(0, 30),
    placeholderLabels: [...desktop.placeholderLabels, ...mobile.placeholderLabels].slice(0, 20),
    imgMissingAlt: [...new Set([...desktop.imgNoAlt, ...mobile.imgNoAlt])],
    docBasics: desktop.docBasics,
    keyboard: desktop.keyboard,
  },
  screenshots: [...desktop.files, ...mobile.files, ...nojs.files],
  boundaries: [
    'Contrast is computed against solid background colors only; text over images or gradients is skipped and must be checked by eye.',
    'dead_controls lists visible buttons, tabs, and toggles with no click/key listener on themselves or any ancestor; each is a control that does nothing when pressed. It cannot tell whether a listener does the right thing: click through every signature interaction yourself.',
    'assert_failures counts failed console.assert calls: encode fixture invariants (totals sum, statuses match thresholds, counts match filters) as console.assert at load and they are checked here.',
    'clipped_content lists containers with hidden/clip overflow that cut off text or controls without an ellipsis or scroll affordance.',
    'blank_page = 1 means the page rendered under 40 characters of text (dev server down, error page, SPA that failed to boot); every other count is meaningless until it is 0.',
    'text_collisions lists text drawn over other text or small SVG marks (labels printed through map dots, captions under panels).',
    'hidden_with_js counts text that is still invisible after a full scroll pass (closed menus, tabs, and dialogs are expected there; review each).',
    'Full-page captures draw position:fixed/sticky elements once, over whatever content sits there; judge fixed bars from the -scroll frames, not the full-page image.',
    'Slop signals (scroll_animated, nested_boxes, emoji_icons, warm_neutral_body) are counts to disposition, not verdicts: scroll_animated >= 5 is the reveal-everywhere tell (craft ban 14), nested_boxes > 0 is box-in-box-in-box (ban 11), emoji_icons > 0 is S-33, warm_neutral_body = 1 is ban 8 unless the brand record justifies it.',
    'small_targets lists pointer targets under 24x24 CSS px that also fail the WCAG 2.5.8 spacing exception (inline links in running text are exempt); touch-first surfaces should still aim for 44px (Apple) / 48dp (Material).',
    'unnamed_controls lists links, buttons, and fields with no accessible name (icon-only buttons without aria-label, inputs without a label); placeholder_labels lists fields whose only label is placeholder text, which disappears on input.',
    'focus_* come from pressing Tab up to 60 times on the desktop render: focus_invisible = focus moved but nothing on the element, its pseudo-elements, or its two nearest ancestors changed (2.4.7); focus_obscured = every sampled point of the focused element sits under a fixed/sticky layer (2.4.11); focus_hidden = focus landed on something invisible or off-screen (closed menu links, hidden drawers). focus_stops = 0 on a page with controls means the keyboard cannot reach them.',
    'doc_basics flags a missing lang or <title>, no h1, and a viewport that blocks zoom. img_missing_alt counts images with no alt attribute at all (alt="" is a valid decorative mark).',
    'A clean report proves only these measurements. It does not judge design quality or slop.',
  ],
};
writeFileSync(path.join(outDir, 'render-check.json'), JSON.stringify(report, null, 2));

const s = report.summary;
const line = `RENDER-CHECK ${VERSION}: overflow_desktop=${s.overflow_desktop} overflow_mobile=${s.overflow_mobile} js_errors=${s.js_errors} contrast_failures=${s.contrast_failures} word_stacking=${s.word_stacking} text_collisions=${s.text_collisions} clipped_content=${s.clipped_content} dead_controls=${s.dead_controls} assert_failures=${s.assert_failures} nav_hidden_desktop=${s.nav_hidden_desktop} progress_empty=${s.progress_empty} blank_page=${s.blank_page} hidden_without_js=${s.hidden_without_js} broken_images=${s.broken_images} | a11y: small_targets=${s.small_targets} unnamed_controls=${s.unnamed_controls} placeholder_labels=${s.placeholder_labels} img_missing_alt=${s.img_missing_alt} doc_basics=${s.doc_basics} focus_stops=${s.focus_stops} focus_invisible=${s.focus_invisible} focus_obscured=${s.focus_obscured} focus_hidden=${s.focus_hidden} | slop: scroll_animated=${s.scroll_animated} nested_boxes=${s.nested_boxes} emoji_icons=${s.emoji_icons} warm_neutral_body=${s.warm_neutral_body}`;
if (asJson) console.log(JSON.stringify(report, null, 2));
else {
  console.log(line);
  for (const c of report.details.contrast.slice(0, 12)) console.log(`  contrast ${c.ratio}:1 < ${c.need}:1  ${c.el}  "${c.text}"${c.atScroll ? '  (at scroll ' + c.atScroll + ')' : ''}`);
  for (const w of report.details.stacking.slice(0, 8)) console.log(`  stacking ${w.lines} lines @${w.width}px  ${w.el}  "${w.text}"`);
  for (const h of report.details.hiddenWithoutJs.slice(0, 8)) console.log(`  hidden-without-js  ${h.el}  "${h.text}"`);
  for (const e of navErrors) console.log(`  navigation-failed  ${e}`);
  for (const e of jsErrors.slice(0, 5)) console.log(`  js-error  ${e}`);
  for (const c of report.details.clippedContent.slice(0, 6)) console.log(`  clipped  ${c.el} cuts ${c.lost}`);
  for (const n of report.details.navHiddenDesktop) console.log(`  nav-hidden-desktop  ${n}`);
  for (const n of report.details.progressEmpty) console.log(`  progress-empty  ${n}`);
  for (const a of report.details.assertFailures.slice(0, 6)) console.log(`  assert  ${a}`);
  for (const d of report.details.deadControls.slice(0, 6)) console.log(`  dead-control  ${d}`);
  for (const c of report.details.textCollisions.slice(0, 6)) console.log(`  text-collision  ${c.el}  "${c.text}"`);
  for (const n of report.details.nestedBoxes.slice(0, 5)) console.log(`  nested-box depth ${n.depth}  ${n.el}`);
  for (const e of report.details.emojiIcons.slice(0, 5)) console.log(`  emoji  ${e.el}  "${e.text}"`);
  for (const t of report.details.smallTargets.slice(0, 6)) console.log(`  small-target ${t.size}  ${t.el}  "${t.text}"${t.at ? '  (mobile)' : ''}`);
  for (const u of report.details.unnamedControls.slice(0, 6)) console.log(`  unnamed-control  ${u.el}  ${u.text}`);
  for (const p of report.details.placeholderLabels.slice(0, 4)) console.log(`  placeholder-as-label  ${p.el}  "${p.text}"`);
  for (const d of report.details.docBasics) console.log(`  doc  ${d}`);
  for (const k of report.details.keyboard.invisible.slice(0, 5)) console.log(`  focus-invisible  ${k}`);
  for (const k of report.details.keyboard.obscured.slice(0, 5)) console.log(`  focus-obscured  ${k}`);
  for (const k of report.details.keyboard.hidden.slice(0, 5)) console.log(`  focus-hidden  ${k}`);
  if (s.warm_neutral_body) console.log(`  warm-neutral body OKLCH L=${report.details.bodyOklch.L.toFixed(2)} C=${report.details.bodyOklch.C.toFixed(3)} H=${report.details.bodyOklch.H.toFixed(0)}`);
  console.log(`  screenshots + render-check.json in ${outDir}`);
}
clearInterval(keepAlive); ws.close(); proc.kill();
// Remove the throwaway Chrome profile (hundreds of runs once filled a drive). Chrome releases files shortly after exit.
await new Promise((r) => { proc.once("exit", r); setTimeout(r, 3000); });
for (let i = 0; i < 5; i++) { try { rmSync(profile, { recursive: true, force: true }); break; } catch { await sleep(400); } }
const fail = s.overflow_desktop || s.overflow_mobile || s.js_errors || s.contrast_failures || s.word_stacking || s.text_collisions || s.clipped_content || s.dead_controls || s.assert_failures || s.nav_hidden_desktop || s.progress_empty || s.blank_page || s.hidden_without_js || s.broken_images || s.scroll_animated >= 5 || s.nested_boxes || s.emoji_icons || s.warm_neutral_body || s.small_targets || s.unnamed_controls || s.placeholder_labels || s.img_missing_alt || s.doc_basics || s.focus_invisible || s.focus_obscured || s.focus_hidden;
process.exit(fail ? 1 : 0);

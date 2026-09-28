#!/usr/bin/env node
// Copyright (c) 2026 ByteWaker. Licensed under Apache-2.0.
// Part of build-premium-website — https://github.com/tdat-dev/premium-web
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
import { existsSync, mkdirSync, mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const VERSION = '1.0.0';
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
let seq = 0; const pending = new Map(); const jsErrors = [];
ws.addEventListener('message', (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); return; }
  if (d.method === 'Runtime.exceptionThrown') jsErrors.push(d.params.exceptionDetails?.exception?.description?.split('\n')[0] ?? d.params.exceptionDetails?.text);
});
const send = (method, params = {}) => new Promise((res, rej) => { const id = ++seq; pending.set(id, (d) => (d.error ? rej(new Error(`${method}: ${d.error.message}`)) : res(d.result))); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async (expression) => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;

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
    if (lines >= 3 && text.length >= 12 && text.length / lines < 10 && cs.writingMode.startsWith('horizontal')) stacking.push({ el: label(el), text: text.slice(0, 50), lines, width: Math.round(r.width) });
  }
  const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getBoundingClientRect().width > 0).map((i) => i.getAttribute('src'));
  const doc = document.documentElement;
  return { pageHeight: doc.scrollHeight, overflowX: Math.max(0, doc.scrollWidth - innerWidth), contrast, stacking, hidden, broken };
})()`;

async function run(name, width, height, mobile, { js = true, shots = true } = {}) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  await send('Emulation.setScriptExecutionDisabled', { value: !js });
  await send('Page.navigate', { url: target });
  await sleep(3000);
  // Scroll through once so observer-driven content settles, then return to top (timers do not run with JS disabled).
  if (js) await send('Runtime.evaluate', { expression: `(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=${Math.round(height / 2)}){scrollTo(0,y);await new Promise(r=>setTimeout(r,100));}scrollTo(0,0);})()`, awaitPromise: true });
  await sleep(1000);
  const m = await evaluate(MEASURE);
  const files = [];
  if (shots) {
    const h = Math.min(m.pageHeight, 12000);
    const full = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width, height: h, scale: 1 } });
    const f = path.join(outDir, `${name}.png`); writeFileSync(f, Buffer.from(full.data, 'base64')); files.push(f);
    if (!mobile && m.pageHeight > height * 1.5) {
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
  },
  details: {
    jsErrors,
    contrast: dedupe([...desktop.contrast, ...mobile.contrast]).slice(0, 40),
    stacking: dedupe([...desktop.stacking, ...mobile.stacking]).slice(0, 20),
    hiddenWithoutJs: nojs.hidden.slice(0, 30),
    hiddenWithJs: desktop.hidden.slice(0, 30),
    brokenImages: [...new Set([...desktop.broken, ...mobile.broken])],
  },
  screenshots: [...desktop.files, ...mobile.files, ...nojs.files],
  boundaries: [
    'Contrast is computed against solid background colors only; text over images or gradients is skipped and must be checked by eye.',
    'hidden_with_js counts text that is still invisible after a full scroll pass (closed menus, tabs, and dialogs are expected there; review each).',
    'A clean report proves only these measurements. It does not judge design quality or slop.',
  ],
};
writeFileSync(path.join(outDir, 'render-check.json'), JSON.stringify(report, null, 2));

const s = report.summary;
const line = `RENDER-CHECK ${VERSION}: overflow_desktop=${s.overflow_desktop} overflow_mobile=${s.overflow_mobile} js_errors=${s.js_errors} contrast_failures=${s.contrast_failures} word_stacking=${s.word_stacking} hidden_without_js=${s.hidden_without_js} broken_images=${s.broken_images}`;
if (asJson) console.log(JSON.stringify(report, null, 2));
else {
  console.log(line);
  for (const c of report.details.contrast.slice(0, 12)) console.log(`  contrast ${c.ratio}:1 < ${c.need}:1  ${c.el}  "${c.text}"`);
  for (const w of report.details.stacking.slice(0, 8)) console.log(`  stacking ${w.lines} lines @${w.width}px  ${w.el}  "${w.text}"`);
  for (const h of report.details.hiddenWithoutJs.slice(0, 8)) console.log(`  hidden-without-js  ${h.el}  "${h.text}"`);
  for (const e of jsErrors.slice(0, 5)) console.log(`  js-error  ${e}`);
  console.log(`  screenshots + render-check.json in ${outDir}`);
}
clearInterval(keepAlive); ws.close(); proc.kill();
const fail = s.overflow_desktop || s.overflow_mobile || s.js_errors || s.contrast_failures || s.word_stacking || s.hidden_without_js || s.broken_images;
process.exit(fail ? 1 : 0);

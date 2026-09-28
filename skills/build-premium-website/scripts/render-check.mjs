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
import { existsSync, mkdirSync, mkdtempSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir, homedir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const VERSION = '1.2.0';
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
  const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getBoundingClientRect().width > 0).map((i) => i.getAttribute('src'));
  const doc = document.documentElement;
  return { pageHeight: doc.scrollHeight, overflowX: Math.max(0, doc.scrollWidth - (window.__rcWidth || innerWidth)), contrast, stacking, hidden, broken, warmNeutralBody, bodyOklch: bgLch, nested: nested.slice(0, 20), emoji: emoji.slice(0, 20), collisions };
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

async function run(name, width, height, mobile, { js = true, shots = true } = {}) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile });
  await send('Emulation.setScriptExecutionDisabled', { value: !js });
  await send('Page.navigate', { url: target });
  await sleep(3000);
  // Snapshot opacity/transform below the fold before scrolling; elements that change on scroll are scroll-animated.
  if (js) await evaluate(`(() => { const vh = innerHeight; window.__rcPre = []; for (const el of document.body.querySelectorAll('section,article,div,p,h1,h2,h3,h4,figure,img,li,blockquote,ul,ol,a,span')) { const r = el.getBoundingClientRect(); if (r.top < vh || r.height < 8) continue; const cs = getComputedStyle(el); window.__rcPre.push([el, cs.opacity, cs.transform]); } return window.__rcPre.length; })()`);
  // Scroll through once so observer-driven content settles, then return to top (timers do not run with JS disabled).
  if (js) await send('Runtime.evaluate', { expression: `(async()=>{const h=document.documentElement.scrollHeight;for(let y=0;y<h;y+=${Math.round(height / 2)}){scrollTo(0,y);await new Promise(r=>setTimeout(r,100));}scrollTo(0,0);})()`, awaitPromise: true });
  await sleep(1000);
  // Mobile emulation can widen innerWidth to fit overflowing content; measure against the emulated width.
  await evaluate(`window.__rcWidth = ${width}`);
  const m = await evaluate(MEASURE);
  m.deadControls = js && !mobile ? await deadControls() : [];
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
  },
  screenshots: [...desktop.files, ...mobile.files, ...nojs.files],
  boundaries: [
    'Contrast is computed against solid background colors only; text over images or gradients is skipped and must be checked by eye.',
    'dead_controls lists visible buttons, tabs, and toggles with no click/key listener on themselves or any ancestor; each is a control that does nothing when pressed. It cannot tell whether a listener does the right thing: click through every signature interaction yourself.',
    'text_collisions lists text drawn over other text or small SVG marks (labels printed through map dots, captions under panels).',
    'hidden_with_js counts text that is still invisible after a full scroll pass (closed menus, tabs, and dialogs are expected there; review each).',
    'Full-page captures draw position:fixed/sticky elements once, over whatever content sits there; judge fixed bars from the -scroll frames, not the full-page image.',
    'Slop signals (scroll_animated, nested_boxes, emoji_icons, warm_neutral_body) are counts to disposition, not verdicts: scroll_animated >= 5 is the reveal-everywhere tell (craft ban 14), nested_boxes > 0 is box-in-box-in-box (ban 11), emoji_icons > 0 is S-33, warm_neutral_body = 1 is ban 8 unless the brand record justifies it.',
    'A clean report proves only these measurements. It does not judge design quality or slop.',
  ],
};
writeFileSync(path.join(outDir, 'render-check.json'), JSON.stringify(report, null, 2));

const s = report.summary;
const line = `RENDER-CHECK ${VERSION}: overflow_desktop=${s.overflow_desktop} overflow_mobile=${s.overflow_mobile} js_errors=${s.js_errors} contrast_failures=${s.contrast_failures} word_stacking=${s.word_stacking} text_collisions=${s.text_collisions} dead_controls=${s.dead_controls} hidden_without_js=${s.hidden_without_js} broken_images=${s.broken_images} | slop: scroll_animated=${s.scroll_animated} nested_boxes=${s.nested_boxes} emoji_icons=${s.emoji_icons} warm_neutral_body=${s.warm_neutral_body}`;
if (asJson) console.log(JSON.stringify(report, null, 2));
else {
  console.log(line);
  for (const c of report.details.contrast.slice(0, 12)) console.log(`  contrast ${c.ratio}:1 < ${c.need}:1  ${c.el}  "${c.text}"`);
  for (const w of report.details.stacking.slice(0, 8)) console.log(`  stacking ${w.lines} lines @${w.width}px  ${w.el}  "${w.text}"`);
  for (const h of report.details.hiddenWithoutJs.slice(0, 8)) console.log(`  hidden-without-js  ${h.el}  "${h.text}"`);
  for (const e of jsErrors.slice(0, 5)) console.log(`  js-error  ${e}`);
  for (const d of report.details.deadControls.slice(0, 6)) console.log(`  dead-control  ${d}`);
  for (const c of report.details.textCollisions.slice(0, 6)) console.log(`  text-collision  ${c.el}  "${c.text}"`);
  for (const n of report.details.nestedBoxes.slice(0, 5)) console.log(`  nested-box depth ${n.depth}  ${n.el}`);
  for (const e of report.details.emojiIcons.slice(0, 5)) console.log(`  emoji  ${e.el}  "${e.text}"`);
  if (s.warm_neutral_body) console.log(`  warm-neutral body OKLCH L=${report.details.bodyOklch.L.toFixed(2)} C=${report.details.bodyOklch.C.toFixed(3)} H=${report.details.bodyOklch.H.toFixed(0)}`);
  console.log(`  screenshots + render-check.json in ${outDir}`);
}
clearInterval(keepAlive); ws.close(); proc.kill();
const fail = s.overflow_desktop || s.overflow_mobile || s.js_errors || s.contrast_failures || s.word_stacking || s.text_collisions || s.dead_controls || s.hidden_without_js || s.broken_images || s.scroll_animated >= 5 || s.nested_boxes || s.emoji_icons || s.warm_neutral_body;
process.exit(fail ? 1 : 0);

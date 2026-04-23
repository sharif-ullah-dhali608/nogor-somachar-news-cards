/* নগর সমাচার ২৪ — cards.js — 5 exact reference templates */
const W = 1080, H = 1080;
const COLORS = ['#c0392b', '#e74c3c', '#b71c1c', '#e67e22', '#f39c12', '#43a047', '#1565c0', '#8e44ad', '#000', '#1a1a1a', '#fff'];
let img1 = null, img2 = null, adImg = null, logo = null, accent = '#c0392b', curT = 0, showAd = true;
let img1Scale = 1.0, img2Scale = 1.0;
let img1OffX = 0, img1OffY = 0, img2OffX = 0, img2OffY = 0;
let adImgScale = 1.0, adImgOffX = 0, adImgOffY = 0;
const $ = id => document.getElementById(id);

function processLogo(img) {
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const cx = c.getContext('2d', { willReadFrequently: true });
  cx.drawImage(img, 0, 0);
  const data = cx.getImageData(0, 0, c.width, c.height);
  const d = data.data;
  const limitX = c.width * 0.42;
  for (let i = 0; i < d.length; i += 4) {
    const x = (i / 4) % c.width;
    if (x < limitX) {
      const r = d[i], g = d[i + 1], b = d[i + 2], a = d[i + 3];
      if (a > 10 && r > 100 && r > g * 1.5 && r > b * 1.5) {
        const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        d[i] = lum * 0.2; d[i + 1] = lum * 0.2; d[i + 2] = lum * 0.2;
      }
    }
  }
  cx.putImageData(data, 0, 0);
  const ret = new Image();
  ret.src = c.toDataURL();
  return ret;
}

function removeWhiteBgFloodFill(imgObj, callback) {
  const c = document.createElement('canvas');
  const maxDim = 800;
  let w = imgObj.width, h = imgObj.height;
  if (w > maxDim || h > maxDim) {
    const r = Math.min(maxDim / w, maxDim / h);
    w *= r; h *= r;
  }
  w = Math.round(w) || 1; h = Math.round(h) || 1;
  c.width = w; c.height = h;
  const ctx = c.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(imgObj, 0, 0, w, h);

  const imgD = ctx.getImageData(0, 0, w, h);
  const data = imgD.data;

  const bgR = (data[0] + data[(w - 1) * 4]) / 2;
  const bgG = (data[1] + data[(w - 1) * 4 + 1]) / 2;
  const bgB = (data[2] + data[(w - 1) * 4 + 2]) / 2;

  const stack = new Uint32Array(w * h);
  let stackLen = 0;
  const visited = new Uint8Array(w * h);

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const idx = y * w + x;
    if (visited[idx]) return;
    visited[idx] = 1;
    stack[stackLen++] = idx;
  };

  for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
  for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }

  while (stackLen > 0) {
    const idx = stack[--stackLen];
    const x = idx % w;
    const y = Math.floor(idx / w);

    let i = idx * 4;
    let r = data[i], g = data[i + 1], b = data[i + 2];

    let dist = Math.abs(r - bgR) + Math.abs(g - bgG) + Math.abs(b - bgB);
    if (dist < 80) {
      data[i + 3] = 0; // set transparent
      push(x - 1, y); push(x + 1, y); push(x, y - 1); push(x, y + 1);
    }
  }

  ctx.putImageData(imgD, 0, 0);
  const res = new Image();
  res.onload = () => callback(res);
  res.src = c.toDataURL("image/png");
}

function flipSelectedImage() {
  const target = parseInt($('imgCtrlTarget').value);
  let trgImg = target === 1 ? img1 : target === 2 ? img2 : adImg;
  if (!trgImg) return;

  const b = $('btnFlipImg');
  b.textContent = '⏳ ফ্লিপ হচ্ছে...';
  b.disabled = true;

  setTimeout(() => {
    const c = document.createElement('canvas');
    c.width = trgImg.width; c.height = trgImg.height;
    const cx = c.getContext('2d');
    cx.translate(c.width, 0);
    cx.scale(-1, 1);
    cx.drawImage(trgImg, 0, 0);

    const res = new Image();
    res.onload = () => {
      if (target === 1) { img1 = res; origImg1 = res; }
      else if (target === 2) img2 = res;
      else adImg = res;

      b.textContent = '✅ ফ্লিপ সম্পন্ন!';
      setTimeout(() => { b.textContent = '↔️ হরিজন্টাল ফ্লিপ (Horizontal Flip)'; b.disabled = false; }, 1500);
      rf(); rth();
    };
    res.src = c.toDataURL("image/png");
  }, 50);
}

(() => {
  const l = new Image();
  l.onload = () => {
    logo = processLogo(l);
    const hdr = document.getElementById('hdrLogo');
    if (hdr) hdr.src = logo.src;
    rf(); rth();
  };
  l.src = 'logo.png';
})();
let logo2 = null;
(() => { const l = new Image(); l.onload = () => { logo2 = l; rf(); rth(); }; l.src = 'logo-removebg-preview.png'; })();

let rawLogo = new Image();
rawLogo.onload = () => { rf(); rth(); };
rawLogo.src = 'logo.png';

let clockImg = null;
(() => {
  const cl = new Image();
  cl.onload = () => { clockImg = cl; rf(); rth(); };
  cl.src = 'clock.png';
})();


function inp() { return { hl: $('headline').value || 'শিরোনাম', hlFs: parseInt($('hlFs').value) || 48, hlY: parseInt($('hlY').value) || 100, hlX: parseInt($('hlX').value) || 52, body: $('bodytext').value || '', sp: $('speaker').value || '', des: $('designation').value || '', cat: $('category').value, date: $('catdate').value || '', web: $('website').value || '', accent }; }

/* ── core helpers ── */
function cov(ctx, im, x, y, w, h, al = 1, scale = 1, offX = 0, offY = 0) {
  if (!im) return; ctx.save(); ctx.globalAlpha = al; ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const s = Math.max(w / im.width, h / im.height) * scale, nw = im.width * s, nh = im.height * s;
  ctx.drawImage(im, x + (w - nw) / 2 + offX, y + (h - nh) / 2 + offY, nw, nh); ctx.restore();
}
function covT(ctx, im, x, y, w, h, al = 1, scale = 1, offX = 0, offY = 0) {/* top-anchored */
  if (!im) return; ctx.save(); ctx.globalAlpha = al; ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const s = Math.max(w / im.width, h / im.height) * scale, nw = im.width * s, nh = im.height * s;
  ctx.drawImage(im, x + (w - nw) / 2 + offX, y + offY, nw, nh); ctx.restore();
}
function linG(ctx, x, y, w, h, stops) { const g = ctx.createLinearGradient(x, y, x, y + h); stops.forEach(([p, c]) => g.addColorStop(p, c)); ctx.fillStyle = g; ctx.fillRect(x, y, w, h); }
function radG(ctx, cx, cy, r0, r1, stops) { const g = ctx.createRadialGradient(cx, cy, r0, cx, cy, r1); stops.forEach(([p, c]) => g.addColorStop(p, c)); return g; }

function wrap(ctx, txt, x, y, mw, lh) {
  if (!txt) return 0;
  const ws = txt.split(' '); let ln = '', ls = [];
  for (const w of ws) { const t = ln ? ln + ' ' + w : w; if (ctx.measureText(t).width > mw && ln) { ls.push(ln); ln = w; } else ln = t; }
  ls.push(ln); ls.forEach((l, i) => ctx.fillText(l, x, y + i * lh)); return ls.length;
}
function wrapC(ctx, txt, cx, y, mw, lh) {/* center */
  if (!txt) return 0;
  const ws = txt.split(' '); let ln = '', ls = [];
  for (const w of ws) { const t = ln ? ln + ' ' + w : w; if (ctx.measureText(t).width > mw && ln) { ls.push(ln); ln = w; } else ln = t; }
  ls.push(ln); ls.forEach((l, i) => ctx.fillText(l, cx, y + i * lh)); return ls.length;
}
function pill(ctx, x, y, txt, fs = 20, px = 14, py = 8, bg = '#c0392b', fg = '#fff') {
  ctx.font = `bold ${fs}px Noto Sans Bengali`;
  const tw = ctx.measureText(txt).width, ph = fs + py * 2, pw = tw + px * 2, r = ph / 2;
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + pw - r, y); ctx.arc(x + pw - r, y + r, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(x + r, y + ph); ctx.arc(x + r, y + r, r, Math.PI / 2, 3 * Math.PI / 2); ctx.closePath();
  ctx.fillStyle = bg; ctx.fill(); ctx.fillStyle = fg; ctx.textBaseline = 'middle'; ctx.fillText(txt, x + px, y + r); ctx.textBaseline = 'alphabetic';
}
function drawLogo(ctx, x, y, mw, align = 'left', al = 1) {
  if (!logo) return;
  const lh = Math.round(logo.height / logo.width * mw);
  const dx = align === 'right' ? x - mw : align === 'center' ? x - mw / 2 : x;
  ctx.save(); ctx.globalAlpha = al;
  ctx.shadowBlur = 3; ctx.shadowColor = 'rgba(0,0,0,.7)'; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1;
  ctx.drawImage(logo, dx, y - lh, mw, lh); ctx.restore();
}
/* draw Bangladesh Times style text logo as fallback enhanced */
function drawTextLogo(ctx, x, y, scale = 1, light = false) {
  const fc = light ? '#fff' : '#111';
  ctx.font = `bold ${Math.round(30 * scale)}px Arial`;
  ctx.fillStyle = fc; ctx.shadowBlur = 0;
  const site = 'নগর সমাচার';
  if (logo) { drawLogo(ctx, x, y, Math.round(200 * scale), 'left', 1); return; }
  ctx.fillText(site, x, y);
  const tw = ctx.measureText(site).width;
  const rh = Math.round(26 * scale), rw = Math.round(70 * scale), rx = x + tw + 6, ry = y - rh;
  ctx.fillStyle = '#c0392b'; ctx.fillRect(rx, ry, rw, rh);
  ctx.fillStyle = '#fff'; ctx.font = `bold ${Math.round(18 * scale)}px Arial`; ctx.textBaseline = 'middle';
  ctx.fillText('২৪', rx + rw / 2 - ctx.measureText('২৪').width / 2, ry + rh / 2);
  ctx.textBaseline = 'alphabetic';
}
function sh(ctx, b = 10) { ctx.shadowBlur = b; ctx.shadowColor = 'rgba(0,0,0,.8)'; }
function nosh(ctx) { ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }

/* ── AD FOOTER ── */
const AD_H = 120;
function adH() { return showAd ? AD_H : 0; }
function drawAd(ctx) {
  if (!showAd) return;
  const y = H - AD_H;
  if (adImg) { cov(ctx, adImg, 0, y, W, AD_H, 1, adImgScale, adImgOffX, adImgOffY); }
  else {
    ctx.fillStyle = '#f5c842'; ctx.fillRect(0, y, W, AD_H);
    ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.font = 'bold 22px Noto Sans Bengali'; ctx.textAlign = 'center';
    ctx.fillText('বিজ্ঞাপন এলাকা — Ad Image আপলোড করুন', W / 2, y + AD_H / 2 + 8); ctx.textAlign = 'left';
  }
}

/* ══════════════════════════════════════════════════════
   T2 — QUOTE SPLIT CARD (reference: left photo + right red quote panel)
   LEFT: portrait photo full height + faint watermark
   RIGHT: dark red bg, logo top, yellow ❝❝, white rounded quote box,
          attribution (yellow em-dash + name), designation, website
══════════════════════════════════════════════════════ */
function T1(ctx, d) {
  const ah = adH();
  const mainH = H - ah;
  const SPLIT = Math.round(W * .48); // left photo width ~48%

  /* ── LEFT: portrait photo full height ── */
  cov(ctx, img1, 0, 0, SPLIT, mainH, 1, img1Scale, img1OffX, img1OffY);

  /* ── RIGHT: dark red bg ── */
  ctx.fillStyle = '#b71c1c'; // d.accent might not match the nice red in the reference perfectly. The image uses a rich dark red.
  ctx.fillRect(SPLIT, 0, W - SPLIT, mainH);

  /* ── LOGO top right panel (direct red background) ── */
  const logoSrc2 = logo2 || logo;
  if (logoSrc2) {
    const l2h = 56;
    const rat = logoSrc2.width && logoSrc2.height ? (logoSrc2.width / logoSrc2.height) : 3;
    const l2w = Math.round(rat * l2h);
    ctx.save();
    ctx.shadowBlur = 4; ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.drawImage(logoSrc2, W - l2w - 24, 24, l2w, l2h);
    // Draw twice for a stronger shadow definition behind white text on red
    ctx.drawImage(logoSrc2, W - l2w - 24, 24, l2w, l2h);
    ctx.restore();
  }

  /* ── Calculate Quote Box height exactly ── */
  const boxX = 420; // move left
  const boxW = W - boxX - 100; // smaller width, leaves more gap on right
  const qfs = 36, qlh = qfs * 1.5;
  ctx.font = `bold ${qfs}px Noto Serif Bengali`;

  // Custom exact line counting for accurate box height
  const pWords = d.hl.split(' ');
  let tLines = 1, trm = '';
  // Accurate wrapping length calculation
  const ws = d.hl.split(' ');
  let ln = '', ls = [];
  for (const w of ws) {
    const t = ln ? ln + ' ' + w : w;
    if (ctx.measureText(t).width > boxW - 80 && ln) { ls.push(ln); ln = w; }
    else ln = t;
  }
  ls.push(ln);

  // Increased base padding significantly to make the box even bigger vertically
  const boxH = Math.max(460, ls.length * qlh + 160);
  const boxY = 180;

  /* ── white rounded quote box ── */
  ctx.save();
  ctx.shadowBlur = 12; ctx.shadowColor = 'rgba(0,0,0,.15)';
  ctx.fillStyle = '#fff';
  const r = 40; // very round corners
  ctx.beginPath();
  ctx.moveTo(boxX + r, boxY); ctx.lineTo(boxX + boxW - r, boxY); ctx.arc(boxX + boxW - r, boxY + r, r, -Math.PI / 2, 0);
  ctx.lineTo(boxX + boxW, boxY + boxH - r); ctx.arc(boxX + boxW - r, boxY + boxH - r, r, 0, Math.PI / 2);
  ctx.lineTo(boxX + r, boxY + boxH); ctx.arc(boxX + r, boxY + boxH - r, r, Math.PI / 2, Math.PI);
  ctx.lineTo(boxX, boxY + r); ctx.arc(boxX + r, boxY + r, r, Math.PI, 3 * Math.PI / 2);
  ctx.closePath(); ctx.fill();
  ctx.restore();

  /* ── yellow big quote marks ── */
  ctx.fillStyle = '#ffcc00'; // bright yellow
  ctx.font = 'bold 180px Georgia, serif';
  ctx.textBaseline = 'top';
  // Use a single quotation character which produces exactly two strokes (two commas)
  ctx.fillText('\u201c', boxX + 80, boxY - 60);
  ctx.textBaseline = 'alphabetic'; // reset

  /* quote text inside box */
  ctx.fillStyle = '#111';
  ctx.font = `bold ${qfs}px Noto Serif Bengali`;
  nosh(ctx);
  wrap(ctx, d.hl, boxX + 40, boxY + 65 + (qlh / 2), boxW - 80, qlh);

  /* ── attribution below box ── */
  const attrY = boxY + boxH + 70;
  const attrX = SPLIT + 30; // on red bg
  ctx.fillStyle = '#ffcc00'; // speaker yellow
  ctx.font = `normal 38px Noto Serif Bengali`;
  const spkText = '—  ' + (d.sp || 'বক্তার নাম');
  ctx.fillText(spkText, attrX, attrY);

  // designation / body text in white, 2 lines
  let nextY = attrY + 45;
  const desTxt = d.des || d.body;
  if (desTxt) {
    ctx.fillStyle = '#fff'; // designation white
    ctx.font = `24px Noto Sans Bengali`;
    const dashW = ctx.measureText('—  ').width; // align exactly under name
    wrap(ctx, desTxt, attrX + dashW, nextY, W - attrX - dashW - 40, 36);
  }

  /* watermark: center 50/50 over split and over the quote box */
  ctx.save();
  const wmY = Math.round(mainH * 0.50);
  const wmFs = 42;
  ctx.font = `bold ${wmFs}px Arial, sans-serif`;
  const wPart1 = 'Nogor ', wPart2 = 'Somachar', wPart3 = ' 24';
  const tw1 = ctx.measureText(wPart1).width;
  const tw2 = ctx.measureText(wPart2).width;
  const tw3 = ctx.measureText(wPart3).width;
  const totalW = tw1 + tw2 + tw3;
  // Center exactly 50/50 over the SPLIT line
  const wmX = SPLIT - Math.round(totalW / 2);
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#ffffff'; ctx.fillText(wPart1, wmX, wmY);
  ctx.fillStyle = '#ffcc00'; ctx.fillText(wPart2, wmX + tw1, wmY);
  ctx.fillStyle = '#625353ff'; ctx.fillText(wPart3, wmX + tw1 + tw2, wmY);
  ctx.restore();

  /* ── website bottom center ── */
  if (d.web) {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Arial, Noto Sans Bengali';
    const webX = SPLIT + (W - SPLIT) / 2;
    ctx.textAlign = 'center';

    // Globe icon approximation with text
    ctx.fillText('�  ' + d.web, webX, mainH - 45);
    ctx.textAlign = 'left';
  }

  drawAd(ctx);
}

/* ══════════════════════════════════════════════════════
   T4 — BANGLADESH TIMES STYLE (Reference Image)
   Left curved photo, Red-Dark gradient bg, White text, Pill button
══════════════════════════════════════════════════════ */
function T2(ctx, d) {
  const ah = adH();
  const mainH = H - ah;

  // 1. Background (Deep Red Gradient)
  const g = ctx.createLinearGradient(W, 0, W, mainH);
  g.addColorStop(0, '#a50000'); // Deep Red
  g.addColorStop(1, '#5a0000'); // Darker Red
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, mainH);

  // 2. Photo with Custom Curved Clip (Left Side)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(W * 0.45, 0); // Top width
  // Creating the elegant curve like the reference
  ctx.bezierCurveTo(W * 0.65, mainH * 0.3, W * 0.35, mainH * 0.7, W * 0.55, mainH);
  ctx.lineTo(0, mainH);
  ctx.closePath();
  ctx.clip();

  if (img1) {
    cov(ctx, img1, 0, 0, W * 0.65, mainH, 1, img1Scale, img1OffX, img1OffY);
  } else {
    ctx.fillStyle = '#333'; ctx.fillRect(0, 0, W * 0.65, mainH);
  }
  ctx.restore();

  // 3. Logo and Date (Top Right)
  const logoX = W - 50;
  if (logo2 || logo) {
    const lImg = logo2 || logo;
    const lH = 65;
    const lW = (lImg.width / lImg.height) * lH;
    ctx.drawImage(lImg, logoX - lW, 40, lW, lH);
  }

  if (d.date) {
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px Noto Sans Bengali';
    ctx.textAlign = 'right';
    ctx.fillText(d.date, logoX, 140);
  }

  // 4. Headline (Main Quote)
  const textX = W * ((d.hlX || 52) / 100); // X position from slider
  const textW = W - textX - 50;
  const textStartY = (d.hlY || 100) + 120;  // Y position from slider (base 120 + offset)
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff';
  ctx.font = `bold ${d.hlFs || 58}px Noto Serif Bengali`;
  const hLines = wrap(ctx, d.hl, textX, textStartY, textW, 85);

  // 5. Speaker Name (Yellow with Underline)
  const speakerY = textStartY + (hLines * 85) + 60;
  ctx.fillStyle = '#ffff00'; // Bright Yellow
  ctx.font = 'bold 42px Noto Sans Bengali';
  ctx.textAlign = 'right';
  ctx.fillText(d.sp || 'নাম উল্লেখ নেই', W - 50, speakerY);

  // Underline
  ctx.strokeStyle = '#ffff00';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(W - 50, speakerY + 15);
  ctx.lineTo(W - 400, speakerY + 15);
  ctx.stroke();

  // 6. Pill Button removed as requested
  // 7. Footer Ad Area
  drawAd(ctx);
}

/* ══════════════════════════════════════════════════════
   T3 — PERFECT GEOMETRIC SLANT (Ref: Image 2)
   Fixed intercepts to match the massive Dark Red band and layout
══════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════
   T3 — PERFECT GEOMETRIC SLANT (Ref: Image 3/4)
   Fixed intercepts to match the massive Dark Red band and layout
══════════════════════════════════════════════════════ */
function T3(ctx, d) {
  const ah = adH();
  const mainH = H - ah;

  const fillAbove = (color, c) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    if (c >= 0) {
      ctx.moveTo(0, c);
      ctx.lineTo(W, W + c);
      ctx.lineTo(W, 0);
      ctx.lineTo(0, 0);
    } else {
      ctx.moveTo(-c, 0);
      ctx.lineTo(W, W + c);
      ctx.lineTo(W, 0);
    }
    ctx.fill();
  };

  // Base Beige
  ctx.fillStyle = '#E5E3DB';
  ctx.fillRect(0, 0, W, mainH);

  // Layers from bottom-up
  fillAbove('#5A473E', 800);  // Shadow Brown
  fillAbove('#48494B', 650);  // Dark Grey
  fillAbove('#811D1E', 450);  // Dark Red (massive central coverage)
  fillAbove('#68483B', -500); // Main Brown (Top Right corner)

  // Bright Red overlay (Bottom Right)
  ctx.fillStyle = '#D61214';
  ctx.beginPath();
  ctx.moveTo(W, mainH - 350);
  ctx.lineTo(W - 450, mainH);
  ctx.lineTo(W, mainH);
  ctx.fill();

  // Faint watermark
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = '#000';
  ctx.font = 'bold 90px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Nogor Somachar 24', W / 2 + 50, mainH - 220);
  ctx.restore();

  // Quote marks
  ctx.fillStyle = '#0F0F0F';
  ctx.font = 'bold 240px Arial, serif';
  ctx.textBaseline = 'top';
  nosh(ctx);
  ctx.fillText('“', 100, 60);
  ctx.textBaseline = 'alphabetic';

  // True Logo explicitly un-filtered
  const logoX = W - 50;
  if (rawLogo && rawLogo.width) {
    const lH = 80;
    const lW = (rawLogo.width / rawLogo.height) * lH;
    ctx.drawImage(rawLogo, logoX - lW, 50, lW, lH);
  }

  // Centered Quote Text
  const textX = W / 2;
  const textW = W - 180;
  // Make sure it starts lower, avoiding logo collision even if hlY=100
  const textStartY = d.hlY + 80;
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.font = `normal ${d.hlFs || 46}px Noto Sans Bengali, sans-serif`;
  nosh(ctx);
  const hLines = wrapC(ctx, d.hl, textX, textStartY, textW, (d.hlFs || 46) * 1.6);

  // Speaker Name
  ctx.textAlign = 'left';
  const speakerY = textStartY + (hLines * (d.hlFs || 46) * 1.6) + 70;

  ctx.fillStyle = '#ECA93A'; // Golden Yellow
  ctx.font = 'bold 46px Noto Sans Bengali, Arial';
  ctx.fillText(d.sp || 'ইশতিয়াক আহমেদ সিদ্দিকী', 100, speakerY);

  // Divider
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(100, speakerY + 28);
  ctx.lineTo(480, speakerY + 28);
  ctx.stroke();

  // Designation
  ctx.fillStyle = '#E8E8E8';
  ctx.font = 'normal 26px Noto Sans Bengali';
  ctx.fillText(d.des || 'প্রথম যুগ্ম-সম্পাদক, সিলেট জেলা বিএনপি।', 100, speakerY + 75);

  // Date
  if (d.date) {
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 44px Noto Sans Bengali';
    ctx.fillText(d.date, 80, mainH - 80);
  }

  // Person Image
  if (img1) {
    ctx.save();
    const ih = mainH * 0.58 * img1Scale;
    const iw = (img1.width / img1.height) * ih;
    const drawX = W - iw + img1OffX;
    const drawY = mainH - ih + img1OffY;
    ctx.drawImage(img1, drawX, drawY, iw, ih);
    ctx.restore();
  }

  // Footer Ad Area
  drawAd(ctx);
}


function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + r); ctx.arc(x + r, y + r, r, Math.PI, 3 * Math.PI / 2);
  ctx.closePath(); ctx.fill();
}


/* ══════════════════════════════════════════════════════
   T7 — AGAMIR SOMOY STYLE (exact reference match)
   - Black bg
   - Photo top ~57%
   - Date right-aligned + thin underline
   - Headline right-aligned, large bold
   - বিস্তারিত কমেন্টে LEFT side
   - Big red triangle bottom-left
   - Logo + website bottom-right
══════════════════════════════════════════════════════ */
function wrapR(ctx, txt, rx, y, mw, lh) {
  /* right-aligned word wrap — rx is the right edge X */
  if (!txt) return 0;
  const ws = txt.split(' '); let ln = '', ls = [];
  for (const w of ws) {
    const t = ln ? ln + ' ' + w : w;
    if (ctx.measureText(t).width > mw && ln) { ls.push(ln); ln = w; }
    else ln = t;
  }
  ls.push(ln);
  ls.forEach((l, i) => ctx.fillText(l, rx, y + i * lh));
  return ls.length;
}

function T7(ctx, d) {
  const ah = adH();
  const mainH = H - ah;

  /* 1. Pure black background */
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, mainH);

  /* 2. Photo — top 57% */
  const photoH = Math.round(mainH * 0.57);
  if (img1) {
    cov(ctx, img1, 0, 0, W, photoH, 1, img1Scale, img1OffX, img1OffY);
    // Hard fade to black at bottom of photo
    const fadeG = ctx.createLinearGradient(0, photoH - 90, 0, photoH + 10);
    fadeG.addColorStop(0, 'rgba(0,0,0,0)');
    fadeG.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = fadeG;
    ctx.fillRect(0, photoH - 90, W, 100);
  } else {
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, W, photoH);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.font = 'bold 32px Noto Sans Bengali';
    ctx.textAlign = 'center';
    ctx.fillText('ছবি আপলোড করুন', W / 2, photoH / 2);
    ctx.textAlign = 'left';
  }

  /* 2b. Clock badge — top-right corner, circular */
  if (clockImg && clockImg.width) {
    const badgeR = 60;
    const badgeX = W - 24 - badgeR; // top-RIGHT side
    const badgeY = 24 + badgeR;
    ctx.save();
    // 1. Clip to circle
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    // 2. White background fill
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(badgeX - badgeR - 1, badgeY - badgeR - 1, badgeR * 2 + 2, badgeR * 2 + 2);
    // 3. Scale by HEIGHT (image is landscape) so full logo shows
    const imgAspect = clockImg.width / clockImg.height;
    const fitH = badgeR * 2 * 1.05;
    const fitW = fitH * imgAspect;
    // Logo is right-of-center in the source image, shift LEFT to center it
    const logoXShift = fitW * 0.050;
    ctx.drawImage(clockImg, badgeX - fitW / 2 - logoXShift, badgeY - fitH / 2, fitW, fitH);
    ctx.restore();
    // 4. White border ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR + 1, 0, Math.PI * 2);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  /* 3. Layout metrics */
  const footerH = 240;
  const fY = mainH - footerH;
  const textAreaY = photoH;

  /* 4. Date — right aligned, with thin full-width underline */
  const dateY = textAreaY + 56;
  if (d.date) {
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.font = '27px Noto Sans Bengali';
    ctx.textAlign = 'right';
    ctx.fillText(d.date, W - 44, dateY);
    ctx.textAlign = 'left';
  }
  // Thin separator line below date
  ctx.strokeStyle = 'rgba(255,255,255,0.30)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(44, dateY + 14);
  ctx.lineTo(W - 44, dateY + 14);
  ctx.stroke();

  /* 5. Headline — right-aligned, bold, large */
  const hlFontSize = d.hlFs || 60;
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${hlFontSize}px Noto Serif Bengali, Noto Sans Bengali`;
  nosh(ctx);
  ctx.textAlign = 'right';
  const hlY = dateY + 62;
  const hlMaxW = W - 88;
  const lh = hlFontSize * 1.42;
  const hlLines = wrapR(ctx, d.hl, W - 44, hlY, hlMaxW, lh);
  ctx.textAlign = 'left';

  /* 6. Footer background */
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, fY, W, footerH);

  /* 7. Red Triangle — BIG, bottom-left, rises above footer */
  ctx.beginPath();
  ctx.moveTo(0, mainH);              // bottom-left corner
  ctx.lineTo(0, fY - 40);            // tall — rises 40px above footer top
  ctx.lineTo(W * 0.40, mainH);       // wide — 40% of card width along bottom
  ctx.closePath();
  ctx.fillStyle = '#c0392b';
  ctx.fill();

  /* 8. বিস্তারিত কমেন্টে — RIGHT side, top of footer, above logo */
  const iconR = 20;
  const btnRowY = fY + 44;           // top of footer + padding
  // Measure text to right-align everything
  ctx.font = '30px Noto Sans Bengali';
  const btnLabel = 'বিস্তারিত কমেন্টে';
  const labelW = ctx.measureText(btnLabel).width;
  const iconGap = 14;
  const totalBtnW = iconR * 2 + iconGap + labelW;
  const btnRightEdge = W - 36;
  const iconX = btnRightEdge - totalBtnW + iconR;
  const iconCY = btnRowY;
  // Red circle
  ctx.beginPath();
  ctx.arc(iconX, iconCY, iconR, 0, Math.PI * 2);
  ctx.fillStyle = '#c0392b';
  ctx.fill();
  // White arrow
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('›', iconX, iconCY);
  ctx.textBaseline = 'alphabetic';
  ctx.textAlign = 'left';
  // Label right-aligned
  ctx.fillStyle = 'rgba(255,255,255,0.88)';
  ctx.font = '30px Noto Sans Bengali';
  ctx.fillText(btnLabel, iconX + iconR + iconGap, btnRowY + iconR - 2);

  /* 9. Logo — right side, below বিস্তারিত কমেন্টে */
  const logoSrc = rawLogo || logo2 || logo;
  if (logoSrc && logoSrc.width) {
    const lH = 80;
    const lW = (logoSrc.width / logoSrc.height) * lH;
    const lX = W - lW - 36;
    const lY = fY + 78;              // pushed lower, below the button row
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.drawImage(logoSrc, lX, lY, lW, lH);
    ctx.restore();
  }

  /* 10. Website URL — bottom-right */
  if (d.web) {
    ctx.fillStyle = 'rgba(255,255,255,0.58)';
    ctx.font = '22px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(d.web, W - 36, mainH - 18);
    ctx.textAlign = 'left';
  }

  drawAd(ctx);
}


/* ── dispatch ── */
const FNS = [T1, T2, T3, T7];
const TNAMES = ['আর্টিকেল স্টাইল', 'ফুল ব্লিড রেড', 'ইশতিয়াক স্টাইল', 'আগামীর সময় স্টাইল (T7)'];

function drawT(ctx, idx) { ctx.clearRect(0, 0, W, H); FNS[idx](ctx, inp()); }
function rf() { drawT($('mainCanvas').getContext('2d'), curT); $('ctname').textContent = `টেমপ্লেট ${curT + 1} — ${TNAMES[curT]}`; }

function rth() {
  const g = $('tgrid'); g.innerHTML = '';
  FNS.forEach((_, i) => {
    const d = document.createElement('div'); d.className = 'tc' + (i === curT ? ' on' : '');
    const tc = document.createElement('canvas'); tc.width = 300; tc.height = 300;
    const num = document.createElement('div'); num.className = 'tnum'; num.textContent = i + 1;
    const nm = document.createElement('div'); nm.className = 'tcn'; nm.textContent = TNAMES[i];
    d.append(tc, num, nm);
    d.onclick = () => { document.querySelectorAll('.tc').forEach(x => x.classList.remove('on')); d.classList.add('on'); curT = i; rf(); };
    g.append(d);
    const c2 = tc.getContext('2d'); c2.save(); c2.scale(300 / W, 300 / H); drawT(c2, i); c2.restore();
  });
}

function buildColors() {
  const pal = $('colorPalette');
  COLORS.forEach(c => {
    const s = document.createElement('div'); s.className = 'cs' + (c === accent ? ' on' : '');
    s.style.background = c; s.title = c;
    s.onclick = () => { document.querySelectorAll('.cs').forEach(x => x.classList.remove('on')); s.classList.add('on'); accent = c; rf(); rth(); };
    pal.append(s);
  });
  const cw = document.createElement('div'); cw.className = 'cs custom';
  const ci = document.createElement('input'); ci.type = 'color'; ci.value = accent; ci.title = 'কাস্টম';
  ci.oninput = () => { document.querySelectorAll('.cs').forEach(x => x.classList.remove('on')); accent = ci.value; rf(); rth(); };
  cw.append(ci); pal.append(cw);
}

function toggleAd() {
  showAd = !showAd;
  const t = $('adTog'), l = $('adLbl');
  t.classList.toggle('on', showAd);
  l.textContent = showAd ? 'বিজ্ঞাপন দেখানো হচ্ছে' : 'বিজ্ঞাপন লুকানো';
  rf(); rth();
}

let origImg1 = null;
function loadImg(file, slot) {
  if (!file) return;
  const r = new FileReader();
  r.onload = e => {
    const im = new Image(); im.onload = () => {
      const strip = $('imgPreviewStrip');
      const thumb = document.createElement('img');
      thumb.src = im.src;
      thumb.style.height = '36px'; thumb.style.border = '2px solid #1f2937'; thumb.style.borderRadius = '4px';

      if (slot === 1) {
        img1 = im;
        origImg1 = im;
        $('ub1').classList.add('on');
        $('upLabel').textContent = '✓ মেইন ফটো লোড';
        if (strip) { strip.appendChild(thumb); }
        $('imgCtrlTarget').value = "1"; updateImgCtrlUI();
        const b = $('btnRemoveBg');
        if (b) b.style.display = 'block';
      }
      else if (slot === 2) {
        img2 = im;
        $('upLabel').textContent = '✓ মেইন ও ২য় ফটো';
        if (strip) { strip.appendChild(thumb); }
      }
      else {
        adImg = im;
        $('ubAd').classList.add('on');
        $('ubAd').querySelector('p').textContent = '✓ বিজ্ঞাপন লোড';
        $('imgCtrlTarget').value = "3"; updateImgCtrlUI();
      }
      rf(); rth();
    }; im.src = e.target.result;
  }; r.readAsDataURL(file);
}

$('up1').addEventListener('change', e => {
  const files = e.target.files;
  if (!files || !files.length) return;
  const strip = $('imgPreviewStrip');
  if (strip) { strip.style.display = 'flex'; strip.innerHTML = ''; }
  loadImg(files[0], 1);
  if (files.length > 1) {
    loadImg(files[1], 2);
  }
});

$('btnRemoveBg')?.addEventListener('click', () => {
  if (!img1 || !origImg1) return;
  const b = $('btnRemoveBg');
  b.textContent = '⏳ রিমুভ হচ্ছে...';
  b.disabled = true;

  setTimeout(() => {
    removeWhiteBgFloodFill(origImg1, (resImg) => {
      img1 = resImg;
      b.textContent = '✅ ব্যাকগ্রাউন্ড রিমুভড!';
      setTimeout(() => { b.textContent = '🪄 ম্যাজিক ব্যাকগ্রাউন্ড রিমুভ'; b.disabled = false; }, 2000);
      rf(); rth();
    });
  }, 50);
});

$('upAd').addEventListener('change', e => loadImg(e.target.files[0], 3));

function updateImgCtrlUI() {
  if (!$('imgCtrlTarget')) return;
  const val = parseInt($('imgCtrlTarget').value);
  let s = 1.0, x = 0, y = 0;
  if (val === 1) { s = img1Scale; x = img1OffX; y = img1OffY; }
  else if (val === 2) { s = img2Scale; x = img2OffX; y = img2OffY; }
  else if (val === 3) { s = adImgScale; x = adImgOffX; y = adImgOffY; }

  $('scU').value = s * 100; $('scUval').textContent = Math.round(s * 100) + '%';
  $('imUx').value = x; $('imUxval').textContent = x + 'px';
  $('imUy').value = y; $('imUyval').textContent = y + 'px';
}

function handleImgCtrlChange(type, val) {
  const target = parseInt($('imgCtrlTarget').value);
  const v = (type === 'scale') ? (val / 100) : parseInt(val);

  if (target === 1) {
    if (type === 'scale') img1Scale = v; else if (type === 'x') img1OffX = v; else img1OffY = v;
  } else if (target === 2) {
    if (type === 'scale') img2Scale = v; else if (type === 'x') img2OffX = v; else img2OffY = v;
  } else if (target === 3) {
    if (type === 'scale') adImgScale = v; else if (type === 'x') adImgOffX = v; else adImgOffY = v;
  }

  if (type === 'scale') $('scUval').textContent = val + '%';
  else if (type === 'x') $('imUxval').textContent = val + 'px';
  else if (type === 'y') $('imUyval').textContent = val + 'px';

  rf(); rth();
}
['headline', 'bodytext', 'speaker', 'designation', 'catdate', 'website'].forEach(id => $(id).addEventListener('input', () => { rf(); rth(); }));
$('category').addEventListener('change', () => { rf(); rth(); });

function dl(fmt = 'png') {
  const c = $('mainCanvas'), a = document.createElement('a');
  const hl = inp().hl.substring(0, 20).replace(/\s+/g, '_');
  a.download = `nogor_somachar_t${curT + 1}_${hl}.${fmt}`;
  const mime = fmt === 'jpg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png';
  a.href = c.toDataURL(mime, .96); a.click();
}

buildColors(); rth(); updateImgCtrlUI(); rf();

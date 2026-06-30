/* নগর সমাচার ২৪ — cards.js — 3 exact reference templates */
const W = 1080;
let H = 1080;
const COLORS = ['#c0392b', '#e74c3c', '#b71c1c', '#e67e22', '#f39c12', '#43a047', '#1565c0', '#8e44ad', '#000', '#1a1a1a', '#fff'];
let img1 = null, img2 = null, adImg = null, logo = null, accent = '#c0392b', curT = 0, showAd = false;
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

let adLogoImg = new Image();
adLogoImg.onload = () => { rf(); rth(); };
adLogoImg.src = 'adlogo.jpeg';

let clockImg = null;
(() => {
  const cl = new Image();
  cl.onload = () => { clockImg = cl; rf(); rth(); };
  cl.src = 'clock.png';
})();


function inp() { return { hl: $('headline').value || 'শিরোনাম', hlFs: parseInt($('hlFs').value) || 48, hlY: parseInt($('hlY').value) || 100, hlX: parseInt($('hlX').value) || 52, body: $('bodytext').value || '', sp: $('speaker').value || '', des: $('designation').value || '', cat: $('category').value, date: $('catdate').value || '', web: $('website').value || '', showDetailsBtn: $('showDetailsBtn') ? $('showDetailsBtn').checked : true, showCreditBtn: $('showCreditBtn') ? $('showCreditBtn').checked : false, accent }; }

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
  const lines = txt.split('\n'); let ls = [];
  for (const line of lines) {
    const ws = line.split(' '); let ln = '';
    for (const w of ws) {
      const t = ln ? ln + ' ' + w : w;
      if (ctx.measureText(t).width > mw && ln) { ls.push(ln.trim()); ln = w; } else ln = t;
    }
    if (ln) ls.push(ln.trim());
  }
  ls.forEach((l, i) => ctx.fillText(l, x, y + i * lh)); return ls.length;
}

function wrapC(ctx, txt, cx, y, mw, lh) {/* center */
  if (!txt) return 0;
  const lines = txt.split('\n'); let ls = [];
  for (const line of lines) {
    const ws = line.split(' '); let ln = '';
    for (const w of ws) {
      const t = ln ? ln + ' ' + w : w;
      if (ctx.measureText(t).width > mw && ln) { ls.push(ln.trim()); ln = w; } else ln = t;
    }
    if (ln) ls.push(ln.trim());
  }
  ls.forEach((l, i) => ctx.fillText(l, cx, y + i * lh)); return ls.length;
}

function wrapR(ctx, txt, rx, y, mw, lh) {
  /* right-aligned word wrap — rx is the right edge X */
  if (!txt) return 0;
  const lines = txt.split('\n'); let ls = [];
  for (const line of lines) {
    const ws = line.split(' '); let ln = '';
    for (const w of ws) {
      const t = ln ? ln + ' ' + w : w;
      if (ctx.measureText(t).width > mw && ln) { ls.push(ln.trim()); ln = w; } else ln = t;
    }
    if (ln) ls.push(ln.trim());
  }
  ls.forEach((l, i) => ctx.fillText(l, rx, y + i * lh)); return ls.length;
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

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + r); ctx.arc(x + r, y + r, r, Math.PI, 3 * Math.PI / 2);
  ctx.closePath(); ctx.fill();
}

/* ── AD FOOTER ── */
const AD_H = 120;
function adH() { return showAd ? AD_H : 0; }
function drawAd(ctx, customW) {
  if (!showAd) return;
  const cw = customW || W;
  const y = H - AD_H;
  if (adImg) { cov(ctx, adImg, 0, y, cw, AD_H, 1, adImgScale, adImgOffX, adImgOffY); }
  else {
    ctx.fillStyle = '#f5c842'; ctx.fillRect(0, y, cw, AD_H);
    ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.font = 'bold 22px Noto Sans Bengali'; ctx.textAlign = 'center';
    ctx.fillText('বিজ্ঞাপন এলাকা — Ad Image আপলোড করুন', cw / 2, y + AD_H / 2 + 8); ctx.textAlign = 'left';
  }
}

/* ══════════════════════════════════════════════════════
   T1 — QUOTE SPLIT CARD (reference: left photo + right red quote panel)
══════════════════════════════════════════════════════ */
function T1(ctx, d) {
  const ah = adH();
  const mainH = H - ah;
  const SPLIT = Math.round(W * .48); // left photo width ~48%

  /* ── LEFT: portrait photo full height ── */
  cov(ctx, img1, 0, 0, SPLIT, mainH, 1, img1Scale, img1OffX, img1OffY);

  /* ── RIGHT: dark red bg ── */
  ctx.fillStyle = '#b71c1c';
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
    ctx.drawImage(logoSrc2, W - l2w - 24, 24, l2w, l2h);
    ctx.restore();
  }

  /* ── Calculate Quote Box height exactly ── */
  const boxX = 420; // move left
  const boxW = W - boxX - 100; // smaller width, leaves more gap on right
  const qfs = 36, qlh = qfs * 1.5;
  ctx.font = `bold ${qfs}px Noto Serif Bengali`;

  const pWords = d.hl.split(' ');
  let tLines = 1, trm = '';
  const ws = d.hl.split(' ');
  let ln = '', ls = [];
  for (const w of ws) {
    const t = ln ? ln + ' ' + w : w;
    if (ctx.measureText(t).width > boxW - 80 && ln) { ls.push(ln); ln = w; }
    else ln = t;
  }
  ls.push(ln);

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

  let nextY = attrY + 45;
  const desTxt = d.des || d.body;
  if (desTxt) {
    ctx.fillStyle = '#fff'; // designation white
    ctx.font = `24px Noto Sans Bengali`;
    const dashW = ctx.measureText('—  ').width;
    wrap(ctx, desTxt, attrX + dashW, nextY, W - attrX - dashW - 40, 36);
  }

  /* watermark */
  ctx.save();
  const wmY = Math.round(mainH * 0.50);
  const wmFs = 42;
  ctx.font = `bold ${wmFs}px Arial, sans-serif`;
  const wPart1 = 'Nogor ', wPart2 = 'Somachar', wPart3 = ' 24';
  const tw1 = ctx.measureText(wPart1).width;
  const tw2 = ctx.measureText(wPart2).width;
  const tw3 = ctx.measureText(wPart3).width;
  const totalW = tw1 + tw2 + tw3;
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
    ctx.fillText('  ' + d.web, webX, mainH - 45);
    ctx.textAlign = 'left';
  }

  drawAd(ctx);
}

/* ══════════════════════════════════════════════════════
   T2 —   STYLE (previously T7)
══════════════════════════════════════════════════════ */
function T2(ctx, d) {
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
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(badgeX - badgeR - 1, badgeY - badgeR - 1, badgeR * 2 + 2, badgeR * 2 + 2);
    const imgAspect = clockImg.width / clockImg.height;
    const fitH = badgeR * 2 * 1.05;
    const fitW = fitH * imgAspect;
    const logoXShift = fitW * 0.050;
    ctx.drawImage(clockImg, badgeX - fitW / 2 - logoXShift, badgeY - fitH / 2, fitW, fitH);
    ctx.restore();
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

  /* 3b. Footer background */
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, fY, W, footerH);

  /* 3c. Red Triangle — BIG, bottom-left, rises above footer */
  ctx.beginPath();
  ctx.moveTo(0, mainH);              // bottom-left corner
  ctx.lineTo(0, fY - 40);            // tall — rises 40px above footer top
  ctx.lineTo(W * 0.40, mainH);       // wide — 40% of card width along bottom
  ctx.closePath();
  ctx.fillStyle = '#5e5554ff';
  ctx.fill();

  /* 4. Date — right aligned, with thin full-width underline */
  const dateY = textAreaY + 56;
  const alignDateY = dateY - 70; // তারিখের পজিশনটি আগে হিসাব করে নিলাম

  /* Watermark (Jol Chap) — center aligned with date */
  if (logo2 && logo2.width) {
    ctx.save();
    ctx.globalAlpha = 1.0; // লোগোটি উজ্জ্বল দেখানোর জন্য 1.0 করা হলো (হালকা চাইলে 0.5 রাখতে পারেন)
    const wmWidth = 320;
    const wmHeight = (logo2.height / logo2.width) * wmWidth;
    const wmX = (W - wmWidth) / 2;

    // লোগোটিকে তারিখের ঠিক সোজা লাইনে বসানো হলো:
    const wmY = alignDateY - (wmHeight / 2) - 10;

    ctx.drawImage(logo2, wmX, wmY, wmWidth, wmHeight);
    ctx.restore();
  }

  if (d.date) {
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.font = '27px Noto Sans Bengali';
    ctx.textAlign = 'right';
    ctx.fillText(d.date, W - 44, alignDateY);
    ctx.textAlign = 'left';
  }
  // Thin separator line below date
  ctx.strokeStyle = 'rgba(255,255,255,0.30)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(44, alignDateY + 14);
  ctx.lineTo(W - 44, alignDateY + 14);
  ctx.stroke();

  /* 5. Headline (Dynamic Alignment & Max Width) */
  const hlFontSize = d.hlFs || 60;
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${hlFontSize}px Noto Serif Bengali, Noto Sans Bengali`;
  nosh(ctx);

  // হেডলাইনের জন্য সর্বোচ্চ জায়গা বাড়িয়ে দেওয়া হলো, যাতে সহজে লাইন না ভাঙে
  const hlMaxW = W - 88;
  const lh = hlFontSize * 1.42;

  // হেডলাইনটি ক্যানভাসে কয় লাইন জায়গা নিবে তা নিখুঁতভাবে হিসাব করা হচ্ছে
  let ls = [];
  const lines = d.hl.split('\n');
  for (const line of lines) {
    const ws = line.split(' '); let ln = '';
    for (const w of ws) {
      const t = ln ? ln + ' ' + w : w;
      if (ctx.measureText(t).width > hlMaxW && ln) { ls.push(ln.trim()); ln = w; }
      else ln = t;
    }
    if (ln) ls.push(ln.trim());
  }
  const numLines = ls.length;

  // লাইন সংখ্যা অনুযায়ী ভার্টিক্যাল সেন্টার অ্যাডজাস্টমেন্ট
  let yOffset = 0;
  if (numLines === 1) {
    yOffset = 45; // ১ লাইন হলে ৪৫ পিক্সেল নিচে নেমে আসবে
  } else if (numLines > 2) {
    yOffset = -20; // ৩ লাইন বা তার বেশি হলে উপরে উঠে যাবে
  }

  /* হেডলাইন সবসময় ডানপাশে ফিক্সড থাকবে (বাটন অন বা অফ যাই থাকুক) */
  ctx.textAlign = 'right';
  const hlY = dateY + 62 + yOffset;
  let hlLines = wrapR(ctx, d.hl, W - 44, hlY, hlMaxW, lh);
  ctx.textAlign = 'left';
  /* 8. Website URL — বামপাশে (Triangle এর নিচে) বসানো হলো */
  if (d.web) {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '30px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(d.web, 25, mainH - 22);
  }
  /* 10. বিস্তারিত কমেন্টে — আরও বামে সরানো হলো */
  if (d.showDetailsBtn) {
    const iconR = 15;
    const btnLabel = 'বিস্তারিত কমেন্টে';
    ctx.font = 'bold 27px Noto Sans Bengali';
    const labelW = ctx.measureText(btnLabel).width;
    const iconGap = 10;

    // আগে W - 44 ছিল, এখন আরও একটু বামে সরাতে W - 75 করা হলো
    const btnRightEdge = W - 44;

    // বাটন টেক্সট 
    ctx.fillStyle = '#ffcc00';
    ctx.textAlign = 'right';
    ctx.fillText(btnLabel, btnRightEdge, mainH - 20);
    ctx.textAlign = 'left';

    // আইকনের পজিশন
    const iconX = btnRightEdge - labelW - iconGap - iconR;
    const iconCY = mainH - 28;

    ctx.beginPath();
    ctx.arc(iconX, iconCY, iconR, 0, Math.PI * 2);
    ctx.fillStyle = '#ffcc00';
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('›', iconX, iconCY);
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
  }
  drawAd(ctx);
}

/* ══════════════════════════════════════════════════════
   T3 — T2 + বক্তা/রিপোর্টার নাম ও পদবি/বিভাগ সহ (previously T7b)
══════════════════════════════════════════════════════ */
function T3(ctx, d) {
  const ah = adH();
  const mainH = H - ah;

  /* 1. Pure black background */
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, mainH);

  /* 2. Photo — top 57% */
  const photoH = Math.round(mainH * 0.57);
  if (img1) {
    cov(ctx, img1, 0, 0, W, photoH, 1, img1Scale, img1OffX, img1OffY);
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
    const badgeX = W - 24 - badgeR;
    const badgeY = 24 + badgeR;
    ctx.save();
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(badgeX - badgeR - 1, badgeY - badgeR - 1, badgeR * 2 + 2, badgeR * 2 + 2);
    const imgAspect = clockImg.width / clockImg.height;
    const fitH = badgeR * 2 * 1.05;
    const fitW = fitH * imgAspect;
    const logoXShift = fitW * 0.050;
    ctx.drawImage(clockImg, badgeX - fitW / 2 - logoXShift, badgeY - fitH / 2, fitW, fitH);
    ctx.restore();
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

  /* 3b. Footer background */
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, fY, W, footerH);

  /* 3c. Red Triangle — BIG, bottom-left */
  ctx.beginPath();
  ctx.moveTo(0, mainH);
  ctx.lineTo(0, fY - 40);
  ctx.lineTo(W * 0.40, mainH);
  ctx.closePath();
  ctx.fillStyle = '#5e5554ff';
  ctx.fill();

  /* 4. Date — right aligned, with thin full-width underline */
  const dateY = textAreaY + 56;
  const alignDateY = dateY - 70; // তারিখের পজিশনটি আগে হিসাব করে নিলাম

  /* Watermark (Jol Chap) — center aligned with date */
  if (logo2 && logo2.width) {
    ctx.save();
    ctx.globalAlpha = 1.0; // লোগোটি উজ্জ্বল দেখানোর জন্য 1.0 করা হলো (হালকা চাইলে 0.5 রাখতে পারেন)
    const wmWidth = 320;
    const wmHeight = (logo2.height / logo2.width) * wmWidth;
    const wmX = (W - wmWidth) / 2;

    // লোগোটিকে তারিখের ঠিক সোজা লাইনে বসানো হলো:
    const wmY = alignDateY - (wmHeight / 2) - 10;

    ctx.drawImage(logo2, wmX, wmY, wmWidth, wmHeight);
    ctx.restore();
  }

  if (d.date) {
    ctx.fillStyle = 'rgba(255,255,255,0.78)';
    ctx.font = '27px Noto Sans Bengali';
    ctx.textAlign = 'right';
    ctx.fillText(d.date, W - 44, alignDateY);
    ctx.textAlign = 'left';
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.30)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(44, alignDateY + 14);
  ctx.lineTo(W - 44, alignDateY + 14);
  ctx.stroke();

  /* 5. Headline (Dynamic Vertical Centering) */
  const hlFontSize = d.hlFs || 60;
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${hlFontSize}px Noto Serif Bengali, Noto Sans Bengali`;
  nosh(ctx);
  const hlMaxW = W - 120; // Reduced to prevent cutoff
  const lh = hlFontSize * 1.42;

  // হেডলাইনটি ক্যানভাসে কয় লাইন জায়গা নিবে তা আগে হিসাব করা হচ্ছে
  const ws = d.hl.split(' ');
  let ln = '', ls = [];
  for (const w of ws) {
    const t = ln ? ln + ' ' + w : w;
    if (ctx.measureText(t).width > hlMaxW && ln) { ls.push(ln); ln = w; }
    else ln = t;
  }
  ls.push(ln);
  const numLines = ls.length;

  // লাইন সংখ্যা অনুযায়ী Y পজিশন অ্যাডজাস্টমেন্ট (১ লাইন হলে নিচে নামবে)
  let yOffset = 0;
  if (numLines === 1) {
    yOffset = 45; // ১ লাইন হলে ৪৫ পিক্সেল নিচে নেমে ভার্টিক্যালি সেন্টার হবে
  } else if (numLines > 2) {
    yOffset = -20; // ৩ লাইন বা তার বেশি হলে একটু উপরে উঠে যাবে যাতে নিচে জায়গা থাকে
  }

  /* হেডলাইন সবসময় ডানপাশে ফিক্সড থাকবে (বাটন অন বা অফ যাই থাকুক) */
  ctx.textAlign = 'right';
  const hlY = dateY + 62 + yOffset;
  let hlLines = wrapR(ctx, d.hl, W - 44, hlY, hlMaxW, lh);
  ctx.textAlign = 'left';
  //Website URL
  if (d.web) {
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.font = '30px Arial';
    ctx.textAlign = 'left';
    // বাম দিক থেকে 36 পিক্সেল ফাঁকা রেখে বসানো হলো
    ctx.fillText(d.web, 25, mainH - 22);
  }

  /* 8. বক্তা/রিপোর্টার নাম ও পদবি/বিভাগ (শিরোনামের সাথে ডানপাশে ফিক্সড) */
  const spkY = fY + 80;
  // আগে W - 36 ছিল, এখন শিরোনামের সাথে মেলাতে W - 44 করা হলো
  const spkRightEdge = W - 36;

  // স্পিকার/রিপোর্টার নাম
  if (d.sp) {
    ctx.fillStyle = '#ffcc00';
    ctx.font = 'bold 41px SolaimanLipi, AdorshoLipi, Noto Sans Bengali';
    ctx.textAlign = 'right';
    ctx.fillText(d.sp, spkRightEdge, spkY);
    ctx.textAlign = 'left';
  }

  /* নাম ও পদবির মাঝখানের ডিভাইডার লাইন */
  const dividerY = spkY + 16;
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W * 0.42, dividerY);
  ctx.lineTo(W - 44, dividerY); // লাইনটিও ৪৪ পিক্সেল পর্যন্ত করা হলো
  ctx.stroke();

  /* পদবি/বিভাগ */
  if (d.des) {
    const webY = mainH - 18;
    const desY = dividerY + ((webY - dividerY) / 2) - 10;

    ctx.fillStyle = 'rgba(200,200,200,0.85)';
    ctx.font = '31px Noto Sans Bengali';
    ctx.textAlign = 'right';

    // W - 44 ব্যবহার করা হলো
    wrapR(ctx, d.des, spkRightEdge, desY, W - (W * 0.40) - 40, 38);
    ctx.textAlign = 'left';
  }
  /* 10. বিস্তারিত কমেন্টে — আরও বামে সরানো হলো */
  if (d.showDetailsBtn) {
    const iconR = 15;
    const btnLabel = 'বিস্তারিত কমেন্টে';
    ctx.font = 'bold 27px Noto Sans Bengali';
    const labelW = ctx.measureText(btnLabel).width;
    const iconGap = 10;

    // আগে W - 44 ছিল, এখন আরও একটু বামে সরাতে W - 75 করা হলো
    const btnRightEdge = W - 44;

    // বাটন টেক্সট 
    ctx.fillStyle = '#ffcc00';
    ctx.textAlign = 'right';
    ctx.fillText(btnLabel, btnRightEdge, mainH - 20);
    ctx.textAlign = 'left';

    // আইকনের পজিশন
    const iconX = btnRightEdge - labelW - iconGap - iconR;
    const iconCY = mainH - 28;

    ctx.beginPath();
    ctx.arc(iconX, iconCY, iconR, 0, Math.PI * 2);
    ctx.fillStyle = '#ffcc00';
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('›', iconX, iconCY);
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
  }

  drawAd(ctx);
}

/* ══════════════════════════════════════════════════════
   T4 — PORTRAIT NEWS CARD  (1245 × 1536)
   White/light gradient top half · headline · details btn · cover image
══════════════════════════════════════════════════════ */
/* ══════════════════════════════════════════════════════
   T4 — PORTRAIT NEWS CARD  (1245 × 1536)
   White/light gradient top half · headline · details btn · cover image
══════════════════════════════════════════════════════ */
function T4(ctx, d) {
  const TW = 1245;          // template-local width
  const TH = 1536;          // template-local height
  const MARGIN = 60;        // horizontal margin

  /* ── 1. BACKGROUND: gradient top 60% (Updated to Gray) ── */
  const topH = Math.round(TH * 0.60);
  const bgGrad = ctx.createLinearGradient(0, 0, 0, topH);
  bgGrad.addColorStop(0, '#f3f4f6'); // Light gray
  bgGrad.addColorStop(1, '#e5e7eb'); // Slightly darker gray at bottom
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, TW, topH);

  /* ── 1b. Subtle radial glow top-left ── */
  const glow = ctx.createRadialGradient(0, 200, 0, 0, 200, 700);
  glow.addColorStop(0, 'rgba(229,57,53,0.05)');
  glow.addColorStop(1, 'rgba(229,57,53,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, TW, topH);

  /* ═══════════════════════════════════════
     2. TOP BAR (Header)
  ═══════════════════════════════════════ */
  const HDR_Y = 42;          // top of header row
  const HDR_H = 80;          // header row height
  const DATE_X = MARGIN;      // left edge of date box
  const RED = '#e53935';

  /* ── Date box ── */
  const dateBoxW = 340;
  const dateBoxH = 72;
  const dateBoxR = 10;        // corner radius
  const iconSq = dateBoxH;  // solid red square occupies full height on right
  const dateBoxY = HDR_Y + (HDR_H - dateBoxH) / 2;

  // Outer stroked rounded-rect
  ctx.save();
  ctx.beginPath();
  const dbx = DATE_X, dby = dateBoxY, dbw = dateBoxW, dbh = dateBoxH, dbr = dateBoxR;
  ctx.moveTo(dbx + dbr, dby);
  ctx.lineTo(dbx + dbw - dbr, dby); ctx.arcTo(dbx + dbw, dby, dbx + dbw, dby + dbr, dbr);
  ctx.lineTo(dbx + dbw, dby + dbh - dbr); ctx.arcTo(dbx + dbw, dby + dbh, dbx + dbw - dbr, dby + dbh, dbr);
  ctx.lineTo(dbx + dbr, dby + dbh); ctx.arcTo(dbx, dby + dbh, dbx, dby + dbh - dbr, dbr);
  ctx.lineTo(dbx, dby + dbr); ctx.arcTo(dbx, dby, dbx + dbr, dby, dbr);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = RED;
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();

  // Solid red square on right side of date box
  const sqX = DATE_X + dateBoxW - iconSq;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(sqX, dby + dbr);
  ctx.lineTo(sqX, dby + dbh - dbr); ctx.arcTo(sqX, dby + dbh, sqX + dbr, dby + dbh, dbr);
  ctx.lineTo(dbx + dbw - dbr, dby + dbh); ctx.arcTo(dbx + dbw, dby + dbh, dbx + dbw, dby + dbh - dbr, dbr);
  ctx.lineTo(dbx + dbw, dby + dbr); ctx.arcTo(dbx + dbw, dby, dbx + dbw - dbr, dby, dbr);
  ctx.lineTo(sqX + dbr, dby); ctx.arcTo(sqX, dby, sqX, dby + dbr, dbr);
  ctx.closePath();
  ctx.fillStyle = RED;
  ctx.fill();
  ctx.restore();

  // Calendar icon (white) inside the red square
  ctx.save();
  const icCX = sqX + iconSq / 2;
  const icCY = dby + dbh / 2;
  const icS = 28; // half-size of icon
  ctx.strokeStyle = '#ffffff';
  ctx.fillStyle = '#ffffff';
  ctx.lineWidth = 2.8;
  ctx.lineJoin = 'round';
  // Body rect
  ctx.strokeRect(icCX - icS, icCY - icS + 6, icS * 2, icS * 2 - 4);
  // Top bar
  ctx.fillRect(icCX - icS, icCY - icS + 6, icS * 2, 10);
  // Hooks
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(icCX - icS * 0.5, icCY - icS + 2); ctx.lineTo(icCX - icS * 0.5, icCY - icS + 18); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(icCX + icS * 0.5, icCY - icS + 2); ctx.lineTo(icCX + icS * 0.5, icCY - icS + 18); ctx.stroke();
  // Grid dots
  const dotR = 3;
  [[-0.5, 0.1], [0.1, 0.1], [0.5, 0.1], [-0.5, 0.55], [0.1, 0.55]].forEach(([fx, fy]) => {
    ctx.beginPath();
    ctx.arc(icCX + fx * icS * 1.1, icCY + fy * icS * 1.4, dotR, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // Date text inside box (left portion)
  if (d.date) {
    ctx.save();
    ctx.font = 'bold 30px Noto Sans Bengali, Arial';
    ctx.fillStyle = '#1a1a1a';
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'left';
    ctx.fillText(d.date, DATE_X + 16, dby + dbh / 2);
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.restore();
  }

  /* ── Details Button (Top Right, replaces logo) ── */
  if (d.showDetailsBtn !== false) {
    const btnLabel = 'বিস্তারিত খবর কমেন্টে.....';
    const btnFs = 28;
    const btnPadX = 20;
    const btnPadY = 14;
    const btnIconSq = btnFs + btnPadY * 2;
    ctx.font = `${btnFs}px Noto Sans Bengali, Arial`;
    const labelW = ctx.measureText(btnLabel).width;
    const btnW = labelW + btnPadX * 2 + btnIconSq + 12;
    const btnH = btnIconSq;
    const btnBR = 8;

    const bx = TW - MARGIN - btnW;
    const by = HDR_Y + (HDR_H - btnH) / 2;

    ctx.save();
    ctx.shadowColor = 'rgba(229,57,53,0.25)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 3;
    ctx.beginPath();
    ctx.moveTo(bx + btnBR, by);
    ctx.lineTo(bx + btnW - btnBR, by); ctx.arcTo(bx + btnW, by, bx + btnW, by + btnBR, btnBR);
    ctx.lineTo(bx + btnW, by + btnH - btnBR); ctx.arcTo(bx + btnW, by + btnH, bx + btnW - btnBR, by + btnH, btnBR);
    ctx.lineTo(bx + btnBR, by + btnH); ctx.arcTo(bx, by + btnH, bx, by + btnH - btnBR, btnBR);
    ctx.lineTo(bx, by + btnBR); ctx.arcTo(bx, by, bx + btnBR, by, btnBR);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(bx + btnBR, by);
    ctx.lineTo(bx + btnW - btnBR, by); ctx.arcTo(bx + btnW, by, bx + btnW, by + btnBR, btnBR);
    ctx.lineTo(bx + btnW, by + btnH - btnBR); ctx.arcTo(bx + btnW, by + btnH, bx + btnW - btnBR, by + btnH, btnBR);
    ctx.lineTo(bx + btnBR, by + btnH); ctx.arcTo(bx, by + btnH, bx, by + btnH - btnBR, btnBR);
    ctx.lineTo(bx, by + btnBR); ctx.arcTo(bx, by, bx + btnBR, by, btnBR);
    ctx.closePath();
    ctx.strokeStyle = RED;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.font = `${btnFs}px Noto Sans Bengali, Arial`;
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(btnLabel, bx + btnPadX, by + btnH / 2);
    ctx.restore();

    const iconSqX = bx + btnW - btnIconSq;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(iconSqX, by + btnBR);
    ctx.lineTo(iconSqX, by + btnH - btnBR); ctx.arcTo(iconSqX, by + btnH, iconSqX + btnBR, by + btnH, btnBR);
    ctx.lineTo(bx + btnW - btnBR, by + btnH); ctx.arcTo(bx + btnW, by + btnH, bx + btnW, by + btnH - btnBR, btnBR);
    ctx.lineTo(bx + btnW, by + btnBR); ctx.arcTo(bx + btnW, by, bx + btnW - btnBR, by, btnBR);
    ctx.lineTo(iconSqX + btnBR, by); ctx.arcTo(iconSqX, by, iconSqX, by + btnBR, btnBR);
    ctx.closePath();
    ctx.fillStyle = RED;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.font = `${Math.round(btnIconSq * 0.52)}px Arial`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🔗', iconSqX + btnIconSq / 2, by + btnH / 2);
    ctx.restore();
  }
  /* ═══════════════════════════════════════
     3. HEADLINE — max 3 lines, top-anchored
  ═══════════════════════════════════════ */
  const MAX_HL_LINES = 3;
  const hlFs = 75;
  const hlLH = hlFs * 1.45;
  const hlMaxW = TW - MARGIN * 2 - 80;
  const headerBottom = HDR_Y + HDR_H + 20;

  ctx.font = `bold ${hlFs}px Noto Serif Bengali, Noto Sans Bengali`;

  // Word-wrap then hard-cap at 3 lines
  let hlLines = [];
  const hlWords = d.hl.split('\n');
  for (const para of hlWords) {
    const ws = para.split(' '); let ln = '';
    for (const w of ws) {
      const t = ln ? ln + ' ' + w : w;
      if (ctx.measureText(t).width > hlMaxW && ln) { hlLines.push(ln.trim()); ln = w; }
      else ln = t;
    }
    if (ln) hlLines.push(ln.trim());
  }
  if (hlLines.length > MAX_HL_LINES) {
    hlLines = hlLines.slice(0, MAX_HL_LINES);
    // trim last line and add ellipsis if needed
    let last = hlLines[MAX_HL_LINES - 1];
    while (ctx.measureText(last + '...').width > hlMaxW && last.length > 0) {
      last = last.slice(0, -1).trimEnd();
    }
    hlLines[MAX_HL_LINES - 1] = last + '...';
  }
  const numHlLines = hlLines.length;
  const totalHlH = numHlLines * hlLH;

  // Anchor headline near the top (just below header), not center
  const hlStartY = headerBottom + 60 + hlFs;

  ctx.fillStyle = '#1a237e';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  nosh(ctx);

  hlLines.forEach((line, i) => {
    ctx.fillText(line, TW / 2, hlStartY + i * hlLH);
  });

  const lastLineY = hlStartY + (numHlLines - 1) * hlLH;
  let currentY = lastLineY + 70;

  if (d.sp) {
    ctx.fillStyle = RED;
    ctx.font = 'bold 36px Noto Sans Bengali';
    ctx.fillText('— ' + d.sp, TW / 2, currentY);
    currentY += 45;
  }
  if (d.des) {
    ctx.fillStyle = '#666666';
    ctx.font = '30px Noto Sans Bengali';
    ctx.fillText(d.des, TW / 2, currentY);
  }

  /* ═══════════════════════════════════════
     4. MAIN IMAGE — bottom 55% (adjust if extra fields)
  ═══════════════════════════════════════ */
  const imgTop = (d.sp || d.des) ? Math.round(TH * 0.47) : Math.round(TH * 0.45);
  const imgH = TH - imgTop;

  // Top separator line
  ctx.save();
  ctx.strokeStyle = '#3f4041ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, imgTop); ctx.lineTo(TW, imgTop);
  ctx.stroke();
  ctx.restore();

  if (img1) {
    cov(ctx, img1, 0, imgTop, TW, imgH, 1, img1Scale, img1OffX, img1OffY);
  } else {
    // Placeholder when no image is loaded
    ctx.save();
    const phGrad = ctx.createLinearGradient(0, imgTop, 0, TH);
    phGrad.addColorStop(0, '#cfd8dc');
    phGrad.addColorStop(1, '#cfd8dc');
    ctx.fillStyle = phGrad;
    ctx.fillRect(0, imgTop, TW, imgH);
    ctx.fillStyle = 'rgba(35, 39, 43, 0.15)';
    ctx.font = 'bold 40px Noto Sans Bengali, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('ছবি আপলোড করুন', TW / 2, imgTop + imgH / 2);
    ctx.restore();
  }

  /* ═══════════════════════════════════════
     5. CENTER AD LOGO (Replaces old Details Button)
  ═══════════════════════════════════════ */
  if (adLogoImg && adLogoImg.width) {
    const alH = 60; // Keep it modest
    const alW = (adLogoImg.width / adLogoImg.height) * alH;
    const alX = (TW - alW) / 2;
    const alY = imgTop - (alH / 2);

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    // Clip the image to a rounded pill shape to hide the white corners from the JPEG
    const br = alH / 2;
    ctx.beginPath();
    ctx.moveTo(alX + br, alY);
    ctx.lineTo(alX + alW - br, alY); ctx.arcTo(alX + alW, alY, alX + alW, alY + br, br);
    ctx.lineTo(alX + alW, alY + alH - br); ctx.arcTo(alX + alW, alY + alH, alX + alW - br, alY + alH, br);
    ctx.lineTo(alX + br, alY + alH); ctx.arcTo(alX, alY + alH, alX, alY + alH - br, br);
    ctx.lineTo(alX, alY + br); ctx.arcTo(alX, alY, alX + br, alY, br);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(adLogoImg, alX, alY, alW, alH);
    ctx.restore();
  }

  /* ═══════════════════════════════════════
     6. IMAGE CREDIT BADGE (Bottom Right of Image)
  ═══════════════════════════════════════ */
  if (d.showCreditBtn) {
    const crLabel = 'ছবি সংগৃহীত';
    const crFs = 24;
    const crPadX = 20;
    const crPadY = 12;
    ctx.font = `${crFs}px Noto Sans Bengali, Arial`;
    const crW = ctx.measureText(crLabel).width + crPadX * 2;
    const crH = crFs + crPadY * 2;
    const crBR = 8;
    const crX = TW - MARGIN - crW;
    const crY = TH - 40 - crH;

    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;

    ctx.beginPath();
    ctx.moveTo(crX + crBR, crY);
    ctx.lineTo(crX + crW - crBR, crY); ctx.arcTo(crX + crW, crY, crX + crW, crY + crBR, crBR);
    ctx.lineTo(crX + crW, crY + crH - crBR); ctx.arcTo(crX + crW, crY + crH, crX + crW - crBR, crY + crH, crBR);
    ctx.lineTo(crX + crBR, crY + crH); ctx.arcTo(crX, crY + crH, crX, crY + crH - crBR, crBR);
    ctx.lineTo(crX, crY + crBR); ctx.arcTo(crX, crY, crX + crBR, crY, crBR);
    ctx.closePath();

    ctx.fillStyle = '#ffffff';
    ctx.fill();

    ctx.strokeStyle = RED;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#333333';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(crLabel, crX + crW / 2, crY + crH / 2);
    ctx.restore();
  }
  drawAd(ctx, TW);
}

/* ── dispatch ── */
const FNS = [T1, T2, T3, T4];
const TNAMES = ['নগর সমাচার আর্টিকেল', 'নগর সমাচার স্টাইল', 'নগর সমাচার + বক্তা/পদবি', 'পোর্ট্রেট নিউজ কার্ড'];
function drawT(ctx, idx) { ctx.clearRect(0, 0, W, H); FNS[idx](ctx, inp()); }
function rf() {
  // T4 is a portrait card (1245 x 1536); all others are 1080 x 1080
  const isT4 = curT === 3;
  const baseW = isT4 ? 1245 : 1080;
  const baseH = isT4 ? 1536 : 1080;
  H = baseH + (showAd ? AD_H : 0);
  const cvs = document.getElementById('mainCanvas');
  if (cvs.width !== baseW) cvs.width = baseW;
  if (cvs.height !== H) cvs.height = H;
  drawT(cvs.getContext('2d'), curT);
  document.getElementById('ctname').textContent = `টেমপ্লেট ${curT + 1} — ${TNAMES[curT]}`;
}

function rth() {
  const g = $('tgrid'); g.innerHTML = '';

  FNS.forEach((_, i) => {
    const isPortrait = i === 3;
    const szW = isPortrait ? 1245 : 1080;
    const szH = isPortrait ? (1536 + (showAd ? AD_H : 0)) : (showAd ? 1080 + AD_H : 1080);

    const div = document.createElement('div'); div.className = 'tc' + (i === curT ? ' on' : '');
    const tc = document.createElement('canvas');
    tc.width = 300;
    tc.height = Math.round(300 * (szH / szW));

    const num = document.createElement('div'); num.className = 'tnum'; num.textContent = i + 1;
    const nm = document.createElement('div'); nm.className = 'tcn'; nm.textContent = TNAMES[i];
    div.append(tc, num, nm);

    div.onclick = () => {
      document.querySelectorAll('.tc').forEach(x => x.classList.remove('on'));
      div.classList.add('on');
      curT = i;
      const hlInput = $('headline');
      if (curT === 1 && (!hlInput.value || hlInput.value.trim() === 'শিরোনাম')) {
        hlInput.value = 'দেশের সর্বশেষ গুরুত্বপূর্ণ সংবাদ শিরোনাম এখানে লিখুন';
      }
      rf();
    };

    g.append(div);
    const c2 = tc.getContext('2d');
    c2.save();
    c2.scale(tc.width / szW, tc.height / szH);
    const prevH = H;
    H = szH;
    drawT(c2, i);
    H = prevH;
    c2.restore();
  });
}

// পেজ লোড হওয়ার সাথে সাথে বিজ্ঞাপন বাটনটি ডিফল্টভাবে অফ রাখা
showAd = false;
if (document.getElementById('adTog')) {
  document.getElementById('adTog').classList.remove('on');
}
if (document.getElementById('adLbl')) {
  document.getElementById('adLbl').textContent = 'বিজ্ঞাপন লুকানো';
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

function resetForm() {
  if (confirm('আপনি কি সব ডাটা মুছে নতুন করে শুরু করতে চান?')) {
    localStorage.removeItem('newsCardData');
    location.reload();
  }
}

/* ── Auto-save & Auto-select Logic ── */
function getBengaliDate() {
  const months = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
  const bngNums = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  const toBng = (str) => str.toString().split('').map(c => /[0-9]/.test(c) ? bngNums[c] : c).join('');

  const d = new Date();
  return `${toBng(d.getDate())} ${months[d.getMonth()]} ${toBng(d.getFullYear())}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('input, textarea');

  // Set default date
  const dateInput = $('catdate');
  if (dateInput && !dateInput.value.trim() || dateInput.value === '২ মার্চ ২০২৬') {
    dateInput.value = getBengaliDate();
  }

  // Load saved data
  const savedData = localStorage.getItem('newsCardData');
  if (savedData) {
    try {
      const data = JSON.parse(savedData);
      inputs.forEach(input => {
        if (input.type === 'file') return;
        if (input.id && data[input.id] !== undefined) {
          if (input.type === 'checkbox' || input.type === 'radio') {
            input.checked = data[input.id];
          } else {
            input.value = data[input.id];
          }
        }
      });
      // Delay rendering slightly to ensure fonts/images are ready
      setTimeout(() => {
        if (typeof rf === 'function') rf();
        if (typeof rth === 'function') rth();
      }, 100);
    } catch (e) {
      console.error("Failed to parse saved data");
    }
  }

  // Save data on input and auto-select on focus
  inputs.forEach(input => {
    // Auto-select text on focus
    input.addEventListener('focus', function () {
      this.select();
    });

    // Auto-save on change
    input.addEventListener('input', () => {
      const currentData = {};
      inputs.forEach(inp => {
        if (inp.type === 'file') return;
        if (inp.id) {
          if (inp.type === 'checkbox' || inp.type === 'radio') {
            currentData[inp.id] = inp.checked;
          } else {
            currentData[inp.id] = inp.value;
          }
        }
      });
      localStorage.setItem('newsCardData', JSON.stringify(currentData));
    });
  });
});
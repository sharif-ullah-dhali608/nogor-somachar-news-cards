/* নগর সমাচার ২৪ — cards.js — 5 exact reference templates */
const W = 1080, H = 1080;
const COLORS = ['#c0392b', '#e74c3c', '#b71c1c', '#e67e22', '#f39c12', '#43a047', '#1565c0', '#8e44ad', '#000', '#1a1a1a', '#fff'];
let img1 = null, img2 = null, adImg = null, logo = null, accent = '#c0392b', curT = 0, showAd = true;
let img1Scale = 1.0, img2Scale = 1.0;
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


function inp() { return { hl: $('headline').value || 'শিরোনাম', hlFs: parseInt($('hlFs').value) || 48, hlY: parseInt($('hlY').value) || 100, body: $('bodytext').value || '', sp: $('speaker').value || '', des: $('designation').value || '', cat: $('category').value, date: $('catdate').value || '', web: $('website').value || '', accent }; }

/* ── core helpers ── */
function cov(ctx, im, x, y, w, h, al = 1, scale = 1) {
  if (!im) return; ctx.save(); ctx.globalAlpha = al; ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const s = Math.max(w / im.width, h / im.height) * scale, nw = im.width * s, nh = im.height * s;
  ctx.drawImage(im, x + (w - nw) / 2, y + (h - nh) / 2, nw, nh); ctx.restore();
}
function covT(ctx, im, x, y, w, h, al = 1, scale = 1) {/* top-anchored */
  if (!im) return; ctx.save(); ctx.globalAlpha = al; ctx.beginPath(); ctx.rect(x, y, w, h); ctx.clip();
  const s = Math.max(w / im.width, h / im.height) * scale, nw = im.width * s, nh = im.height * s;
  ctx.drawImage(im, x + (w - nw) / 2, y, nw, nh); ctx.restore();
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
  if (adImg) { cov(ctx, adImg, 0, y, W, AD_H); }
  else {
    ctx.fillStyle = '#f5c842'; ctx.fillRect(0, y, W, AD_H);
    ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.font = 'bold 22px Noto Sans Bengali'; ctx.textAlign = 'center';
    ctx.fillText('বিজ্ঞাপন এলাকা — Ad Image আপলোড করুন', W / 2, y + AD_H / 2 + 8); ctx.textAlign = 'left';
  }
}

/* ══════════════════════════════════════════════════════
   T1 — ARTICLE STYLE
   photo top, white card, CENTERED logo in circle, centered headline
══════════════════════════════════════════════════════ */
function T1(ctx, d) {
  const ah = adH();
  const PHOTO_Y = 0;
  const PHOTO_H = 520;
  const CARD_Y = 480;
  const CARD_H = H - ah - CARD_Y;

  /* photo — top-anchored */
  covT(ctx, img1, 0, PHOTO_Y, W, PHOTO_H + 40, 1, img1Scale);

  /* elegant curved date tab hanging from top right */
  if (d.date) {
    ctx.font = `bold 24px Noto Sans Bengali`;
    const tw = ctx.measureText(d.date).width;
    const tabH = 50, curveW = 35;
    const endX = W - 30;
    const flatRight = endX - curveW;
    const flatW = tw + 40;
    const flatLeft = flatRight - flatW;
    const startX = flatLeft - curveW;

    ctx.fillStyle = '#8b1a1a';
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.bezierCurveTo(flatLeft, 0, flatLeft, tabH, flatLeft + curveW, tabH);
    ctx.lineTo(flatRight - curveW, tabH);
    ctx.bezierCurveTo(flatRight, tabH, flatRight, 0, endX, 0);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText(d.date, flatLeft + flatW / 2, tabH / 2 + 2);
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
  }

  /* elegant curved logo tab hanging from top left */
  if (logo2) {
    const l2h = 36;
    const l2w = Math.round(logo2.width / logo2.height * l2h) || 120;
    const tabH = 50, curveW = 35;
    const startX = 30;
    const flatLeft = startX + curveW;
    const flatW = l2w + 40;
    const flatRight = flatLeft + flatW;
    const endX = flatRight + curveW;

    // Use white background to mirror the right tab
    ctx.fillStyle = '#8b1a1a';
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.bezierCurveTo(flatLeft, 0, flatLeft, tabH, flatLeft + curveW, tabH);
    ctx.lineTo(flatRight - curveW, tabH);
    ctx.bezierCurveTo(flatRight, tabH, flatRight, 0, endX, 0);
    ctx.closePath();
    ctx.fill();

    // Add strong shadow and draw twice so the white text in the logo is very clear!
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,1)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    const l2x = flatLeft + flatW / 2 - l2w / 2;
    const l2y = tabH / 2 - l2h / 2 + 2;
    ctx.drawImage(logo2, l2x, l2y, l2w, l2h);
    ctx.drawImage(logo2, l2x, l2y, l2w, l2h); // Draw again for a bolder shadow
    ctx.restore();
  }

  /* white fade */
  linG(ctx, 0, CARD_Y - 80, W, 100, [[0, 'rgba(240,236,232,0)'], [1, 'rgba(240,236,232,1)']]);

  /* white card */
  ctx.fillStyle = '#323232';
  roundedRect(ctx, 0, CARD_Y, W, CARD_H, 0);

  /* subtle dot texture */
  ctx.save(); ctx.globalAlpha = .04;
  for (let dy = CARD_Y; dy < H - ah; dy += 18) for (let dx = 0; dx < W; dx += 18) {
    ctx.beginPath(); ctx.arc(dx, dy, 2, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill();
  } ctx.restore();

  /* ── World map watermark (greyscale, lower position) ── */
  ctx.save();
  ctx.filter = 'grayscale(100%)';
  ctx.globalAlpha = 0.18;
  ctx.font = 'bold 480px serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('🌐', W + 80, CARD_Y + CARD_H * 0.65);
  ctx.filter = 'none';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.restore();

  /* ── LOGO: centered on boundary line, no circle/arc bg ── */
  const lmw = 260, lh = logo ? Math.round(logo.height / logo.width * lmw) : 50;
  const lcy = CARD_Y;
  drawLogo(ctx, W / 2 - lmw / 2, lcy + lh / 2 - 6, lmw, 'left', 1);

  /* headline — CENTER aligned, below logo */
  const bfs = d.hlFs, blh = bfs * 1.4, bmw = W - 80;
  let curY = lcy + lh / 2 + d.hlY;
  ctx.fillStyle = '#fff'; ctx.font = `bold ${bfs}px Noto Serif Bengali`; nosh(ctx);
  ctx.textAlign = 'center';
  const lines = wrapC(ctx, d.hl, W / 2, curY, bmw, blh);

  // Body text on next line, smaller
  let bodyLines = 0;
  curY += lines * blh;
  if (d.body) {
    const bodyFs = 32, bodyLh = bodyFs * 1.5;
    curY += 20; // gap
    ctx.font = `normal ${bodyFs}px Noto Sans Bengali`;
    bodyLines = wrapC(ctx, d.body, W / 2, curY, bmw, bodyLh);
    curY += bodyLines * bodyLh;
  }

  /* ── "বিস্তারিত কমেন্টে" pill button ── */
  {
    const pillTxt = 'বিস্তারিত কমেন্টে';
    ctx.font = 'bold 26px Noto Sans Bengali';
    const pillTw = ctx.measureText(pillTxt).width;
    const pillW = pillTw + 56, pillH = 56, pillR = 28;
    const pillX = W / 2 - pillW / 2;
    const pillY2 = curY + 36;
    ctx.save();
    ctx.strokeStyle = '#c0392b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(pillX + pillR, pillY2);
    ctx.lineTo(pillX + pillW - pillR, pillY2);
    ctx.arc(pillX + pillW - pillR, pillY2 + pillR, pillR, -Math.PI / 2, Math.PI / 2);
    ctx.lineTo(pillX + pillR, pillY2 + pillH);
    ctx.arc(pillX + pillR, pillY2 + pillR, pillR, Math.PI / 2, 3 * Math.PI / 2);
    ctx.closePath();
    ctx.fillStyle = 'rgba(192,57,43,0.10)';
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#8b1a1a';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pillTxt, W / 2, pillY2 + pillH / 2);
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  }

  /* speaker attribution — bottom right */
  const attrY = curY + 40;
  if (d.sp) {
    ctx.textAlign = 'right';
    if (d.des || d.cat) {
      ctx.font = 'italic 20px Noto Sans Bengali'; ctx.fillStyle = '#777';
      ctx.fillText((d.des || d.cat) + '...', W - 28, attrY);
    }
    ctx.font = `bold 32px Noto Serif Bengali`; ctx.fillStyle = d.accent;
    ctx.fillText(d.sp, W - 28, attrY + (d.des || d.cat ? 36 : 0));
    ctx.textAlign = 'center';
  }

  /* ══════════════════════════════════════
     RED FOOTER BAR — logo + social icons
  ══════════════════════════════════════ */
  const FOOTER_H = 100;
  const FY = H - ah - FOOTER_H;

  // Dark red bar
  ctx.fillStyle = '#8b1a1a';
  ctx.fillRect(0, FY, W, FOOTER_H);

  // Logo (logo2 preferred, fallback to logo)
  const ftLogo = logo2 || logo;
  if (ftLogo) {
    const lH = 62, lW = Math.round(ftLogo.width / ftLogo.height * lH);
    ctx.save();
    ctx.shadowBlur = 5; ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.drawImage(ftLogo, 28, FY + (FOOTER_H - lH) / 2, lW, lH);
    ctx.restore();
  }

  // Social icons
  const socIcons = ['f', '▶', '', '♪', '✈', '🌐'];
  const socLabels = ['f', '▶', '⬤', '♫', '➤', '⊕'];
  const socColors = ['#1877f2', '#ff0000', '#222', '#111', '#229ed9', '#333'];
  const iSz = 46, iGap = 14;
  const totalSocW = socIcons.length * (iSz + iGap) - iGap;
  let ix = W - totalSocW - 30;
  const iy = FY + FOOTER_H / 2;

  // Draw custom icons as colored circles with letters
  const icoDefs = [
    { bg: '#1877f2', label: 'f', fs: 28, font: 'bold 28px Arial' },
    { bg: '#ff0000', label: '▶', fs: 20, font: 'bold 20px Arial' },
    { bg: '#c13584', label: '📷', fs: 20, font: '20px serif' },
    { bg: '#111', label: '♪', fs: 22, font: 'bold 22px Arial' },
    { bg: '#229ed9', label: '✈', fs: 20, font: 'bold 20px Arial' },
    { bg: '#333', label: '🌐', fs: 18, font: '18px serif' },
  ];
  icoDefs.forEach(ic => {
    ctx.save();
    // Circle
    ctx.fillStyle = ic.bg;
    ctx.beginPath();
    ctx.arc(ix + iSz / 2, iy, iSz / 2, 0, Math.PI * 2);
    ctx.fill();
    // Icon letter
    ctx.fillStyle = '#fff';
    ctx.font = ic.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ic.label, ix + iSz / 2, iy);
    ctx.restore();
    ix += iSz + iGap;
  });

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  drawAd(ctx);
}
function T1b(ctx, d) {
  const ah = adH();
  const PHOTO_Y = 0;
  const PHOTO_H = 520;
  const CARD_Y = 480;
  const CARD_H = H - ah - CARD_Y;

  /* photo — top-anchored */
  covT(ctx, img1, 0, PHOTO_Y, W, PHOTO_H + 40, 1, img1Scale);

  /* elegant curved date tab hanging from top right */
  if (d.date) {
    ctx.font = `bold 24px Noto Sans Bengali`;
    const tw = ctx.measureText(d.date).width;
    const tabH = 50, curveW = 35;
    const endX = W - 30;
    const flatRight = endX - curveW;
    const flatW = tw + 40;
    const flatLeft = flatRight - flatW;
    const startX = flatLeft - curveW;

    ctx.fillStyle = '#8b1a1a';
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.bezierCurveTo(flatLeft, 0, flatLeft, tabH, flatLeft + curveW, tabH);
    ctx.lineTo(flatRight - curveW, tabH);
    ctx.bezierCurveTo(flatRight, tabH, flatRight, 0, endX, 0);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText(d.date, flatLeft + flatW / 2, tabH / 2 + 2);
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
  }

  /* elegant curved logo tab hanging from top left */
  if (logo2) {
    const l2h = 36;
    const l2w = Math.round(logo2.width / logo2.height * l2h) || 120;
    const tabH = 50, curveW = 35;
    const startX = 30;
    const flatLeft = startX + curveW;
    const flatW = l2w + 40;
    const flatRight = flatLeft + flatW;
    const endX = flatRight + curveW;

    // Use white background to mirror the right tab
    ctx.fillStyle = '#8b1a1a';
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.bezierCurveTo(flatLeft, 0, flatLeft, tabH, flatLeft + curveW, tabH);
    ctx.lineTo(flatRight - curveW, tabH);
    ctx.bezierCurveTo(flatRight, tabH, flatRight, 0, endX, 0);
    ctx.closePath();
    ctx.fill();

    // Add strong shadow and draw twice so the white text in the logo is very clear!
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,1)';
    ctx.shadowBlur = 6;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    const l2x = flatLeft + flatW / 2 - l2w / 2;
    const l2y = tabH / 2 - l2h / 2 + 2;
    ctx.drawImage(logo2, l2x, l2y, l2w, l2h);
    ctx.drawImage(logo2, l2x, l2y, l2w, l2h); // Draw again for a bolder shadow
    ctx.restore();
  }

  /* white fade */
  linG(ctx, 0, CARD_Y - 80, W, 100, [[0, 'rgba(240,236,232,0)'], [1, 'rgba(240,236,232,1)']]);

  /* white card */
  ctx.fillStyle = '#323232';
  roundedRect(ctx, 0, CARD_Y, W, CARD_H, 0);

  /* subtle dot texture */
  ctx.save(); ctx.globalAlpha = .04;
  for (let dy = CARD_Y; dy < H - ah; dy += 18) for (let dx = 0; dx < W; dx += 18) {
    ctx.beginPath(); ctx.arc(dx, dy, 2, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill();
  } ctx.restore();

  /* ── World map watermark (greyscale, lower position) ── */
  ctx.save();
  ctx.filter = 'grayscale(20%)';
  ctx.globalAlpha = 0.18;
  ctx.font = 'bold 480px serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';
  ctx.fillText('', W + 80, CARD_Y + CARD_H * 0.65);
  ctx.filter = 'none';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.restore();

  /* headline — CENTER aligned */
  const bfs = d.hlFs, blh = bfs * 1.4, bmw = W - 80;
  let curY = CARD_Y + d.hlY;
  ctx.fillStyle = '#fff'; ctx.font = `bold ${bfs}px Noto Serif Bengali`; nosh(ctx);
  ctx.textAlign = 'center';
  const lines = wrapC(ctx, d.hl, W / 2, curY, bmw, blh);

  // Body text on next line, smaller
  let bodyLines = 0;
  curY += lines * blh;
  if (d.body) {
    const bodyFs = 32, bodyLh = bodyFs * 1.5;
    curY += 20; // gap
    ctx.font = `normal ${bodyFs}px Noto Sans Bengali`;
    bodyLines = wrapC(ctx, d.body, W / 2, curY, bmw, bodyLh);
    curY += bodyLines * bodyLh;
  }

  /* ── "বিস্তারিত কমেন্টে" shape (attached to footer) ── */
  {
    const FOOTER_H_INT = 90;
    const FY_INT = H - ah - FOOTER_H_INT;
    const pillTxt = 'বিস্তারিত কমেন্টে';
    ctx.font = 'bold 24px Noto Sans Bengali';
    const pillTw = ctx.measureText(pillTxt).width;
    const pillW = pillTw + 80, pillH = 70;
    const pillX = W / 2 - pillW / 2;
    const pillY2 = FY_INT - pillH;

    ctx.save();
    ctx.fillStyle = '#8b1a1a';
    ctx.beginPath();
    // Start at bottom left (fush with footer)
    ctx.moveTo(pillX, FY_INT);
    // Line up to side
    ctx.lineTo(pillX, FY_INT - pillH * 0.5);
    // Pointed top middle
    ctx.lineTo(W / 2, pillY2);
    // Line down to right side
    ctx.lineTo(pillX + pillW, FY_INT - pillH * 0.5);
    // Line down to bottom right
    ctx.lineTo(pillX + pillW, FY_INT);
    ctx.closePath();
    ctx.fill();

    // Text centered inside the shape - moved slightly lower
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(pillTxt, W / 2, FY_INT - pillH * 0.28);
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  }

  /* speaker attribution — bottom right */
  const attrY = curY + 40;
  if (d.sp) {
    ctx.textAlign = 'right';
    if (d.des || d.cat) {
      ctx.font = 'italic 20px Noto Sans Bengali'; ctx.fillStyle = '#777';
      ctx.fillText((d.des || d.cat) + '...', W - 28, attrY);
    }
    ctx.font = `bold 32px Noto Serif Bengali`; ctx.fillStyle = d.accent;
    ctx.fillText(d.sp, W - 28, attrY + (d.des || d.cat ? 36 : 0));
    ctx.textAlign = 'center';
  }

  /* ══════════════════════════════════════
     RED FOOTER BAR — logo + social icons
  ══════════════════════════════════════ */
  const FOOTER_H = 100;
  const FY = H - ah - FOOTER_H;

  // Dark red bar
  ctx.fillStyle = '#8b1a1a';
  ctx.fillRect(0, FY, W, FOOTER_H);

  // Logo (logo2 preferred, fallback to logo)
  const ftLogo = logo2 || logo;
  const iSz = 42, iGap = 10;
  const icoDefs = [
    { bg: '#1877f2', label: 'f', font: 'bold 26px Arial' },
    { bg: '#ff0000', label: '▶', font: 'bold 18px Arial' },
    { bg: '#c13584', label: '📷', font: '18px serif' },
    { bg: '#111', label: '♪', font: 'bold 20px Arial' },
    { bg: '#229ed9', label: '✈', font: 'bold 18px Arial' },
    { bg: '#333', label: '🌐', font: '16px serif' },
  ];
  const totalIconsW = icoDefs.length * (iSz + iGap) - iGap;

  // Measure logo width
  let lH = 0, lW = 0;
  if (ftLogo) { lH = 58; lW = Math.round(ftLogo.width / ftLogo.height * lH); }

  const logoIconGap = 24; // gap between logo and icon group
  const totalBlockW = lW + (lW ? logoIconGap : 0) + totalIconsW;
  const blockStartX = W / 2 - totalBlockW / 2;
  const iy = FY + FOOTER_H / 2;

  // Draw logo
  if (ftLogo) {
    ctx.save();
    ctx.shadowBlur = 4; ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.drawImage(ftLogo, blockStartX, FY + (FOOTER_H - lH) / 2, lW, lH);
    ctx.restore();
  }

  // Draw social icon circles
  let ix = blockStartX + (lW ? lW + logoIconGap : 0);
  icoDefs.forEach(ic => {
    ctx.save();
    ctx.fillStyle = ic.bg;
    ctx.beginPath();
    ctx.arc(ix + iSz / 2, iy, iSz / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = ic.font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(ic.label, ix + iSz / 2, iy);
    ctx.restore();
    ix += iSz + iGap;
  });

  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  drawAd(ctx);
}

/* ══════════════════════════════════════════════════════
   T2 — QUOTE SPLIT CARD (reference: left photo + right red quote panel)
   LEFT: portrait photo full height + faint watermark
   RIGHT: dark red bg, logo top, yellow ❝❝, white rounded quote box,
          attribution (yellow em-dash + name), designation, website
══════════════════════════════════════════════════════ */
function T2(ctx, d) {
  const ah = adH();
  const mainH = H - ah;
  const SPLIT = Math.round(W * .48); // left photo width ~48%

  /* ── LEFT: portrait photo full height ── */
  cov(ctx, img1, 0, 0, SPLIT, mainH, 1, img1Scale);

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
   T3 — BORDER FRAME
   thick red border around photo, white panel below, date pill + logo
══════════════════════════════════════════════════════ */
// function T3(ctx, d) {
//   const ah = adH();
//   const mainH = H - ah;
//   const splitY = Math.round(mainH * 0.56);

//   /* ── 1. Photo Top ── */
//   ctx.fillStyle = '#111'; ctx.fillRect(0, 0, W, H);
//   covT(ctx, img1, 0, 0, W, splitY + 40);

//   /* ── 2. Torn paper divider ── */
//   function jaggedEdge(ctx, startY, color, amp, freq, phase) {
//     ctx.beginPath();
//     ctx.moveTo(0, startY);
//     for (let x = 0; x <= W; x += freq) {
//       const y = startY + Math.sin(x * 0.05 + phase) * amp + Math.sin(x * 0.12) * (amp * 0.5);
//       ctx.lineTo(x, y);
//     }
//     ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
//     ctx.fillStyle = color;
//     ctx.fill();
//   }

//   // White torn edge
//   jaggedEdge(ctx, splitY, '#fff', 8, 15, 0);
//   // Red torn edge slightly lower
//   jaggedEdge(ctx, splitY + 12, '#9e0000', 8, 15, 0); // Very dark rich red

//   /* ── 3. Logo Top Left (T1 style curved tab) ── */
//   const lmw = 230;
//   const lh3 = logo ? Math.round(logo.height / logo.width * lmw) : 36;
//   const tabH = lh3 + 30;
//   const curveW = 35;
//   const startX = 20;
//   const flatLeft = startX + curveW;
//   const flatW = lmw + 30;
//   const flatRight = flatLeft + flatW;
//   const endX = flatRight + curveW;

//   ctx.fillStyle = '#ffffff';
//   ctx.beginPath();
//   ctx.moveTo(startX, 0);
//   ctx.bezierCurveTo(flatLeft, 0, flatLeft, tabH, flatLeft + curveW, tabH);
//   ctx.lineTo(flatRight - curveW, tabH);
//   ctx.bezierCurveTo(flatRight, tabH, flatRight, 0, endX, 0);
//   ctx.closePath();
//   ctx.fill();

//   if (logo) {
//     drawLogo(ctx, flatLeft + 15, tabH - 12, lmw, 'left', 1);
//   } else {
//     // Draw text logo with light=false so the text is dark and visible on the white tab
//     drawTextLogo(ctx, flatLeft + 25, tabH - 16, 1.2, false);
//   }

//   /* ── 4. Typography (Centered Yellow & White) ── */
//   ctx.textAlign = 'center';
//   nosh(ctx);
//   const textsY = splitY + 90;

//   // Yellow sub-heading (using d.body or fallback)
//   ctx.fillStyle = '#ffcc00';
//   ctx.font = 'bold 46px Noto Sans Bengali';
//   const linesYText = wrapC(ctx, d.body, W / 2, textsY, W - 80, 64);

//   // White Headline
//   const wTextY = textsY + linesYText * 64 + 10;
//   ctx.fillStyle = '#fff';
//   ctx.font = 'bold 56px Noto Serif Bengali';
//   ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 8;
//   wrapC(ctx, d.hl, W / 2, wTextY, W - 60, 78);
//   ctx.shadowBlur = 0;

//   /* ── 5. Bottom Pill Button ── */
//   const btnMsg = d.sp || 'বিস্তারিত কমেন্টে';
//   ctx.font = 'bold 36px Noto Sans Bengali';
//   const pw = ctx.measureText(btnMsg).width + 80;
//   const ph = 64;
//   const px = (W - pw) / 2;
//   const pillY = mainH - 120;

//   ctx.fillStyle = '#d30000'; // brighter red for pill
//   ctx.beginPath();
//   // Provide rounded rectangle fallback manually if roundRect is not available in context, though Chrome supports it.
//   if (ctx.roundRect) {
//     ctx.roundRect(px, pillY, pw, ph, ph / 2);
//   } else {
//     ctx.rect(px, pillY, pw, ph);
//   }
//   ctx.fill();

//   ctx.fillStyle = '#fff';
//   ctx.textBaseline = 'middle';
//   ctx.fillText(btnMsg, W / 2, pillY + ph / 2);
//   ctx.textBaseline = 'alphabetic';
//   ctx.textAlign = 'left';

//   /* ── 6. Website footer ── */
//   if (d.web) {
//     ctx.font = '18px Noto Sans Bengali'; ctx.fillStyle = '#ffaa00';
//     ctx.textAlign = 'center'; ctx.fillText(d.web, W / 2, mainH - 20); ctx.textAlign = 'left';
//   }
//   drawAd(ctx);
// }

/* ══════════════════════════════════════════════════════
   T4 — BANGLADESH TIMES STYLE (Reference Image)
   Left curved photo, Red-Dark gradient bg, White text, Pill button
══════════════════════════════════════════════════════ */
function T4(ctx, d) {
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
    cov(ctx, img1, 0, 0, W * 0.65, mainH, 1, img1Scale);
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
  const textX = W * 0.52; // Start after the curve
  const textW = W - textX - 50;
  ctx.textAlign = 'left';
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 58px Noto Serif Bengali';
  const hLines = wrap(ctx, d.hl, textX, 220, textW, 85);

  // 5. Speaker Name (Yellow with Underline)
  const speakerY = 220 + (hLines * 85) + 60;
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

  // 6. Pill Button (বিস্তারিত কমেন্টে)
  const pillW = 240, pillH = 60, pillR = 30;
  const pillX = W * 0.55, pillY = mainH - 120;

  ctx.fillStyle = '#fff';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(pillX, pillY, pillW, pillH, pillR);
  } else {
    ctx.rect(pillX, pillY, pillW, pillH); // Fallback
  }
  ctx.fill();

  ctx.fillStyle = '#a50000';
  ctx.font = 'bold 26px Noto Sans Bengali';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('বিস্তারিত কমেন্টে', pillX + pillW / 2, pillY + pillH / 2);
  ctx.textBaseline = 'alphabetic';

  // 7. Footer Ad Area
  drawAd(ctx);
}

/* ══════════════════════════════════════════════════════
   T5 — BANGLADESH TIMES QUOTE CARD v2 (Reference Image)
   Red-purple gradient, yellow ❝, white Bengali quote,
   yellow speaker name, grey pill designation,
   diagonal white stripe + right-side photo, logo bottom-left
══════════════════════════════════════════════════════ */
function T5(ctx, d) {
  const ah = adH();
  const mainH = H - ah;

  /* ── 1. Red-Purple Gradient Background ── */
  const bg = ctx.createLinearGradient(0, 0, 0, mainH);
  bg.addColorStop(0, '#6b0057'); // Dark purple-red top
  bg.addColorStop(0.4, '#9e0000'); // Rich red mid
  bg.addColorStop(1, '#c0392b'); // Bright red bottom
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, mainH);

  /* ── 2. Faint "BANGLADESH TIMES" watermark diagonal ── */
  ctx.save();
  ctx.globalAlpha = 0.06;
  ctx.font = 'bold 80px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.translate(W * 0.55, mainH * 0.65);
  ctx.rotate(-Math.PI / 6);
  ctx.fillText('www.nagorsomachar24.com', 0, 0);
  ctx.restore();

  /* ── 3. Diagonal White + Red Decorative Stripe (bottom area) ── */
  // White stripe (wider, bottom-right)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(W * 0.2, mainH);         // bottom-left of stripe
  ctx.lineTo(W * 0.42, mainH * 0.52); // top-left of stripe
  ctx.lineTo(W, mainH * 0.52);        // top-right
  ctx.lineTo(W, mainH);               // bottom-right
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.restore();

  // Thin red stripe on top of white stripe
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(W * 0.2, mainH);
  ctx.lineTo(W * 0.42, mainH * 0.52);
  ctx.lineTo(W * 0.47, mainH * 0.52);
  ctx.lineTo(W * 0.25, mainH);
  ctx.closePath();
  ctx.fillStyle = '#c0392b';
  ctx.fill();
  ctx.restore();

  /* ── 4. Photo (right side, over the stripe) ── */
  if (img1) {
    const photoX = W * 0.38;
    const photoW = W - photoX;
    const photoY = mainH * 0.44;
    const photoH = mainH - photoY;
    // Clip to bottom-right area
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(photoX, photoY);
    ctx.lineTo(W, photoY);
    ctx.lineTo(W, mainH);
    ctx.lineTo(W * 0.2, mainH);
    ctx.closePath();
    ctx.clip();
    cov(ctx, img1, photoX - 40, photoY, photoW + 40, photoH, 1, img1Scale);
    ctx.restore();
  }

  /* ── 5. Opening Quote Mark (top-left, large yellow) ── */
  ctx.font = 'bold 220px Georgia, serif';
  ctx.fillStyle = '#ffdd00';
  ctx.textBaseline = 'top';
  ctx.textAlign = 'left';
  ctx.fillText('\u201c', 40, 30);
  ctx.textBaseline = 'alphabetic';

  /* ── 6. Main Quote Text (white, bold, large Bengali) ── */
  nosh(ctx);
  const qfs = 56, qlh = qfs * 1.5;
  const qX = 55, qTextW = W - 110;
  ctx.font = `bold ${qfs}px Noto Serif Bengali`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';

  const qWords = d.hl.split(' ');
  let qLn = '', qLines = [];
  for (const w of qWords) {
    const t = qLn ? qLn + ' ' + w : w;
    if (ctx.measureText(t).width > qTextW && qLn) { qLines.push(qLn); qLn = w; }
    else qLn = t;
  }
  qLines.push(qLn);

  const qStartY = 240;
  qLines.forEach((line, i) => ctx.fillText(line, qX, qStartY + i * qlh));
  const qEndY = qStartY + qLines.length * qlh;

  /* ── 7. Speaker Name (yellow, bold, left-aligned) ── */
  const spY = qEndY + 30;
  ctx.font = `bold 62px Noto Serif Bengali`;
  ctx.fillStyle = '#ffdd00';
  ctx.textAlign = 'left';
  ctx.fillText(d.sp || 'বক্তার নাম', qX, spY);

  /* ── 8. Designation Pill Box (grey bg, dark text) ── */
  if (d.des) {
    ctx.font = `bold 30px Noto Sans Bengali`;
    const desW = ctx.measureText(d.des).width + 40;
    const desH = 52;
    const desX = qX;
    const desY2 = spY + 18;
    const desR = 8;
    // Grey rounded box
    ctx.fillStyle = 'rgba(200,200,200,0.92)';
    ctx.beginPath();
    ctx.moveTo(desX + desR, desY2);
    ctx.lineTo(desX + desW - desR, desY2);
    ctx.arc(desX + desW - desR, desY2 + desR, desR, -Math.PI / 2, 0);
    ctx.lineTo(desX + desW, desY2 + desH - desR);
    ctx.arc(desX + desW - desR, desY2 + desH - desR, desR, 0, Math.PI / 2);
    ctx.lineTo(desX + desR, desY2 + desH);
    ctx.arc(desX + desR, desY2 + desH - desR, desR, Math.PI / 2, Math.PI);
    ctx.lineTo(desX, desY2 + desR);
    ctx.arc(desX + desR, desY2 + desR, desR, Math.PI, 3 * Math.PI / 2);
    ctx.closePath();
    ctx.fill();
    // Text inside pill
    ctx.fillStyle = '#111111';
    ctx.textAlign = 'left';
    ctx.fillText(d.des, desX + 20, desY2 + desH - 11);
  }

  /* ── 9. Logo Bottom-Left (on white stripe area) ── */
  const logoY = mainH - 90;
  const logoSrc = logo2 || logo;
  if (logoSrc) {
    const lH = 60;
    const lW = Math.round(logoSrc.width / logoSrc.height * lH);
    ctx.drawImage(logoSrc, 40, logoY - lH + 10, lW, lH);
  }

  /* ── 10. Date & Website Bottom-Right ── */
  ctx.textAlign = 'right';
  if (d.date) {
    ctx.font = 'bold 30px Noto Sans Bengali';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText(d.date, W - 40, mainH - 90);
  }
  if (d.web) {
    ctx.font = 'bold 28px Arial, Noto Sans Bengali';
    ctx.fillStyle = '#1a1a1a';
    ctx.fillText(d.web, W - 40, mainH - 50);
  }
  ctx.textAlign = 'left';

  drawAd(ctx);
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arc(x + w - r, y + r, r, -Math.PI / 2, 0);
  ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + r); ctx.arc(x + r, y + r, r, Math.PI, 3 * Math.PI / 2);
  ctx.closePath(); ctx.fill();
}

/* ── dispatch ── */
const FNS = [T1, T1b, T2, T4, T5];
const TNAMES = ['আর্টিকেল স্টাইল', 'ফুল ব্লিড রেড', 'বর্ডার ফ্রেম', 'সার্কুলার স্প্লিট', 'ডার্ক কোট'];

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

function loadImg(file, slot) {
  if (!file) return;
  const r = new FileReader();
  r.onload = e => {
    const im = new Image(); im.onload = () => {
      if (slot === 1) { img1 = im; $('ub1').classList.add('on'); $('ub1').querySelector('p').textContent = '✓ ফটো লোড'; }
      else if (slot === 2) { img2 = im; $('ub2').classList.add('on'); $('ub2').querySelector('p').textContent = '✓ ফটো ২ লোড'; }
      else { adImg = im; $('ubAd').classList.add('on'); $('ubAd').querySelector('p').textContent = '✓ বিজ্ঞাপন লোড'; }
      rf(); rth();
    }; im.src = e.target.result;
  }; r.readAsDataURL(file);
}
$('up1').addEventListener('change', e => loadImg(e.target.files[0], 1));
$('up2').addEventListener('change', e => loadImg(e.target.files[0], 2));
$('upAd').addEventListener('change', e => loadImg(e.target.files[0], 3));
['headline', 'bodytext', 'speaker', 'designation', 'catdate', 'website'].forEach(id => $(id).addEventListener('input', () => { rf(); rth(); }));
$('category').addEventListener('change', () => { rf(); rth(); });

function dl(fmt = 'png') {
  const c = $('mainCanvas'), a = document.createElement('a');
  const hl = inp().hl.substring(0, 20).replace(/\s+/g, '_');
  a.download = `nogor_somachar_t${curT + 1}_${hl}.${fmt}`;
  const mime = fmt === 'jpg' ? 'image/jpeg' : fmt === 'webp' ? 'image/webp' : 'image/png';
  a.href = c.toDataURL(mime, .96); a.click();
}

buildColors(); rth(); rf();

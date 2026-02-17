/* =============================================
   TẾT LÌ XÌ - result.js
   Fireworks · Confetti · Money Rain · Display
   ============================================= */

/* ---- Load Data from sessionStorage ---- */
function formatCurrency(n) {
  return Number(n).toLocaleString('vi-VN') + ' ₫';
}

function loadResultData() {
  const total     = parseInt(sessionStorage.getItem('lixi_total')) || 0;
  const count     = parseInt(sessionStorage.getItem('lixi_count')) || 0;
  const breakdown = JSON.parse(sessionStorage.getItem('lixi_breakdown') || '[]');

  // Animate amount display
  animateCount(document.getElementById('resultAmount'), total);

  if (count > 0) {
    document.getElementById('resultCount').textContent =
      `${count.toLocaleString('vi-VN')} tờ tiền · ${breakdown.length} mệnh giá`;
  }

  // Render breakdown
  if (breakdown.length > 0) {
    const card = document.getElementById('breakdownCard');
    let html = `<div class="breakdown-title">Chi tiết từng mệnh giá</div>`;
    breakdown.forEach((item, i) => {
      html += `
        <div class="breakdown-row" style="animation-delay:${i * 0.07}s">
          <span class="bd-label">${item.label}</span>
          <span class="bd-qty">× ${item.qty}</span>
          <span class="bd-sub">${formatCurrency(item.sub)}</span>
        </div>
      `;
    });
    card.innerHTML = html;
  }
}

/* Count-up animation */
function animateCount(el, target) {
  const duration = 2500;
  const start    = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = formatCurrency(current);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = formatCurrency(target);
  }
  requestAnimationFrame(update);
}

/* ---- Money Rain ---- */
const MONEY_EMOJIS = ['💰','💴','💵','💶','💷','🪙','🎴','🧧'];

function createMoneyRain() {
  const container = document.getElementById('moneyRain');
  const count = window.innerWidth < 600 ? 18 : 30;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'money-coin';
    el.textContent = MONEY_EMOJIS[Math.floor(Math.random() * MONEY_EMOJIS.length)];
    el.style.left       = Math.random() * 100 + 'vw';
    el.style.fontSize   = (1 + Math.random() * 1.2) + 'rem';
    el.style.animationDuration = (4 + Math.random() * 6) + 's';
    el.style.animationDelay   = (Math.random() * 8) + 's';
    container.appendChild(el);
  }
}

/* ---- Confetti ---- */
const CONFETTI_COLORS = [
  '#FFD700', '#FF4444', '#FF9900', '#FF6B9E',
  '#4CAF50', '#9C27B0', '#00BCD4', '#FF5722',
];

function createConfetti() {
  const container = document.getElementById('confettiContainer');
  const count = window.innerWidth < 600 ? 40 : 70;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left             = Math.random() * 100 + 'vw';
    el.style.background       = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    el.style.width            = (6 + Math.random() * 8) + 'px';
    el.style.height           = (10 + Math.random() * 10) + 'px';
    el.style.animationDuration = (3 + Math.random() * 5) + 's';
    el.style.animationDelay   = (Math.random() * 6) + 's';
    el.style.borderRadius     = Math.random() > 0.5 ? '50%' : '2px';
    el.style.opacity          = 0.7 + Math.random() * 0.3;
    container.appendChild(el);
  }
}

/* ---- Fireworks (Canvas) ---- */
const canvas = document.getElementById('fireworksCanvas');
const ctx    = canvas.getContext('2d');

let W, H;
function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const FIREWORK_COLORS = [
  '#FFD700','#FF4444','#FF9900','#FF6B9E',
  '#FFF3A0','#FF8C00','#FFD700','#FFFFFF',
  '#FF6347','#98FB98','#DDA0DD','#87CEEB',
];

class Particle {
  constructor(x, y, color) {
    this.x = x; this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1.5 + Math.random() * 4;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = 0.012 + Math.random() * 0.018;
    this.radius = 2 + Math.random() * 2.5;
    this.trail = [];
  }
  update() {
    this.trail.push({ x: this.x, y: this.y, a: this.alpha });
    if (this.trail.length > 6) this.trail.shift();
    this.vx *= 0.97;
    this.vy = this.vy * 0.97 + 0.06;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
  }
  draw() {
    // Trail
    this.trail.forEach((t, i) => {
      ctx.globalAlpha = t.a * (i / this.trail.length) * 0.4;
      ctx.fillStyle   = this.color;
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();
    });
    // Main
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = this.color;
    ctx.shadowBlur  = 8;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
  }
  isDead() { return this.alpha <= 0; }
}

class StarParticle {
  constructor(x, y, color) {
    this.x = x; this.y = y; this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.8 + Math.random() * 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = 0.008 + Math.random() * 0.012;
    this.size  = 6 + Math.random() * 6;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1;
  }
  update() {
    this.vx *= 0.96;
    this.vy = this.vy * 0.96 + 0.04;
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotationSpeed;
    this.alpha -= this.decay;
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle   = this.color;
    ctx.shadowBlur  = 6;
    ctx.shadowColor = this.color;
    // Draw star
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const outer = this.size;
      const inner = this.size * 0.4;
      const a1 = (i * 4 * Math.PI / 5) - Math.PI / 2;
      const a2 = (i * 4 * Math.PI / 5 + 2 * Math.PI / 5) - Math.PI / 2;
      ctx.lineTo(Math.cos(a1) * outer, Math.sin(a1) * outer);
      ctx.lineTo(Math.cos(a2) * inner, Math.sin(a2) * inner);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;
  }
  isDead() { return this.alpha <= 0; }
}

let particles = [];
let lastFirework = 0;
let fireworkInterval = 800;

function launchFirework() {
  const x = 0.15 * W + Math.random() * 0.7 * W;
  const y = 0.05 * H + Math.random() * 0.45 * H;
  const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
  const count = 60 + Math.floor(Math.random() * 40);

  // Burst
  for (let i = 0; i < count; i++) {
    particles.push(new Particle(x, y, color));
  }
  // Stars
  const starColor = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
  for (let i = 0; i < 10; i++) {
    particles.push(new StarParticle(x, y, starColor));
  }
}

function fireworkLoop(timestamp) {
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.fillRect(0, 0, W, H);

  if (timestamp - lastFirework > fireworkInterval) {
    launchFirework();
    lastFirework = timestamp;
    // Vary interval
    fireworkInterval = 600 + Math.random() * 700;
  }

  particles.forEach(p => { p.update(); p.draw(); });
  particles = particles.filter(p => !p.isDead());

  requestAnimationFrame(fireworkLoop);
}

/* ---- Navigation ---- */
function goBack() {
  document.body.style.animation = 'fadeOut 0.5s ease forwards';
  document.body.style.cssText += 'animation: fadeOut 0.4s ease forwards;';

  const style = document.createElement('style');
  style.textContent = `@keyframes fadeOut { from{opacity:1;transform:scale(1)} to{opacity:0;transform:scale(1.03)} }`;
  document.head.appendChild(style);

  document.body.style.animation = 'fadeOut 0.4s ease forwards';
  setTimeout(() => { window.location.href = 'index.html'; }, 400);
}

function share() {
  const total = sessionStorage.getItem('lixi_total') || 0;
  const text  = `🧧 Tổng lì xì Tết của tôi là: ${Number(total).toLocaleString('vi-VN')} ₫ 🎉\nChúc mừng năm mới Bính Nhọ 2026! 🐴✨`;

  if (navigator.share) {
    navigator.share({ title: 'Lì xì Tết 2025', text });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.querySelector('.btn-share');
      btn.textContent = '✅ Đã sao chép!';
      setTimeout(() => { btn.textContent = '🎊 Chia sẻ'; }, 2000);
    });
  }
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  loadResultData();
  createMoneyRain();
  createConfetti();
  requestAnimationFrame(fireworkLoop);
});

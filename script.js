/* =============================================
   TẾT LÌ XÌ CALCULATOR - script.js
   ============================================= */

const BILLS = [
  { value: 500,     label: '500 đ',      cls: 'bill-500',    emoji: '💵', color: '#5B8DB8' },
  { value: 1000,    label: '1.000 đ',    cls: 'bill-1000',   emoji: '💵', color: '#7B6FA0' },
  { value: 2000,    label: '2.000 đ',    cls: 'bill-2000',   emoji: '💵', color: '#4E8B7A' },
  { value: 5000,    label: '5.000 đ',    cls: 'bill-5000',   emoji: '💵', color: '#8B6B9E' },
  { value: 10000,   label: '10.000 đ',   cls: 'bill-10000',  emoji: '💴', color: '#B07840' },
  { value: 20000,   label: '20.000 đ',   cls: 'bill-20000',  emoji: '💴', color: '#4D8C4A' },
  { value: 50000,   label: '50.000 đ',   cls: 'bill-50000',  emoji: '💶', color: '#9B4E9E' },
  { value: 100000,  label: '100.000 đ',  cls: 'bill-100000', emoji: '🟥', color: '#C8102E' },
  { value: 200000,  label: '200.000 đ',  cls: 'bill-200000', emoji: '🟫', color: '#B07840' },
  { value: 500000,  label: '500.000 đ',  cls: 'bill-500000', emoji: '🟩', color: '#4D8C4A' },
];

// Bill face art (ASCII style placeholder since no actual images)
const BILL_ART = {
  500:    { symbol: '⋆ 500 ⋆',   star: '★' },
  1000:   { symbol: '1K',         star: '★' },
  2000:   { symbol: '2K',         star: '★' },
  5000:   { symbol: '5K',         star: '★' },
  10000:  { symbol: '10K',        star: '✦' },
  20000:  { symbol: '20K',        star: '✦' },
  50000:  { symbol: '50K',        star: '✦' },
  100000: { symbol: '100K',       star: '❋' },
  200000: { symbol: '200K',       star: '❋' },
  500000: { symbol: '500K',       star: '❋' },
};

function formatCurrency(n) {
  return n.toLocaleString('vi-VN') + ' ₫';
}

function buildBillCard(bill, index) {
  const art = BILL_ART[bill.value];
  return `
    <div class="bill-card" id="card-${index}">
      <div class="bill-image ${bill.cls}">
        <div style="
          display:flex;flex-direction:column;align-items:center;justify-content:center;
          width:100%;height:100%;gap:2px;text-shadow:0 1px 3px rgba(0,0,0,0.4);
        ">
          <span style="font-size:0.6rem;letter-spacing:2px;opacity:0.7">VIỆT NAM</span>
          <span style="font-size:1rem;font-weight:900;letter-spacing:0">${art.symbol}</span>
          <span style="font-size:0.55rem;letter-spacing:1px;opacity:0.6">${art.star} ĐỒNG ${art.star}</span>
        </div>
      </div>
      <div class="bill-label">${bill.label}</div>
      <div class="bill-input-row">
        <button class="qty-btn" onclick="changeQty(${index}, -1)" aria-label="Giảm">−</button>
        <input
          type="number"
          class="qty-input"
          id="qty-${index}"
          value="0"
          min="0"
          max="9999"
          oninput="onQtyChange(${index})"
          aria-label="Số lượng tờ ${bill.label}"
        />
        <button class="qty-btn" onclick="changeQty(${index}, 1)" aria-label="Tăng">+</button>
      </div>
      <div class="bill-subtotal" id="sub-${index}"></div>
    </div>
  `;
}

function renderBills() {
  const grid = document.getElementById('billsGrid');
  grid.innerHTML = BILLS.map((b, i) => buildBillCard(b, i)).join('');
}

function getQty(index) {
  const input = document.getElementById(`qty-${index}`);
  const v = parseInt(input.value) || 0;
  return Math.max(0, v);
}

function updateTotals() {
  let total = 0;
  let totalCount = 0;

  BILLS.forEach((bill, i) => {
    const qty = getQty(i);
    const sub = qty * bill.value;
    totalCount += qty;
    total += sub;

    const subEl = document.getElementById(`sub-${i}`);
    const card  = document.getElementById(`card-${i}`);

    if (qty > 0) {
      subEl.textContent = `= ${formatCurrency(sub)}`;
      card.classList.add('has-value');
    } else {
      subEl.textContent = '';
      card.classList.remove('has-value');
    }
  });

  document.getElementById('liveTotal').textContent = formatCurrency(total);
  document.getElementById('liveCount').textContent = `${totalCount.toLocaleString('vi-VN')} tờ tiền`;

  // Glow effect when total > 0
  const screen = document.querySelector('.screen-value');
  if (total > 0) {
    screen.style.textShadow = '0 0 30px rgba(255,215,0,0.8), 0 0 60px rgba(255,215,0,0.4)';
  } else {
    screen.style.textShadow = '0 0 20px rgba(255,215,0,0.6)';
  }

  // Save to sessionStorage for result page
  sessionStorage.setItem('lixi_total', total);
  sessionStorage.setItem('lixi_count', totalCount);

  const breakdown = BILLS.map((b, i) => ({
    label: b.label,
    qty: getQty(i),
    sub: getQty(i) * b.value,
  })).filter(x => x.qty > 0);
  sessionStorage.setItem('lixi_breakdown', JSON.stringify(breakdown));
}

function onQtyChange(index) {
  // Clamp value
  const input = document.getElementById(`qty-${index}`);
  let v = parseInt(input.value) || 0;
  if (v < 0) input.value = 0;
  if (v > 9999) input.value = 9999;
  updateTotals();
}

function changeQty(index, delta) {
  const input = document.getElementById(`qty-${index}`);
  let v = (parseInt(input.value) || 0) + delta;
  if (v < 0) v = 0;
  if (v > 9999) v = 9999;
  input.value = v;

  // Button press animation
  input.style.transform = 'scale(1.08)';
  setTimeout(() => input.style.transform = '', 150);

  updateTotals();
}

function resetAll() {
  BILLS.forEach((_, i) => {
    document.getElementById(`qty-${i}`).value = 0;
    document.getElementById(`sub-${i}`).textContent = '';
    document.getElementById(`card-${i}`).classList.remove('has-value');
  });
  updateTotals();
}

function calculate() {
  const total = parseInt(sessionStorage.getItem('lixi_total')) || 0;

  if (total === 0) {
    // Shake animation if nothing entered
    const btn = document.getElementById('btnCalculate');
    btn.style.animation = 'none';
    btn.style.transform = 'translateX(-8px)';
    setTimeout(() => { btn.style.transform = 'translateX(8px)'; }, 100);
    setTimeout(() => { btn.style.transform = 'translateX(-4px)'; }, 200);
    setTimeout(() => { btn.style.transform = 'translateX(0)'; btn.style.animation = ''; }, 300);
    return;
  }

  // Fade out and navigate
  document.body.classList.add('fade-out');
  setTimeout(() => {
    window.location.href = 'result.html';
  }, 500);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderBills();
  updateTotals();
});

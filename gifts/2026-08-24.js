(() => {
  const originalOpenGift = window.openGift;
  if (typeof originalOpenGift !== 'function') return;

  let photo25 = null;
  async function loadPhoto25() {
    if (photo25) return photo25;
    try {
      const r = await fetch('/gifts/2026-08-25.js?v=2', { cache: 'no-store' });
      const source = await r.text();
      const m = source.match(/g\.image\s*=\s*"(data:image\/jpeg;base64,[A-Za-z0-9+/=]+)"/);
      if (m) photo25 = m[1];
    } catch (_) {}
    return photo25;
  }

  async function patch25Modal() {
    const date = document.querySelector('.modal-date');
    if (!date || !date.textContent.includes('25 AUG')) return;

    const sender = document.querySelector('.sender-name');
    if (sender) sender.textContent = 'Любимая жена';

    const photo = await loadPhoto25();
    const gift = document.querySelector('.gift');
    if (photo && gift && !gift.querySelector('.gift-photo')) {
      const img = document.createElement('img');
      img.className = 'gift-photo';
      img.src = photo;
      img.alt = '';
      gift.appendChild(img);
    }
  }

  window.openGift = function(index) {
    const result = originalOpenGift.apply(this, arguments);
    if (index === 1) {
      setTimeout(patch25Modal, 0);
    }
    return result;
  };
})();

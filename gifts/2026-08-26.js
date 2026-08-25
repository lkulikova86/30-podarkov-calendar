(() => {
  const g = gifts.find(x => x.date === "2026-08-26");
  if (!g) return;

  const previousIsLocked = isLocked;
  isLocked = function(item) {
    if (item === g) return false;
    return previousIsLocked(item);
  };

  let photoUrl = null;

  function injectPhoto() {
    if (!photoUrl) return;
    g.image = photoUrl;
    const modalDate = document.querySelector('.modal-date');
    if (modalDate && modalDate.textContent.includes('26 AUG')) {
      const gift = document.querySelector('.gift');
      if (gift) {
        let img = gift.querySelector('.gift-photo');
        if (!img) {
          img = document.createElement('img');
          img.className = 'gift-photo';
          img.alt = '';
          gift.appendChild(img);
        }
        img.src = photoUrl;
      }
    }
  }

  async function loadPhoto() {
    if (photoUrl) return photoUrl;
    const parts = await Promise.all([
      fetch('/gifts/gift26_part1.txt?v=4', {cache:'no-store'}).then(r => r.text()),
      fetch('/gifts/gift26_part2.txt?v=4', {cache:'no-store'}).then(r => r.text()),
      fetch('/gifts/gift26_part3.txt?v=4', {cache:'no-store'}).then(r => r.text())
    ]);
    const b64 = parts.join('').replace(/\s+/g, '');
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    photoUrl = URL.createObjectURL(new Blob([bytes], {type:'image/jpeg'}));
    injectPhoto();
    return photoUrl;
  }

  loadPhoto().catch(console.error);
  render();

  const originalOpenGift = window.openGift;
  window.openGift = function(index) {
    const result = originalOpenGift.apply(this, arguments);
    if (index === 2) {
      setTimeout(() => {
        if (photoUrl) injectPhoto();
        else loadPhoto().then(injectPhoto).catch(console.error);
      }, 0);
    }
    return result;
  };
})();

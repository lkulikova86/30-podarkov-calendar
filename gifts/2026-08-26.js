(() => {
  const g = gifts.find(x => x.date === "2026-08-26");
  if (!g) return;

  // Keep day 3 unlocked now.
  const previousIsLocked = isLocked;
  isLocked = function(item) {
    if (item === g) return false;
    return previousIsLocked(item);
  };

  let photoReady = false;
  const photoPromise = Promise.all([
    fetch('/gifts/day3_photo_1.txt?v=2', { cache: 'no-store' }).then(r => {
      if (!r.ok) throw new Error('photo part 1 failed');
      return r.text();
    }),
    fetch('/gifts/day3_photo_2.txt?v=2', { cache: 'no-store' }).then(r => {
      if (!r.ok) throw new Error('photo part 2 failed');
      return r.text();
    })
  ]).then(parts => {
    const b64 = parts.join('').replace(/\s+/g, '');
    if (!b64.startsWith('/9j/') || !b64.endsWith('/2Q==')) {
      throw new Error('invalid day 3 JPEG data');
    }
    g.image = 'data:image/jpeg;base64,' + b64;
    photoReady = true;
    render();
  }).catch(err => console.error('Day 3 photo:', err));

  const originalOpenGift = window.openGift;
  window.openGift = function(index) {
    if (index === 2 && !photoReady) {
      photoPromise.then(() => {
        if (photoReady) originalOpenGift.call(this, index);
      });
      return;
    }
    return originalOpenGift.apply(this, arguments);
  };

  render();
})();

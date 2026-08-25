(() => {
  const g = gifts.find(x => x.date === "2026-08-26");
  if (!g) return;

  const originalIsLocked = isLocked;
  isLocked = function(item) {
    if (item === g) return false;
    return originalIsLocked(item);
  };

  render();

  Promise.all([
    fetch('/gifts/gift26_part1.txt?v=1', { cache: 'no-store' }).then(r => r.text()),
    fetch('/gifts/gift26_part2.txt?v=1', { cache: 'no-store' }).then(r => r.text()),
    fetch('/gifts/gift26_part3.txt?v=1', { cache: 'no-store' }).then(r => r.text())
  ]).then(parts => {
    g.image = 'data:image/jpeg;base64,' + parts.join('');
    render();
  });
})();

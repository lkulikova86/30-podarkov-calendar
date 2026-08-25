(() => {
  const g = gifts.find(x => x.date === "2026-08-26");
  if (!g) return;

  // Keep day 3 unlocked now.
  const previousIsLocked = isLocked;
  isLocked = function(item) {
    if (item === g) return false;
    return previousIsLocked(item);
  };

  // Real binary JPEG stored directly in the repository.
  g.image = '/gifts/gift_2026-08-26.jpg?v=2';
  render();
})();

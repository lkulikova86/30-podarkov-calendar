(() => {
  const g = gifts.find(x => x.date === "2026-08-26");
  if (!g) return;

  // Keep day 3 unlocked now.
  const previousIsLocked = isLocked;
  isLocked = function(item) {
    if (item === g) return false;
    return previousIsLocked(item);
  };

  // Use a real image file from the repository; no async base64 assembly.
  g.image = "/gifts/gift_2026-08-26.webp?v=1";

  render();
})();

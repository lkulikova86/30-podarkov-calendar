(() => {
  const g = gifts.find(x => x.date === "2026-08-26");
  if (!g) return;

  g.from = "любимая жена";
  g.image = "/gifts/day3_photo.jpg?v=3";

  const previousIsLocked = isLocked;
  isLocked = function(item) {
    if (item === g) return false;
    return previousIsLocked(item);
  };

  render();
})();

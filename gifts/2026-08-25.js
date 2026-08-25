(() => {
  const g = gifts.find(x => x.date === "2026-08-25");
  if (!g) return;
  g.image = "gifts/gift_2026-08-25.jpg?v=zip1";
  g.from = "Любимая жена";
  if (typeof render === "function") render();
})();

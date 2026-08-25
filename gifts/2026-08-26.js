(() => {
  const g = gifts.find(x => x.date === "2026-08-26");
  if (!g) return;

  // Открываем 3-й день уже сейчас.
  const previousIsLocked = isLocked;
  isLocked = function(item) {
    if (item === g) return false;
    return previousIsLocked(item);
  };
  render();

  let photo26 = null;
  let loading26 = null;

  function putPhotoIntoOpenModal() {
    const date = document.querySelector('.modal-date');
    if (!date || !date.textContent.includes('26 AUG')) return;

    const gift = document.querySelector('.gift');
    if (!gift || !photo26) return;

    let img = gift.querySelector('.gift-photo');
    if (!img) {
      img = document.createElement('img');
      img.className = 'gift-photo';
      img.alt = '';
      gift.appendChild(img);
    }
    img.src = photo26;
  }

  function loadPhoto26() {
    if (photo26) return Promise.resolve(photo26);
    if (loading26) return loading26;

    loading26 = Promise.all([
      fetch('/gifts/gift26_part1.txt?v=2', { cache: 'no-store' }).then(r => {
        if (!r.ok) throw new Error('part1');
        return r.text();
      }),
      fetch('/gifts/gift26_part2.txt?v=2', { cache: 'no-store' }).then(r => {
        if (!r.ok) throw new Error('part2');
        return r.text();
      }),
      fetch('/gifts/gift26_part3.txt?v=2', { cache: 'no-store' }).then(r => {
        if (!r.ok) throw new Error('part3');
        return r.text();
      })
    ]).then(parts => {
      photo26 = 'data:image/jpeg;base64,' + parts.map(x => x.trim()).join('');
      g.image = photo26;
      render();
      putPhotoIntoOpenModal();
      return photo26;
    }).catch(err => {
      console.error('Gift 26 image load failed', err);
      loading26 = null;
      return null;
    });

    return loading26;
  }

  // Если картинка ещё грузится, всё равно добавим её в уже открытое окно сразу после загрузки.
  loadPhoto26();

  const previousOpenGift = window.openGift;
  window.openGift = function(index) {
    const result = previousOpenGift.apply(this, arguments);
    if (index === 2) {
      setTimeout(() => {
        if (photo26) {
          putPhotoIntoOpenModal();
        } else {
          loadPhoto26().then(putPhotoIntoOpenModal);
        }
      }, 0);
    }
    return result;
  };
})();

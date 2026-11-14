// Werbeschild – Webseite: Geräteauswahl mit Download-Animation, Anleitung, sanftes Einblenden. Keine Cookies, kein Tracking.
(() => {
  document.documentElement.classList.remove('no-js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- device choice: the link itself starts the download, the page shows a little show and the matching guide ----
  const choices = document.querySelectorAll('.choice[data-target]');
  const guides = document.querySelectorAll('.guide[data-guide]');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  let toastTimer;

  function say(text) {
    toastText.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  }

  function label(tile, text) {
    const t = tile.querySelector('.go-t');
    if (t) t.textContent = text;
  }

  function reset(tile) {
    clearTimeout(tile._timer);
    tile.classList.remove('loading', 'done', 'active');
    label(tile, 'Herunterladen');
  }

  function burst(tile) {
    const colors = ['#22d3ee', '#6366f1', '#a855f7', '#f472b6', '#34d399', '#fbbf24'];
    for (let i = 0; i < 18; i++) {
      const s = document.createElement('span');
      const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.35;
      const dist = 58 + Math.random() * 54;
      s.className = 'spark';
      s.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      s.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
      s.style.setProperty('--c', colors[i % colors.length]);
      tile.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    }
  }

  function animate(tile) {
    choices.forEach((c) => { if (c !== tile) reset(c); });
    reset(tile);
    tile.classList.add('active');
    if (reduce) {
      tile.classList.add('done');
      label(tile, 'Download gestartet');
      return;
    }
    void tile.offsetWidth; // restart the animation on a second click
    tile.classList.add('loading');
    label(tile, 'Download startet …');
    tile._timer = setTimeout(() => {
      tile.classList.remove('loading');
      tile.classList.add('done');
      label(tile, 'Download gestartet');
      burst(tile);
    }, 1300);
  }

  function showGuide(target) {
    guides.forEach((g) => {
      const on = g.dataset.guide === target;
      g.hidden = !on;
      g.classList.remove('is-open');
      if (on) { void g.offsetWidth; g.classList.add('is-open'); }
    });
  }

  // Before a choice both guides stay hidden (with JavaScript off, both are simply visible).
  guides.forEach((g) => { g.hidden = true; });

  choices.forEach((c) => c.addEventListener('click', () => {
    animate(c);
    showGuide(c.dataset.target);
    say(c.dataset.target === 'win' ? 'Der Download für Windows startet …' : 'Der Download fürs Handy startet …');
    const guide = document.getElementById('guide-' + c.dataset.target);
    setTimeout(() => guide.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }), 900);
  }));

  // ---- recommend the right download for the visitor's device ----
  const ua = navigator.userAgent || '';
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isWindows = /Windows/i.test(ua) && !isAndroid;
  const recommended = isAndroid ? 'pick-android' : isWindows ? 'pick-win' : null;
  if (recommended) {
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = 'Für dein Gerät';
    document.getElementById(recommended).appendChild(badge);
  }
  if (isIOS) {
    const off = document.querySelector('.choice.off small');
    if (off) off.textContent = 'Noch nicht verfügbar – nutze Werbeschild am PC oder auf Android';
  }

  // ---- gentle reveal on scroll ----
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  items.forEach((el) => io.observe(el));
})();

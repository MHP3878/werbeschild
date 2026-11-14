// Werbeschild – Webseite: Geräteauswahl, Anleitung nach dem Download, sanftes Einblenden. Keine Cookies, kein Tracking.
(() => {
  document.documentElement.classList.remove('no-js');

  // ---- device choice: the link itself starts the download, the page only shows the matching guide ----
  const choices = document.querySelectorAll('.choice[data-target]');
  const guides = document.querySelectorAll('.guide[data-guide]');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toastText');
  let toastTimer;

  function showGuide(target) {
    guides.forEach((g) => { g.hidden = g.dataset.guide !== target; });
    choices.forEach((c) => c.classList.toggle('active', c.dataset.target === target));
  }

  function say(text) {
    toastText.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 4200);
  }

  // Before a choice: both guides stay hidden (with JavaScript off, both are simply visible).
  guides.forEach((g) => { g.hidden = true; });

  choices.forEach((c) => c.addEventListener('click', () => {
    showGuide(c.dataset.target);
    say(c.dataset.target === 'win' ? 'Der Download für Windows startet …' : 'Der Download fürs Handy startet …');
    const guide = document.getElementById('guide-' + c.dataset.target);
    setTimeout(() => guide.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' }), 250);
  }));

  // ---- recommend the right download for the visitor's device ----
  const ua = navigator.userAgent || '';
  const isAndroid = /Android/i.test(ua);
  const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isWindows = /Windows/i.test(ua) && !isAndroid;
  const recommended = isAndroid ? 'pick-android' : isWindows ? 'pick-win' : null;
  if (recommended) {
    const el = document.getElementById(recommended);
    const badge = document.createElement('span');
    badge.className = 'badge';
    badge.textContent = 'Für dein Gerät';
    el.appendChild(badge);
  }
  if (isIOS) {
    const off = document.querySelector('.choice.off');
    if (off) off.querySelector('small').textContent = 'Noch nicht verfügbar – nutze Werbeschild am PC oder auf Android';
  }

  // ---- gentle reveal on scroll ----
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
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

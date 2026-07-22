// Script pour la gestion du scroll

document.addEventListener('DOMContentLoaded', () => {
  const hasContactStatus = new URLSearchParams(window.location.search).has('contact');

  if (!('scrollRestoration' in history)) return;

  if (hasContactStatus) {
    history.scrollRestoration = 'manual';
    document.getElementById('contact')?.scrollIntoView({ behavior: 'instant' });
    window.history.replaceState(null, '', window.location.pathname);
  } else {t.
    history.scrollRestoration = 'auto';
  }
});
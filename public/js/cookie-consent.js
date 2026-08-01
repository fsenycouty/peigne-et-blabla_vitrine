/**
 * Gestion du consentement cookies pour la carte Google Maps.
 * Choix mémorisé en localStorage (préférence d'affichage, pas un jeton
 * d'authentification). Tant qu'aucun choix n'est enregistré, la carte
 * n'est pas chargée et la bannière reste visible.
 */

document.addEventListener('DOMContentLoaded', () => {
  const CONSENT_KEY = 'peb-map-consent';
  const banner = document.getElementById('cookie-banner');
  const mapContainer = document.getElementById('map-container');
  const acceptBtn = document.getElementById('cookie-accept');
  const refuseBtn = document.getElementById('cookie-refuse');

  if (!banner || !mapContainer || !acceptBtn || !refuseBtn) return;

  /** Injecte l'iframe Google Maps dans le conteneur. */
  function loadMap() {
    mapContainer.innerHTML = `
      <iframe
        src="https://www.google.com/maps?q=Arthez-de-B%C3%A9arn,France&z=10&output=embed"
        loading="lazy"
        title="Zone d'intervention — 15km autour d'Arthez-de-Béarn"
        referrerpolicy="no-referrer-when-downgrade"
      ></iframe>`;
  }

  function showBanner() {
    banner.hidden = false; // aucun choix encore fait
    document.body.classList.add('has-cookie-banner');
  }

  function hideBanner() {
    banner.hidden = true;
    document.body.classList.remove('has-cookie-banner');
  }

  const consent = localStorage.getItem(CONSENT_KEY);

  if (consent === 'accepted') {
    loadMap();
  } else if (consent !== 'refused') {
    showBanner();
  }

  acceptBtn.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    loadMap();
    hideBanner();
  });

  refuseBtn.addEventListener('click', () => {
    localStorage.setItem(CONSENT_KEY, 'refused');
    hideBanner();
  });
});
// Service : construit des URLs Cloudinary optimisées à partir des URLs brutes
// stockées en BDD (format et qualité automatiques, largeur adaptée à l'affichage).
// Aucun accès aux données, aucune logique métier autre que la transformation d'URL.

/**
 * Insère les paramètres de transformation Cloudinary (f_auto, q_auto, largeur)
 * juste après le segment "/upload/" d'une URL Cloudinary.
 * @param {string} url - URL Cloudinary brute (ex: https://res.cloudinary.com/xxx/image/upload/v123/photo.jpg)
 * @param {number} width - Largeur cible en pixels
 * @returns {string} URL avec transformation appliquée, ou l'URL d'origine si le format est inattendu
 */
export function getOptimizedImageUrl(url, width = 500) {
  // Sécurité : si l'URL ne contient pas "/upload/", on la renvoie telle quelle
  // plutôt que de produire une URL cassée (donnée invalide en base, ou URL
  // qui ne vient finalement pas de Cloudinary)
  if (!url || !url.includes("/upload/")) {
    return url;
  }
  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
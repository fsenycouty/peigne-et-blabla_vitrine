// Service : construction d'URLs des images Cloudinary optimisées pour l'affichage.

export function optimizeUrlImage(url, width = 400) {

  const marker = '/upload/';
  // Cherche la position de '/upload/' dans l'URL
  // (indexOf renvoie -1 s'il est absent : URL provenant d'une autre source, ou mal formée)
  const markerIndex = url.indexOf(marker);

  // Si l'URL ne correspond pas au format Cloudinary attendu
  // renvoie de l'url originale
  if (markerIndex === -1) {
    return url;
  }

  // Calcule l'endroit exact où insérer les paramètres : juste après la fin de '/upload/'
  const insertPosition = markerIndex + marker.length;

  // Construit la chaîne de paramètres à insérer :
  // f_auto = format le plus léger selon le navigateur (WebP/AVIF)
  // q_auto = compression automatique optimisée
  // w_<width> = largeur maximale de l'image livrée
  // Le "/" final sépare ces paramètres du reste de l'URL (numéro de version, nom du fichier).
  const transformation = `f_auto,q_auto,w_${width}/`;

  // Reconstruit l'URL complète en trois morceaux :
  // - la partie avant l'insertion (".../upload/")
  // - les paramètres de transformation
  // - la partie après (numéro de version + nom de fichier), inchangée
  return url.slice(0, insertPosition) + transformation + url.slice(insertPosition);
}

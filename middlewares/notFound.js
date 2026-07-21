// Middleware pour l'erreur de la page non trouvée

export function notFound (req, res, next) {
  // Renvoi à la vue error
  res.status(404).render('error', { message: "cette page n'existe pas !" });
}
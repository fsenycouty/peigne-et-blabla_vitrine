// Middleware pour l'erreur système

export function errorHandler (err, req, res, next) {
  // Renvoi à la vue error
  res.status(500).render('error', { message: "merci de réessayer plus tard..." });
}
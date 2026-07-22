// Middleware pour valider le contenu du JSON du formulaire

import Joi from "joi";

export function validForm(req, res, next) {
  
  // Définition du JSON attendu
  const schemaForm = Joi.object({
    name: Joi.string().trim().min(3).max(100).pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s'’-]+$/).required(),
    phone: Joi.string().trim().pattern(/^0[1-9]\d{8}$/).required(),
    message: Joi.string().trim().min(1).max(2000).required(),
  });
  // Validation du JSON body de la requête
  const { error, value } = schemaForm.validate(req.body);

  if (error) {
    console.error(error.message);
    // Test : affiche un message dans le navigateur
    res.send('saisie non valide');
  }

  next();
}
// Middleware pour valider le contenu du formulaire
import Joi from "joi";

export function validForm(req, res, next) {
  
  // Définition du schema du body attendu
  const schemaForm = Joi.object({
    name: Joi.string().trim().min(3).max(100).pattern(/^[a-zA-ZÀ-ÖØ-öø-ÿ\s.'’-]+$/).required(),
    phone: Joi.string().trim().pattern(/^(?:0|\+33\s?)[1-9](?:[\s.]?\d{2}){4}$/).required(),
    message: Joi.string().trim().min(1).max(2000).required(),
  });
  // Validation du body de la requête
  const { error, value } = schemaForm.validate(req.body);
  
  if (error) {
    // Sauvegarde les données saisies par le visiteur
    req.session.formData = req.body;
    // Log complet côté serveur
    console.error('Informations saisies non valides :', error.message);
    // Redirige vers  "/" avec req.query.contact = 'error'
    return res.redirect('/?contact=error#contact');
  }
  // 'Value' validée et nettoyée par Joi remplace le req.body d'origine
  req.body = value;
  next();
}
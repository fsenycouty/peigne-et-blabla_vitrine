// Controller pour le formulaire de contact de Peigne et Blabla
import { emailSend } from '../utils/email.service.js';

class ContactController {
  // Envoie les données du formulaire à Resend
  form = async (req, res, next) => {
    try {
      const { name, phone, message } = req.body;
      emailSend(name, phone, message);

      // Redirige vers '/' à l'endroit du formulaire avec req.query.contact = 'success'
      res.redirect('/?contact=success#contact');

    } catch (err) {
      // Trace complète côté serveur uniquement — jamais renvoyée au visiteur
      console.error("Erreur lors de la récupération des données du formulaire :", err);
      next(err);
    };
  };
}

export default new ContactController();



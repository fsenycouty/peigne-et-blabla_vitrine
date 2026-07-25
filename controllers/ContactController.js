// Controller pour le formulaire de contact de Peigne et Blabla
import { emailSend } from '../services/email.service.js';

class ContactController {
  // Envoie les données du formulaire à Resend
  form = async (req, res, next) => {
    try {
      // Récupère les données du formulaire
      // pour les passer en paramètres à la fonction emailSend
      const { name, phone, message } = req.body;
      await emailSend(name, phone, message);

      // Redirige vers '/' à l'endroit du formulaire avec req.query.contact = 'success'
      res.redirect('/?contact=success#contact');

    } catch (err) {
      // Log complet côté serveur
      console.error("Erreur lors de la récupération des données du formulaire :", err);
      next(err);
    };
  };
}

export default new ContactController();



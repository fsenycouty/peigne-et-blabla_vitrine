// Controller pour le formulaire de contact de Peigne et Blabla
import { emailSend } from "../services/email.service.js";

class ContactController {
  // Envoie les données du formulaire à Resend
  form = async (req, res, next) => {
    try {
      // Récupère les données du formulaire
      // pour les passer en paramètres à la fonction emailSend
      const { name, phone, message } = req.body;
      await emailSend(name, phone, message);

      // Redirige vers '/' à l'endroit du formulaire avec req.query.contact = 'success'
      res.redirect("/?contact=success#contact");

    } catch (err) {
      // Sauvegarde les données saisies par le visiteur
      req.session.formData = req.body;
      // Log complet côté serveur
      console.error(err);
      // Redirige vers  "/" avec req.query.contact = 'error-email'
      res.redirect("/?contact=error-email#contact");
    }
  };
}

export default new ContactController();

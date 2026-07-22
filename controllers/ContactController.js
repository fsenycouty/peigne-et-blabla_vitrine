// Controller pour le formulaire de contact de Peigne et Blabla

class ContactController {
  // Envoie les données du formulaire à Resend
  form = async (req, res, next) => {
    try {
      const dataContact = req.body;
      // TODO : transmettre 'dataContact' à Resend

      // Redirige vers '/' à l'endroit du formulaire avec req.query.contact = 'success'
      res.redirect('/?contact=success#contact');

    } catch (err) {
      console.error("Erreur lors de la récupération des données du formulaire :", err);
      next(err);
    };
  };
}

export default new ContactController();



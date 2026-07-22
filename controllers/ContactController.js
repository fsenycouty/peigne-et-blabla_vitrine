// Controller pour le formulaire de contact de Peigne et Blabla

class ContactController {
  // Récupération des données saisie dans le formulaire
  form = async (req, res, next) => {
    try {
      const dataContact = req.body;
      // Test: affiche la saisie faite dans le formulaire
      console.log(dataContact);

      res.redirect('/');

    } catch (err) {
      console.error("Erreur lors de la récupération des données du formulaire :", err);
    };
  };
}

export default new ContactController();





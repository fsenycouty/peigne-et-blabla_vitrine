// Controller pour la page d'accueil de Peigne et Blabla

class HomeController {
  // Envoye à la vue home.ejs
  home =async (req, res) => {
    res.render("home");
  }
}

export default new HomeController();
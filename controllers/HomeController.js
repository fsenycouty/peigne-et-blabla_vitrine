// Controller pour la page d'accueil de Peigne et Blabla

class HomeController {
  
  home =async (req, res) => {
    res.render("home");
  }
}

export default new HomeController();
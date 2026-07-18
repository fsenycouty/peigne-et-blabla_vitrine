// Controller pour la page d'accueil de Peigne et Blabla

class HomeController {
  home =async (req, res) => {
    // test affichage d'un message sur la page localhost:XXXX/
    res.send('Hello, welcome to the home page!');
  }
}

export default new HomeController();
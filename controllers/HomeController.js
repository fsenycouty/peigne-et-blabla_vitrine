// Controller pour la page d'accueil de Peigne et Blabla

// Import de dataPictures pour le test de l'affichage en dynamique de la gallerie
import dataPictures from "../data/dataPictures.json" with { type: "json"};
import Picture from "../models/Picture.js";

class HomeController {
  // Envoye à la vue home.ejs
  home = async (req, res) => {
    // Envoi le dataPictures à la vue
    res.render("home", { dataPictures });
  }
}

export default new HomeController();
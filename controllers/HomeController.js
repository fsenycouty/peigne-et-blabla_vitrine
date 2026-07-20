// Controller pour la page d'accueil de Peigne et Blabla
import Picture from '../models/Picture.js';

class HomeController {
  // Envoye à la vue home.ejs
  home = async (req, res) => {
    // Récupère les infos des photos stockées dans la BDD
    const dataPictures = await Picture.findAll(
      {
        order: [['position', 'ASC']]
      }
    );
    
    res.render('home', { dataPictures });
  }
}

export default new HomeController();
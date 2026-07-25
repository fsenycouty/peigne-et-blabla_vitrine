// Controller pour la page d'accueil de Peigne et Blabla
import Picture from "../models/Picture.js";
import { getReviews } from "../services/review.service.js";

class HomeController {
  // Affiche la page d'accueil avec la galerie de photos issues de la BDD.
  // En cas d'échec de la récupération (erreur BDD), transmet l'erreur au middleware d'erreur global via `next`.
  home = async (req, res, next) => {
    try {
      // Récupère les infos des photos stockées dans la BDD
      const dataPictures = await Picture.findAll({
        order: [["position", "ASC"]],
      });

      // Récupère les avis Google
      const dataReviews = await getReviews();

      // Récupère le résultat de la soumission au formulaire : 'success', 'error' ou undifined
      const responseForm = req.query.contact;

      res.render("home", { dataPictures, responseForm, dataReviews });

    } catch (err) {
      // Trace complète côté serveur uniquement — jamais renvoyée au visiteur
      console.error("Erreur lors de la récupération des données : ", err);
      next(err);
    }
  };
}

export default new HomeController();

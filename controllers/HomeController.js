// Controller pour la page d'accueil de Peigne et Blabla
import Picture from "../models/Picture.js";

class HomeController {
  // Affiche la page d'accueil avec la galerie de photos issues de la BDD.
  // En cas d'échec de la récupération (erreur BDD), transmet l'erreur au middleware d'erreur global via `next`.
  home = async (req, res, next) => {
    try {
      // Récupère les infos des photos stockées dans la BDD
      const dataPictures = await Picture.findAll({
        order: [["position", "ASC"]],
      });

      // Récupère le résultat de la soumission au formulaire : 'success', 'error' ou undifined
      const responseForm = req.query.contact;

      res.render("home", { dataPictures, responseForm });

    } catch (err) {
      // Trace complète côté serveur uniquement — jamais renvoyée au visiteur
      console.error("Erreur lors de la récupération des photos :", err);
      next(err);
    }
  };
}

export default new HomeController();

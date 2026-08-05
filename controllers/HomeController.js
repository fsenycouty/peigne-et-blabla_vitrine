// Controller pour la page d'accueil de Peigne et Blabla
import { BeforeAfterPicture, Picture } from "../models/index.js";
import { getReviews } from "../services/review.service.js";
import { getCurrentOffer } from "../services/offer.service.js";
import { optimizeUrlImage } from "../services/image.service.js";

class HomeController {
  // Affiche la page d'accueil avec la galerie de photos issues de la BDD.
  // En cas d'échec de la récupération (erreur BDD), transmet l'erreur au middleware d'erreur global via `next`.
  home = async (req, res, next) => {
    try {
      const currentOffer = await getCurrentOffer();

      // Récupère les infos des photos stockées dans la BDD
      const dataPictures = await BeforeAfterPicture.findAll({
        include: [
          { model: Picture, as: "before" },
          { model: Picture, as: "after" },
        ],
        order: [["position", "ASC"]],
      });
      
      // Transforme les instances Sequelize en objets simples déjà prêts pour l'affichage
      const galleryPictures = dataPictures.map((picture) => (
        {
          position: picture.position,
          beforeUrl: optimizeUrlImage(picture.before.url),
          afterUrl: optimizeUrlImage(picture.after.url),
        } 
      ));

      // Récupère les avis Google
      // const dataReviews = await getReviews();

      // Récupère le résultat de la soumission au formulaire : 'success', 'error', 'error-email' ou undefined
      const responseForm = req.query.contact;
      // Récupère les données sauvegardé après l'erreur à la soumission du formulaire pour les renvoyer à la vue
      const formData = req.session.formData;
      // Efface les données du formulaire sauvegardé
      req.session.formData = null;

      //TODO Rajouter dataReviews
      res.render("home", {
        galleryPictures,
        responseForm,
        formData,
        currentOffer,
      });
    } catch (err) {
      // Trace complète côté serveur uniquement — jamais renvoyée au visiteur
      console.error("Erreur lors de la récupération des données : ", err);
      next(err);
    }
  };
}

export default new HomeController();

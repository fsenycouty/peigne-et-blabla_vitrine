// Service : vérifie la présence du flyer de l'offre du moment
// et renvoie ses informations d'affichage (URL + texte alternatif).
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

// En ES Modules, __filename et __dirname n'existent pas nativement
// (contrairement à CommonJS) : on les reconstruit à partir de import.meta.url.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin absolu, côté système de fichiers, vers l'image de l'offre du moment
const currentOfferImg = path.join(__dirname, "..", "public", "img", "current_offer.png");


// Vérifie si un flyer d'offre du moment est présent sur le serveur
export async function getCurrentOffer() {
  try {
    // fs.promises.access vérifie l'existence/accessibilité pas le contenu
    await fs.promises.access(currentOfferImg);

    const currentOffer =
    {
      imageUrl: "/img/current_offer.png",
      imageAlt: "Flyer de l'offre du moment",
    };

    return currentOffer;

  } catch (error) {
    // Si le fichier n'existe pas (ou n'est pas accessible), ce n'est pas une erreur
    // signifie simplement qu'aucune offre n'est en place actuellement.
    // Log le code (ex. "ENOENT") pour diagnostic et renvoie null pour ne pas afficher la section offre.
    console.error(error.code);
    return null;
  }
}
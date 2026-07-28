

import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const currentOfferImg = path.join(__dirname, "..", "public", "img", "current_offer.png");

export async function getCurrentOffer() {
  try {
    await fs.promises.access(currentOfferImg);

    const currentOffer =
    {
      imageUrl: "/img/current_offer.png",
      imageAlt: "Flyer de l'offre du moment",
    };

    return currentOffer;

  } catch (error) {
    console.error(error.code);
    return null;
  }
}
import "dotenv/config";

// Durée pour lancer la nouvelle requete à l'API Google (au bout de 24h)
const reloadTime = 24 * 60 * 60 * 1000;
// Stockage des avis pendant 24h
let reviewStocked = null;
// Initialise pour le compteur
let timestamp = null;

// Fonction compteur
function countDownValid() {
  if (Date.now() - timestamp < reloadTime) {
    // le décompte continu
    return true;
  }
  // le décompte est atteint
  return false;
}

// Fonction d'appel à l'API Google pour récupérer les avis client
export async function getReviews() {

    if (countDownValid()) {
      // Le timer décompte toujours : renvoie les avis en mémoire
      return reviewStocked;
    }

    // Requete méthode GET à l'API
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${process.env.PLACE_ID}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY,
          "X-Goog-FieldMask": "reviews,rating",
        },
      },
    );

    // Réponse de l'API
    const result = await response.json();
    const reviews = result.reviews;
    const totalRating = result.rating;

    // Récupère les données des 3 derniers avis de reviews : la note, le texte et le nom du client
    const threeRecentReviews = [];

    for (let i = 0; i < 3; i++) {
      const review = {
        rating: reviews[i].rating,
        text: reviews[i].originalText.text,
        name: reviews[i].authorAttribution.displayName,
      };

      threeRecentReviews.push(review);
    }

    const dataReviews = {totalRating, threeRecentReviews};
  
    // Réinitialise pour le compteur
    timestamp = Date.now();

    // Vérification des données récupérées et triées
    console.log(dataReviews)
    
    return reviewStocked = dataReviews;
}

// Pour test avec node services/review.service.js
getReviews();
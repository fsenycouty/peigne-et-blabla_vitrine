// Service : envoi de la requête à l'API et récupère les données Avis Google
import "dotenv/config";

// Durée pour lancer la nouvelle requete à l'API (au bout de 24h)
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

// Fonction d'appel à l'API pour récupérer les avis client
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
        "X-Goog-FieldMask": "reviews,rating,googleMapsUri",
      },
    },
  );

  if (!response.ok) {
    if (reviewStocked === null) {
      throw new Error(
        `Échec de récupération des avis Google : ${response.status}`,
      );
    }
    console.error(
      "Echec de la récupération, charge les avis stockés en cache : ",
      response.status,
    );
    return reviewStocked;
  }

  // Réponse de l'API
  const result = await response.json();
  // Le lien vers la fiche Google "Peigne et Blabla"
  const googleReviewsUrl = result.googleMapsUri;
  // La moyenne des notes des avis Google
  const totalRating = result.rating;
  // Les données des 5 avis Google (classé par pertinence)
  const reviews = result.reviews;
  // Trie les avis du plus récent au plus ancien par rapport à publishtime
  reviews.sort((a, b) => new Date(b.publishTime) - new Date(a.publishTime));

  // Récupère les données des 3 derniers avis de reviews : la note, le texte et le nom du client
  const threeRecentReviews = [];

  for (let i = 0; i < 3; i++) {
    const review = {
      rating: reviews[i].rating,
      text: reviews[i].originalText.text,
      name: reviews[i].authorAttribution.displayName.toLowerCase(),
    };

    threeRecentReviews.push(review);
  }

  // Données prêtes à envoyer pour HomeController
  const dataReviews = { totalRating, threeRecentReviews, googleReviewsUrl };
  
  // Réinitialise pour le compteur
  timestamp = Date.now();

  return (reviewStocked = dataReviews);
}

// getReviews()
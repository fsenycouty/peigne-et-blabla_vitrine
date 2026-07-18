// Fichier principal de l'application Peigne et Blabla

import 'dotenv/config';
import express from 'express';
import routerHome from './routers/routerHome.js';

// Initialisation de l'application Express
const app = express();

// Utilisation du router pour la page d'accueil
app.use(routerHome);

// Définition du port à partir de la variable d'environnement ou par défaut à 3000
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} 🚀`);
});
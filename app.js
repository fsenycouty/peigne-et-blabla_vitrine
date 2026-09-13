// Fichier principal de l'application Peigne et Blabla

import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import compression from 'compression';
import routerHome from './routers/routerHome.js';
import routerContact from './routers/routerContact.js';
import routerLegal from './routers/routerLegal.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Initialisation de l'application Express
const app = express();

// Compresse les réponses HTTP (HTML, CSS, JS) avec gzip avant de les envoyer au navigateur
// Placé tout en haut de la chaîne de middlewares pour s'appliquer à toutes les réponses
app.use(compression());

// Configuration de EJS comme moteur de vues
app.set('view engine', 'ejs');
app.set('views', './views');

// Montre les fichiers statiques (css, img) depuis le dossier public
app.use(express.static('./public'));

// Pour lire le body d'une requête HTTP de la method="POST"
app.use(express.urlencoded({ extended: true }));

// Configuration de express-session
app.use(session(
  {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:
      {
        secure: true
      }
  }
));

// Utilisation des router
app.use(routerHome);
app.use(routerContact);
app.use(routerLegal);

// Cas où la page n'existe pas
app.use(notFound);
// Erreur système
app.use(errorHandler);

// Définition du port à partir de la variable d'environnement ou par défaut à 3000
const PORT = process.env.PORT || 3000;

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT} 🚀`);
});
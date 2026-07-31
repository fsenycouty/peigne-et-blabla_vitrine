# peigne-et-blabla_vitrine

- **Client** : Alicia, coiffeuse à domicile
- **Nom commercial** : Peigne et bla-bla
- **Zone d'intervention** : 15 km autour d'Arthez-de-Béarn
- **Contact** : 07 59 90 85 54 · peigneetblabla@gmail.com

**Besoin** : Alicia a besoin d'un site vitrine pour présenter son activité de coiffeuse à domicile. Le site doit permettre aux visiteurs de voir ses prestations, ses tarifs, ses réalisations, et de la contacter facilement.

## Prérequis

- [Node.js](https://nodejs.org/) et npm
- Un projet [Supabase](https://supabase.com/) (base de données PostgreSQL) déjà créé
- Un compte [Cloudinary](https://cloudinary.com/) (hébergement des photos de la galerie — upload manuel via le dashboard, aucun appel API depuis l'application)
- Un compte [Resend](https://resend.com/) (envoi de l'email du formulaire de contact)
- Un projet [Google Cloud](https://console.cloud.google.com/) avec l'API **Places API (New)** activée, et une clé API (récupération des avis Google)

## Installation

1. Cloner le dépôt :
```bash
   git clone https://github.com/fsenycouty/peigne-et-blabla_vitrine.git
   cd peigne-et-blabla_vitrine
```

2. Installer les dépendances :
```bash
   npm install
```

3. Créer le fichier `.env` à partir du modèle fourni, puis renseigner les vraies valeurs :
```bash
   cp .env.example .env
```

4. Appliquer les migrations pour créer les tables dans la base de données (nécessite `dotenv-cli` pour que `sequelize-cli` puisse lire le fichier `.env`, déjà installé en devDependency) :
```bash
   npx dotenv-cli sequelize-cli db:migrate
```

5. Démarrer le serveur en mode développement (rechargement automatique avec `nodemon`) :
```bash
   npm run dev
```
   Le site est alors accessible sur `http://localhost:PORT` (le port défini dans `.env`).

## Variables d'environnement

Toutes les variables attendues sont listées, avec des valeurs factices, dans `.env.example`. Aucune valeur réelle ne doit être committée.

| Variable | Rôle |
|---|---|
| `PORT` | Port d'écoute du serveur Express en local |
| `DATABASE_URL` | Chaîne de connexion complète à la base PostgreSQL (Supabase) |
| `RESEND_API_KEY` | Clé API Resend, utilisée pour l'envoi de l'email du formulaire de contact |
| `CONTACT_EMAIL_TO` | Adresse email de destination des messages du formulaire de contact (boîte mail d'Alicia) |
| `GOOGLE_API_KEY` | Clé API Google Cloud (Places API), utilisée pour récupérer les avis Google |
| `PLACE_ID` | Identifiant Google de la fiche établissement (Google Business Profile) d'Alicia, utilisé pour cibler les avis à récupérer |

## Scripts disponibles

| Commande | Rôle |
|---|---|
| `npm run dev` | Démarre le serveur avec `nodemon` (rechargement automatique à chaque modification, pour le développement) |
| `npm start` | Démarre le serveur avec `node`, sans rechargement automatique (pour la production) |

## Structure du projet

```
├── app.js            # Point d'entrée : configuration et démarrage du serveur Express
├── routers/          # Définition des routes (endpoints)
├── controllers/      # Orchestration requête/réponse
├── services/         # Logique métier réutilisable (avis Google, envoi d'email, offre du moment)
├── models/           # Modèles Sequelize : définition des entités, accès aux données uniquement
├── database/         # Connexion technique à la base de données (instance Sequelize)
├── views/            # Templates EJS
├── middlewares/      # Gestion des erreurs, validation des entrées, etc.
├── migrations/       # Historique versionné des changements de structure de la base de données
├── seeders/          # Scripts d'insertion de données (dossier généré par sequelize-cli, non utilisé actuellement — saisie manuelle en base)
├── config/           # Configuration lue par sequelize-cli (connexion BDD pour les migrations)
├── public/           # Fichiers statiques servis tels quels (CSS, images, JS client)
├── integration/      # Intégration HTML/CSS statique validée avec la cliente (référence visuelle)
└── docs/             # Documentation de conception (cahier des charges, user stories, MCD/MLD/MPD, carnet de bord)
```
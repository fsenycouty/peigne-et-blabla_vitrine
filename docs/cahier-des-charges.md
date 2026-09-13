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
| `CONTACT_EMAIL_FROM` | Adresse d'expédition des emails envoyés via Resend (`onboarding@resend.dev` en local, une adresse sur le vrai domaine une fois celui-ci vérifié sur Resend en production) |
| `CONTACT_EMAIL_TO` | Adresse email de destination des messages du formulaire de contact (boîte mail d'Alicia) |
| `GOOGLE_API_KEY` | Clé API Google Cloud (Places API), utilisée pour récupérer les avis Google |
| `PLACE_ID` | Identifiant Google de la fiche établissement (Google Business Profile) d'Alicia, utilisé pour cibler les avis à récupérer |
| `SESSION_SECRET` | Clé secrète de signature des cookies de session (`express-session`), utilisée pour le pré-remplissage du formulaire de contact après une erreur. Générer une valeur aléatoire (ex. `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`), jamais la même qu'un exemple ou qu'un autre projet |
| `NODE_ENV` | Non requis en local. À définir sur `production` en environnement de production : conditionne notamment le flag `secure` du cookie de session (n'est envoyé qu'en HTTPS) |

## Scripts disponibles

| Commande | Rôle |
|---|---|
| `npm run dev` | Démarre le serveur avec `nodemon` (rechargement automatique à chaque modification, pour le développement) |
| `npm start` | Démarre le serveur avec `node`, sans rechargement automatique (pour la production) |

## Déploiement

Le site est hébergé sur [Render](https://render.com/) (plan Starter) et accessible sur [https://peigneetblabla.fr](https://peigneetblabla.fr).

**Organisation des comptes** :

- Le compte Render est au nom d'Alicia (propriétaire du site, titulaire de la carte bancaire associée à l'abonnement) — choix délibéré pour que la propriété du compte et de la facturation reste clairement celle de la cliente, et pour ne jamais mélanger ce projet avec d'autres projets du développeur sur un même espace de facturation.
- Le développeur accède au compte par **partage direct des identifiants de connexion** (pas d'invitation en tant que membre du workspace : Render facture ~25 $/mois supplémentaires pour cette fonctionnalité, jugé disproportionné pour ce projet). Arrangement documenté et assumé, à changer si la collaboration évolue.
- Le nom de domaine `peigneetblabla.fr` est réservé chez OVH, également au nom d'Alicia.

**Déploiement du code** :

- Le service Render est connecté au dépôt GitHub via son **URL publique**.
- Conséquence : **pas de déploiement automatique** au `git push`. Après chaque mise à jour poussée sur `main`, un redéploiement manuel est nécessaire depuis le dashboard Render (bouton **Manual Deploy** → **Deploy latest commit**).

**Base de données et emails en production** : mêmes services qu'en développement (Supabase, Resend).

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
├── seeders/          # Scripts d'insertion de données (dossier généré par sequelize-cli mais supprimé car non utilisé actuellement — saisie manuelle en base)
├── config/           # Configuration lue par sequelize-cli (connexion BDD pour les migrations)
├── public/           # Fichiers statiques servis tels quels (CSS, images, JS client)
├── integration/      # Intégration HTML/CSS statique validée avec la cliente (référence visuelle)
└── docs/             # Documentation de conception (cahier des charges, user stories, MCD/MLD/MPD, carnet de bord)
```
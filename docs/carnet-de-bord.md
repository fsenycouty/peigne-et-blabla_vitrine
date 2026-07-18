# Carnet de bord — Peigne et bla-bla (vitrine)

## 17-07-2026

### Objectifs du jour

- Démarrer le projet (cadrage).
- Valider le cahier des charges.

### Travail réalisé

**Cadrage, conception visuelle et intégration** :

- Rédaction et validation du cahier des charges (`docs/cahier-des-charges.md`).
- Création du dépôt `peigne-et-blabla_vitrine`.
- Rédaction des user stories (`docs/conception/user-stories.md`) et mise en place du Kanban sur GitHub.
- Conception du wireframe et de la maquette (`docs/conception/ui`)
- Intégration en statique : html/css (`integration/`)

### Difficultés rencontrées / corrigées

- **Push refusé** avec le message `Password authentication is not supported for Git operations`:
  - **Cause** : GitHub a supprimé l'authentification par mot de passe pour les opérations Git en HTTPS depuis 2021.
  - **Solution** : génération d'un jeton d'accès personnel (Personal Access Token) classique avec le scope `repo`, utilisé comme mot de passe lors du push.

---

## 18-07-2026

### Objectifs du jour

- MCD/MLD/MPD.
- Création des comptes Supabase et Cloudinary.
- Initialisation du projet (Node.js/Express/EJS).
- Connexion à la BDD.
- 

### Travail réalisé

**Conception des données** :

- MCD / MVD avec mocodo
- MPD avec dbdiagram

**Mise en place technique** :

- Création des comptes Supabase et Cloudinary.
- Initialisation du projet (`npm init`), installation d'Express, Sequelize, `pg`/`pg-hstore`, `dotenv` (+ `nodemon` et `sequelize-cli` en devDependencies).
- Initialisation de `sequelize-cli` (`sequelize-cli init`) : dossiers `config/`, `migrations/`, `models/`, `seeders/`.
- Isolation des dossiers `migrations/` et `seeders/` en CommonJS (fichier `package.json` dédié dans chacun) pour cohabiter avec le `"type": "module"` du reste du projet.
- Configuration de `config/config.json` avec `use_env_variable: "DATABASE_URL"` : la CLI lit la connexion Supabase depuis l'environnement, aucun identifiant en dur.
- Écriture de la connexion Sequelize applicative dans `database/sequelize-client.js`.
- Écriture du modèle `Picture` (`models/Picture.js`).
- Écriture et application de la migration `create-pictures` (traduction du MPD validé) : table `pictures` créée avec succès dans Supabase, vérifiée dans le Table Editor.
- Installation de `dotenv-cli` pour permettre à `sequelize-cli` de lire le `.env` lors des commandes (`npx dotenv sequelize-cli db:migrate`).
- Création de la structure MVC complète : `routers/`, `controllers/`, `models/`, `views/`, `middlewares/`.
- Configuration minimale du serveur Express (`app.js`) avec une route et un contrôleur de test (« Hello, welcome to the home page! ») pour valider la chaîne routeur → contrôleur → réponse.

### Difficultés rencontrées / corrigées

- **Conflit entre `sequelize-cli` et `"type": "module"`** : **(note : sequelize-cli non vue en formation, fait avec l'aide de l'IA)**
  - **Cause** : `sequelize-cli` génère par défaut des fichiers en CommonJS (`require`/`module.exports`), alors que le `package.json` du projet déclare `"type": "module"` (ES Modules) — les deux syntaxes ne coexistent pas dans un même fichier.
  - **Solution** : ajout d'un fichier `package.json` (`{ "type": "commonjs" }`) dans `migrations/` et `seeders/`, pour que Node applique CommonJS localement à ces deux dossiers sans changer le reste du projet. Le fichier de connexion (`database/sequelize-client.js`) et le modèle (`models/Picture.js`) restent en ES Modules puisqu'ils ne sont utilisés que par le code applicatif, jamais par la CLI.

- **`sequelize-cli db:migrate` échoue avec `Error parsing url: undefined`** :
  - **Cause** : `sequelize-cli` est un outil indépendant de l'application : il ne charge pas le `.env` automatiquement (seule l'application le fait, via `import 'dotenv/config'`). `DATABASE_URL` était donc `undefined` au moment où la CLI en avait besoin.
  - **Solution** : installation de `dotenv-cli`, utilisé pour précharger les variables d'environnement avant d'exécuter les commandes `sequelize-cli` (`npx dotenv sequelize-cli db:migrate`).

- **Point de vigilance repéré en relecture (corrigé avant tout bug réel)** : l'option `freezeTableName` empêche la pluralisation automatique du nom de table par Sequelize, mais ne suffit pas à faire correspondre exactement `Picture` (modèle, singulier) à `pictures` (table réelle, pluriel, minuscule) — la pluralisation automatique de Sequelize aurait donné `Pictures` avec une majuscule. D'où la nécessité de préciser explicitement `tableName: "pictures"` dans la définition du modèle, plutôt que de compter sur un comportement par défaut.

### À poursuivre

- Phase 6 (développement) : convertir `integration/index.html` en vues EJS (`views/`), en restant fidèle au rendu déjà validé avec la cliente.
- Créer les routes/contrôleurs réels pour la galerie, branchés sur le modèle `Picture` (remplacer le contrôleur de test « Hello World »).
- Mettre en place la connexion à Cloudinary (hébergement des photos avant/après de la galerie).
- Préparer l'intégration de l'API Google Places pour les avis Google (appel à la demande, cache serveur, aucun stockage en base).
- Mettre en place la gestion des erreurs (middlewares 404 et 500), prévue dès le début de la Phase 6.
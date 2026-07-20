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

---

## 19-07-2026

### Objectifs du jour

- Convertir `integration/index.html` en vues EJS, sur la branche `dev_views`, en restant fidèle au rendu déjà validé avec la cliente.

### Travail réalisé

**Développement** :

- Installation et configuration d'EJS comme moteur de vues (`app.set('view engine', 'ejs')`, dossier `views/`).
- Déplacement des assets statiques (`css/`, `img/`) dans `public/`, servis via `express.static`, plutôt que depuis `integration/`.
- Conversion de `integration/index.html` en `views/home.ejs` ; `HomeController.home` modifié pour faire `res.render('home')` à la place du `res.send()` de test.
- Vérification du rendu : comparaison entre la page générée par EJS et l'`integration/index.html`.
- Passage des chemins d'assets en absolu (`/img/...`, `/css/...`) plutôt qu'en relatif.
- Extraction d'un partial `views/partials/nav.ejs` : la liste des 6 liens de navigation était dupliquée à l'identique entre la nav desktop et le panneau mobile dans le HTML d'origine ; factorisée en un seul partial inclus aux deux endroits (`<%- include('partials/nav') %>`), sans changement de rendu.

### Difficultés rencontrées / corrigées

- **Découverte en testant le rendu après extraction du partial `nav.ejs`** : les commentaires EJS `<%# ... %>` laissent une ligne vide dans le HTML généré, sauf à les terminer par `-%>` (ex. `<%# ... -%>`). Sans incidence visuelle (espaces ignorés par le navigateur).

---

## 20-07-2026

### Objectifs du jour

- Afficher la galerie de façon dynamique, d'abord simulée puis réellement branchée sur Supabase.

### Travail réalisé

**Développement (suite)** :

- Génération d'un jeu de données de test (`data/dataPictures.json`, 4 paires avant/après) au format attendu par le modèle Sequelize (clés en `camelCase`), pour simuler l'affichage dynamique sans dépendre de Cloudinary/Supabase déjà peuplés.
- Import du fichier JSON en ES Modules (`import dataPictures from "../data/dataPictures.json" with { type: "json" }`).
- Ajout d'une boucle EJS dans `views/home.ejs` pour générer les 4 `.ba-slider` de la galerie à partir des données reçues.
- Upload manuel des 8 photos (4 avant/après) sur Cloudinary via le dashboard (Media Library), un accès laissé en mode « Public » (obligatoire ici : aucun système d'authentification sur le site, les images doivent être accessibles directement par `<img src>`).
- Saisie manuelle des 4 lignes correspondantes dans la table `pictures` sur Supabase (Table Editor), avec un `position` distinct par ligne pour conserver l'ordre d'affichage.
- Remplacement du JSON de test par le vrai appel au modèle dans `HomeController.home` : `Picture.findAll({ order: [['position', 'ASC']] })` — la galerie affiche désormais les vraies données de Supabase/Cloudinary.

### Difficultés rencontrées / corrigées

- **`import ... with { type: JSON }` (sans guillemets)** : `SyntaxError: Unexpected identifier 'JSON'`.
  - **Cause** : l'attribut d'import (`with { type: ... }`) exige une chaîne de caractères littérale ; `JSON` sans guillemets fait référence à l'objet global JavaScript, pas à une chaîne.
  - **Solution** : `type: "json"` (avec guillemets).
- **Erreur de syntaxe sur le tri Sequelize** : `order: ['position', 'ASC']` (tableau plat).
  - **Cause** : Sequelize interprète chaque élément du tableau `order` comme un critère de tri séparé — la requête générée triait donc sur deux colonnes distinctes, `position` et une colonne `ASC` inexistante, ce qui aurait provoqué une erreur SQL à l'exécution.
  - **Solution** : `order: [['position', 'ASC']]` — un tableau de tuples `[colonne, direction]`, conforme à la syntaxe attendue.

### À poursuivre

- Nettoyer `data/dataPictures.json` (fichier de test devenu inutile, encore commité dans le dépôt).
- Mettre en place la gestion des erreurs (middlewares 404 et 500).
- Avis Google via l'API Google Places (appel à la demande, cache serveur, aucun stockage en base).
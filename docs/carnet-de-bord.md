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

---

## 21-07-2026

### Objectifs du jour

- Mettre en place la gestion des erreurs (middlewares 404 et 500).
- Factorisation (partials)

### Travail réalisé

**Développement (gestion des erreurs)** :

- `HomeController.home` : ajout d'un `try/catch` autour de `Picture.findAll()`, avec `console.error` (log complet côté serveur uniquement) puis `next(err)` pour transmettre l'erreur.
- Écriture de `middlewares/notFound.js` (404, 3 paramètres) et `middlewares/errorHandler.js` (500, 4 paramètres `(err, req, res, next)` requise par Express pour qu'il soit reconnu comme gestionnaire d'erreur).
- Création de `views/error.ejs`, vue unique réutilisée par les deux middlewares (variable `message`), layout du site conservé (nav + footer allégé).
- Extraction de 3 partials pour éviter la duplication entre `home.ejs` et `error.ejs` : `views/partials/head.ejs` (title/description passés en variables pour garder un SEO propre par page), `views/partials/site-nav.ejs` (bloc nav desktop + mobile) et `views/partials/site-nav.ejs` (balises du footer communes).
- Branchement des deux middlewares dans `app.js`, dans l'ordre : `routerHome` → `notFound` → `errorHandler`.
- Tests manuels : simulation d'un 500 (erreur provoquée temporairement, puis `DATABASE_URL` cassée) et d'un 404 (URL inexistante) — comportement validé dans les deux cas, aucune stack trace ni message SQL exposée au visiteur.

### Difficultés rencontrées / corrigées

- **`Could not find the include file "partials/nav"`** en testant la page d'erreur :
  - **Cause** : EJS résout les chemins d'`include()` relativement au dossier du fichier qui contient l'appel, pas à la racine `views/`. Le partial `site-nav.ejs`, situé dans `views/partials/`, appelait `include('partials/nav')` — un chemin valable depuis `home.ejs` (à la racine de `views/`) mais qui, depuis `partials/`, pointait vers un inexistant `partials/partials/nav.ejs`.
  - **Solution** : `include('nav')` dans `site-nav.ejs`, chemin relatif au dossier courant où vit déjà `nav.ejs`.

---

## 22-07-2026

### Objectifs du jour

- Concevoir et développer le formulaire de contact (validation des entrées, retour visuel succès/erreur), en repoussant l'envoi réel de l'email à une prochaine session.

### Travail réalisé

**Conception** :

- Découpage : router → middleware de validation (Joi) → contrôleur.
- Choix du fournisseur d'envoi d'email : Resend (intégration reportée à une prochaine session).

**Développement** :

- `routers/routerContact.js` : route `POST /contact-messages`.
- `middlewares/validForm.js` : schéma Joi complet — `name` (lettres accentuées, espaces, tirets, apostrophes autorisés via un pattern dédié), `phone` (pattern format français à 10 chiffres), `message` (bornes de longueur). `req.body` remplacé par la valeur validée/nettoyée (`value`) avant de passer la main au contrôleur.
- `controllers/ContactController.js` : redirige selon le résultat via `?contact=success` ou `?contact=error` dans l'URL (pattern POST/Redirect/GET).
- `HomeController.home` : lit `req.query.contact` et transmet la valeur brute (`responseForm`) à la vue.
- `views/home.ejs` : cadre de retour inline (vert succès / rouge erreur, `role="status"` / `role="alert"`).
- `public/js/contact-form.js` : après soumission, saut instantané vers `#contact`, nettoyage de l'URL (`history.replaceState`), et gestion ciblée de `history.scrollRestoration` pour ne pas rester bloqué sur le formulaire au rechargement, sans altérer le comportement natif de défilement du reste du site.

### Difficultés rencontrées / corrigées

- **Donnée validée non réutilisée** : `schemaForm.validate()` renvoie une valeur nettoyée (`value`), jamais réaffectée à `req.body` — le contrôleur recevait donc la saisie brute, pas la version validée.
  - **Solution** : `req.body = value` ajouté avant `next()`.
- **Défilement animé (`scroll-behavior: smooth`) trop lent** à l'arrivée sur la confirmation d'envoi.
  - **Solution** : script dédié forçant un saut instantané uniquement dans ce cas précis, sans désactiver le confort du défilement fluide pour la navigation normale du site.

### À poursuivre

- `HttpError` : la distinction succès/erreur se fait pour l'instant par simple redirection, sans code HTTP dédié type 400.
- Envoi réel de l'email via Resend (service dédié `services/emailService.js`), avec sa propre gestion des erreurs d'envoi (échec → `?contact=error`).
- Avis Google (API Google Places) — toujours pas commencé.
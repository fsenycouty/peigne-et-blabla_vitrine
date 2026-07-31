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
- Création de la structure MVC complète : `routers/`, `controllers/`, `models/`, `views/`, `middlewares/`.
- Configuration minimale du serveur Express (`app.js`) avec une route et un contrôleur de test (« Hello, welcome to the home page! ») pour valider la chaîne routeur → contrôleur → réponse.

### Difficultés rencontrées / corrigées

- **Conflit entre `sequelize-cli` et `"type": "module"`** : **(note : sequelize-cli non vue en formation, fait avec l'aide de l'IA)**
  - **Cause** : `sequelize-cli` génère par défaut des fichiers en CommonJS (`require`/`module.exports`), alors que le `package.json` du projet déclare `"type": "module"` (ES Modules) — les deux syntaxes ne coexistent pas dans un même fichier.
  - **Solution** : ajout d'un fichier `package.json` (`{ "type": "commonjs" }`) dans `migrations/` et `seeders/`, pour que Node applique CommonJS localement à ces deux dossiers sans changer le reste du projet. Le fichier de connexion (`database/sequelize-client.js`) et le modèle (`models/Picture.js`) restent en ES Modules puisqu'ils ne sont utilisés que par le code applicatif, jamais par la CLI.

- **`sequelize-cli db:migrate` échoue avec `Error parsing url: undefined`** :
  - **Cause** : `sequelize-cli` est un outil indépendant de l'application : il ne charge pas le `.env` automatiquement (seule l'application le fait, via `import 'dotenv/config'`). `DATABASE_URL` était donc `undefined` au moment où la CLI en avait besoin.
  - **Solution** : installation de `dotenv-cli`, utilisé pour précharger les variables d'environnement avant d'exécuter les commandes `sequelize-cli` (`npx dotenv-cli sequelize-cli db:migrate`).

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

---

## 23-07-2026

### Objectifs du jour

- Finaliser l'envoi réel de l'email de contact via Resend.
- Traiter le risque d'injection HTML dans le champ `message`.

### Travail réalisé

**Développement (Resend)** :

- `utils/email.service.js` : fonction `emailSend(name, phone, message)`, appel à `resend.emails.send()` avec un email HTML affichant nom/téléphone/message, `to` lu depuis `CONTACT_EMAIL_TO`.
- `ContactController.form` : appel à `emailSend(...)`, redirection `?contact=success` en cas de succès ; toute erreur (validation Joi ou échec Resend) remonte vers l'utilisateur soit par redirection `?contact=error`, soit par la page 500 générique selon son origine.
- `middlewares/errorHandler.js` : ajout de `console.error(err)` avant le rendu de la page d'erreur, pour garder une trace serveur complète.
- Choix d'expédition en développement : adresse de test Resend (`onboarding@resend.dev`), `CONTACT_EMAIL_TO` réglé sur l'adresse perso/école.

**Sécurité** :

- Installation de la dépendance `escape-html` pour échapper le champ `message` avant insertion dans le HTML de l'email (contrairement à `name`/`phone`, `message` n'a pas de contrainte de format Joi, donc un visiteur pourrait y injecter du HTML/JS) : `escapeHTML(message).replace(/\n/g, '<br>')`, échappement appliqué avant la conversion des retours à la ligne.

### Difficultés rencontrées / corrigées

- **`await` manquant devant `emailSend(...)`** : le contrôleur redirigeait vers `success` avant que la promesse d'envoi ne soit résolue. Testé avec une clé API Resend invalide : l'erreur remontait bien dans la console (promesse rejetée non gérée) mais après l'envoi de la réponse HTTP — le visiteur voyait « envoyé » alors que l'email n'était pas parti.
  - **Solution** : ajout de `await` devant l'appel.

---

## 24-07-2026

### Objectifs du jour

- Configuration Google Cloud.
- développement et test du service de récupération des avis.

### Travail réalisé

**Configuration Google Cloud** :

- Création du projet Google Cloud, activation de l'API **Places API (New)**, création d'une clé API.
- Facturation : compte lié à l'offre d'essai sans frais (263 €, 90 jours) — confirmée compatible avec les seuils d'usage gratuits de Google Maps Platform, pas de passage à un compte payant nécessaire à ce stade.
- Choix de sécurité sur la clé API : restriction par API ("Places API (New)" uniquement).
- Filet de sécurité à poser : un quota de requêtes/jour côté Google Cloud.
- Recherche du Place ID via l'outil Place ID Finder (Maps JavaScript API).

**Développement** :

- Renommage du dossier `utils/` en `services/`.
- Écriture du service de récupération des avis : `services/review.service.js`.
- Cache en mémoire côté serveur : deux variables de module non exportées (`reviewStocked`, `timestamp`) et une fonction `countDownValid()` comparant le temps écoulé à un TTL de 24h (`reloadTime`).
- Appel `fetch` en `GET` vers `https://places.googleapis.com/v1/places/{PLACE_ID}` (headers `X-Goog-Api-Key` et `X-Goog-FieldMask: reviews,rating`), puis nettoyage de la réponse pour ne garder que `rating`, `originalText.text` (texte d'avis en français) et `authorAttribution.displayName`.
- Tri des avis par `publishTime` décroissant et ne garder que les 3 plus récents (`threeRecentReviews`).
- Gestion d'erreur construite autour de `response.ok` : si absence de cache, l'erreur est relancée avec un message explicite (remonte jusqu'à la page 500) ; si un cache existe déjà, les avis périmés sont renvoyés en dépannage avec une trace `console.error`.
- Forme de retour : objet `{ totalRating, threeRecentReviews }`.

### Difficultés rencontrées / corrigées

- **Erreur `403 PERMISSION_DENIED` ("Requests to this API ... are blocked")** au premier test :
  - **Cause précise** — le module sélectionné dans Google Cloud était Place API au lieu de Places API (New).
- **Erreur `400 INVALID_ARGUMENT`** ensuite :
  - **Cause** : espace en trop dans le header `X-Goog-FieldMask` (`"reviews, rating"` au lieu de `"reviews,rating"`).
- **Tableau `reviews` pas trié par date** : constaté sur les données réelles de test (Google classe par pertinence et non par chronologie).
  - **Solution** : tri explicite par `publishTime` ajouté avant de découper les 3 avis à afficher.
- **Seulement 5 avis récupérés sur les 13 existants** sur la fiche de l'établissement de test (Happy Coiffure) :
  - **Cause** : limite native de l'API Place Details, non contournable officiellement (5 avis maximum, sélectionnés par un algorithme de pertinence interne à Google).
  - **Décision** : acceptée telle quelle, cohérente avec le cahier des charges — à signaler à Alicia.
- **Fiche Google Business d'Alicia non trouvée en ligne** lors de la première recherche : elle ne l'avait pas encore créée. Créée le 24-07, vérification Google en cours (délai variable, jusqu'à 14 jours pour un courrier postal) — développement poursuivi en attendant avec l'établissement de test (Happy Coiffure), Place ID clairement marqué comme temporaire dans le `.env`.

---

## 25-07-2026

### Objectifs du jour

- Brancher le service `review.service.js` dans `HomeController` et l'afficher dans `home.ejs`.
- Afficher la moyenne des notes et un lien stable vers la fiche d'avis Google.
- Premier test de déploiement sur Render.

### Travail réalisé

**Intégration** :

- `HomeController.home` : appel à `getReviews()`, résultat transmis à la vue via `res.render("home", { ..., dataReviews })`.
- `views/home.ejs` : nouvelle section `#reviews` — badge avec la moyenne et le lien "Voir tous les avis", grille de cartes pour les 3 avis les plus récents (note, texte, auteur).
- Moyenne des notes affichée en chiffre, avec une icône étoile à côté (`<span class="google-rating-stars">★</span>`).

**Déploiement (test Render)** :

- Six variables identifiées nécessaires ajoutées dans Render (`process.env.*`) : `PORT`, `DATABASE_URL`, `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `GOOGLE_API_KEY`, `PLACE_ID`.
- `.env.example` mis à jour avec les clés manquantes (`CONTACT_EMAIL_TO`, `GOOGLE_API_KEY`, `PLACE_ID`).

**Lien vers les avis Google** :

- Dans `review.service.js` utilisation du champ `googleMapsUri` renvoyé directement par l'API (ajouté au `X-Goog-FieldMask`).

**Réglage du quota sur Google Cloud** :

- Poser un quota de requêtes/jour sur la clé API dans Google Cloud (filet de sécurité, en l'absence de restriction par IP).

### Difficultés rencontrées / corrigées

- **`Error: Missing API key` au démarrage sur Render** :
  - **Cause** : `.env` exclu de Git (comme voulu), donc absent sur l'environnement de déploiement.
  - **Solution** : variables recopiées manuellement dans les paramètres d'environnement de Render.

---

## 31-07-2026

### Objectifs du jour

- Revoir le modèle de données de la galerie suite à un retour critique, et répercuter ce changement sur les migrations, modèles, associations, contrôleur et vue déjà en place.

### Travail réalisé

**Conception des données (révision du modèle)** :

- Retour critique reçu sur le modèle `PICTURE` initial (une ligne portant à la fois `beforeUrl`/`afterUrl` et leurs `publicId`) : une ligne de table doit représenter une seule chose, or une ligne y représentait deux photos en même temps.
- Refonte du MCD : entité `PICTURE` (id, url) générique, entité `BEFORE_AFTER_PICTURE` (id, position) reliée à `PICTURE` par deux associations à rôles distincts (`CONCERNS_BEFORE`, `CONCERNS_AFTER`).
- MLD dérivé : les deux clés étrangères (`beforePictureId`, `afterPictureId`) portées par `beforeAfterPicture` (côté cardinalité `1,1`), non par `picture` (côté `0,1`).
- MPD (SQL) mis à jour en conséquence : tables `pictures` (id, url) et `before_after_pictures` (id, position, before_picture_id, after_picture_id, `ON DELETE RESTRICT`).

**Mise en place technique / Développement** :

- Nouvelles migrations `create-picture` et `create-before-after-picture` écrites et exécutées avec succès sur Supabase.
- Modèles `Picture.js` et `BeforeAfterPicture.js`.
- Fichier d'associations : alias `before`/`after` dupliqués entre `belongsTo` et `hasOne`, avec `foreignKey` — les deux sens de la relation doivent toujours porter le même `foreignKey`.
- `HomeController.home` mis à jour : `Picture.findAll(...)` remplacé par `BeforeAfterPicture.findAll({ include: [{ model: Picture, as: "before" }, { model: Picture, as: "after" }], order: [["position", "ASC"]] })`.
- Données ré-saisies manuellement dans Supabase selon la nouvelle structure : une ligne par photo dans `pictures`, puis une ligne dans `before_after_pictures` référençant les deux `id`.
- `views/home.ejs` : `picture.before.url`/`picture.after.url`; attributs `alt` rendus uniques par paire en réutilisant `picture.position` (`alt="Photo avant, coiffure n°<%= picture.position %>"`).

### Difficultés rencontrées / corrigées

- **Erreur Mocodo `Err.9 - impossible de calculer un plongement planaire`** en générant le schéma visuel du nouveau MCD :
  - **Cause** : deux associations parallèles entre les deux mêmes entités (`CONCERNS_BEFORE`/`CONCERNS_AFTER`) mettent en difficulté l'algorithme de placement automatique par défaut de Mocodo.
  - **Solution** : changer d'algorithme d'arrangement (`--arrange=ga` ou `--arrange=lp` plutôt que `bb`, le mode exact par défaut). Le texte Mocodo restait valide indépendamment de ce problème de rendu.

---

## 01-08-2026

### Objectifs du jour

- Élargir le format de téléphone accepté (indicatif international).
- Renforcer la protection contre l'injection HTML sur tous les champs de l'email de contact.
- Corriger le respect du pattern POST/Redirect/GET en cas d'échec d'envoi.
- Permettre au visiteur de retrouver sa saisie après une erreur (pré-remplissage du formulaire).

### Travail réalisé

**Sécurité / robustesse** :

- Pattern téléphone (`middlewares/validForm.js`) étendu pour accepter le format international (`+33`) en plus du format national, avec ou sans séparateurs (espace, point) entre les groupes de chiffres.
- `escapeHTML` appliqué désormais aux trois champs (`name`, `phone`, `message`) dans `services/email.service.js` (défense en profondeur), plutôt qu'au seul champ `message` — les champs `name`/`phone` sont déjà contraints par Joi, mais l'échappement systématique protège contre un futur assouplissement du pattern de validation. `.replace(/\n/g, '<br>')` conservé uniquement sur `message`, seul champ pouvant légitimement contenir des retours à la ligne (issu d'un `<textarea>`).

**Gestion des erreurs (Resend)** :

- `ContactController.form` : remplacement du `next(err)` par `res.redirect('/?contact=error-email#contact')` en cas d'échec d'envoi, pour respecter le pattern POST/Redirect/GET (évite la popup navigateur de renvoi de formulaire au rechargement). Introduction d'un 3ᵉ état distinct (`error-email`) pour un message différent d'une erreur de saisie.

**Fonctionnalité : pré-remplissage du formulaire après une erreur** :

1. Installation d'`express-session`.
2. Ajout de `SESSION_SECRET` dans `.env`/`.env.example` (valeur générée via `crypto.randomBytes`).
3. Configuration du middleware dans `app.js` (`resave: false`, `saveUninitialized: false`, `cookie.secure: false` avec `TODO` pour le passage en production).
4. `validForm.js` : sauvegarde de `req.body` (données brutes) dans `req.session.formData` avant la redirection en cas d'erreur de saisie.
5. `ContactController.js` : même sauvegarde en cas d'échec d'envoi, via `req.body` plutôt que les variables déstructurées (évite un problème de portée de bloc).
6. `HomeController.js` : lecture de `req.session.formData` dans une variable dédiée, distincte de `responseForm`, puis effacement immédiat de la session.
7. `home.ejs` : pré-remplissage via l'attribut `value` (`<input>`) et le contenu entre balises (`<textarea>`), avec accès sécurisé (`formData?.name`) pour ne pas planter au chargement normal.

### Difficultés rencontrées / corrigées

- **Point vérifié avant de valider, pas supposé** : comportement de `<%= formData?.name %>` quand `formData` vaut `undefined` — testé directement avec le moteur EJS : rendu en chaîne vide, jamais la chaîne littérale `"undefined"`, donc pas besoin de `|| ''` supplémentaire.

### À poursuivre

- `cookie.secure: false` à repasser à `true` avant le déploiement en production.
- Remplacer le Place ID de test par celui d'Alicia une fois sa fiche Google Business vérifiée.
- Réserver le nom de domaine "www.peigneetblabla.fr" sur Gandi avec la cliente et souscrire à l'abonnement environ 8€/mois pour l'hébergement sur Render.
- Créer un log sur Resend avec le mail de peigneetblabla@gmail.com :
  - récupérer le RESEND_API_KEY à remplacer dans le .env
  - modifier l'adresse CONTACT_EMAIL_TO du .env avec celui de peigneetblabla@gmail.com
  - paramétrer Resend avec le vrai nom de domaine
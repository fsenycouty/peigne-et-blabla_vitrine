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

- MCD avec mocodo
- MVD
- MPD

**Mise en place technique** :

- Création des comptes Supabase et Cloudinary.
- Initialisation du projet (Node.js/Express/EJS).
- Connexion à la BDD.

### Difficultés rencontrées / corrigées

- **Push refusé** avec le message `Password authentication is not supported for Git operations`:
  - **Cause** : GitHub a supprimé l'authentification par mot de passe pour les opérations Git en HTTPS depuis 2021.
  - **Solution** : génération d'un jeton d'accès personnel (Personal Access Token) classique avec le scope `repo`, utilisé comme mot de passe lors du push.

### À poursuivre
# Carnet de bord — Peigne et bla-bla (vitrine)

## 2026-07-17

### Objectifs du jour

- Démarrer le projet (cadrage).
- Valider le cahier des charges.

### Travail réalisé

- Lecture de l'ancien dépôt (`peigne-et-blabla`) pour comprendre le rendu visuel déjà validé avec la cliente et le périmètre initial (maquette, wireframe, user stories).
- Décisions de cadrage actées pour cette nouvelle version :
  - suppression du calendrier de disponibilités, remplacé par un bloc statique "Mes horaires" (horaires fixes, sans interactivité) ;
  - pas d'espace admin dans cette itération (gestion des photos faite directement par le développeur, pas par la cliente) ;
  - Cloudinary conservé pour l'hébergement des images, Supabase (PostgreSQL) conservé pour stocker les métadonnées de la galerie ;
  - formulaire de contact fonctionnel : envoi réel d'un email à Alicia.
- Rédaction et validation du cahier des charges (`docs/cahier-des-charges.md`).
- Création du nouveau dépôt `peigne-et-blabla_vitrine` et premier push.

### Difficultés rencontrées / corrigées

- **Push refusé** avec le message `Password authentication is not supported for Git operations`.
  - **Cause** : GitHub a supprimé l'authentification par mot de passe pour les opérations Git en HTTPS depuis 2021.
  - **Solution** : génération d'un jeton d'accès personnel (Personal Access Token) classique avec le scope `repo`, utilisé comme mot de passe lors du push.

### À poursuivre

- Étape 2 : conception visuelle — reprendre les maquettes déjà validées de l'ancien projet (`docs/maquette/`) et les adapter au nouveau périmètre (suppression du bloc disponibilités/calendrier, ajout du bloc "Mes horaires").
- Nettoyer un fichier parasite repéré dans le dépôt : `docs/README.md:Zone.Identifier` (artefact Windows généré lors d'un téléchargement), à supprimer et à ajouter au `.gitignore` pour éviter que ça se reproduise.
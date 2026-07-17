# Carnet de bord — Peigne et bla-bla (vitrine)

## 17-07-2026

### Objectifs du jour

- Démarrer le projet (cadrage).
- Valider le cahier des charges.

### Travail réalisé

- Rédaction et validation du cahier des charges (`docs/cahier-des-charges.md`).
- Création du dépôt `peigne-et-blabla_vitrine`.
- Rédaction des user stories et mise en place du Kanban pour le suivi de projet sur GitHub.

### Difficultés rencontrées / corrigées

- **Push refusé** avec le message `Password authentication is not supported for Git operations`:
  - **Cause** : GitHub a supprimé l'authentification par mot de passe pour les opérations Git en HTTPS depuis 2021.
  - **Solution** : génération d'un jeton d'accès personnel (Personal Access Token) classique avec le scope `repo`, utilisé comme mot de passe lors du push.

### À poursuivre

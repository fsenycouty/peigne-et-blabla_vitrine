# Cahier des charges — Peigne et bla-bla

## 1. Présentation du projet

- **Client** : Alicia, coiffeuse à domicile
- **Nom commercial** : Peigne et bla-bla
- **Zone d'intervention** : 15 km autour d'Arthez-de-Béarn
- **Contact** : 07 59 90 85 54 · peigneetblabla@gmail.com

**Besoin** : Alicia a besoin d'un site vitrine pour présenter son activité de coiffeuse à domicile. Le site doit permettre aux visiteurs de voir ses prestations, ses tarifs, ses réalisations, et de la contacter facilement.

## 2. Périmètre fonctionnel

Le site permet de :

- voir la présentation d'Alicia et ses coordonnées dès l'arrivée sur la page ;
- consulter les prestations et les tarifs, classés par catégorie (Femme / Homme / Enfant) ;
- voir quand elle existe, une offre du moment ponctuelle sous forme d'image (flyer) ;
- regarder une galerie de photos avant/après ;
- consulter les horaires d'ouverture (jours et heures) dans un cadre simple appelé « Mes horaires » ;
- lire des avis Google ;
- voir la zone d'intervention sur une carte ;
- envoyer un message à Alicia via un formulaire de contact (ce message arrive directement dans sa boîte mail) ;
- naviguer facilement sur mobile grâce à un menu qui s'adapte à la taille de l'écran.

## 3. Contraintes

- **Budget** : aucun frais récurrent, à part le nom de domaine/hébergement (environ 100 € par an).
- **Accessibilité** : le site doit être utilisable par tout le monde, y compris avec un lecteur d'écran (textes alternatifs sur les images, icônes décoratives cachées, etc.).
- **Mobile-first** (priorité au mobile) : le site doit d'abord bien fonctionner sur téléphone, puis s'adapter aux écrans plus grands.
- **Hébergement des images** : les photos sont stockées avec l'outil Cloudinary (service en ligne fait pour héberger et gérer des images).
- **Offre du moment** : contrairement à la galerie, l'image de l'offre du moment n'est pas hébergée sur Cloudinary mais stockée directement dans le code du site (`public/img/`). Ce choix s'explique par la nature différente de ce contenu : il n'y a pas d'espace admin, donc seul le développeur peut la mettre à jour (remplacement du fichier + redéploiement) ; et contrairement aux paires avant/après (multiples, ordonnées, à relier entre elles), c'est un élément unique, sans relation ni historique à modéliser en base. La présence ou l'absence du fichier sert elle-même d'interrupteur : si l'image n'existe pas, le bloc ne s'affiche simplement pas.
- **Base de données** : les informations sur la galerie de photos sont enregistrées dans une base de données PostgreSQL, hébergée avec l'outil Supabase.
- **Formulaire de contact** : le message envoyé par un visiteur doit arriver dans la boîte mail d'Alicia (peigneetblabla@gmail.com).

## 4. Livrables

- [x] Cahier des charges (ce document)
- [x] Maquette / conception visuelle
- [x] Intégration HTML/CSS statique
- [x] Conception des données (dictionnaire de données, MCD, MLD, MPD)
- [x] Mise en place technique (Node.js, Express, EJS)
- [x] Développement des fonctionnalités
- [ ] Tests
- [ ] Aspects légaux (mentions légales, politique de confidentialité)
- [ ] Déploiement en ligne
- [ ] Documentation (README, carnet de bord)

## 5. Évolutions futures possibles
 
- espace d'administration sécurisé pour Alicia (gestion autonome de la galerie) ;
- gestion de la mise à jour de la gallerie photo ;
- gestion des prestations/tarifs depuis un espace admin plutôt qu'en dur dans le HTML ;
- introduction d'un système de disponibilités (calendrier).
# Plan de test — Peigne et bla-bla

Checklist manuelle des parcours utilisateur principaux, à exécuter sur les deux environnements (local et Render).

(En complément un test unitaire automatisé `node:test` est prévu sur la fonction pure `optimizeUrlImage()` — voir `test/image.service.test.js`)

| Test| Parcours | Étapes | Résultat attendu | Environnement | Résultat obtenu |
|---|---|---|---|---|---|
| T01 | Coordonnées et zone d'intervention visibles dès l'arrivée | Charger la page d'accueil | Nom, téléphone, email, zone (15 km autour d'Arthez-de-Béarn) visibles sans scroll ou en tout début de page | Local + Render | OK |
| T02 | Prestations et tarifs par catégorie | Aller à la section prestations, vérifier les 3 catégories | Femme / Homme / Enfant affichées avec tarifs corrects, lisibles | Local + Render | OK |
| T03 | Galerie de réalisations (avant/après) | Charger la page, observer la galerie | Les paires avant/après s'affichent, images chargées depuis Cloudinary, ordre cohérent (`position`) | Local + Render | OK |
| T04 | Bloc "Mes horaires" | Consulter le cadre horaires | Lun/Mar/Jeu/Ven 9h-18h, Sam 8h30-12h30, fermé Mer/Dim, contenu exact | Local + Render | OK |
| T05 | Bouton d'appel direct | Cliquer sur le bouton tel: (ou vérifier le `href` sur desktop) | Propose d'appeler le 07 59 90 85 54 (sur mobile réel ou émulation) | Local + Render, test réel sur mobile si possible | OK |
| T06 | Carte de la zone d'intervention | Charger la section carte | Carte Google Maps affichée, centrée sur la zone d'intervention | Local + Render | OK |
| T07 | Avis Google | Charger la page, observer la section avis | Moyenne + 3 avis les plus récents affichés, lien "Voir tous les avis" fonctionnel | Local + Render | OK |
| T08 | Formulaire de contact — cas nominal | Remplir le formulaire correctement, envoyer | Redirection avec message de succès (`?contact=success`), email reçu | Local + Render | OK |
| T09 | Formulaire de contact — cas d'erreur | Soumettre un champ invalide (ex. email mal formé, champ requis vide) | Redirection avec message d'erreur (`?contact=error`), aucun email envoyé | Local + Render | OK |
| T10 | Page inexistante | Naviguer vers une URL qui n'existe pas (ex. `/xyz`) | Page 404 propre, avec le layout du site, pas de crash | Local + Render | OK |
| T11 | Affichage mobile | Réduire la fenêtre / tester sur un vrai téléphone | Mise en page adaptée, menu accessible, aucun débordement horizontal | Local + Render | OK |
| T12 | Menu mobile (ouverture/fermeture) | Ouvrir puis fermer le menu sur petit écran | Menu s'ouvre/se ferme, `aria-expanded` reflète l'état | Local + Render | OK |

## Accessibilité

| Test | Parcours | Étapes | Résultat attendu | Environnement | Résultat obtenu |
|---|---|---|---|---|---|
| T13 | Navigation clavier | Parcourir toute la page avec Tab uniquement (pas de souris) | Tous les éléments interactifs atteignables, focus visible à chaque étape, ordre logique | Local | OK |
| T14 | Textes alternatifs des images | Inspecter les images de la galerie, le logo, les icônes | `alt` pertinent sur chaque image de contenu, `alt=""` ou `aria-hidden="true"` sur les décoratives | Local | OK |
| T15 | Association label/champ du formulaire | Cliquer sur chaque label du formulaire de contact | Le focus va sur le bon champ (association `for`/`id` correcte) | Local | OK |
| T16 | Hiérarchie des titres | Inspecter la structure des titres de la page (DevTools ou lecteur d'écran) | Un seul `<h1>`, pas de saut de niveau (h2 → h4 interdit) | Local | OK |
| T17 | Contraste texte/fond | Vérifier les couleurs principales (texte courant, boutons) | Ratio ≥ 4.5:1 (WCAG AA) | Local | OK |
| T18 | Langue du document | Inspecter la balise `<html>` | `lang="fr"` présent | Local | OK |
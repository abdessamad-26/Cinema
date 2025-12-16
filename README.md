<div align="center">
<img width="180" title="CineScope" alt="Logo CineScope" src="https://raw.githubusercontent.com/abdessamad-26/Cinema/main/public/logo.png" />
<h1>CineScope</h1>
<p width="120">Application web moderne de recherche et de découverte de films, alimentée par l'API OMDb. CineScope offre une expérience utilisateur fluide et élégante pour explorer des milliers de films avec des informations détaillées, incluant des thèmes personnalisables, une recherche en temps réel et des pages de détails complètes.</p>
</div>

Télécharger
Télécharger le programme
Configuration système requise
| Configuration minimale|Recommandée
----|----|----
Système d'exploitation|Windows 10, macOS 10.15, Linux (toute distribution récente)|Windows 11, macOS 13+, Ubuntu 22.04+
Navigateur web|Chrome 90+, Firefox 88+, Safari 14+, Edge 90+|Dernières versions de Chrome, Firefox ou Edge
Node.js|Version 14.0 ou supérieure|Version 18.0 ou supérieure
RAM (Mémoire)|2 Go disponibles|4 Go disponibles ou plus
Connexion internet|Connexion stable pour accéder à l'API OMDb|Connexion haut débit

[!NOTE]
L'application nécessite une clé API OMDb gratuite pour fonctionner. Vous pouvez en obtenir une sur omdbapi.com/apikey.aspx.


[!CAUTION]
L'application nécessite une connexion internet active pour récupérer les données des films depuis l'API OMDb.

Arguments de la ligne de commande (Scripts npm)
CommandeFonctionnaliténpm run devLance le serveur de développement avec rechargement automatique (hot reload)npm run buildGénère le build de production optimisé dans le dossier dist/npm run previewPrévisualise le build de production en localnpm installInstalle toutes les dépendances du projet
Installation

Obtenez le code source soit en téléchargeant le zip, soit en faisant git clone https://github.com/abdessamad-26/Cinema.
Ouvrez le dossier contenant le code source (ou extrayez le zip téléchargé et ouvrez le dossier), puis ouvrez le répertoire du programme dans un terminal.
Installez les dépendances en tapant npm install dans le terminal.
Configurez votre clé API OMDb dans le fichier src/config.js :

javascript   export const OMDB_API_KEY = "6f7e6e0c";

Tapez dans le terminal npm run dev pour lancer le serveur de développement.
Ouvrez votre navigateur à l'adresse http://localhost:5173 pour accéder à l'application.

Comment ça marche ?
Aperçu de l'application
CineScope est une application web monopage (SPA) qui communique avec l'API OMDb pour récupérer et afficher des informations sur les films. L'application est construite avec une architecture modulaire et utilise Vite comme outil de développement et de build.
Architecture de l'application
Structure des pages

index.html: Page d'accueil affichant une sélection de films tendance avec chargement progressif
search.html: Page de recherche permettant de trouver des films par titre avec pagination
movie.html: Page de détails affichant toutes les informations d'un film spécifique

Modules JavaScript

main-index.js: Gère la logique de la page d'accueil, le chargement par lots et le système de cache
main-search.js: Implémente la recherche en temps réel avec debounce et la pagination des résultats
main-movie.js: Récupère et affiche les détails complets d'un film à partir de son ID IMDb
switcher.js: Gère le changement de thème avec persistance dans localStorage
api/omdb.js: Module d'intégration avec l'API OMDb, centralise tous les appels API
ui/cards.js: Composants réutilisables pour générer les cartes de films (format large et small)
format.js: Fonctions utilitaires pour le formatage des dates et le debouncing

Système de styles

base.css: Styles de base, navigation, footer et composants partagés
index.css: Styles spécifiques à la page d'accueil (hero, grille de films, animations)
search.css: Styles de la page de recherche (barre de recherche, résultats, états vides)
movie.css: Styles de la page détails (mise en page, badges de notes, informations)
themes.css: Variables CSS et définition des 6 thèmes disponibles

Flux de données
Page d'accueil:

main-index.js charge une liste prédéfinie de films tendance
Pour chaque film, appel à searchMovies() puis getMovieById() via api/omdb.js
Les données sont mises en cache pendant 10 minutes
createMovieCardLarge() génère le HTML pour chaque carte
Chargement progressif par lots de 4 films avec préchargement anticipé

Page de recherche:

L'utilisateur tape une requête dans le champ de recherche
Après 400ms (debounce), appel à searchMovies() avec la requête
Les résultats sont affichés avec createMovieCardSmall()
Bouton "Charger plus" pour récupérer les pages suivantes
État vide affiché si aucun résultat n'est trouvé

Page détails:

L'ID IMDb est récupéré depuis l'URL (?i=tt1234567)
Appel à getMovieById() pour obtenir toutes les informations
Rendu des détails : poster, titre, synopsis, casting, notes, etc.
Gestion des données manquantes avec affichage de "Non disponible"

API OMDb
Endpoints utilisés
Recherche de films
GET http://www.omdbapi.com/?s={query}&page={page}&apikey={key}
Détails d'un film
GET http://www.omdbapi.com/?i={imdbID}&apikey={key}
Limites de l'API

Plan gratuit : 1000 requêtes par jour
Rate limiting appliqué côté serveur
Cache implémenté côté client pour minimiser les appels

Système de cache
L'application utilise un système de cache en mémoire pour optimiser les performances :

Durée de vie : 10 minutes
Limite : 50 entrées maximum
Stratégie : FIFO (First In, First Out)
Clés de cache : movie-{titre} pour les films

Optimisations de performance
Lazy loading des images

Les posters de films sont chargés uniquement quand ils sont visibles
Attribut loading="lazy" sur toutes les images

Debouncing de la recherche

Délai de 400ms avant l'exécution de la recherche
Évite les appels API inutiles pendant la frappe

Batch loading

Chargement par lots de 4 films sur la page d'accueil
Préchargement du lot suivant en arrière-plan

Retry automatique

Jusqu'à 2 réessais en cas d'échec d'une requête API
Délai exponentiel entre les tentatives

Skeleton loaders

Affichage de placeholders animés pendant le chargement
Améliore la perception de performance

Système de thèmes
6 thèmes disponibles:

Dark Purple (par défaut)
Cyber Blue
Neon Pink
Forest Green
Sunset Orange
Midnight Blue

Fonctionnement:

Variables CSS personnalisées pour chaque thème
Changement instantané via data-theme sur l'élément <body>
Persistance dans localStorage
Boutons de sélection dans le footer de chaque page

Build et déploiement
Vite compile l'application en :

Regroupant tous les modules JavaScript
Minifiant le CSS et le JavaScript
Optimisant les images et les assets
Générant des fichiers avec hash pour le cache navigateur
Créant 3 points d'entrée : index.html, search.html, movie.html

Le dossier dist/ contient l'application prête pour la production.
Objectif du projet
L'objectif principal est de créer une application web moderne, performante et élégante permettant d'explorer le monde du cinéma tout en démontrant les meilleures pratiques de développement web front-end, incluant l'optimisation des performances, l'accessibilité, le design responsive et l'intégration d'API externes.
Fonctionnalités avancées
Interface utilisateur

Design moderne avec gradients et glassmorphisme
Animations et transitions fluides
Hover effects sur tous les éléments interactifs
États de chargement avec spinners et skeleton cards
Notifications toast pour les actions réussies/échouées
Barre de navigation sticky avec effet de scroll

Accessibilité

Attributs ARIA pour les lecteurs d'écran
Navigation au clavier complète
Contraste optimisé (WCAG AA)
Labels descriptifs pour tous les éléments
Support de l'impression avec styles dédiés
Focus visible sur tous les éléments interactifs

Responsive design

Mobile-first approach
Breakpoints : 480px, 768px, 1024px
Grilles adaptatives avec CSS Grid
Images responsive avec aspect-ratio
Menu de navigation adaptatif

Gestion des erreurs

Messages d'erreur clairs et informatifs
Fallbacks pour les images manquantes
Gestion des données indisponibles
Retry automatique en cas d'échec API
États vides personnalisés

Améliorations futures possibles

Système de favoris avec localStorage
Filtres avancés (genre, année, note)
Mode liste/grille
Partage social des films
PWA avec support offline
Internationalisation (i18n)
Mode clair en plus des thèmes sombres
Historique de recherche
Recommandations personnalisées
Comparaison de films côte à côte
Export des résultats en PDF
Intégration avec d'autres API (TMDb, TVDb)

Contribution
Les contributions sont les bienvenues. Pour contribuer :

Fork le projet
Créer une branche (git checkout -b feature/amelioration)
Commit les modifications (git commit -m 'Ajout fonctionnalité')
Push vers la branche (git push origin feature/amelioration)
Ouvrir une Pull Request

Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
Crédits

Données fournies par OMDb API
Polices par Google Fonts (Inter)
Icônes SVG custom
Build tool : Vite

Support
Pour toute question ou problème, veuillez ouvrir une issue sur GitHub ou contacter l'équipe de développement.

Développé avec passion pour offrir la meilleure expérience de découverte de films.
CineScope
Site web moderne de recherche et de découverte de films, alimentée par l'API OMDb. CineScope offre une expérience utilisateur fluide et élégante pour explorer des milliers de films avec des informations détaillées.
Caractéristiques principales
Interface utilisateur

Design moderne et responsive : Interface adaptative qui fonctionne parfaitement sur tous les appareils (mobile, tablette, desktop)
6 thèmes visuels : Choix entre Dark Purple, Cyber Blue, Neon Pink, Forest Green, Sunset Orange et Midnight Blue
Animations fluides : Transitions et micro-animations pour une expérience utilisateur premium
Mode sombre : Tous les thèmes sont optimisés pour le confort visuel

Fonctionnalités
Page d'accueil

Affichage d'une sélection de films tendance
Chargement progressif par batch de 4 films
Système de cache intelligent pour optimiser les performances
Préchargement des données pour une navigation fluide
Notifications visuelles pour les actions utilisateur

Page de recherche

Recherche en temps réel avec debounce (400ms)
Affichage du nombre total de résultats
Pagination avec bouton "Charger plus"
État vide personnalisé quand aucun résultat n'est trouvé
Bouton d'effacement rapide de la recherche
Raccourci clavier Échap pour réinitialiser la recherche

Page détails du film

Informations complètes : titre, synopsis, réalisateur, acteurs, durée, etc.
Affichage des notes provenant de multiples sources (IMDb, Rotten Tomatoes, Metacritic)
Mise en page responsive avec grille adaptative
Gestion des erreurs et des données manquantes

Technologies utilisées

HTML5 : Structure sémantique
CSS3 : Animations, Grid Layout, Flexbox, Variables CSS
JavaScript ES6+ : Modules, Async/Await, Promises
Vite : Build tool et serveur de développement
OMDb API : Base de données de films

Installation

Cloner le repository

bashgit clone https://github.com/abdessamad-26/Cinema
cd cinescope

Installer les dépendances

bashnpm install

Configurer la clé API
Modifier le fichier src/config.js avec votre clé API OMDb :

javascriptexport const OMDB_API_KEY = "votre_cle_api";
Développement
Lancer le serveur de développement :
bashnpm run dev
L'application sera accessible sur http://localhost:5173
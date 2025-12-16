<div align="center">

<img width="180" title="CineScope" alt="Logo CineScope" src="https://moodle.supinfo.com/pluginfile.php/1/theme_moove/logo/1765241933/logoSUPINFO2.png" />

# **CineScope**

**Application web moderne de recherche et de découverte de films**, alimentée par l'API **OMDb**.
CineScope offre une expérience utilisateur fluide et élégante pour explorer des milliers de films avec des informations détaillées, incluant **des thèmes personnalisables**, **une recherche en temps réel** et **des pages de détails complètes**.

</div>

---

## **Télécharger**

Télécharger le programme depuis le dépôt GitHub.

---

## **Configuration système requise**

| Configuration minimale | Configuration recommandée                 |
| ---------------------- | ----------------------------------------- |
| Navigateur moderne     | Navigateur récent (Chrome, Firefox, Edge) |
| Connexion Internet     | Connexion Internet stable                 |
| Node.js ≥ 16           | Node.js ≥ 18                              |

---

> [!NOTE]
> L'application nécessite une **clé API OMDb gratuite** pour fonctionner.
> Vous pouvez en obtenir une sur **omdbapi.com/apikey.aspx**.

> [!CAUTION]
> Une **connexion Internet active** est requise pour récupérer les données depuis l'API OMDb.

---

## **Scripts et commandes npm**

| Commande    | Description |
| ----------- | ----------- |
| ```bash     |             |
| npm run dev |             |

````| Lance le serveur de développement avec rechargement automatique |
| ```bash
npm run build
``` | Génère la version de production |
| ```bash
npm install
``` | Installe toutes les dépendances du projet |

---

## **Installation**

### **1. Récupération du code source**

```bash
git clone https://github.com/abdessamad-26/Cinema
````

Ou téléchargez directement l'archive ZIP depuis GitHub.

---

### **2. Accéder au dossier du projet**

```bash
cd Cinema
```

---

### **3. Installer les dépendances**

```bash
npm install
```

---

### **4. Configuration de la clé API OMDb**

Dans le fichier `src/config.js` :

```javascript
export const OMDB_API_KEY = "VOTRE_CLE_API";
```

---

### **5. Lancer l'application**

```bash
npm run dev
```

Ouvrez ensuite votre navigateur à l'adresse suivante :
**[http://localhost:5173](http://localhost:5173)**

---

## **Fonctionnement de l'application**

### **Aperçu général**

CineScope est une application web qui communique avec l'API **OMDb** pour récupérer et afficher des informations détaillées sur les films.
Elle repose sur une **architecture modulaire moderne** et utilise **Vite** pour le développement et la compilation.

---

## **Architecture de l'application**

### **Structure des pages**

* **index.html**
  Page d'accueil affichant une sélection de films tendance avec chargement progressif

* **search.html**
  Page de recherche avec saisie en temps réel et pagination

* **movie.html**
  Page de détails affichant toutes les informations d'un film spécifique

---

### **Modules JavaScript**

* **main-index.js**
  Gestion de la page d'accueil, chargement par lots et cache

* **main-search.js**
  Recherche en temps réel avec debounce et pagination

* **main-movie.js**
  Récupération et affichage des détails d'un film via son ID IMDb

* **switcher.js**
  Gestion des thèmes avec persistance via `localStorage`

* **api/omdb.js**
  Centralisation des appels à l'API OMDb

* **ui/cards.js**
  Composants réutilisables pour l'affichage des films

* **format.js**
  Fonctions utilitaires (formatage, debounce)

---

## **Système de styles**

* **base.css** : styles globaux, navigation et footer
* **index.css** : styles de la page d'accueil
* **search.css** : styles de la page de recherche
* **movie.css** : styles de la page de détails
* **themes.css** : variables CSS et thèmes

---

## **Flux de données**

### **Page d'accueil**

* Chargement d'une liste de films tendance
* Appels à `searchMovies()` puis `getMovieById()`
* Mise en cache des données pendant 10 minutes
* Génération des cartes via `createMovieCardLarge()`
* Chargement progressif par lots de 4 films

---

### **Page de recherche**

* Saisie utilisateur dans le champ de recherche
* Délai de 400 ms (debounce)
* Appel à `searchMovies()`
* Affichage via `createMovieCardSmall()`
* Bouton "Charger plus" pour la pagination
* État vide si aucun résultat

---

### **Page détails**

* Récupération de l'ID IMDb depuis l'URL :

```text
?i=tt1234567
```

* Appel à `getMovieById()`
* Affichage des informations : poster, synopsis, casting, notes
* Gestion des données manquantes avec la mention "Non disponible"

---

## **API OMDb**

### **Endpoints utilisés**

**Recherche de films**

```http
GET http://www.omdbapi.com/?s={query}&page={page}&apikey={key}
```

**Détails d'un film**

```http
GET http://www.omdbapi.com/?i={imdbID}&apikey={key}
```

---

### **Limites de l'API**

* Plan gratuit : 1000 requêtes par jour
* Rate limiting côté serveur
* Cache client pour réduire le nombre d'appels

---

## **Système de thèmes**

### **Thèmes disponibles**

* Dark Purple (par défaut)
* Cyber Blue
* Neon Pink
* Forest Green
* Sunset Orange
* Midnight Blue

---

### **Fonctionnement**

* Variables CSS personnalisées pour chaque thème
* Changement via l'attribut `data-theme` sur l'élément `<body>`
* Persistance du thème avec `localStorage`
* Sélecteur de thème disponible dans le footer

---

CineScope permet une exploration claire, structurée et moderne d’un large catalogue de films en ligne.

---

## **Bonnes pratiques et performances**

* Architecture modulaire facilitant la maintenance et l’évolution du projet
* Séparation claire entre logique métier, appels API et composants UI
* Mise en cache côté client pour limiter les requêtes réseau
* Chargement progressif améliorant la performance perçue
* Gestion des erreurs et des données manquantes

---

## **Sécurité et configuration**

* La clé API OMDb doit rester confidentielle
* Il est recommandé d’utiliser des variables d’environnement pour la production
* Aucune donnée utilisateur sensible n’est stockée

---

## **Limites connues**

* Dépendance à l’API OMDb et à ses quotas journaliers
* Nécessite une connexion Internet active
* Fonctionnalités hors ligne non prises en charge

---

## **Axes d’amélioration possibles**

* Authentification utilisateur
* Système de favoris
* Historique de recherche
* Filtrage avancé (année, genre, note)
* Internationalisation (i18n)

---

## **Licence**

Ce projet est fourni à des fins pédagogiques et de démonstration.

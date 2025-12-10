import { searchMovies, getMovieById } from './api/omdb.js';
import { createMovieCardLarge } from './ui/cards.js';

const TRENDING_TITLES = [
  'Guardians of the Galaxy',
  'Inception',
  'Spider-Man: Into the Spider-Verse',
  'Interstellar',
  'The Matrix',
  'The Dark Knight',
  'Pulp Fiction',
  'Fight Club'
];

const trendingGrid = document.getElementById('trending-grid');
const loadMoreBtn = document.getElementById('load-more-trending');

let displayed = 0;
const BATCH_SIZE = 3;

async function fetchMovieByTitle(title) {
  try {
    const res = await searchMovies(title, 1);
    
    if (res.Response === 'True' && Array.isArray(res.Search) && res.Search.length > 0) {
      const imdbID = res.Search[0].imdbID;
      const full = await getMovieById(imdbID);
      return full.Response === 'True' ? full : res.Search[0];
    }
    
    return null;
  } catch (error) {
    console.error(`Erreur lors du chargement du film "${title}":`, error);
    return null;
  }
}

async function loadNextBatch() {
  const next = TRENDING_TITLES.slice(displayed, displayed + BATCH_SIZE);
  
  if (next.length === 0) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.textContent = 'Tous les films chargés';
    return;
  }
  
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = 'Chargement...';
  
  try {
    const promises = next.map(title => fetchMovieByTitle(title));
    const movies = await Promise.all(promises);
    
    movies.forEach(movie => {
      if (movie) {
        const card = createMovieCardLarge(movie, true);
        trendingGrid.appendChild(card);
      }
    });
    
    displayed += next.length;
    
    if (displayed >= TRENDING_TITLES.length) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = 'Tous les films chargés';
    } else {
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = 'Charger plus';
    }
  } catch (error) {
    console.error('Erreur lors du chargement des films:', error);
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = 'Réssayer';
  }
}

loadMoreBtn.addEventListener('click', loadNextBatch);

document.addEventListener('DOMContentLoaded', () => {
  loadNextBatch();
});
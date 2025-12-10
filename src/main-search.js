import { searchMovies } from './api/omdb.js';
import { createMovieCardSmall } from './ui/cards.js';
import { debounce } from './format.js';

const input = document.getElementById('search-input');
const grid = document.getElementById('search-grid');
const info = document.getElementById('search-results-info');
const loadMore = document.getElementById('load-more-search');
const clearBtn = document.getElementById('clear-search');
const form = document.getElementById('search-form');

let currentQuery = '';
let currentPage = 1;
let totalResults = 0;
let isLoading = false;

function showEmptyState() {
  grid.innerHTML = `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
      <h3>Aucun résultats Trouvés</h3>
      <p>Essayez avec un autre titre de film</p>
    </div>
  `;
}

function renderResults(results) {
  grid.innerHTML = '';
  
  if (!results || results.length === 0) {
    showEmptyState();
    info.textContent = '';
    loadMore.hidden = true;
    return;
  }

  info.textContent = `${totalResults} résultat${totalResults > 1 ? 's' : ''} trouvés${totalResults > 1 ? 's' : ''}`;
  info.classList.remove('loading');
  
  results.forEach(movie => {
    const card = createMovieCardSmall(movie);
    grid.appendChild(card);
  });

  const hasMoreResults = currentPage * 10 < totalResults;
  loadMore.hidden = !hasMoreResults;
}

function appendResults(results) {
  if (!results || results.length === 0) return;

  results.forEach(movie => {
    const card = createMovieCardSmall(movie);
    grid.appendChild(card);
  });

  const hasMoreResults = currentPage * 10 < totalResults;
  loadMore.hidden = !hasMoreResults;
  info.textContent = `${Math.min(currentPage * 10, totalResults)} résultat${totalResults > 1 ? 's' : ''} sur ${totalResults}`;
}

async function performSearch(query, page = 1) {
  if (!query || isLoading) {
    if (!query) {
      grid.innerHTML = '';
      info.textContent = '';
      loadMore.hidden = true;
    }
    return;
  }

  isLoading = true;
  loadMore.disabled = true;
  
  if (page === 1) {
    grid.innerHTML = '';
    info.textContent = 'Recherche en cours...';
    info.classList.add('loading');
  } else {
    loadMore.textContent = 'Chargement...';
  }

  try {
    const response = await searchMovies(query, page);

    if (response.Response === 'True') {
      totalResults = parseInt(response.totalResults || '0', 10);
      
      if (page === 1) {
        renderResults(response.Search);
      } else {
        appendResults(response.Search);
      }
    } else {
      if (page === 1) {
        showEmptyState();
        info.textContent = response.Error || 'Aucun film trouvé';
        info.classList.remove('loading');
      }
      loadMore.hidden = true;
    }
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    info.textContent = 'Une erreur est survenue. Veuillez réssayer.';
    info.classList.remove('loading');
    loadMore.hidden = true;
  } finally {
    isLoading = false;
    loadMore.disabled = false;
    loadMore.textContent = 'Charger plus de résultats';
  }
}

const debouncedSearch = debounce((event) => {
  const query = event.target.value.trim();
  currentQuery = query;
  currentPage = 1;
  
  clearBtn.hidden = !query;
  
  performSearch(query, currentPage);
}, 400);

input.addEventListener('input', debouncedSearch);

input.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    input.value = '';
    currentQuery = '';
    grid.innerHTML = '';
    info.textContent = '';
    loadMore.hidden = true;
    clearBtn.hidden = true;
    input.blur();
  }
});

clearBtn.addEventListener('click', () => {
  input.value = '';
  currentQuery = '';
  grid.innerHTML = '';
  info.textContent = '';
  loadMore.hidden = true;
  clearBtn.hidden = true;
  input.focus();
});

loadMore.addEventListener('click', async () => {
  if (!currentQuery || isLoading) return;
  
  currentPage++;
  await performSearch(currentQuery, currentPage);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
});

document.addEventListener('DOMContentLoaded', () => {
  input.focus();
});
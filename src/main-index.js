import { searchMovies, getMovieById } from './api/omdb.js';
import { createMovieCardLarge, createSkeletonCard } from './ui/cards.js';

const TRENDING_TITLES = [
  'Guardians of the Galaxy',
  'Inception',
  'Spider-Man: Into the Spider-Verse',
  'Interstellar',
  'The Matrix',
  'The Dark Knight',
  'Pulp Fiction',
  'Fight Club',
  'The Shawshank Redemption',
  'Forrest Gump',
  'The Godfather',
  'Parasite'
];

const trendingGrid = document.getElementById('trending-grid');
const loadMoreBtn = document.getElementById('load-more-trending');

let displayed = 0;
const BATCH_SIZE = 4;

const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000;

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;

  if (Date.now() - item.timestamp > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return item.data;
}

function setCache(key, data) {
  cache.set(key, { data, timestamp: Date.now() });

  if (cache.size > 50) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
}

function showNotification(message, type = 'error') {
  document.querySelectorAll('.notification').forEach(el => el.remove());

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    max-width: 400px;
    padding: 1rem 1.5rem;
    background: ${type === 'error'
      ? 'linear-gradient(135deg, #ef4444, #dc2626)'
      : 'linear-gradient(135deg, #10b981, #059669)'};
    color: white;
    border-radius: 12px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    display: flex;
    align-items: center;
    gap: 1rem;
    font-weight: 500;
  `;

  notification.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      ${type === 'error'
        ? '<circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
        : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'}
    </svg>
    <span>${message}</span>
    <button onclick="this.parentElement.remove()"
      style="margin-left:auto;background:none;border:none;color:white;font-size:1.5rem;cursor:pointer;opacity:.8;">×</button>
  `;

  if (!document.querySelector('style[data-notification]')) {
    const style = document.createElement('style');
    style.setAttribute('data-notification', '');
    style.textContent = `
      @keyframes slideInRight {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideInRight 0.3s ease reverse';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

async function withRetry(fn, retries = 2, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, delay * (i + 1)));
    }
  }
}

function showSkeletonCards(count) {
  for (let i = 0; i < count; i++) {
    trendingGrid.appendChild(createSkeletonCard('large'));
  }
}

function removeSkeletonCards() {
  document.querySelectorAll('.skeleton-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'scale(0.9)';
    el.style.transition = 'all 0.3s ease';
    setTimeout(() => el.remove(), 300);
  });
}

async function fetchMovieByTitle(title) {
  const cacheKey = `movie-${title}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  try {
    const movie = await withRetry(async () => {
      const res = await searchMovies(title, 1);

      if (res.Response === 'True' && res.Search?.length) {
        const imdbID = res.Search[0].imdbID;
        const full = await getMovieById(imdbID);
        return full.Response === 'True' ? full : res.Search[0];
      }

      throw new Error();
    });

    if (movie) setCache(cacheKey, movie);
    return movie;
  } catch {
    return null;
  }
}

async function loadNextBatch() {
  const next = TRENDING_TITLES.slice(displayed, displayed + BATCH_SIZE);

  if (!next.length) {
    loadMoreBtn.disabled = true;
    loadMoreBtn.innerHTML = `
      <span class="btn-text">Tous les films chargés</span>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    `;
    return;
  }

  loadMoreBtn.disabled = true;
  const original = loadMoreBtn.innerHTML;
  loadMoreBtn.innerHTML = `
    <div style="width:20px;height:20px;border:3px solid rgba(255,255,255,.3);
    border-top-color:white;border-radius:50%;animation:spin .8s linear infinite;"></div>
    <span class="btn-text">Chargement...</span>
  `;

  if (!document.querySelector('style[data-spin]')) {
    const style = document.createElement('style');
    style.setAttribute('data-spin', '');
    style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
    document.head.appendChild(style);
  }

  showSkeletonCards(next.length);

  try {
    const movies = await Promise.all(next.map(fetchMovieByTitle));
    await new Promise(r => setTimeout(r, 500));
    removeSkeletonCards();
    await new Promise(r => setTimeout(r, 300));

    movies.forEach((movie, i) => {
      if (!movie) return;
      const card = createMovieCardLarge(movie, true);
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
      trendingGrid.appendChild(card);

      setTimeout(() => {
        card.style.transition = 'all 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 100);
    });

    displayed += next.length;

    if (displayed >= TRENDING_TITLES.length) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.innerHTML = original;
    } else {
      loadMoreBtn.disabled = false;
      loadMoreBtn.innerHTML = original;
    }

    const count = movies.filter(Boolean).length;
    if (count) showNotification(`${count} film${count > 1 ? 's' : ''} chargé${count > 1 ? 's' : ''}`, 'success');
  } catch {
    removeSkeletonCards();
    showNotification('Erreur lors du chargement. Veuillez réessayer.');
    loadMoreBtn.disabled = false;
    loadMoreBtn.innerHTML = original;
  }
}

loadMoreBtn.addEventListener('click', loadNextBatch);

let isPreloading = false;
window.addEventListener('scroll', () => {
  if (isPreloading) return;

  if (
    window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 800 &&
    !loadMoreBtn.disabled &&
    displayed < TRENDING_TITLES.length
  ) {
    isPreloading = true;
    loadNextBatch().finally(() => (isPreloading = false));
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadNextBatch();

  setTimeout(() => {
    TRENDING_TITLES.slice(BATCH_SIZE, BATCH_SIZE * 2).forEach(fetchMovieByTitle);
  }, 2000);
});

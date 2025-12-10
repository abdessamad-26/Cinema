import { getMovieById } from './api/omdb.js';
import { formatDateFR } from './format.js';

const article = document.getElementById('movie-article');

function createLabelledRow(label, value) {
  const row = document.createElement('div');
  row.className = 'meta-row';
  
  const strong = document.createElement('strong');
  strong.textContent = label + ' :';
  
  const span = document.createElement('span');
  span.textContent = value && value !== 'N/A' ? value : 'Non disponible';
  
  row.appendChild(strong);
  row.appendChild(span);
  
  return row;
}

function renderMovie(data) {
  if (!data || data.Response === 'False') {
    article.innerHTML = `
      <div class="error-message">
        <p>Film introuvable</p>
        ${data?.Error ? `<p>${data.Error}</p>` : ''}
      </div>
    `;
    return;
  }

  const container = document.createElement('div');
  container.className = 'movie-article';

  const top = document.createElement('div');
  top.className = 'movie-top';

  const img = document.createElement('img');
  img.src = data.Poster && data.Poster !== 'N/A' ? data.Poster : '/assets/placeholder.png';
  img.alt = data.Title ? `Affiche de ${data.Title}` : 'Affiche indisponible';
  img.loading = 'lazy';
  top.appendChild(img);

  const info = document.createElement('div');
  info.className = 'movie-info';

  const h2 = document.createElement('h2');
  h2.textContent = data.Title || 'Titre inconnu';
  info.appendChild(h2);

  if (data.Genre || data.Released) {
    const meta = document.createElement('div');
    meta.className = 'meta';
    const parts = [];
    if (data.Genre && data.Genre !== 'N/A') parts.push(data.Genre);
    if (data.Released && data.Released !== 'N/A') parts.push(data.Released);
    meta.textContent = parts.join(' Â· ');
    info.appendChild(meta);
  }

  if (data.Plot && data.Plot !== 'N/A') {
    const plot = document.createElement('div');
    plot.className = 'plot';
    plot.textContent = data.Plot;
    info.appendChild(plot);
  }

  const detailsSection = document.createElement('div');
  detailsSection.className = 'details-section';

  if (data.Director && data.Director !== 'N/A') {
    detailsSection.appendChild(createLabelledRow('Réalisateur', data.Director));
  }

  if (data.Actors && data.Actors !== 'N/A') {
    detailsSection.appendChild(createLabelledRow('Acteurs', data.Actors));
  }

  if (data.Runtime && data.Runtime !== 'N/A') {
    detailsSection.appendChild(createLabelledRow('Durée', data.Runtime));
  }

  if (data.Country && data.Country !== 'N/A') {
    detailsSection.appendChild(createLabelledRow('Pays', data.Country));
  }

  if (data.Language && data.Language !== 'N/A') {
    detailsSection.appendChild(createLabelledRow('Langue', data.Language));
  }

  if (data.DVD && data.DVD !== 'N/A') {
    detailsSection.appendChild(createLabelledRow('Sortie DVD', formatDateFR(data.DVD)));
  }

  if (detailsSection.children.length > 0) {
    info.appendChild(detailsSection);
  }

  if (Array.isArray(data.Ratings) && data.Ratings.length > 0) {
    const ratings = document.createElement('div');
    ratings.className = 'ratings';
    
    data.Ratings.forEach(rating => {
      const badge = document.createElement('div');
      badge.className = 'rating-badge';
      badge.textContent = `${rating.Source} : ${rating.Value}`;
      badge.setAttribute('title', `Note ${rating.Source}`);
      ratings.appendChild(badge);
    });
    
    info.appendChild(ratings);
  }

  top.appendChild(info);
  container.appendChild(top);

  article.innerHTML = '';
  article.appendChild(container);
}

function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

async function init() {
  const id = getQueryParam('i');
  
  if (!id) {
    article.innerHTML = `
      <div class="error-message">
        <p>Identifiant du film manquant</p>
        <p>Utilisez un lien depuis la recherche ou l'accueil.</p>
      </div>
    `;
    return;
  }

  try {
    const data = await getMovieById(id);
    renderMovie(data);
  } catch (error) {
    console.error('Erreur lors du chargement du film:', error);
    article.innerHTML = `
      <div class="error-message">
        <p>Erreur lors du chargement du film</p>
        <p>Veuillez réessayer ultérieurement.</p>
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', init);
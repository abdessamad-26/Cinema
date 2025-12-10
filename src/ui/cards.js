export function createMovieCardSmall(movie) {
  const container = document.createElement('article');
  container.className = 'result-card';
  container.tabIndex = 0;

  const img = document.createElement('img');
  img.alt = movie.Title ? `Affiche de ${movie.Title}` : 'Affiche indisponible';
  img.src = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : '/assets/placeholder.png';
  container.appendChild(img);

  const meta = document.createElement('div');

  const title = document.createElement('h4');
  title.textContent = movie.Title;
  meta.appendChild(title);

  const year = document.createElement('div');
  year.textContent = movie.Year ?? '';
  year.style.color = 'var(--muted)';
  meta.appendChild(year);

  const link = document.createElement('a');
  link.href = `movie.html?i=${movie.imdbID}`;
  link.textContent = 'En savoir plus';
  link.setAttribute('aria-label', `En savoir plus sur ${movie.Title}`);
  link.style.display = 'inline-block';
  link.style.marginTop = '0.5rem';
  meta.appendChild(link);

  container.appendChild(meta);
  return container;
}

export function createMovieCardLarge(movie, showSummary = false) {
  const card = document.createElement('div');
  card.className = 'movie-card';

  const img = document.createElement('img');
  img.alt = movie.Title ? `Affiche de ${movie.Title}` : 'Affiche indisponible';
  img.src = movie.Poster && movie.Poster !== 'N/A' ? movie.Poster : '/assets/placeholder.png';
  card.appendChild(img);

  const h = document.createElement('h3');
  h.textContent = movie.Title;
  card.appendChild(h);

  if (showSummary && movie.Plot) {
    const p = document.createElement('p');
    p.textContent = movie.Plot.length > 140 ? movie.Plot.slice(0, 140) + '…' : movie.Plot;
    card.appendChild(p);
  }

  const actions = document.createElement('div');
  actions.className = 'card-actions';
  const link = document.createElement('a');
  link.href = `movie.html?i=${movie.imdbID}`;
  link.textContent = 'En savoir plus';
  actions.appendChild(link);

  card.appendChild(actions);
  return card;
}

const imageObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      if (!img.dataset.src) return;

      img.src = img.dataset.src;
      img.removeAttribute('data-src');
      img.classList.add('loaded');
      imageObserver.unobserve(img);
    });
  },
  {
    rootMargin: '50px',
    threshold: 0.1
  }
);

export function createMovieCardSmall(movie) {
  const container = document.createElement('article');
  container.className = 'result-card';
  container.tabIndex = 0;
  container.setAttribute('role', 'article');
  container.setAttribute(
    'aria-label',
    `Film: ${movie.Title}, ${movie.Year || 'année inconnue'}`
  );

  const img = document.createElement('img');
  img.alt = movie.Title ? `Affiche de ${movie.Title}` : 'Affiche indisponible';

  if (movie.Poster && movie.Poster !== 'N/A') {
    img.dataset.src = movie.Poster;
    img.src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150"%3E%3Crect fill="%236366f1" width="100" height="150"/%3E%3C/svg%3E';
    imageObserver.observe(img);
  } else {
    img.src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 150"%3E%3Crect fill="%23333" width="100" height="150"/%3E%3Ctext x="50" y="75" text-anchor="middle" fill="%23666" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
  }

  container.appendChild(img);

  const meta = document.createElement('div');

  const title = document.createElement('h4');
  title.textContent = movie.Title;
  meta.appendChild(title);

  if (movie.Year) {
    const year = document.createElement('div');
    year.textContent = movie.Year;
    year.style.color = 'var(--color-text-muted)';
    meta.appendChild(year);
  }

  const link = document.createElement('a');
  link.href = `movie.html?i=${movie.imdbID}`;
  link.textContent = 'En savoir plus';
  link.setAttribute('aria-label', `En savoir plus sur ${movie.Title}`);
  meta.appendChild(link);

  container.appendChild(meta);

  container.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = link.href;
    }
  });

  let timeoutId;
  container.addEventListener('mouseenter', () => {
    clearTimeout(timeoutId);
    container.style.setProperty('--hover-delay', '0ms');
  });

  container.addEventListener('mouseleave', () => {
    timeoutId = setTimeout(() => {
      container.style.removeProperty('--hover-delay');
    }, 300);
  });

  return container;
}

export function createMovieCardLarge(movie, showSummary = false) {
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.tabIndex = 0;
  card.setAttribute('role', 'article');
  card.setAttribute('aria-label', `Film: ${movie.Title}`);

  const img = document.createElement('img');
  img.alt = movie.Title ? `Affiche de ${movie.Title}` : 'Affiche indisponible';

  if (movie.Poster && movie.Poster !== 'N/A') {
    img.dataset.src = movie.Poster;
    img.src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%236366f1" width="200" height="300"/%3E%3C/svg%3E';
    imageObserver.observe(img);
  } else {
    img.src =
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 300"%3E%3Crect fill="%23333" width="200" height="300"/%3E%3Ctext x="100" y="150" text-anchor="middle" fill="%23666" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
  }

  card.appendChild(img);

  const h3 = document.createElement('h3');
  h3.textContent = movie.Title;
  card.appendChild(h3);

  if (showSummary && movie.Plot && movie.Plot !== 'N/A') {
    const p = document.createElement('p');
    p.textContent =
      movie.Plot.length > 140
        ? `${movie.Plot.slice(0, 140)}…`
        : movie.Plot;
    card.appendChild(p);
  }

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const link = document.createElement('a');
  link.href = `movie.html?i=${movie.imdbID}`;
  link.textContent = 'Voir les détails';
  link.setAttribute(
    'aria-label',
    `Voir les détails de ${movie.Title}`
  );
  actions.appendChild(link);

  card.appendChild(actions);

  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      window.location.href = link.href;
    }
  });

  let timeoutId;
  card.addEventListener('mouseenter', () => {
    clearTimeout(timeoutId);
    card.style.setProperty('--hover-scale', '1.02');
  });

  card.addEventListener('mouseleave', () => {
    timeoutId = setTimeout(() => {
      card.style.removeProperty('--hover-scale');
    }, 300);
  });

  return card;
}

export function createSkeletonCard(type = 'large') {
  const skeleton = document.createElement('div');
  skeleton.className =
    type === 'small'
      ? 'result-card skeleton-card'
      : 'movie-card skeleton-card';
  skeleton.setAttribute('aria-hidden', 'true');

  if (type === 'small') {
    skeleton.innerHTML = `
      <div class="skeleton skeleton-poster-small"></div>
      <div style="flex: 1; display: flex; flex-direction: column; gap: 0.5rem;">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-year"></div>
      </div>
    `;
  } else {
    skeleton.innerHTML = `
      <div class="skeleton skeleton-poster"></div>
      <div class="skeleton skeleton-title"></div>
      <div class="skeleton skeleton-text"></div>
      <div class="skeleton skeleton-text" style="width: 60%;"></div>
    `;
  }

  return skeleton;
}

export { imageObserver };

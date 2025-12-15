export function debounce(fn, wait = 300) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

export function formatDateFR(dateStr) {
  if (!dateStr || dateStr === 'N/A') return 'N/A';

  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;

  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();

  return `${dd}/${mm}/${yyyy}`;
}

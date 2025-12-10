/**
 * Debounce simple — retourne une fonction mémorisée
 * @param {Function} fn 
 * @param {number} wait 
 */
export function debounce(fn, wait = 300) {
  let t;
  return function (...args) {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * format date OMDb (ex: "12 Jun 2012" or "N/A") -> "jj/mm/aaaa"
 * Si date invalide, renvoie la chaîne d'entrée.
 * @param {string} dateStr
 */
export function formatDateFR(dateStr) {
  if (!dateStr || dateStr === 'N/A') return 'N/A';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

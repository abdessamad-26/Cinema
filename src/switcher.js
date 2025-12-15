(function () {
  'use strict';

  try {
    const THEMES = [
      'dark-purple',
      'cyber-blue',
      'neon-pink',
      'forest-green',
      'sunset-orange',
      'midnight-blue'
    ];

    const STORAGE_KEY = 'moviedb-theme';
    const DEFAULT_THEME = 'dark-purple';

    function loadTheme() {
      try {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;
      } catch {
        return DEFAULT_THEME;
      }
    }

    function applyTheme(theme) {
      if (!document.body) return;
      if (!THEMES.includes(theme)) theme = DEFAULT_THEME;
      document.body.setAttribute('data-theme', theme);
    }

    function init() {
      if (!document.body) return;

      const theme = loadTheme();
      applyTheme(theme);

      const buttons = document.querySelectorAll('.theme-btn[data-theme]');
      if (!buttons.length) return;

      buttons.forEach(btn => {
        btn.addEventListener('click', () => {
          const theme = btn.dataset.theme;
          if (!THEMES.includes(theme)) return;

          applyTheme(theme);
          try {
            localStorage.setItem(STORAGE_KEY, theme);
          } catch {}
        });
      });
    }

    document.addEventListener('DOMContentLoaded', init);

  } catch (e) {
    console.error('Theme switcher désactivé (sécurité):', e);
  }
})();

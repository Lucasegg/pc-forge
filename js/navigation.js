// ============================================================
// PC FORGE - Navigation Controller
// External by design so Content Security Policy blocks inline JS.
// ============================================================

(() => {
  'use strict';

  const navigationMap = Object.freeze({
    'nav-home': 'btn-back-home',
    'nav-wizard': 'btn-start',
    'nav-manual': 'btn-manual',
    'nav-faq': 'btn-faq-nav',
    'nav-contact': 'btn-contact-nav',
    'nav-wizard-m': 'btn-start',
    'nav-manual-m': 'btn-manual',
    'nav-faq-m': 'btn-faq-nav',
    'nav-contact-m': 'btn-contact-nav'
  });

  function closeMenu() {
    document.getElementById('nav-mobile')?.classList.remove('open');
  }

  function navigateTo(buttonId) {
    closeMenu();
    const existing = document.getElementById(buttonId);
    if (existing) {
      existing.click();
      return;
    }

    const app = document.getElementById('app');
    if (!app || !Object.values(navigationMap).includes(buttonId)) return;

    const bridge = document.createElement('button');
    bridge.id = buttonId;
    bridge.hidden = true;
    app.appendChild(bridge);
    bridge.click();
    bridge.remove();
  }

  document.getElementById('nav-toggle')?.addEventListener('click', () => {
    document.getElementById('nav-mobile')?.classList.toggle('open');
  });

  Object.entries(navigationMap).forEach(([navigationId, buttonId]) => {
    document.getElementById(navigationId)?.addEventListener('click', () => {
      navigateTo(buttonId);
    });
  });

  document.querySelectorAll('[data-policy]').forEach(button => {
    button.addEventListener('click', () => {
      closeMenu();
      App.openPolicy(button.dataset.policy);
    });
  });

  document.getElementById('footer-contact')?.addEventListener('click', () => {
    navigateTo('btn-contact-nav');
  });

  document.addEventListener('keydown', event => {
    if (event.ctrlKey && event.key.toLowerCase() === 'b') {
      event.preventDefault();
      navigateTo('btn-start');
    }
  });
})();

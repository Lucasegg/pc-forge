// ============================================================
// PC FORGE - Anonymous Activity Monitor
// No cookies, persistent identifiers, IP capture or personal data.
// ============================================================

const ActivityMonitor = (() => {
  'use strict';

  const endpoint = 'https://script.google.com/macros/s/AKfycbxl2Iv8iM5pdWsEzgbvnWQLOXIWvNUfoYocxUTUxLtXR10rbixsb4fqeIYx3cUmerd4/exec';
  const allowedEvents = new Set([
    'page_view',
    'build_started',
    'build_completed',
    'pdf_downloaded',
    'build_shared',
    'contact_opened',
    'contact_submitted',
    'application_error'
  ]);
  const allowedPages = new Set([
    'home', 'wizard', 'result', 'notebook', 'manual', 'contact', 'faq', 'policy'
  ]);
  const allowedModes = new Set(['', 'guiado', 'avancado', 'notebook']);
  const detailPattern = /^[a-z0-9_-]{0,80}$/i;
  let lastPageView = '';
  let lastPageViewAt = 0;

  function deviceCategory() {
    const width = window.innerWidth;
    if (width <= 640) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  }

  function track(eventName, options = {}) {
    const page = String(options.page || 'home');
    const mode = String(options.mode || '');
    const detail = String(options.detail || '');

    if (!allowedEvents.has(eventName)) return;
    if (!allowedPages.has(page)) return;
    if (!allowedModes.has(mode)) return;
    if (!detailPattern.test(detail)) return;

    const body = new URLSearchParams({
      event: eventName,
      page,
      mode,
      device: deviceCategory(),
      detail
    });

    try {
      if (navigator.sendBeacon && navigator.sendBeacon(endpoint, body)) return;
      fetch(endpoint, {
        method: 'POST',
        mode: 'no-cors',
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        body,
        keepalive: true
      }).catch(() => {});
    } catch {
      // Metrics must never interrupt the user's experience.
    }
  }

  function trackPage(page, mode = '', detail = '') {
    const signature = `${page}:${mode}:${detail}`;
    const now = Date.now();
    if (signature === lastPageView && now - lastPageViewAt < 1500) return;
    lastPageView = signature;
    lastPageViewAt = now;
    track('page_view', { page, mode, detail });
  }

  return Object.freeze({ track, trackPage });
})();

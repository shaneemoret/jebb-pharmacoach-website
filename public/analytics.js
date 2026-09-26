/* One consent-controlled GA4 installation shared by React and generated pages. */
(() => {
  if (window.pharmaAnalytics) return;
  const id = 'G-CE0YM7TDCH';
  const production = /^(www\.)?thepharmacoach\.com$/.test(location.hostname);
  const key = 'pharma-analytics-consent-v1';
  let consent = null;
  try { consent = localStorage.getItem(key); } catch { /* Storage can be disabled. */ }
  let loaded = false;
  let lastPage = null;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
  });
  function safeUrl(value) {
    try {
      const url = new URL(value, location.href);
      // Retain campaign attribution, never arbitrary form/contact query values.
      const clean = new URL(url.origin + url.pathname);
      for (const name of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'dclid', 'gbraid', 'wbraid']) {
        const value = url.searchParams.get(name);
        if (value && !/@|%40/i.test(value)) clean.searchParams.set(name, value);
      }
      return clean.href;
    } catch { return ''; }
  }
  function pageView() {
    if (!loaded || consent !== 'granted') return;
    const page = safeUrl(location.href);
    if (page === lastPage) return;
    lastPage = page;
    gtag('event', 'page_view', { page_location: page, page_referrer: safeUrl(document.referrer), page_title: document.title });
  }
  function load() {
    if (!production || loaded || consent !== 'granted') return;
    loaded = true;
    gtag('js', new Date());
    gtag('set', 'linker', { domains: ['thepharmacoach.com', 'medrepcollege.com'] });
    gtag('config', id, {
      send_page_view: false,
      page_location: safeUrl(location.href), page_referrer: safeUrl(document.referrer),
      allow_google_signals: false, allow_ad_personalization_signals: false,
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
    document.head.append(script);
    pageView();
  }
  function event(name, parameters) {
    if (loaded && consent === 'granted') gtag('event', name, { ...parameters, page_location: safeUrl(location.href) });
  }
  function choose(value) {
    consent = value;
    try { localStorage.setItem(key, value); } catch { /* Choice still applies to this page. */ }
    gtag('consent', 'update', { analytics_storage: value });
    if (value === 'granted') load();
    else if (loaded) {
      window['ga-disable-' + id] = true;
      for (const cookie of document.cookie.split(';')) {
        const name = cookie.trim().split('=')[0];
        if (!/^_ga(?:_|$)/.test(name)) continue;
        for (const domain of ['', ';domain=' + location.hostname, ';domain=.thepharmacoach.com']) {
          document.cookie = name + '=;Max-Age=0;path=/' + domain;
        }
      }
      // Reload stops an already-loaded tag and all automatic event listeners.
      location.reload();
    }
    document.getElementById('analytics-choice')?.setAttribute('hidden', '');
  }
  function showChoice() { document.getElementById('analytics-choice')?.removeAttribute('hidden'); }
  window.pharmaAnalytics = { event, pageView, showChoice };
  if (consent === 'granted') gtag('consent', 'update', { analytics_storage: 'granted' });
  function init() {
    const panel = document.createElement('section');
    panel.id = 'analytics-choice';
    panel.setAttribute('aria-label', 'Analytics preferences');
    panel.innerHTML = '<p>May we use Google Analytics to understand how visitors use this site? Optional analytics cookies help us improve it. <a href="https://medrepcollege.com/privacy">Privacy policy</a></p><div><button type="button" data-choice="denied">Decline</button><button type="button" data-choice="granted">Allow analytics</button></div>';
    panel.hidden = consent === 'granted' || consent === 'denied';
    panel.addEventListener('click', e => { const button = e.target.closest('[data-choice]'); if (button) choose(button.dataset.choice); });
    const settings = document.createElement('button');
    settings.type = 'button'; settings.id = 'analytics-settings'; settings.textContent = 'Cookie preferences';
    settings.addEventListener('click', showChoice);
    document.body.append(panel, settings);
    load();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    const locationName = link.closest('header') ? 'header' : link.closest('footer') ? 'footer' : 'body';
    const parameters = { link_url: url.origin + url.pathname, cta_location: locationName };
    if (url.hostname === 'medrepcollege.com') {
      if (/secure-your-spot|book-a-call/.test(url.pathname)) event('schedule_call_click', parameters);
      else if (/apply|application/.test(url.pathname)) event('application_click', parameters);
      else if (url.pathname === '/access') event('guide_request_click', parameters);
      else if (/checkout/.test(url.pathname)) event('enrollment_click', parameters);
    } else if (url.origin === location.origin && /^\/(academy|mastermind-accelerator|vip-signature-access)\/?$/.test(url.pathname)) {
      event('select_program', { ...parameters, program_name: url.pathname.replaceAll('/', '') });
    }
  });
  // Navigation currently uses normal anchors. Hash/accordion changes are not page views.
  // A future client router must call pharmaAnalytics.pageView() after setting the title.
  window.addEventListener('popstate', pageView);
})();

(function () {
  'use strict';
  const CONSENT_KEY = 'gymplified_analytics_consent';
  const allowedFeatures = new Set(['dashboard','workouts','nutrition','progress','goals','friends','settings','body_metrics','personal_records','other']);
  let started = false;
  let sessionId = '';

  function getConsent() {
    try { return localStorage.getItem(CONSENT_KEY) || 'unset'; }
    catch (_) { return 'unset'; }
  }

  function getSessionId() {
    if (sessionId) return sessionId;
    try {
      sessionId = sessionStorage.getItem('gymplified_analytics_session') || '';
      if (!sessionId) {
        sessionId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'session-' + Date.now().toString(36) + Math.random().toString(36).slice(2);
        sessionStorage.setItem('gymplified_analytics_session', sessionId);
      }
    } catch (_) {
      sessionId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : 'session-' + Date.now().toString(36);
    }
    return sessionId;
  }

  function setAnalyticsConsent(choice) {
    if (choice !== 'granted' && choice !== 'denied') return;
    try { localStorage.setItem(CONSENT_KEY, choice); } catch (_) {}
    const banner = document.getElementById('analyticsConsentBanner');
    if (banner) banner.remove();
    const status = document.getElementById('analyticsConsentStatus');
    if (status) status.textContent = choice === 'granted'
      ? 'Anonymous analytics are enabled. You can disable them here at any time.'
      : 'Optional analytics are disabled.';
    if (choice === 'granted') start();
    else started = false;
  }
  window.setAnalyticsConsent = setAnalyticsConsent;

  function showConsentBanner() {
    if (getConsent() !== 'unset' || document.getElementById('analyticsConsentBanner')) return;
    const banner = document.createElement('section');
    banner.id = 'analyticsConsentBanner';
    banner.className = 'install-help';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'analyticsConsentTitle');
    banner.setAttribute('aria-describedby', 'analyticsConsentDescription');
    banner.innerHTML = '<h2 id="analyticsConsentTitle">Your privacy choices</h2><p id="analyticsConsentDescription">Gymplified can collect optional, anonymous feature-usage statistics to improve the app. Analytics are off unless you choose to allow them. Your account ID is not sent with these events.</p><div class="install-actions"><button class="btn btn-primary" id="analyticsAccept" type="button">Allow anonymous analytics</button><button class="btn" id="analyticsReject" type="button">Decline</button></div>';
    document.body.appendChild(banner);
    banner.querySelector('#analyticsAccept').addEventListener('click', () => setAnalyticsConsent('granted'));
    banner.querySelector('#analyticsReject').addEventListener('click', () => setAnalyticsConsent('denied'));
  }

  function send(client, eventName, feature) {
    if (getConsent() !== 'granted' || !client) return;
    const payload = {
      event_name: eventName,
      user_id: null,
      session_id: getSessionId(),
      feature: allowedFeatures.has(feature) ? feature : null
    };
    client.from('analytics_events').insert(payload).then(result => {
      if (result.error) console.warn('Anonymous analytics event was not recorded:', result.error.message);
    }).catch(error => console.warn('Anonymous analytics request failed:', error && error.message));
  }

  function start() {
    if (started || getConsent() !== 'granted') return;
    const client = typeof window.getGymplifiedSupabaseClient === 'function' ? window.getGymplifiedSupabaseClient() : null;
    if (!client) return;
    started = true;
    send(client, 'page_view', 'other');
    send(client, 'app_open', 'dashboard');

    if (typeof window.showScreen === 'function' && !window.showScreen.__gymplifiedAnalyticsWrapped) {
      const original = window.showScreen;
      const wrapped = function (screenId) {
        const result = original.apply(this, arguments);
        const map = {dashboard:'dashboard',training:'workouts',nutrition:'nutrition',prs:'personal_records',friends:'friends',settings:'settings',progress:'progress',goals:'goals'};
        send(client, 'feature_used', map[screenId] || 'other');
        return result;
      };
      wrapped.__gymplifiedAnalyticsWrapped = true;
      window.showScreen = wrapped;
    }
  }

  function init() {
    const status = document.getElementById('analyticsConsentStatus');
    const consent = getConsent();
    if (status) status.textContent = consent === 'granted' ? 'Anonymous analytics are enabled.' : consent === 'denied' ? 'Optional analytics are disabled.' : 'Analytics preference not yet set.';
    if (consent === 'unset') showConsentBanner();
    if (consent === 'granted') start();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();

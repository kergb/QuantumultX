let body = $response.body;

const injectedScript = `
<script>
(function () {
  'use strict';

  const adSelectors = [
    "a[href*='theporndude']",
    "a[href*='mycomic']",
    "a[href*='myavlive']",
    "a[href*='bit.ly']",
    "a[href*='/vip']",
    "iframe", "div.under_player"
  ];

  const removeAds = () => {
    adSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
  };

  const observeAds = () => {
    const obs = new MutationObserver(removeAds);
    obs.observe(document.body || document.documentElement, { childList: true, subtree: true });
  };

  const preventPopupByClick = () => {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[target="_blank"], a[href^="http"]');
      if (a && /bit\\.ly|theporndude|mycomic|vip/.test(a.href)) {
        e.preventDefault();
        e.stopPropagation();
        console.log('[popup blocked]', a.href);
      }
    }, true);
  };

  const preventVideoPause = () => {
    try {
      Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
      Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
    } catch {}

    const stopEvent = e => e.stopImmediatePropagation();
    ['visibilitychange', 'webkitvisibilitychange', 'blur', 'focus'].forEach(evt => {
      document.addEventListener(evt, stopEvent, true);
      window.addEventListener(evt, stopEvent, true);
    });
  };

  const init = () => {
    removeAds();
    observeAds();
    preventPopupByClick();
    setTimeout(preventVideoPause, 3000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
</script>
`;

body = body.replace(/<head>/i, `<head>${injectedScript}`);
$done({ body });

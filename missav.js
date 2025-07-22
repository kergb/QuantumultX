let body = $response.body;

const injectedScript = `
<script>
(function () {
  'use strict';

  const selectors = [
    "a[href*='theporndude.com']",
    "a[href*='mycomic']",
    "a[href*='myavlive']",
    "a[href*='bit.ly']",
    "a[href*='/vip']",
    "iframe",
    "#a[href*='//bit.ly/']",
    "div[style*='z-index: 1001']",
    "ul.space-y-2.mb-4.ml-4.list-disc.text-nord14",
    "div.space-y-5.mb-5",
    "div.under_player",
    "div[style='width: 300px; height: 250px;']"
  ];

  const removeAds = () => {
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
  };

  const observeAds = () => {
    const observer = new MutationObserver(removeAds);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  const patchOpen = () => {
    try {
      Object.defineProperty(window, 'open', { value: () => null, writable: false });
    } catch {}
  };

  const preventPause = () => {
    try {
      Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
      Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
    } catch {}

    const stopEvt = e => e.stopImmediatePropagation();
    ['visibilitychange', 'webkitvisibilitychange', 'blur', 'focus'].forEach(evt => {
      window.addEventListener(evt, stopEvt, true);
      document.addEventListener(evt, stopEvt, true);
    });

    setInterval(() => {
      document.dispatchEvent(new Event('visibilitychange'));
      document.dispatchEvent(new Event('webkitvisibilitychange'));
    }, 1500);
  };

  const init = () => {
    removeAds();
    observeAds();
    patchOpen();
    setTimeout(preventPause, 1500);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    requestAnimationFrame(init);
  }
})();
</script>
`;

body = body.replace(/<head>/i, `<head>${injectedScript}`);
$done({ body });

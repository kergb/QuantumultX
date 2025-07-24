const injectedScript = `
<script>
(function () {
  'use strict';
  const adSelectors = [
    "a[href^='https://theporndude.com']",
    "a[href*='mycomic']",
    "a[href*='myavlive']",
    "[href*='bit.ly']",
    "[href*='bit.ly'][target=_blank]",
    "a[href*='/vip']",
    "iframe",
    "#a[href*='//bit.ly/']",
    "div[style*='z-index: 1001']",
    "ul.space-y-2.mb-4.ml-4.list-disc.text-nord14",
    "div.space-y-5.mb-5",
    "div.under_player",
    "div[style='width: 300px; height: 250px;']"
  ];
  
  const cleanAds = () => {
    adSelectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });
  };
  cleanAds();
  new MutationObserver(cleanAds).observe(document.documentElement, { childList: true, subtree: true });

  // ✅ 使用第一段方式，直接覆盖 window.open
  window.open = () => {};

  const preventPause = () => {
    try {
      Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
      Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
    } catch (e) {}
    ['visibilitychange', 'webkitvisibilitychange', 'blur', 'focus'].forEach(event => {
      window.addEventListener(event, e => e.stopImmediatePropagation(), true);
      document.addEventListener(event, e => e.stopImmediatePropagation(), true);
    });
    setInterval(() => {
      document.dispatchEvent(new Event('visibilitychange'));
      document.dispatchEvent(new Event('webkitvisibilitychange'));
    }, 1500);
  };
  setTimeout(preventPause, 3000);
})();
</script>
`;

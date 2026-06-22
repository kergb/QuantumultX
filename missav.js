const injectedScript = `
<script>
(function () {
  'use strict';

  const adSelectors = [
    "iframe",
    "div[class^='root']",
    "div[class*='fixed'][class*='right-'][class*='bottom-']",
    "div.ts-outstream-video",
    "a[href*='bit.ly']",
    "a[href*='mycomic']",
    "a[href*='myavlive']",
    "a[href*='/vip']",
    "div.space-y-5.mb-5",
    "div.under_player",
    "div[style*='z-index: 1001']"
  ];

  function cleanAds() {
    adSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el) return;
        if (el.tagName && el.tagName.toLowerCase() === "iframe") {
          el.remove();
        } else {
          el.style.display = "none";
        }
      });
    });
  }

  // ===== 核心修复点1：等 DOM 可用 =====
  function start() {
    cleanAds();

    // 动态广告
    new MutationObserver(cleanAds)
      .observe(document.documentElement, {
        childList: true,
        subtree: true
      });

    // 防止延迟广告
    setInterval(cleanAds, 2000);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  // ===== 禁止 window.open =====
  try {
    window.open = function () {};
  } catch (e) {}

})();
</script>
`;

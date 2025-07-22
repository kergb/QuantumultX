let body = $response.body;

const injectedScript = `
<script>
(function () {
  'use strict';

  // 广告清除
  const adSelectors = [
    "a[href*='theporndude']",
    "a[href*='mycomic']", "a[href*='myavlive']",
    "a[href*='bit.ly']", "a[href*='/vip']",
    "iframe", "div.under_player"
  ];

  const removeAds = () => {
    for (const sel of adSelectors) {
      document.querySelectorAll(sel).forEach(el => el.remove());
    }
  };

  const observeAds = () => {
    const observer = new MutationObserver(removeAds);
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
  };

  // 防止 window.open 弹窗（低检测方式）
  const patchWindowOpen = () => {
    const nativeOpen = window.open;
    window.open = function (...args) {
      console.log('[hooked] window.open prevented:', args);
      return null;
    };
  };

  // 防止视频失焦暂停（温和模式）
  const preventVideoPause = () => {
    try {
      Object.defineProperty(document, 'hidden', {
        get: () => false,
        configurable: true
      });
      Object.defineProperty(document, 'visibilityState', {
        get: () => 'visible',
        configurable: true
      });
    } catch (e) {}

    const stopEvent = e => e.stopImmediatePropagation();
    ['visibilitychange', 'webkitvisibilitychange', 'blur', 'focus'].forEach(evt => {
      document.addEventListener(evt, stopEvent, true);
      window.addEventListener(evt, stopEvent, true);
    });
  };

  const init = () => {
    removeAds();
    observeAds();
    setTimeout(patchWindowOpen, 3000);      // 延迟防检测
    setTimeout(preventVideoPause, 4000);    // 延迟防检测
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

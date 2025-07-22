let body = $response.body;

const injectedScript = `
<script>
(function () {
  'use strict';

  const safeRemove = () => {
    const selectors = [
      "a[href*='theporndude']",
      "a[href*='mycomic']",
      "a[href*='myavlive']",
      "a[href*='bit.ly']",
      "a[href*='/vip']",
      "iframe",
      "div.under_player"
    ];
    for (const sel of selectors) {
      document.querySelectorAll(sel).forEach(el => el.remove());
    }
  };

  const delayRun = () => {
    requestIdleCallback(() => {
      safeRemove();
      new MutationObserver(safeRemove).observe(document.body, { childList: true, subtree: true });
    });
  };

  // 延迟 patch window.open：减少被检测概率
  setTimeout(() => {
    try {
      window.open = () => null;
    } catch {}
  }, 5000);

  // 延迟且不重定义 document.hidden，可选开启
  /*
  setTimeout(() => {
    try {
      Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
      Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
    } catch {}
  }, 5000);
  */

  // 初始挂载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', delayRun);
  } else {
    delayRun();
  }
})();
</script>
`;

body = body.replace(/<head>/i, `<head>${injectedScript}`);
$done({ body });

let body = $response.body;

const injectedScript = `
<script>
(function () {
  'use strict';

  const run = () => {
    // 删除广告元素（保留国旗图标 .gif）
    const selectors = [
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
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
    };

    cleanAds();
    new MutationObserver(cleanAds).observe(document.documentElement, { childList: true, subtree: true });

    // 禁用 window.open
    try {
      Object.defineProperty(window, 'open', {
        value: () => null,
        writable: false
      });
    } catch (e) {}

    // 防止失焦暂停（延迟执行以确保播放器初始化完毕）
    const fakeVisibility = () => {
      try {
        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
      } catch (e) {}
    };

    const interceptEvents = () => {
      ['visibilitychange', 'webkitvisibilitychange', 'blur', 'focus'].forEach(event => {
        window.addEventListener(event, e => e.stopImmediatePropagation(), true);
        document.addEventListener(event, e => e.stopImmediatePropagation(), true);
      });
    };

    // 执行劫持逻辑
    const applyAntiPause = () => {
      fakeVisibility();
      interceptEvents();
      setInterval(() => {
        fakeVisibility();
        document.dispatchEvent(new Event('visibilitychange'));
      }, 1500);
    };

    // 延迟确保播放器已加载
    setTimeout(applyAntiPause, 3000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
</script>
`;

body = body.replace(/<head>/i, `<head>${injectedScript}`);

$done({ body });

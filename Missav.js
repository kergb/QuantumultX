// Quantumult X 脚本：missav_adblock.js（增强稳定性，解决国旗丢失）

let body = $response.body;

const injectedScript = `
<script>
(function () {
  'use strict';

  const run = () => {
    // 删除广告元素
    const selectors = [
      "a[href^='https://theporndude.com']",
      "a[href*='mycomic']",
      "a[href*='myavlive']",
      "[href*='bit.ly']",
      "[href*='bit.ly'][target=_blank]",
      "a[href*='/vip']",
      // ⚠️ 去掉 img[src*='.gif']，保留国旗图标
      "iframe",
      "#a[href*='//bit.ly/']",
      "div[style*='z-index: 1001']",
      "ul.space-y-2.mb-4.ml-4.list-disc.text-nord14",
      "div.space-y-5.mb-5",
      "div.under_player",
      "div[style='width: 300px; height: 250px;']"
    ];
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });

    const observer = new MutationObserver(() => {
      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // 禁用 window.open
    Object.defineProperty(window, 'open', {
      value: () => null,
      writable: false
    });

    // 防止失焦暂停
    const fakeVisibility = () => {
      Object.defineProperty(document, 'hidden', { value: false, configurable: true });
      Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    };
    document.addEventListener('visibilitychange', fakeVisibility, true);
    fakeVisibility();
  };

  // 等待 DOM 进入加载状态
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
</script>
`;

// 插入到 <head> 前，确保尽早执行
body = body.replace(/<head>/i, `<head>${injectedScript}`);

$done({ body });

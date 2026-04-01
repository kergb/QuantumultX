// ==UserScript==
// 禁跳转 + 防暂停 + 去广告（优化低耗版）
// ==/UserScript==

let body = $response.body;

// ===== 可控开关（用 $prefs 控制）=====
const adBlock = $prefs.valueForKey('ad_block') !== 'off';
const preventOpen = $prefs.valueForKey('no_window_open') !== 'off';
const keepPlay = $prefs.valueForKey('keep_play') !== 'off';

const injectedScript = `
<script>
(function () {
  'use strict';

  const adBlock = ${adBlock};
  const preventOpen = ${preventOpen};
  const keepPlay = ${keepPlay};

  // ===== 1️⃣ 广告清除（节流优化版）=====
  if (adBlock) {
    const adSelectors = [
      "a[href^='https://theporndude.com']",
      "a[href*='mycomic']",
      "a[href*='myavlive']",
      "[href*='bit.ly']",
      "a[href*='/vip']",
      "iframe[src*='ads']",
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

    let timer = null;
    const observer = new MutationObserver(() => {
      if (timer) return;
      timer = setTimeout(() => {
        cleanAds();
        timer = null;
      }, 300);
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // ===== 2️⃣ 禁 window.open =====
  if (preventOpen) {
    try {
      Object.defineProperty(window, 'open', {
        value: () => {},
        writable: false,
        configurable: true
      });
    } catch (e) {
      window.open = () => {};
    }
  }

  // ===== 3️⃣ 防失焦暂停（无 interval 低耗版）=====
  if (keepPlay) {
    const preventPause = () => {
      try {
        Object.defineProperty(document, 'hidden', { get: () => false });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible' });
      } catch (e) {}

      ['visibilitychange', 'webkitvisibilitychange', 'blur'].forEach(event => {
        window.addEventListener(event, e => e.stopImmediatePropagation(), true);
        document.addEventListener(event, e => e.stopImmediatePropagation(), true);
      });
    };

    setTimeout(preventPause, 2000);
  }

})();
</script>
`;

body = body.replace(/<head>/i, \`<head>\${injectedScript}\`);

$done({ body });

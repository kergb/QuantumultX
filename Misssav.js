// 低功耗版：去广告 + 禁跳转 + 轻量防失焦
let body = $response.body;
const injectedScript = `
<script>
(function () {
  'use strict';

  // ==== 1. 去广告 ====
  const adSelectors = [
    "a[href^='https://theporndude.com']",
    "a[href*='mycomic']",
    "a[href*='myavlive']",
    "[href*='bit.ly']",
    "[href*='/vip']",
    "iframe",
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
  
  // 首次执行
  cleanAds();
  
  // 只监听播放器区域变化
  const player = document.querySelector('#player') || document.body;
  new MutationObserver(cleanAds).observe(player, { childList: true, subtree: true });

  // ==== 2. 禁 window.open 跳转 ====
  try {
    Object.defineProperty(window, 'open', {
      value: () => {},
      writable: false,
      configurable: true
    });
  } catch (e) {
    window.open = () => {};
  }

  // ==== 3. 轻量防失焦播放（事件触发型） ====
  document.addEventListener('visibilitychange', e => {
    if (document.hidden) {
      e.stopImmediatePropagation();
      const v = document.querySelector('video');
      if (v && v.paused) {
        v.play().catch(()=>{});
      }
    }
  }, true);

})();
</script>
`;

body = body.replace(/<head>/i, `<head>${injectedScript}`);
$done({ body });

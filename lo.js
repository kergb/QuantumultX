// 低发热版：去广告 + 禁跳转 + 防失焦播放
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
  
  // 仅在播放器区域变化时清理广告
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

  // ==== 3. 防失焦播放 ====
  const preventPause = () => {
    try {
      Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
      Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
    } catch (e) {}
    
    ['visibilitychange', 'webkitvisibilitychange', 'blur', 'focus'].forEach(event => {
      window.addEventListener(event, e => e.stopImmediatePropagation(), true);
      document.addEventListener(event, e => e.stopImmediatePropagation(), true);
    });

    // 延长定时器间隔到 10 秒，降低 CPU 占用
    setInterval(() => {
      document.dispatchEvent(new Event('visibilitychange'));
      document.dispatchEvent(new Event('webkitvisibilitychange'));
    }, 10000);
  };

  // 视频标签出现后再启用防失焦
  const waitForVideo = setInterval(() => {
    if (document.querySelector('video')) {
      clearInterval(waitForVideo);
      preventPause();
    }
  }, 1000);

})();
</script>
`;

body = body.replace(/<head>/i, `<head>${injectedScript}`);
$done({ body });

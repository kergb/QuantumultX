let body = $response.body;

const injectedScript = `
<script>
(function () {
  'use strict';

  // —— 1. 广告清除：立即执行 + 高效监听 —— 
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
    adSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => el.remove());
    });
  };

  cleanAds();
  const observer = new MutationObserver(cleanAds);
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });

  // —— 2. 禁用 window.open —— 
  try {
    Object.defineProperty(window, 'open', {
      value: () => null,
      writable: false
    });
  } catch (e) {}

  // —— 3. 防失焦播放 & 劫持 video.pause —— 
  const applyPrevent = () => {
    // 3.1 伪装页面始终可见
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

    // 3.2 拦截 visibilitychange、blur、focus
    ['visibilitychange', 'webkitvisibilitychange', 'blur', 'focus'].forEach(evt => {
      window.addEventListener(evt, e => e.stopImmediatePropagation(), true);
      document.addEventListener(evt, e => e.stopImmediatePropagation(), true);
    });

    // 3.3 阻止 video.pause()：防止播放器主动暂停
    const protectVideo = () => {
      document.querySelectorAll('video').forEach(video => {
        if (!video.__pausePatched) {
          const origPause = video.pause.bind(video);
          video.pause = function () {
            console.log('[missav_adblock] blocked pause');
            // 仅用户手动触发如点击暂停按钮时可执行
            if (video._allowUserPause) {
              origPause();
            }
          };
          video.addEventListener('play', () => {
            video._allowUserPause = true;
          });
          video.__pausePatched = true;
        }
      });
    };

    protectVideo();
    new MutationObserver(protectVideo).observe(document.body, {
      childList: true,
      subtree: true
    });

    // 3.4 定时刷新可见状态，进一步保证防暂停
    setInterval(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    }, 1500);
  };

  // 延迟确保播放器 DOM 和 JS 完全初始化
  setTimeout(applyPrevent, 3500);
})();
</script>
`;

body = body.replace(/<head>/i, `<head>${injectedScript}`);
$done({ body });

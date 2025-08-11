// 禁跳转其他窗口，去除广告（去掉防失焦播放）
let body = $response.body;
const injectedScript = `
<script>
(function () {
  'use strict';
  
  // ==== 1. 广告清除：立即执行 + MutationObserver ====
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

  cleanAds(); // 首次执行
  new MutationObserver(cleanAds).observe(document.documentElement, { childList: true, subtree: true });

  // ==== 2. 禁 window.open ====
  try {
    Object.defineProperty(window, 'open', {
      value: () => {},
      writable: false,
      configurable: true
    });
  } catch (e) {
    window.open = () => {};
  }

})();
</script>
`;

body = body.replace(/<head>/i, `<head>${injectedScript}`);
$done({ body });

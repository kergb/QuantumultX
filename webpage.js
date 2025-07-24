 // 禁跳转其他窗口，禁失焦播放，去除广告
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
   //====2.禁window open
try {
  Object.defineProperty(window, 'open', {
    value: () => {},
    writable: false,
    configurable: true
  });
} catch (e) {
  window.open = () => {};
}
 // ==== 3. 防失焦播放：延迟执行（方案一） ====
  const preventPause = () => {
    try {
      Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
      Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
    } catch (e) {}
    ['visibilitychange', 'webkitvisibilitychange', 'blur', 'focus'].forEach(event => {
      window.addEventListener(event, e => e.stopImmediatePropagation(), true);
      document.addEventListener(event, e => e.stopImmediatePropagation(), true);
    });
setInterval(() => {
      document.dispatchEvent(new Event('visibilitychange'));
      document.dispatchEvent(new Event('webkitvisibilitychange'));
    }, 1500);
  };
setTimeout(preventPause, 3000); // 延迟执行防暂停
})();
</script>
`;
body = body.replace(/<head>/i, `<head>${injectedScript}`);
$done({ body });

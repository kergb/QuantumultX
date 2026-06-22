// ==== 1. 广告清除：融合增强版 ====
const adSelectors = [
  // iframe 广告（核心）
  "iframe",

  // 通用广告/浮层
  "div[class^='root']",
  "div[class*='fixed'][class*='right-'][class*='bottom-']",
  "div[class*='pt-'][class*='pb-'][class*='px-']:not([class*='sm:'])",
  "div[class*='lg:hidden']",
  "div[class*='lg:block']",

  // 视频广告
  "div.ts-outstream-video",
  "div.grid.md\\:grid-cols-2.gap-8",

  // 你原脚本的站点广告
  "a[href^='https://theporndude.com']",
  "a[href*='mycomic']",
  "a[href*='myavlive']",
  "[href*='bit.ly']",
  "a[href*='/vip']",
  "#a[href*='//bit.ly/']",

  // 特定布局广告块
  "div[style*='z-index: 1001']",
  "div.space-y-5.mb-5",
  "div.under_player",
  "div[style='width: 300px; height: 250px;']"
];

const cleanAds = () => {
  const all = document.querySelectorAll(adSelectors.join(","));

  all.forEach(el => {
    if (!el) return;

    if (el.tagName && el.tagName.toLowerCase() === "iframe") {
      el.remove();
    } else {
      el.style.display = "none";
    }
  });
};

cleanAds(); // 首次执行

new MutationObserver(cleanAds)
  .observe(document.documentElement, { childList: true, subtree: true });

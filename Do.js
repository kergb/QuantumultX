const html = $response.body;

if (!html) {
  $done({});
}

const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");

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

// 删除广告 script
doc.querySelectorAll("script").forEach(el=&gt;{
    let src = el.src || "";
    let text = el.textContent || "";

    if(
        src.includes("tsyndicate.com") ||
        text.includes("TSOutstreamVideo") ||
        text.includes("htmlAds")
    ){
        el.remove();
    }
});


// 删除广告节点
const selectors = [
    'a[href*="bit.ly/"]',
    'div:has(a[href*="go.myavlive.com"])',
    'div[style*="width: 300px; height: 250px;"]',
    '.relative&gt;div[x-init*="campaignId=under_player"]',
    'div[x-show^="recommendItems"]~div[class]:has(a[rel^="sponsored"])'
];


selectors.forEach(sel=&gt;{
    try{
        doc.querySelectorAll(sel).forEach(e=&gt;e.remove());
    }catch(e){}
});


// 防弹窗
const script = doc.createElement("script");
script.textContent = `
(function(){
window.open=function(){};
})();
`;

doc.head.appendChild(script);


$done({
    body:"&lt;!DOCTYPE html&gt;"+doc.documentElement.outerHTML
});

const html = $response.body;

if (!html) {
  $done({});
  return;
}

const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");


// =======================
// 删除广告 Script
// =======================

doc.querySelectorAll("script").forEach(el => {

    let src = el.src || "";
    let text = el.textContent || "";

    if (
        src.includes("tsyndicate.com") ||
        text.includes("TSOutstreamVideo") ||
        text.includes("htmlAds")
    ) {
        el.remove();
    }

});


// =======================
// 删除广告节点
// =======================

const selectors = [

    // 推广链接
    "a[href^='https://theporndude.com']",
    "a[href*='mycomic']",
    "a[href*='myavlive']",
    "[href*='bit.ly']",
    "a[href*='/vip']",


    // 广告容器
    "div[style*='z-index: 1001']",

    "ul.space-y-2.mb-4.ml-4.list-disc.text-nord14",

    "div.space-y-5.mb-5",

    "div.under_player",

    "div[style='width: 300px; height: 250px;']",


    // 原脚本规则
    'div:has(a[href*="go.myavlive.com"])',

    '.relative>div[x-init*="campaignId=under_player"]',

    'div[x-show^="recommendItems"]~div[class]:has(a[rel^="sponsored"])'

];


selectors.forEach(sel => {

    try {

        doc.querySelectorAll(sel)
        .forEach(el => el.remove());

    } catch(e){}

});


// =======================
// 禁止 window.open
// =======================

const antiPopup = doc.createElement("script");

antiPopup.textContent = `
(function(){

window.open=function(){};

})();
`;

doc.head.appendChild(antiPopup);


// =======================
// 输出
// =======================

$done({
    body: "<!DOCTYPE html>" + doc.documentElement.outerHTML
});

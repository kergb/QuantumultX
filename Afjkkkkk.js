const html = $response.body;

if (!html) {
  $done({});
  return;
}

const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");


// 删除广告脚本

doc.querySelectorAll("script").forEach(el => {

    const src = el.src || "";
    const text = el.textContent || "";

    if (
        src.includes("tsyndicate.com") ||
        text.includes("TSOutstreamVideo") ||
        text.includes("htmlAds")
    ) {
        el.remove();
    }

});


// 删除广告节点

const selectors = [

    'a[href*="//bit.ly/"]',

    'a[href*="go.myavlive.com"]',

    'div:has(a[href*="go.myavlive.com"])',

    'div[x-init*="#genki-counter"]',

    '[x-show$="video_details"]>div>ul',

    'div[style*="width: 300px; height: 250px;"]',

    '.relative:has([x-init*="campaignId=under_player"])',

    '.relative>div[x-init*="campaignId=under_player"]',

    'div[x-show^="recommendItems"]~div[class]:has(a[rel^="sponsored"])',

    'div:has(a[rel^="sponsored"])',

    'a[href*="/vip"]',

    'a[href*="mycomic"]',

    'iframe[src*="ad"]',

    'iframe[src*="ads"]'

];


selectors.forEach(selector => {

    try {

        doc.querySelectorAll(selector)
        .forEach(el => el.remove());

    } catch(e){}

});


// 删除空广告占位

doc.querySelectorAll("div").forEach(el => {

    const text = el.innerText?.trim() || "";
    const cls = el.className || "";
    const style = el.getAttribute("style") || "";

    if (
        text === "" &&
        (
            /ad|ads|banner|sponsor|promotion|under/i.test(cls) ||
            /height:\s*(90|100|250|300)px/i.test(style)
        )
    ) {

        el.remove();

    }

});


// 注入防弹窗 JS

const js = doc.createElement("script");

js.textContent = `
(function(){

window.open=function(){};

if(window.player && window.player.pause){

let oldPause=window.player.pause;

window.player.pause=function(){

if(document.hasFocus()){
oldPause();
}

};

}

})();
`;

doc.head.appendChild(js);


// 注入 CSS

const css = doc.createElement("style");

css.textContent = `

.lg\\\\:block,
.lg\\\\:hidden,
a[href*="//bit.ly/"],
div[x-init*="#genki-counter"],
div:has(a[href*="go.myavlive.com"]),
div[style*="width: 300px; height: 250px;"],
.relative>div[x-init*="campaignId=under_player"],
div[x-show^="recommendItems"]~div[class]:has(a[rel^="sponsored"])
{
display:none!important;
}

`;

doc.head.appendChild(css);


$done({
    body:"<!DOCTYPE html>"+doc.documentElement.outerHTML
});

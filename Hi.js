const html = $response.body;

if (!html) {
  $done({});
  return;
}

const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");


// 删除广告脚本

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


// 删除明确广告节点

[
'a[href*="//bit.ly/"]',
'div:has(a[href*="go.myavlive.com"])',
'div[style*="width: 300px; height: 250px;"]',
'.relative>div[x-init*="campaignId=under_player"]',
'div[x-show^="recommendItems"]~div[class]:has(a[rel^="sponsored"])'
]
.forEach(sel=>{

    try{
        doc.querySelectorAll(sel)
        .forEach(e=>e.remove());
    }catch(e){}

});


// 注入 CSS 隐藏残留

const style = doc.createElement("style");

style.textContent = `

.lg\\:block,
.lg\\:hidden,
a[href*="//bit.ly/"],
div[x-init*="#genki-counter"],
div:has(a[href*="go.myavlive.com"]),
[x-show$="video_details"]>div>ul,
div[style*="width: 300px; height: 250px;"],
.relative>div[x-init*="campaignId=under_player"],
div[x-show^="recommendItems"]~div[class]:has(>div>div.mx-auto>div.flex>a[rel^="sponsored"])
{
display:none!important;
}

`;

doc.head.appendChild(style);


// 注入动态清理 JS

const script = doc.createElement("script");

script.textContent = `

(function(){

function clean(){

[
'a[href*="//bit.ly/"]',
'a[href*="go.myavlive.com"]',
'.under_player'
].forEach(s=>{

document.querySelectorAll(s)
.forEach(e=>e.remove());

});

}

clean();

new MutationObserver(clean)
.observe(
document.documentElement,
{
childList:true,
subtree:true
}
);


window.open=function(){};


})();

`;

doc.head.appendChild(script);


$done({
body:"<!DOCTYPE html>"+doc.documentElement.outerHTML
});

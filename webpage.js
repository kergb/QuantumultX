const html = $response.body;

if (!html) {
  $done({});
  return;
}

const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");

// ==========================
// 第一部分：响应阶段 DOMParser 删除广告
// ==========================

// 删除广告 script

doc.querySelectorAll("script").forEach(el =&gt; {

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

// 删除已有广告节点

const removeSelectors = [

    "a[href^='https://theporndude.com']",
    "a[href*='mycomic']",
    "a[href*='myavlive']",
    "[href*='bit.ly']",
    "[href*='bit.ly'][target=_blank]",
    "a[href*='/vip']",

    "div[style*='z-index: 1001']",

    "ul.space-y-2.mb-4.ml-4.list-disc.text-nord14",

    "div.space-y-5.mb-5",

    "div.under_player",

    "div[style='width: 300px; height: 250px;']",

    // 原规则
    'div:has(a[href*="go.myavlive.com"])',

    '.relative&gt;div[x-init*="campaignId=under_player"]',

    'div[x-show^="recommendItems"]~div[class]:has(a[rel^="sponsored"])'

];

removeSelectors.forEach(sel =&gt; {

    try {

        doc.querySelectorAll(sel)
        .forEach(el =&gt; el.remove());

    } catch(e){}

});

// ==========================
// 第二部分：注入网页 JS
// 处理动态广告
// ==========================

const injectedScript = `

&lt;script&gt;

(function(){

'use strict';

// 动态广告选择器

const adSelectors = [

"a[href^='https://theporndude.com']",

"a[href*='mycomic']",

"a[href*='myavlive']",

"[href*='bit.ly']",

"[href*='bit.ly'][target=_blank]",

"a[href*='/vip']",

"div[style*='z-index: 1001']",

"ul.space-y-2.mb-4.ml-4.list-disc.text-nord14",

"div.space-y-5.mb-5",

"div.under_player",

"div[style='width: 300px; height: 250px;']",

"div:has(a[href*='go.myavlive.com'])",

".relative:has(.under_player)"

];

function cleanAds(){

    adSelectors.forEach(selector=&gt;{

        try{

            document
            .querySelectorAll(selector)
            .forEach(el=&gt;el.remove());

        }catch(e){}

    });

}

// 页面加载后清一次

cleanAds();

// 监听动态插入广告

new MutationObserver(()=&gt;{

    cleanAds();

}).observe(
    document.documentElement,
    {
        childList:true,
        subtree:true
    }
);

// ==========================
// 禁止弹窗
// ==========================

try{

Object.defineProperty(
window,
"open",
{
value:function(){},
writable:false,
configurable:true
}
);

}catch(e){

window.open=function(){};

}

})();

&lt;/script&gt;

`;

// 注入 head

body = doc.documentElement.outerHTML;

body = body.replace(
/&lt;head&gt;/i,
"&lt;head&gt;"+injectedScript
);

// 输出

$done({

body:"&lt;!DOCTYPE html&gt;"+body

});

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



    'div:has(a[href*="go.myavlive.com"])',


    '.relative>div[x-init*="campaignId=under_player"]',


    'div[x-show^="recommendItems"]~div[class]:has(a[rel^="sponsored"])'

];



removeSelectors.forEach(sel => {

    try {

        doc.querySelectorAll(sel)
        .forEach(el => el.remove());

    } catch(e){}

});





// ==========================
// 第二部分：注入网页 JS
// 动态广告处理
// ==========================


const injectedScript = `

<script>

(function(){

'use strict';



// 广告选择器

const adSelectors = ${JSON.stringify(removeSelectors)};



function cleanAds(){


    adSelectors.forEach(selector=>{


        try{


            document
            .querySelectorAll(selector)
            .forEach(el=>el.remove());


        }catch(e){}



    });


}



// 首次清理

cleanAds();




// ==========================
// 优化 MutationObserver
// ==========================


let mutationCount = 0;

let lastClean = 0;



new MutationObserver(()=>{


    mutationCount++;


    let now = Date.now();



    // 10次DOM变化
    // 且距离上次超过1秒

    if(
        mutationCount >= 10 &&
        now - lastClean > 1000
    ){


        mutationCount = 0;

        lastClean = now;


        cleanAds();


    }



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


</script>

`;





// 注入 head

let body = doc.documentElement.outerHTML;


body = body.replace(

/<head>/i,

"<head>"+injectedScript

);




// 输出

$done({

body:"<!DOCTYPE html>"+body

});

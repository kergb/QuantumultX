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
// ==========================


const injectedScript = `

<script>

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


    adSelectors.forEach(selector=>{


        try{


            document
            .querySelectorAll(selector)
            .forEach(el=>el.remove());


        }catch(e){}


    });


}




// 页面加载清一次

cleanAds();




// ==========================
// 优化部分：10次DOM变化执行一次
// ==========================


let mutationCount = 0;

let timer = null;



new MutationObserver(()=>{


    mutationCount++;



    if(mutationCount >= 10){


        mutationCount = 0;



        clearTimeout(timer);



        timer=setTimeout(()=>{


            cleanAds();



        },300);



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

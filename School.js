const html = $response.body;

if (!html) {
  $done({});
  return;
}

const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");


// ==========================
// 静态广告清理
// ==========================


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


// 精准广告节点

const removeSelectors = [

"a[href^='https://theporndude.com']",

"a[href*='mycomic']",

"a[href*='myavlive']",

"[href*='bit.ly']",

"a[href*='/vip']",

"div.under_player",

"div:has(a[href*='go.myavlive.com'])",

".relative>div[x-init*='campaignId=under_player']",

"div[x-show^='recommendItems']~div[class]:has(a[rel^='sponsored'])"

];


removeSelectors.forEach(sel=>{

    try{

        doc.querySelectorAll(sel)
        .forEach(el=>el.remove());

    }catch(e){}

});




// ==========================
// 动态广告处理 JS
// ==========================


const injectedScript = `

<script>

(function(){

"use strict";



const selectors=[

"a[href^='https://theporndude.com']",

"a[href*='mycomic']",

"a[href*='myavlive']",

"[href*='bit.ly']",

"a[href*='/vip']",

"div.under_player",

"div:has(a[href*='go.myavlive.com'])"

];



let busy=false;



function removeAds(root=document){


if(busy)return;

busy=true;


selectors.forEach(selector=>{


try{


root.querySelectorAll(selector)
.forEach(el=>{

    el.remove();

});


}catch(e){}


});


busy=false;


}




// 首次清理

removeAds();



// 防止频繁触发

let timer=null;


const observer=new MutationObserver(records=>{


clearTimeout(timer);


timer=setTimeout(()=>{


records.forEach(record=>{


record.addedNodes.forEach(node=>{


if(node.nodeType===1){

    removeAds(node);

}


});


});


},1200);



});



observer.observe(
document.documentElement,
{
childList:true,
subtree:true
}
);



// 禁止弹窗

try{


window.open=function(){};


Object.defineProperty(
window,
"open",
{
value:function(){},
writable:false,
configurable:false
}
);


}catch(e){}



})();


</script>

`;



// 注入

let body = doc.documentElement.outerHTML;


body=body.replace(
/<head>/i,
"<head>"+injectedScript
);



$done({

body:"<!DOCTYPE html>"+body

});

const html = $response.body;

if (!html) {
  $done({});
  return;
}

const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");


// ==========================
// 静态清理
// ==========================


const selectors = [

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

".relative>div[x-init*='campaignId=under_player']",

"div[x-show^='recommendItems']~div[class]:has(a[rel^='sponsored'])"

];



selectors.forEach(sel=>{

try{

doc.querySelectorAll(sel)
.forEach(e=>e.remove());

}catch(e){}

});




// ==========================
// 注入动态清理
// ==========================


const js = `

<script>

(function(){


"use strict";


const selectors=${JSON.stringify(selectors)};



let lock=false;



function clean(root=document){


if(lock)return;

lock=true;



try{


selectors.forEach(sel=>{


try{


// 扫描根节点

if(root.matches && root.matches(sel)){

root.remove();

return;

}


// 扫描子节点

root.querySelectorAll(sel)
.forEach(e=>e.remove());



}catch(e){}



});


}catch(e){}



lock=false;


}




// 初始清理

setTimeout(clean,500);

setTimeout(clean,2000);



// 监听动态广告


let timer;


const observer=new MutationObserver(()=>{


clearTimeout(timer);


timer=setTimeout(()=>{

clean();

},800);



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


}catch(e){}



})();


</script>

`;



let body=doc.documentElement.outerHTML;


body=body.replace(
/<head>/i,
"<head>"+js
);



$done({

body:"<!DOCTYPE html>"+body

});

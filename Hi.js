/**
 * Missav 广告清理
 * ECMAScript Rewrite Script
 */

let body = $response.body;

if (!body) {
  $done({});
}

// 删除广告 script
body = body.replace(
  /<script[^>]*?(?:tsyndicate\.com|TSOutstreamVideo|htmlAds)[\s\S]*?<\/script>/gi,
  ""
);


// 删除 go.myavlive.com 广告块
body = body.replace(
  /<div[^>]*>[\s\S]*?go\.myavlive\.com[\s\S]*?<\/div>/gi,
  ""
);


// 删除 bit.ly 推广
body = body.replace(
  /<a[^>]*href=["'][^"']*bit\.ly[^"']*["'][^>]*>[\s\S]*?<\/a>/gi,
  ""
);


// 删除 300x250 广告
body = body.replace(
  /<div[^>]*width:\s*300px;\s*height:\s*250px;[^>]*>[\s\S]*?<\/div>/gi,
  ""
);


// 注入 CSS
const css = `
.lg\\:block,
.lg\\:hidden,
a[href*="//bit.ly/"],
div[x-init*="#genki-counter"],
div:has(a[href*="go.myavlive.com"]),
[x-show$="video_details']>div>ul"],
div[style*="width: 300px; height: 250px;"],
.relative>div[x-init*="campaignId=under_player"],
div[x-show^="recommendItems"]~div[class]:has(
>div>div.mx-auto>div.flex>a[rel^="sponsored"]
){
display:none!important;
}
`;

body = body.replace(
"</head>",
`<style>${css}</style></head>`
);


// 注入防弹窗 JS
const js = `
<script>
(function(){
document.addEventListener("DOMContentLoaded",function(){

window.open=function(){};

if(window.player && window.player.pause){
let oldPause=window.player.pause;

window.player.pause=function(){
if(document.hasFocus()){
oldPause();
}
}
}

});
})();
</script>
`;

body = body.replace(
"</body>",
js+"</body>"
);


$done({
body
});

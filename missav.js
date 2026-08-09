const html = $response.body;

if (!html) {
    $done({});
    return;
}

const parser = new DOMParser();
const doc = parser.parseFromString(html, "text/html");


// =======================
// 删除广告脚本
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
// 删除广告区域
// =======================

const selectors = [

    // 短链接推广
    'a[href*="bit.ly/"]',

    // myavlive广告
    'div:has(a[href*="go.myavlive.com"])',

    // 300x250广告
    'div[style*="width: 300px; height: 250px;"]',

    // 播放器下面广告（删除外层）
    '.relative:has(div[x-init*="campaignId=under_player"])',

    // sponsored推荐广告
    'div[x-show^="recommendItems"]~div[class]:has(a[rel^="sponsored"])',

    // iframe广告
    'iframe[src*="ad"]',
    'iframe[src*="ads"]',

    // 常见广告标记
    'ins.adsbygoogle',
    '[data-ad]',
    '[data-ads]'

];


selectors.forEach(sel => {

    try {

        doc.querySelectorAll(sel).forEach(el => {
            el.remove();
        });

    } catch(e){}

});


// =======================
// 删除广告空占位
// =======================

doc.querySelectorAll("div").forEach(el => {

    let text = el.textContent.trim();
    let html = el.innerHTML.trim();
    let cls = typeof el.className === "string" 
        ? el.className 
        : "";


    if (
        html === "" &&
        text === "" &&
        (
            cls.includes("ad") ||
            cls.includes("ads") ||
            cls.includes("banner") ||
            cls.includes("sponsor") ||
            cls.includes("promotion")
        )
    ) {

        el.remove();

    }

});


// =======================
// 删除空高度广告盒
// =======================

doc.querySelectorAll("div").forEach(el => {

    let style = el.getAttribute("style") || "";

    if (
        /height:\s*(90|100|250|280|300)px/i.test(style)
        &&
        el.innerText.trim() === ""
    ) {

        el.remove();

    }

});


// =======================
// 禁止弹窗
// =======================

const antiPopup = doc.createElement("script");

antiPopup.textContent = `
(function(){

window.open=function(){};

document.addEventListener(
"click",
function(e){

let a=e.target.closest("a");

if(a && a.target=="_blank"){
    e.preventDefault();
}

},
true
);

})();
`;

doc.head.appendChild(antiPopup);


// =======================
// 输出
// =======================

$done({

    body:
    "<!DOCTYPE html>" +
    doc.documentElement.outerHTML

});

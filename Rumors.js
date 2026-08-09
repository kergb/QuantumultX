const html = $response.body;

if (!html) {
    $done({});
    return;
}


const parser = new DOMParser();
const doc = parser.parseFromString(html,"text/html");


// 删除广告 script

doc.querySelectorAll("script").forEach(el=>{

    let src = el.src || "";
    let text = el.textContent || "";

    if(
        src.includes("tsyndicate.com") ||
        text.includes("TSOutstreamVideo") ||
        text.includes("htmlAds")
    ){
        el.remove();
    }

});



// 删除广告节点

const selectors=[

'a[href*="bit.ly/"]',

'div:has(a[href*="go.myavlive.com"])',

'div[style*="width: 300px; height: 250px;"]',

'.relative>div[x-init*="campaignId=under_player"]',

'div[x-show^="recommendItems"]~div[class]:has(a[rel^="sponsored"])'

];


selectors.forEach(sel=>{

    try{

        doc.querySelectorAll(sel).forEach(el=>{
            el.remove();
        });

    }catch(e){}

});



// 输出保持原结构

$done({

body: doc.documentElement.outerHTML

});

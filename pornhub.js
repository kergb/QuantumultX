let body = $response.body;

const adSelectors = [
  "#cookieBanner",
  ".ad-box",
  ".ad-item",
  ".ad-placeholder",
  ".adContainer",
  ".adWrapper",
  ".ad_wrapper",
  ".ads-container",
  ".adsRemoveButtonWrapper",
  ".adsbytrafficjunky",
  ".bottomNav",
  ".bottomNotification",
  ".cookieBannerV1",
  ".globalCookieBanner",
  ".mg_ad_native",
  ".middleAdContainer",
  ".middleRemoveCTA",
  ".premiumPromoBanner",
  ".topRemoveCTA",
  ".video-wrapper-ad",
  "div[class*='ad-']",
  "div[class*='watchpageAd']",
  "div[id*='ad-']",
  "ins.adsbytrafficjunky"
];

const cssInjection = `
<style>
${adSelectors.join(",")}{
  display:none !important;
  visibility:hidden !important;
  opacity:0 !important;
  width:0 !important;
  height:0 !important;
  min-height:0 !important;
  overflow:hidden !important;
  margin:0 !important;
  padding:0 !important;
  pointer-events:none !important;
}
</style>`;

const jsInjection = `
<script>
(function(){

  try{
    Object.defineProperty(window,'TEXTLINKS',{
      get:function(){ return []; },
      set:function(v){},
      configurable:true
    });
  }catch(e){}

  function removeAds(){
    document.querySelectorAll(
      '${adSelectors.join(",")}'
    ).forEach(function(el){
      el.remove();
    });
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',removeAds);
  }else{
    removeAds();
  }

  new MutationObserver(function(){
    removeAds();
  }).observe(document.documentElement,{
    childList:true,
    subtree:true
  });

})();
</script>`;

/* 替换已知广告数据 */
body = body.replace(
  /var\\s+TEXTLINKS\\s*=\\s*\\[[\\s\\S]*?\\];/gi,
  'var TEXTLINKS=[];'
);

/* 注入 */
if (/<head[^>]*>/i.test(body)) {
  body = body.replace(
    /(<head[^>]*>)/i,
    "$1" + cssInjection + jsInjection
  );
} else {
  body = cssInjection + jsInjection + body;
}

$done({ body });

// ==UserScript==
// @name         Adblock4limbo Slim
// @namespace    https://github.com/yourname/adblock4limbo-slim
// @version      1.0
// @description  Only remove ads (CSS + DOM), no UI buttons or enhancements.
// @author       you
// @match        *://*/*
// ==/UserScript==

(function () {
  'use strict';

  // 注入 CSS 隐藏广告
  const css = `
.ad, .ads, [id*="ad"], [class*="ad"], iframe, .video-ad, .videoAds {
  display: none !important;
}`;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // JS 清理广告 DOM
  const clean = () => {
    document.querySelectorAll(
      'iframe, .ads, .ad, [id*="ad"], [class*="ad"], .video-ad, .videoAds'
    ).forEach(el => el.remove());
  };

  // 拦截 window.open 弹窗
  window.open = () => {};
  clean();
  setInterval(clean, 1500);
})();
// 正则：匹配目标站点
const TARGET_SITES_REGEX = /(missav|netflav|supjav|njav|javday)/i;
const JAVBUS_REGEX = /javbus/i;
const HUARENLIVE_REGEX = /huaren\.live\/player\/ec\.php/i;

// 正则：用于内容替换
const TITLE_REGEX = /<\/title>/i;
const BODY_REGEX = /<\/body>/i;
const WINDOW_OPEN_REGEX = /window\.open/g;

// 主处理函数
function processResponse() {
    const requestUrl = $request.url;
    let responseBody = $response.body;

    if (!responseBody) {
        console.log("响应内容为空");
        $done({ url: requestUrl });
        return;
    }

    const isTargetSite = requestUrl.match(TARGET_SITES_REGEX);
    const isJavbus = requestUrl.match(JAVBUS_REGEX);
    const isHuarenlive = requestUrl.match(HUARENLIVE_REGEX);

    if (isTargetSite) {
        responseBody = responseBody.replace(WINDOW_OPEN_REGEX, "");
    } else if (isHuarenlive) {
        responseBody = responseBody
            .replace(/"time":"20"/g, '"time":"0"')
            .replaceAll(/"img":\s*"[^"]*"/g, '"img": ""');
    }

    // 修改响应头，移除限制性策略
    const responseHeaders = {
        ...$response.headers,
        "Cross-Origin-Embedder-Policy": "unsafe-none",
        "Cross-Origin-Opener-Policy": "unsafe-none",
        "Cross-Origin-Resource-Policy": "cross-origin"
    };

    delete responseHeaders["Content-Security-Policy"];
    delete responseHeaders["X-Frame-Options"];
    delete responseHeaders["Referrer-Policy"];

    $done({
        headers: responseHeaders,
        body: responseBody,
        url: requestUrl
    });
}

// 执行并捕获异常
try {
    processResponse();
} catch (error) {
    console.log(`处理失败: ${error.message}`);
    $done({ url: $request.url, body: $response.body, headers: $response.headers });
}

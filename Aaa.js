// 禁跳转、禁失焦播放、去广告（优化版）

let body = $response.body;

const injectedScript = `
<script>
(function () {
'use strict';

/////////////////////////////////////////////////////
// 1. 去广告
/////////////////////////////////////////////////////

const adSelectors = [
    "a[href*='theporndude.com']",
    "a[href*='mycomic']",
    "a[href*='myavlive']",
    "a[href*='bit.ly']",
    "a[href*='/vip']",

    // 常见广告 iframe（不要删除全部 iframe）
    "iframe[src*='ads']",
    "iframe[src*='adservice']",
    "iframe[src*='doubleclick']",
    "iframe[src*='googlesyndication']",
    "iframe[src*='pop']",
    "iframe[src*='banner']",

    "div[style*='z-index:1001']",
    "div[style*='z-index: 1001']",
    "ul.space-y-2.mb-4.ml-4.list-disc.text-nord14",
    "div.space-y-5.mb-5",
    "div.under_player",
    "div[style='width: 300px; height: 250px;']"
];

function cleanAds() {
    adSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
    });
}

cleanAds();

let cleanTimer;

new MutationObserver(() => {
    clearTimeout(cleanTimer);
    cleanTimer = setTimeout(cleanAds, 50);
}).observe(document.documentElement, {
    childList: true,
    subtree: true
});

/////////////////////////////////////////////////////
// 2. 禁 window.open
/////////////////////////////////////////////////////

try {
    Object.defineProperty(window, "open", {
        value: function () {
            return null;
        },
        writable: false,
        configurable: true
    });
} catch (e) {
    window.open = function () {
        return null;
    };
}

/////////////////////////////////////////////////////
// 3. 禁 target=_blank
/////////////////////////////////////////////////////

document.addEventListener("click", function(e) {

    const a = e.target.closest("a");

    if (!a) return;

    if (a.target === "_blank") {
        a.target = "_self";
    }

}, true);

/////////////////////////////////////////////////////
// 4. 防后台暂停
/////////////////////////////////////////////////////

function preventPause() {

    try {

        Object.defineProperty(document, "hidden", {
            get: () => false,
            configurable: true
        });

        Object.defineProperty(document, "webkitHidden", {
            get: () => false,
            configurable: true
        });

        Object.defineProperty(document, "visibilityState", {
            get: () => "visible",
            configurable: true
        });

    } catch (e) {}

    [
        "visibilitychange",
        "webkitvisibilitychange",
        "blur",
        "focus"
    ].forEach(evt => {

        window.addEventListener(evt, e => {
            e.stopImmediatePropagation();
        }, true);

        document.addEventListener(evt, e => {
            e.stopImmediatePropagation();
        }, true);

    });

    setInterval(() => {

        document.dispatchEvent(new Event("visibilitychange"));
        document.dispatchEvent(new Event("webkitvisibilitychange"));

    }, 5000);

}

setTimeout(preventPause, 2000);

})();
</script>
`;

if (/<head>/i.test(body)) {
    body = body.replace(/<head>/i, "<head>" + injectedScript);
} else {
    body = injectedScript + body;
}

$done({ body });

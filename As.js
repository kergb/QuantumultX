// ==UserScript==
// @name        MissAV 去广告 + 防失焦暂停（整合版）
// @match       https://missav.com/*
// @version     1.0
// @author      ChatGPT
// ==/UserScript==

/**
 * 平台适配 + 日志封装
 */
function b(n) {
  return typeof n != "object" || n === null
    ? String(n)
    : typeof n.toString == "function" && n.toString !== Object.prototype.toString
    ? Array.isArray(n) ? JSON.stringify(n) : n.toString()
    : n instanceof RegExp
    ? n.toString()
    : n instanceof Date
    ? n.toISOString()
    : JSON.stringify(n);
}

const p = class {
  static getInstance(name) {
    const platform = typeof $loon !== 'undefined' ? 'Loon'
                   : typeof $task !== 'undefined' ? 'QX'
                   : typeof $httpClient !== 'undefined' ? 'Surge'
                   : 'Unknown';

    if (!p.instances[platform]) {
      p.instances[platform] = new p(name, platform);
    }
    return p.instances[platform];
  }
  static instances = {};

  constructor(name, platform) {
    this.name = name;
    this.platform = platform;
    this.request = typeof $request !== "undefined" ? $request : null;
    this.response = typeof $response !== "undefined" ? $response : null;
  }

  log(...args) {
    console.log(`[${this.name}] ${args.map(b).join(" | ")}`);
  }

  error(...args) {
    console.log(`[${this.name} ERROR] ${args.map(b).join(" | ")}`);
  }

  done(data) {
    $done(data);
  }

  exit() {
    $done({});
  }
};

const util = p.getInstance("missav");

/**
 * DOM 操作器
 */
class HTMLProcessor {
  constructor(html) {
    const domParser = new DOMParser();
    this.doc = domParser.parseFromString(html, "text/html");
  }

  toString() {
    return this.doc.documentElement.outerHTML;
  }

  removeBySelectors(selectors = []) {
    selectors.forEach(sel => {
      this.doc.querySelectorAll(sel).forEach(el => el.remove());
    });
  }

  injectScript(code) {
    const script = this.doc.createElement("script");
    script.textContent = code;
    this.doc.head.appendChild(script);
  }

  injectStyle(cssText) {
    const style = this.doc.createElement("style");
    style.textContent = cssText;
    this.doc.head.appendChild(style);
  }
}

/**
 * 主处理逻辑
 */
try {
  const body = util.response.body;
  if (!/text\/html/.test(util.response.headers["Content-Type"] || "")) {
    throw new Error("非 HTML 响应，不处理");
  }

  const processor = new HTMLProcessor(body);

  // ✅ 删除常见广告元素
  processor.removeBySelectors([
    "a[href^='https://theporndude.com']",
    "a[href*='mycomic']",
    "a[href*='myavlive']",
    "[href*='bit.ly']",
    "[href*='bit.ly'][target=_blank]",
    "a[href*='/vip']",
    "iframe",
    "#a[href*='//bit.ly/']",
    "div[style*='z-index: 1001']",
    "ul.space-y-2.mb-4.ml-4.list-disc.text-nord14",
    "div.space-y-5.mb-5",
    "div.under_player",
    "div[style='width: 300px; height: 250px;']",
    ".lg\\:block,.lg\\:hidden",
    "div[x-init*='#genki-counter']",
    "div:has(a[href*='go.myavlive.com'])",
    "[x-show$='video_details'] > div > ul",
    "div.relative > div[x-init*='campaignId=under_player']",
    "div[x-show^=recommendItems]~div[class]:has(>div>div.mx-auto>div.flex>a[rel^=sponsored])"
  ]);

  // ✅ 注入防跳转、防暂停 JS
  processor.injectScript(`
    (() => {
      'use strict';
      const adSelectors = [
        "a[href^='https://theporndude.com']",
        "a[href*='mycomic']",
        "a[href*='myavlive']",
        "[href*='bit.ly']",
        "[href*='bit.ly'][target=_blank]",
        "a[href*='/vip']",
        "iframe",
        "#a[href*='//bit.ly/']",
        "div[style*='z-index: 1001']",
        "ul.space-y-2.mb-4.ml-4.list-disc.text-nord14",
        "div.space-y-5.mb-5",
        "div.under_player",
        "div[style='width: 300px; height: 250px;']"
      ];
      const cleanAds = () => {
        adSelectors.forEach(selector => {
          document.querySelectorAll(selector).forEach(el => el.remove());
        });
      };
      cleanAds();
      new MutationObserver(cleanAds).observe(document.documentElement, { childList: true, subtree: true });

      // 禁止 window.open
      try {
        Object.defineProperty(window, 'open', {
          value: () => null,
          writable: false
        });
      } catch (e) {}

      // 防失焦暂停
      const preventPause = () => {
        try {
          Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
          Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
        } catch (e) {}
        ['visibilitychange', 'webkitvisibilitychange', 'blur', 'focus'].forEach(event => {
          window.addEventListener(event, e => e.stopImmediatePropagation(), true);
          document.addEventListener(event, e => e.stopImmediatePropagation(), true);
        });
        setInterval(() => {
          document.dispatchEvent(new Event('visibilitychange'));
          document.dispatchEvent(new Event('webkitvisibilitychange'));
        }, 1500);
      };
      setTimeout(preventPause, 3000);
    })();
  `);

  // ✅ 注入样式（避免广告残留）
  processor.injectStyle(`
    .lg\\:block,.lg\\:hidden,
    a[href*="//bit.ly/"],
    div[x-init*="#genki-counter"],
    div:has(a[href*="go.myavlive.com"]),
    [x-show$="video_details"] > div > ul,
    div[style*="width: 300px; height: 250px;"],
    .relative > div[x-init*="campaignId=under_player"],
    div[x-show^=recommendItems]~div[class]:has(>div>div.mx-auto>div.flex>a[rel^=sponsored]) {
      display: none !important;
    }
  `);

  util.done({ body: processor.toString() });

} catch (err) {
  util.error("处理失败", err);
  util.exit();
}

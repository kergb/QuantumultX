// ==UserScript==
// @name         MissAV 去广告 + 防暂停 + 防跳转
// @namespace    https://limbopro.com
// @version      1.0.0
// @description  清除 MissAV 广告元素、阻止 window.open、避免视频在失焦时暂停播放
// @author       代轩
// @match        https://missav.ai/*
// @match        https://missav.ws/*
// @icon         https://missav.ai/favicon.ico
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  const observer = new MutationObserver(() => {
    const selectors = [
      "a[href^='https://theporndude.com']",
      "a[href*='mycomic']",
      "a[href*='myavlive']",
      "[href*='bit.ly']",
      "[href*='bit.ly'][target=_blank]",
      "a[href*='/vip']",
      "img[src*='.gif']",
      "iframe",
      "#a[href*='//bit.ly/']",
      "div[style*='z-index: 1001']",
      "ul.space-y-2.mb-4.ml-4.list-disc.text-nord14",
      "div.space-y-5.mb-5",
      "div.under_player",
      "div[style='width: 300px; height: 250px;']"
    ];
    for (const selector of selectors) {
      document.querySelectorAll(selector).forEach(el => el.remove());
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  // 注入样式，防止横向滚动条
  const style = document.createElement('style');
  style.textContent = `body { overflow-x: hidden !important; }`;
  document.head.appendChild(style);

  // 禁用 window.open
  Object.defineProperty(window, 'open', {
    value: () => null,
    writable: false
  });

  // 阻止视频在失焦时暂停
  const fakeVisibility = () => {
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
  };

  document.addEventListener('visibilitychange', fakeVisibility, true);
  fakeVisibility();
})();

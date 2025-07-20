(function () {
  'use strict';

  // 通过选择器删除常见广告容器
  const selectors = [
    'iframe',                       // 广告 iframe
    'div[id*="ad"]',
    'div[class*="ad"]',
    'div[class*="ads"]',
    'div[class*="banner"]',
    'div[class*="pop"]',
    'div[class*="float"]',
    'div[style*="z-index: 999"]',
    'div[style*="fixed"]',
    '#ad', '.ad', '.adsbygoogle',  // 常见类名
    '.vjs-ads-ui'                  // 视频广告 UI
  ];

  function removeAds() {
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        el.remove();
      });
    });
  }

  function removeEmptyContainers() {
    document.querySelectorAll('div, section, aside').forEach(el => {
      const style = window.getComputedStyle(el);
      if (
        (el.innerHTML.trim() === '' || el.children.length === 0) &&
        (style.height === '0px' || parseInt(style.height) < 50)
      ) {
        el.remove();
      }
    });
  }

  const observer = new MutationObserver(() => {
    removeAds();
    removeEmptyContainers();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 初始运行
  window.addEventListener('DOMContentLoaded', () => {
    removeAds();
    removeEmptyContainers();
  });

  window.addEventListener('load', () => {
    setTimeout(() => {
      removeAds();
      removeEmptyContainers();
    }, 1000);
  });
})();

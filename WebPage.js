(function () {
  'use strict';

  // 删除iframe和特定的div元素
  function removeElements() {
    const allElements = document.querySelectorAll(
      'div[class^="root"], ' +
      'div[class*="fixed"][class*="right-"][class*="bottom-"], ' +
      'div[class*="pt-"][class*="pb-"][class*="px-"]:not([class*="sm:"]), ' +
      'div[class*="lg:hidden"], ' +
      'div[class*="lg:block"], ' +
      'div.ts-outstream-video, ' +
      'div.grid.md\\:grid-cols-2.gap-8, ' +
      'iframe'
    );

    allElements.forEach(el => {
      if (el.tagName.toLowerCase() === 'iframe') {
        el.remove();
      } else {
        el.style.display = 'none';
      }
    });
  }

  // 节流函数，防止频繁触发
  function throttle(fn, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return fn(...args);
    }
  }

  // 监听DOM变化并执行处理函数
  const observer = new MutationObserver(throttle(() => {
    removeElements();
  }, 500));
  observer.observe(document, { childList: true, subtree: true });

  setTimeout(removeElements, 2500);
  removeElements();

  document.addEventListener('click', () => {
    window.open = () => { };
  });

  // 禁用 window.open 并修改视频暂停逻辑
  document.addEventListener('ready', () => {
    window.open = () => { };
    const pause = window.player.pause;
    window.player.pause = () => {
      if (document.hasFocus()) {
        pause();
      }
    }
  });

})();

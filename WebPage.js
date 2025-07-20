// ==UserScript==
// @name         missav去广告（保留标题截断）
// @namespace    http://tampermonkey.net/
// @version      0.7.5
// @description  去除 missav 页面广告，阻止弹窗，自动暂停视频，但保留视频标题省略样式（不展开标题）
// @author       mrhydra（修改：ChatGPT）
// @license      MIT
// @match        *://*.missav.com/*
// @match        *://missav.com/*
// @match        *://*.missav.ws/*
// @match        *://missav.ws/*
// @match        *://*.missav.ai/*
// @match        *://missav.ai/*
// @icon         https://www.google.com/s2/favicons?domain=missav.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const hostname = window.location.hostname;
    const origin = window.location.origin;

    // 清理class并将特定文本转换为链接（保留标题截断）
    function clearClassAndConvertToLink() {
        const allDivs = document.querySelectorAll('div.my-2.text-sm.text-nord4.truncate, div.flex-1.min-w-0');
        console.log(`[missav页面修改] 找到 ${allDivs.length} 个需要处理的元素`);

        allDivs.forEach(div => {
            console.log(`[missav页面修改] 正在处理的 div 的 class 属性: ${div.className}`);

            if (div.matches('div.my-2.text-sm.text-nord4.truncate')) {
                const a = div.querySelector('a');
                if (a && a.href.includes(hostname)) {
                    // 不清除 className，保留省略样式
                }
            } else if (div.matches('div.flex-1.min-w-0')) {
                const h2 = div.querySelector('h2');
                if (h2) {
                    const text = h2.innerText;
                    const link = document.createElement('a');
                    link.href = `${origin}/genres/${text}`;
                    link.innerText = text;
                    h2.innerHTML = '';
                    h2.appendChild(link);
                    console.log(`[missav页面修改] 已将 "${text}" 转为链接`);
                }
            }
        });
    }

    // 删除广告元素和 iframe
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

        console.log(`[missav页面修改] 找到 ${allElements.length} 个需要处理的广告元素`);

        allElements.forEach(el => {
            if (el.tagName.toLowerCase() === 'iframe') {
                console.log(`[missav页面修改] 移除 iframe`);
                el.remove();
            } else {
                console.log(`[missav页面修改] 隐藏 div：${el.className}`);
                el.style.display = 'none';
            }
        });
    }

    // 节流函数，防抖 DOM 监听
    function throttle(fn, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) return;
            lastCall = now;
            return fn(...args);
        };
    }

    // 监听 DOM 变动
    const observer = new MutationObserver(throttle(() => {
        console.log('[missav页面修改] DOM变动检测');
        clearClassAndConvertToLink();
        removeElements();
    }, 500));
    observer.observe(document, { childList: true, subtree: true });

    // 初始化执行
    console.log('[missav页面修改] 初始化中...');
    setTimeout(clearClassAndConvertToLink, 2500);
    clearClassAndConvertToLink();
    removeElements();

    // 禁止 window.open 弹窗
    document.addEventListener('click', () => {
        window.open = () => { };
    });

    // 视频自动暂停（聚焦时）
    document.addEventListener('ready', () => {
        console.log('ready');
        window.open = () => { };
        const pause = window.player?.pause;
        if (pause) {
            window.player.pause = () => {
                console.log('自动暂停检查');
                if (document.hasFocus()) {
                    pause();
                }
            };
        }
    });
})();

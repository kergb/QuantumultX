//LINK - 删除广告
    function removeElements() {
        document.querySelectorAll('div[class*="lg:hidden"]')
        const allElements = document.querySelectorAll(
            'div[class^="root"], ' +//右下角弹出窗
            'div[class*="fixed"][class*="right-"][class*="bottom-"], ' +
            'div[class*="pt-"][class*="pb-"][class*="px-"]:not([class*="sm:"]), ' +
            'div[class*="lg:hidden"], ' +//视频下方广告
            'div[class*="lg:block"], ' +
            'div.ts-outstream-video, ' +//页面底部广告
            'iframe,' +
            'ul.mb-4.list-none.text-nord14,' +//视频下面跳官方广告telegram,和一些其他的广告
            '.prose,' +//石床澪
            'img[alt="MissAV takeover Fanza"]'//石床澪图片
        )
        //  console.log(`[missav页面修改] 找到 ${allElements.length} 个需要处理的元素`)
        allElements.forEach(el =&gt; {
            if (el.tagName.toLowerCase() === 'iframe') {
                console.log(`[missav页面修改] 正在移除的 iframe 元素`)
                el.remove()
            } else {
                //  console.log(`[missav页面修改] 正在隐藏的 div 元素，class 属性: ${el.className}`)
                el.style.display = 'none'
            }
        })
    }
    //LINK - 节流函数
    function throttle(fn, delay) {
        let lastCall = 0
        return function (...args) {
            const now = new Date().getTime()
            if (now - lastCall &lt; delay) {
                return
            }
            lastCall = now
            return fn(...args)
        }
    }

    function toLink() {
        const origin = window.location.origin
        const allDivs = document.querySelectorAll('div.my-2.text-sm.text-nord4.truncate, div.flex-1.min-w-0')
        // console.log(`[missav页面修改] 找到 ${allDivs.length} 个需要处理的元素`)
        allDivs.forEach(div =&gt; {
            if (div.matches('div.flex-1.min-w-0')) {
                const h2 = div.querySelector('h2')
                if (h2) {
                    const text = h2.innerText
                    const link = document.createElement('a')
                    link.href = `${origin}/genres/${text}`
                    link.innerText = text
                    h2.innerHTML = ''
                    h2.appendChild(link)
                    console.log(`[missav页面修改] 已经将文本 "${text}" 转换为链接`)
                }
            }
        })
    }

    // 取消打开新窗口行为
    unsafeWindow.open = () =&gt; { }

    //LINK - 页面加载之后执行操作
    document.addEventListener('DOMContentLoaded', () =&gt; {

        GM_addStyle(`div.my-2.text-sm.text-nord4.truncate { white-space: normal;}`)
        const observer = new MutationObserver(throttle(() =&gt; {
            removeElements()
            toLink()

        }, 500))
        observer.observe(document, { childList: true, subtree: true })
    })

    document.addEventListener('ready', () =&gt; {
        //自动点击视频`显示更多`
        const showMore = document.querySelector('a.text-nord13.font-medium.flex.items-center')
        if (showMore) { showMore.click() }

        // 取消页面没焦点自动暂停
        const pause = unsafeWindow.player.pause
        if (videoSettings.autoPauseDisable == 0) {
            unsafeWindow.player.pause = () =&gt; {
                if (document.hasFocus()) {
                    pause()
                }
            }
        }
    })

})()

/*******************************
 * Quantumult X JSON 过滤脚本
 * 理智日历 + 随申云 adspool
 *******************************/

const blockList = [
  "实用工具",
  "会员下icon",
  "天气页面_右上角图标",
  "天气页面_24小时",
  "天气页面_15日",
  "每日插屏",
  "下拉屏保",
  "星座Tab（黄历页）"
];

let url = $request.url;
let body = JSON.parse($response.body);

// 理智日历 cal_module
if (url.includes("cal_module")) {
  if (Array.isArray(body.data)) {
    body.data = body.data.filter(i => !blockList.includes(i.module_name));
  }
}

// 随申云 adspool
if (url.includes("adspool")) {
  if (Array.isArray(body.data)) {
    body.data = body.data
      .map(item => {
        if (Array.isArray(item.layout)) {
          item.layout = item.layout.filter(l => !blockList.includes(l.key_name));
        }
        return item;
      })
      .filter(item => item.layout && item.layout.length > 0);
  }
}

$done({ body: JSON.stringify(body) });

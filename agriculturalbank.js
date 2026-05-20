// 中国农业银行开屏广告
// Quantumult X / Surge
// 类型：request-header

const url = $request.url;
const headopt = $request.headers["operation-type"];

if (url.includes("/mobilepaas.abchina.com.cn:441/mgw")) {
  const listbankabc = [
    "com.bankabc.recommendcenter.homepage.gethpadverinfo",
    "com.abchina.mbank.common.homepage.getStartParam"
  ];

  if (listbankabc.includes(headopt)) {
    $done({});
  } else {
    $done();
  }
} else {
  $done();
}

if (!/html&gt;/.test($response.body)) {
  $done({});
} else {
  let body = $response.body;

  // javdb去顶部域名,
  body = body.replace(
    /&lt;\/head&gt;/,
    "&lt;style&gt; .sub-header, .app-desktop-banner, .moj-content {display:none!important;} &lt;/style&gt; \n &lt;/head&gt;"
  );

  // 隐藏百度知道，搜索广告、广告图标
  body = body.replace(
    "&lt;head&gt;",
    "&lt;head&gt;&lt;style&gt; .ec_ad_results, .ad-icon, .wpbyuwfarr-ecom-ads, div[class*=fc-][tplid], .w-question-list[data-sign], .ec-ad{display:none!important} &lt;/style&gt;"
  );

  $done({ body });
}

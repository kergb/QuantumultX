// 可选：广告隐藏样式（如果你希望彻底干净可以删除这两个常量）
const CSS_URL = "https://limbopro.com/CSS/Adblock4limbo.user.css";

const TITLE_INJECTION = `</title>
<link rel="stylesheet" href="${CSS_URL}" type="text/css" />
`;

const BODY_INJECTION = `
<link rel="stylesheet" href="${CSS_URL}" type="text/css" />
</body>
`;

// 匹配目标网站
const TARGET_SITES_REGEX = /(missav|netflav|supjav|njav|javday)/i;
const JAVBUS_REGEX = /javbus/i;
const HUARENLIVE_REGEX = /huaren\.live\/player\/ec\.php/i;

// 结构替换规则
const TITLE_REGEX = /<\/title>/i;
const BODY_REGEX = /<\/body>/i;
const WINDOW_OPEN_REGEX = /window\.open/g;

// 主体处理逻辑
function processResponse() {
    const requestUrl = $request.url;
    let responseBody = $response.body;

    if (!responseBody) {
        console.log("响应体为空");
        $done({ url: requestUrl });
        return;
    }

    const isTargetSite = requestUrl.match(TARGET_SITES_REGEX);
    const isJavbus = requestUrl.match(JAVBUS_REGEX);
    const isHuarenlive = requestUrl.match(HUARENLIVE_REGEX);

    if (isTargetSite) {
        responseBody = responseBody
            .replace(TITLE_REGEX, TITLE_INJECTION)
            .replace(WINDOW_OPEN_REGEX, ""); // 去除 window.open 弹窗行为
    } else if (isJavbus) {
        responseBody = responseBody.replace(BODY_REGEX, BODY_INJECTION);
    } else if (isHuarenlive) {
        responseBody = responseBody
            .replace(/"time":"20"/g, '"time":"0"')
            .replaceAll(/"img":\s*"[^"]*"/g, '"img": ""');
    } else {
        responseBody = responseBody.replace(TITLE_REGEX, TITLE_INJECTION);
    }

    const responseHeaders = {
        ...$response.headers,
        "Cross-Origin-Embedder-Policy": "unsafe-none",
        "Cross-Origin-Opener-Policy": "unsafe-none",
        "Cross-Origin-Resource-Policy": "cross-origin"
    };

    delete responseHeaders["Content-Security-Policy"];
    delete responseHeaders["X-Frame-Options"];
    delete responseHeaders["Referrer-Policy"];

    $done({
        headers: responseHeaders,
        body: responseBody,
        url: requestUrl
    });
}

// 执行
try {
    processResponse();
} catch (error) {
    console.log(`处理失败: ${error.message}`);
    $done({ url: $request.url, body: $response.body, headers: $response.headers });
}

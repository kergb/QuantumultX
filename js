// CSS resource for ad removal
const CSS_URL = "https://limbopro.com/CSS/Adblock4limbo.user.css";

// HTML injection strings (仅注入 CSS)
const TITLE_INJECTION = `</title>
<link rel="stylesheet" href="${CSS_URL}" type="text/css" />
`;

const BODY_INJECTION = `
<link rel="stylesheet" href="${CSS_URL}" type="text/css" />
</body>
`;

// Regular expressions for URL matching
const TARGET_SITES_REGEX = /(missav|netflav|supjav|njav|javday)/i;
const JAVBUS_REGEX = /javbus/i;
const HUARENLIVE_REGEX = /huaren\.live\/player\/ec\.php/i;

// Regular expressions for content manipulation
const TITLE_REGEX = /<\/title>/i;
const BODY_REGEX = /<\/body>/i;
const WINDOW_OPEN_REGEX = /window\.open/g;

// Main function to process response
function processResponse() {
    const requestUrl = $request.url;
    let responseBody = $response.body;

    if (!responseBody) {
        console.log("Response body is null or undefined");
        $done({ url: requestUrl });
        return;
    }

    const isTargetSite = requestUrl.match(TARGET_SITES_REGEX);
    const isJavbus = requestUrl.match(JAVBUS_REGEX);
    const isHuarenlive = requestUrl.match(HUARENLIVE_REGEX);

    if (isTargetSite) {
        responseBody = responseBody
            .replace(TITLE_REGEX, TITLE_INJECTION)
            .replace(WINDOW_OPEN_REGEX, "");
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

try {
    processResponse();
} catch (error) {
    console.log(`Error processing response: ${error.message}`);
    $done({ url: $request.url, body: $response.body, headers: $response.headers });
}

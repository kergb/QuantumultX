let body = $response.body;

const injectedScript = `
<script>
(() => {
  'use strict';

  // ===== 广告清理 =====
  const adSelectors = [
    "iframe",
    "a[href*='bit.ly']",
    "a[href*='/vip']",
    "div.under_player",
    "div[style*='z-index: 1001']"
  ];

  const cleanAds = () => {
    for (const selector of adSelectors) {
      document.querySelectorAll(selector).forEach(el => el.remove());
    }
  };

  cleanAds();

  new MutationObserver(cleanAds).observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // ===== 禁止 window.open =====
  try {
    Object.defineProperty(window, 'open', {
      value: () => null,
      writable: false
    });
  } catch (e) {
    window.open = () => null;
  }

  // ===== 防失焦暂停 =====
  const preventPause = () => {

    try {
      Object.defineProperty(document, 'hidden', {
        get: () => false
      });

      Object.defineProperty(document, 'visibilityState', {
        get: () => 'visible'
      });

    } catch (e) {}

    const blockEvent = e => e.stopImmediatePropagation();

    [
      'visibilitychange',
      'webkitvisibilitychange',
      'blur'
    ].forEach(event => {
      document.addEventListener(event, blockEvent, true);
      window.addEventListener(event, blockEvent, true);
    });

    setInterval(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    }, 1500);
  };

  setTimeout(preventPause, 3000);

})();
</script>
`;

if (body.includes('</head>')) {
  body = body.replace('</head>', injectedScript + '</head>');
} else {
  body += injectedScript;
}

$done({ body });

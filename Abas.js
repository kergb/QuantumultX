/////////////////////////////////////////////////////
// MissAV 广告脚本拦截
/////////////////////////////////////////////////////

const BLOCK_KEYWORDS = [
  "creative.myavlive.com",
  "myavlive",
  "Spot/lib.js",
  "theporndude",
  "bit.ly",
  "exoclick",
  "juicyads",
  "trafficjunky",
  "popads"
];

// 删除已经存在的广告 script
document.querySelectorAll("script").forEach(s => {
  const src = (s.src || "").toLowerCase();
  if (BLOCK_KEYWORDS.some(k => src.includes(k.toLowerCase()))) {
    s.remove();
  }
});

/////////////////////////////////////////////////////
// 拦截动态插入广告节点
/////////////////////////////////////////////////////

(function () {

  function isAdNode(node) {

    if (!node || node.nodeType !== 1) return false;

    const txt = (
      node.outerHTML ||
      node.src ||
      node.href ||
      ""
    ).toLowerCase();

    return BLOCK_KEYWORDS.some(k => txt.includes(k.toLowerCase()));
  }

  const rawAppend = Node.prototype.appendChild;

  Node.prototype.appendChild = function (node) {

    if (isAdNode(node)) {
      return node;
    }

    return rawAppend.call(this, node);
  };

  const rawInsert = Node.prototype.insertBefore;

  Node.prototype.insertBefore = function (node, ref) {

    if (isAdNode(node)) {
      return node;
    }

    return rawInsert.call(this, node, ref);
  };

})();
// ==== 2. 禁 window.open + 广告跳转 ====

const BLOCK_URL = /myavlive|theporndude|bit\.ly|exoclick|juicyads|trafficjunky|popads/i;

try {
  Object.defineProperty(window, "open", {
    value: function (url) {
      if (url && BLOCK_URL.test(url)) return null;
      return null;
    },
    writable: false,
    configurable: true
  });
} catch (e) {
  window.open = function () {
    return null;
  };
}

// 点击广告链接直接拦截
document.addEventListener("click", function(e){

    const a = e.target.closest("a");

    if(!a) return;

    if(BLOCK_URL.test(a.href)){
        e.preventDefault();
        e.stopImmediatePropagation();
    }

},true);
const preventPause = () => {

    try{

        Object.defineProperty(document,"hidden",{
            get:()=>false,
            configurable:true
        });

        Object.defineProperty(document,"visibilityState",{
            get:()=> "visible",
            configurable:true
        });

        Object.defineProperty(document,"webkitHidden",{
            get:()=>false,
            configurable:true
        });

    }catch(e){}

    [
        "visibilitychange",
        "webkitvisibilitychange",
        "blur",
        "focus",
        "pagehide"
    ].forEach(event=>{

        window.addEventListener(event,e=>{
            e.stopImmediatePropagation();
        },true);

        document.addEventListener(event,e=>{
            e.stopImmediatePropagation();
        },true);

    });

    setInterval(()=>{

        document.dispatchEvent(new Event("visibilitychange"));
        document.dispatchEvent(new Event("webkitvisibilitychange"));

    },1500);

};

setTimeout(preventPause,3000);

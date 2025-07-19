let url = $request.url;
let body = $response.body;
// === 1. 针对 i4.cn 应用市场广告过滤 ===
if (url.includes("list-app-m.i4.cn")) {
    let i = JSON.parse(body);
    // 清空推荐应用列表
    i.app && (i.app = []);
    i.adli && (i.adli = []);
    i.list && (i.list = []);
    i.ad && (i.ad = []);
    $done({ body: JSON.stringify(i) });
} else {
    let obj = JSON.parse(body);

    // === 2. 闲鱼首页：去除顶部标签、banner图、广告 sections、部分模块 ===
    if (url.includes("/gw/mtop.taobao.idlehome.home.nextfresh")) {
        delete obj.data.widgetReturnDO;
        delete obj.data.bannerReturnDO;

        if (obj.data?.sections) {
            // 过滤广告和首页推荐区块
            obj.data.sections = obj.data.sections.filter(section =>
                !(section.data && (section.data.bizType === "AD" || section.data.bizType === "homepage"))
            );

            // 过滤掉指定名称的模块
            let excludeNames = ['fish_home_yunying_card_d3', 'idlefish_seafood_market', 'fish_home_chat_room'];
            obj.data.sections = obj.data.sections.filter(section =>
                !excludeNames.includes(section.template.name)
            );
        }

        // 清空顶部菜单图标
        obj.data.homeTopList = [];
    }

    // === 3. 闲鱼本地首页广告过滤 ===
    if (url.includes("/gw/mtop.taobao.idle.local.home")) {
        if (obj.data?.sections) {
            obj.data.sections = obj.data.sections.filter(section =>
                !(section.data && section.data.bizType === "AD")
            );
        }
    }

    // === 4. 首页模块容器（鲸模块）清除 ===
    if (url.includes("/gw/mtop.taobao.idle.home.whale.modulet")) {
        delete obj.data.container.sections;
    }

    // === 5. 弹窗广告内容屏蔽 ===
    if (url.includes("/gw/mtop.taobao.idlemtopsearch.search.shade") || url.includes("/gw/mtop.taobao.idle.user.strategy.list")) {
        delete obj.data;
    }

    // === 6. 我的页面信息净化 ===
    if (url.includes("/mtop.idle.user.page.my.adapter")) {
        // 移除动态提醒、底部图标、回收横幅
        const indexArr = ["3", "6", "4"];
        obj.data.container.sections = obj.data.container.sections.filter(item => !indexArr.includes(item.index));
        obj.data.ability = [];

        // 删除等级字段
        obj.data.container.sections.forEach(section => {
            if (section.index === "1") {
                delete section.item.level;
            }

            // 处理小菜单工具项，保留指定的 ToolId
            if (section.index === "5") {
                const targetToolIds = [20, 1, 13, 26];
                const filteredTools = [
                    section.item.tool.exContent.tools.flatMap(subArray =>
                        subArray.filter(tool => targetToolIds.includes(tool.exContent.toolId))
                    )
                ];
                section.item.tool.exContent.tools = filteredTools;
            }
        });
    }

    // === 7. 圈子内容过滤和样式简化 ===
    if (url.includes("/mtop.taobao.idlehome.home.circle.list")) {
        if (obj.data && obj.data.circleList) {
            obj.data.circleList.forEach(circle => {
                circle.showType = "text";
                if (circle.showInfo?.titleImage) delete circle.showInfo.titleImage;
                if (circle.circleId === "2") circle.showInfo.atmosphereImageUrl = "";
            });
        }
    }

    // === 8. 搜索结果广告过滤 + 分类卡片过滤 ===
    if (url.includes("/gw/mtop.taobao.idlemtopsearch.search")) {
        if (obj.data?.resultList instanceof Array) {
            // 过滤 isAliMaMaAD 为 true 的广告
            obj.data.resultList = obj.data.resultList.filter(item => {
                const adFlag = item?.data?.item?.main?.exContent?.isAliMaMaAD;
                return !(adFlag === true || adFlag === "true");
            });

            // 移除分类选择卡片
            obj.data.resultList = obj.data.resultList.filter(item =>
                item.data.template.name !== "idlefish_search_card_category_select"
            );
        }
    }

    // === 9. 各种推荐卡片与 banner 清除 ===
    if (url.includes("/mtop.taobao.idle.group.myself.banner")) obj.data.bannerList = [];
    if (url.includes("/mtop.taobao.idle.playboy.recommend")) {
        obj.data.recommends = [];
        obj.data.items = [];
        obj.data.next = false;
    }
    if (url.includes("/mtop.taobao.idle.item.recommend.list")) obj.data.cardList = [];

    // === 10. 附近闲置物品详情页净化 ===
    if (url.includes("/mtop.taobao.idle.local.nearby.itemdetail.enter/1.0")) {
        obj.data.targetUrl = "";
        obj.data.trackParams.itemIds = "";
        obj.data.nearbyItemInfoList = [];
        obj.data.name = "";
        obj.data.desc = "";
        obj.data.poiName = "";
    }

    // === 11. 消息中心过滤系统消息（sessionType=25）===
    if (url.includes("/gw/mtop.taobao.idlemessage.session.sync/3.0")) {
        obj.data.sessions = obj.data.sessions.filter(session =>
            session.session.sessionType !== "25"
        );
    }

    // === 12. 关注推荐 feed 过滤，仅保留 cardType 为 9999，去除副标题 ===
    if (url.includes("idle.fun.follow.feed.list")) {
        obj.data.sections = obj.data.sections.filter(section => section.cardType === 9999);
        obj.data.sections.forEach(section => {
            if (section.cardData?.subText) section.cardData.subText = "";
        });
    }

    // === 13. 其他杂项清除 ===
    if (url.includes("idle.fun.follow.often.visit")) obj.data.sections = [];
    if (url.includes("idle.circle.myself.banner/1.0")) obj.data.bannerList = [];
    if (url.includes("idle.circle.visited/1.0")) obj.data.visitedCircleList = [];
    if (url.includes("follow.recommend.feed.list")) {
        obj.data.needDecryptKeys = [];
        obj.data.nextPage = false;
        obj.data.fitRecommendAB = true;
    }

    // === 14. 首页活动组件过滤 ===
    if (url.includes("/mtop.taobao.idle.local.flow.plat.section")) {
        const keyArr = ["fish_home_activity_enter_cardV1"];
        obj.data.data.components = obj.data.data.components.filter(item =>
            !keyArr.includes(item.key)
        );
    }

    $done({ body: JSON.stringify(obj) });
}

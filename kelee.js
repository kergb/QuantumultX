let url = $request.url;
let body = $response.body;
let obj = JSON.parse(body);

const regex =
    /loon:\/\/import\?plugin=(https:\/\/kelee\.one\/Tool\/Loon\/Lpx\/(.+?)\.lpx)/;

obj.lists.forEach((item) => {
    if (item?.url) {
        const match = item.url.match(regex);
        if (match) {
            item.url = `https://quantumult.app/x/open-app/add-resource?remote-resource=%7B%0A%20%20%22rewrite_remote%22%20%3A%20%5B%0A%22${match[1]}%2C%20tag%3D${match[2]}%2C%20update-interval%3D172800%2C%20opt-parser%3Dtrue%2C%20inserted-resource%3Dtrue%2C%20enabled%3Dtrue%22%0A%20%20%5D%0A%7D`;
        }
    }
});

body = JSON.stringify(obj);
$done({ body });

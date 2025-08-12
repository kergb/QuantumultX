try {
  let obj = JSON.parse($response.body);
  obj.needupdate = 0;
  // 部分接口可能是 needUpdate 或 updateNeeded，这里一起兼容
  if (obj.needUpdate !== undefined) obj.needUpdate = 0;
  if (obj.updateNeeded !== undefined) obj.updateNeeded = 0;
  $done({ body: JSON.stringify(obj) });
} catch (e) {
  $done($response);
}

const TOKEN = '' // 服务端同学提供
const IP_ADDRESS = 'https://m.zhiwai.ai/api/v1'
// const IP_ADDRESS = 'http://test.zhiwai.ai/api/v1'

var utilMd5 = require('/md5.js')   

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var signDatas = function(datas) {
    // let token = TOKEN;
    // let nonce = randomString(10);
    // let timestamp = (new Date()).valueOf();
    // let signstr = timestamp + token + nonce;
    // let sign = utilMd5.hexMD5(signstr);
    // datas.nonce = nonce + '';
    // datas.timestamp = timestamp + '';
    // datas.sign = sign + '';
    return datas
}

var fullUrl = function(api) {
    return IP_ADDRESS + api + "?test=test";
}

var randomString = function (len) {
  len = len || 32;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  let maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

module.exports = {
  IP_ADDRESS: IP_ADDRESS,
  formatTime: formatTime,
  signDatas: signDatas,
  fullUrl: fullUrl
}

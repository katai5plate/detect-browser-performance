/**
 * 必須:
 * - detect-es.js
 * - クラス xhr-test と src が付与された script タグ
 *
 * ブロック条件:
 * - ES8 完全対応
 * - ES9 一部対応 (オブジェクトのspread, for-await-of)
 * - base64 対応
 * - WEBGL 完全対応 (experimental-webgl 禁止)
 * - ローカルファイルアクセス
 * - Web Audio API 対応
 */

window.lowPerformanceBlocker = function () {
  var reasons = [];
  var tryit = function (reason, code) {
    try {
      if (typeof code === "string") {
        new Function(code);
        return;
      }
      if (!!code()) return;
    } catch (e) {console.warn(e)}
    reasons.push(reason);
  };
  tryit("ES8", function () {
    return detectES(8);
  });
  tryit("ES9 Rest/Spread Properties", "(()=>({...[1,2]}))()");
  tryit("ES9 for-await-of", "async()=>{for await (let x of []) {}}");
  tryit("base64 conversions", function () {
    return "atob" in window && "btoa" in window;
  });
  tryit("WEBGL (Full support)", function () {
    return document.createElement("canvas").getContext("webgl");
  });
  tryit("Reading local file", function () {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", document.querySelector("script.xhr-test").src);
    xhr.overrideMimeType("text/javascript");
    xhr.send();
    console.log(xhr);
    return true;
  });
  tryit("WEB Audio API", function () {
    return "AudioContext" in window || webkitAudioContext in window;
  });
  return { result: reasons.length === 0, reasons: reasons };
};

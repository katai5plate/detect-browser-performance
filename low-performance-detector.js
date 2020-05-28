/**
 * システム要件に合致するかどうかを調べる関数
 *
 * 必須:
 * - detect-es.js
 * - クラス xhr-test と src が付与された script タグ
 *
 * システム要件:
 * - ES8 完全対応
 * - ES9 一部対応
 *   - オブジェクトの spread
 *   - for-await-of
 *   - Promise.prototype.finally
 * - base64 対応
 * - WEBGL 完全対応 (experimental-webgl 禁止)
 * - ローカルファイルアクセス
 * - Web Audio API 対応
 * - Fetch API 対応
 */

window.lowPerformanceDetector = function (onComplete) {
  var reasons = [];
  var tryit = function (reason, code) {
    try {
      if (typeof code === "string") {
        new Function(code);
        return;
      }
      if (!!code()) return;
    } catch (e) {}
    reasons.push(reason);
  };
  tryit("ES6-8", function () {
    return new DetectES(8).start().result;
  });
  tryit(
    "ES9 Rest/Spread Properties",
    DetectES.codes.syntax.es9.filter(function (x) {
      return x.desc.indexOf("{...}") > -1;
    })[0].code
  );
  tryit(
    "ES9 for-await-of",
    DetectES.codes.syntax.es9.filter(function (x) {
      return x.desc.indexOf("for-await-of") > -1;
    })[0].code
  );
  tryit("ES9 Promise.prototype features", function () {
    return DetectES.testProps(
      DetectES.codes.props.es9.filter(function (x) {
        return x.parent.indexOf("Promise.prototype") > -1;
      })[0]
    ).result;
  });
  tryit("base64 conversions", function () {
    return "atob" in window && "btoa" in window;
  });
  tryit("WEBGL (Full support)", function () {
    return document.createElement("canvas").getContext("webgl");
  });
  tryit("WEB Audio API", function () {
    return "AudioContext" in window || "webkitAudioContext" in window;
  });
  tryit("Fetch API", function () {
    return "fetch" in window;
  });
  var xhrResult = null;
  try {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", document.querySelector("script.xhr-test").src);
    xhr.overrideMimeType("text/javascript");
    xhr.send();
    xhr.onload = function () {
      xhrResult = true;
    };
    xhr.onerror = function () {
      xhrResult = false;
    };
  } catch (e) {
    xhrResult = false;
  }
  var i = this.setInterval(function () {
    if (xhrResult !== null) {
      clearInterval(i);
      if (xhrResult === false) reasons.push("Reading local file");
      onComplete(reasons.length === 0, reasons);
    }
  }, 1);
};

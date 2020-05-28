https://katai5plate.github.io/detect-browser-performance/

# detect-browser-performance
簡易的にブラウザのスペックを解析する

## 独自調査

waw = web-audio-webkit  
-> おそらくiOS限定

- ツクール 1.6.2
  - 非対応: ES10, waw
- Android Firefox 68.8.1
  - 非対応: ES9(正規表現), waw
- Android Chrome
  - 非対応: waw
- Android Edge 45.03.4.4958
  - 非対応: waw
- IE 11.778.18362.0
  - 非対応: ES6-10, WEBGL(exp は OK), wa, waw, ハイフンDate
  - IE10: WEBGL 完全非対応, オンラインであってもローカルファイル読み込み不可
  - IE9: base64 完全非対応
  - IE8: `[].forEach` とかがない
- iOS Safari 604.1
  - 非対応: ES9(dotAll 以外の正規表現), ES10, wa, ハイフンDate
- Edge 44.18362.449.0 (旧版)
  - 非対応: ES6(Symbol 以外), ES9, ES10, waw
```
detect-es詳細:
オブジェクトのspread
RegExp:先or後読み, UnicodePropEsc, NamedCaptureGroups, /s
for-await-of
JSONスーパーセット
try-catchエラー省略
'flat' in window.Array.prototype
'flatMap' in window.Array.prototype
'fromEntries' in window.Object
'dotAll' in window.RegExp.prototype
'trimStart' in window.String.prototype
'trimEnd' in window.String.prototype
'match' in window.Symbol
'replace' in window.Symbol
'search' in window.Symbol
'split' in window.Symbol
'description' in window.Symbol.prototype
window.RegExp.prototype[Symbol.match]
window.RegExp.prototype[Symbol.replace]
window.RegExp.prototype[Symbol.search]
window.RegExp.prototype[Symbol.split]

LPB詳細:
ES8
ES9 Rest/Spread Properties
ES9 for-await-of
```

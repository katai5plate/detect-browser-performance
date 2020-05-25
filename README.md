https://katai5plate.github.io/detect-browser-performance/

# detect-browser-performance
簡易的にブラウザのスペックを解析する

## 独自調査

waw = web-audio-webkit  
-> おそらくiOS限定

- ツクール 1.6.2
  - 非対応: ES10, waw
- Android Firefox 68.8.1
  - 非対応: 一部ES9(正規表現関連), ES10, waw
- Android Chrome
  - 非対応: waw
- Android Edge 45.03.4.4958
  - 非対応: waw
- IE 11.778.18362.0
  - 非対応: ES6-10, WEBGL(expはOK), wa, waw
- iOS Safari 604.1
  - 非対応: 一部ES9(正規表現関連), ES10, wa

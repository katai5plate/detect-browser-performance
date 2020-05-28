/*
 * [[[ 使い方 ]]]
 * - JavaScript（スクリプト）上から実行する。
 * - new DetectES(N).start() を実行すると、Nに対応したESバージョンの動作テストを行う。
 * - 正常動作を確認したときは true が返り、そうでないなら警告ログと false が返る。
 *
 * new detectES(6).start() // ES6 をテスト
 * new detectES(7).start() // ES6-7 までテスト
 * new detectES(8).start() // ES6-8 までテスト
 * new detectES(9).start() // ES6-9 までテスト
 * new detectES(10).start() // ES6-10 までテスト
 * new detectES().start() // デフォルト動作として ES10 までテスト
 * new detectES(8, true).start() // ES8 "だけ" をテスト
 *
 * [[[ 構文テスト内容 ]]]
 * -- ES6 --
 * アロー関数, let/const宣言, for-of/in
 * class構文
 * Unicode
 * 分割代入, テンプレートリテラル, 配列/引数のspread, 可変長引数, デフォルト引数, メソッド定義
 * new.target構文
 * yield構文
 * 2/8/16進数リテラル
 * -- ES7 --
 * べき乗
 * TypedArray.prototype.includes
 * -- ES8 --
 * async/await
 * 末尾カンマ許容
 * -- ES9 --
 * オブジェクトのspread
 * RegExp:先or後読み, UnicodePropEsc, NamedCaptureGroups, /s
 * for-await-of
 * -- ES10 --
 * Well-formed JSON.stringify
 * JSONスーパーセット (MV1.6.2未対応)
 * try-catchエラー省略 (MV1.6.2未対応)
 */

(function () {
  try {
    window = global;
  } catch (e) {}

  var codes = {
    syntax: {
      es6: [
        [
          "()=>{}, let/const, for-of/in",
          "()=>{const a=[1,2,3];for(let i in a){for(let j of a){}}}",
        ],
        ["class, extemds", "class A{};class B extends A{};"],
        ["unicode", "var \\u{20BB7}='\\u{20BB7}';var x=/\\u{20BB7}/u;"],
        [
          "dest-assign, `${}`, [...], f(...), f(x=), {f()}",
          "((x=1)=>(...y)=>{var [c,d]=[1,2],{c:e,d:f}={c,d};let a={a(){}};a=1;var b=`${a}`;return{x,y:[...y,e,f],b}})()(1,2,3)",
        ],
        ["new.target", "function F(){return new.target};F();"],
        ["yield", "function *a(){yield;}"],
        ["0b/0o/0x", "[0b10,0o10,0x10]"],
      ],
      es7: [
        ["**", "()=>1**2"],
        ["[].includes", "[[].includes,(new Uint8Array()).includes]"],
      ],
      es8: [
        ["async/await", "async ()=>await Promise.resolve()"],
        ["last-comma", "((x=[1,2,],)=>({x,}))(1,)"],
      ],
      es9: [
        ["{...}", "(()=>({...[1,2]}))()"],
        [
          "regexp-features",
          "!['$a %a a'.replace(/(?<=$)a/g, 'b')===\"$b %a a\",/^p{gc=Letter}+$/u.test('aA\u3042\u30A2\uFF71\u4E9C'),/(?<a>d{1})-(?<b>d{2})/u.exec('1-22').groups.b===\"22\",!/x.y/s.test('x\\ny')].includes(false)",
        ],
        ["for-await-of", "async()=>{for await (let x of []) {}}"],
      ],
      es10: [
        [
          "well-formed-json-stringify",
          'JSON.stringify("\uD800")===\'"\\ud800"\'',
        ],
        ["json-superset", 'eval(\'"\u2028"\') === "\u2028"'],
        ["try-catch-no-error", "try{}catch{}"],
      ],
    },
    props: {
      es6: [
        [
          null,
          [
            "ArrayBuffer",
            "DataView",
            "Int8Array",
            "Uint8Array",
            "Uint8ClampedArray",
            "Int16Array",
            "Uint16Array",
            "Int32Array",
            "Uint32Array",
            "Float32Array",
            "Float64Array",
            "WeakSet",
            "WeakMap",
            "Proxy",
          ],
        ],
        ["Promise.prototype", ["then", "catch"]],
        ["Array", ["from", "of"]],
        [
          "Array.prototype",
          [
            "fill",
            "find",
            "findIndex",
            "entries",
            "keys",
            "copyWithin",
            "includes",
          ],
        ],
        ["Map.prototype", ["forEach", "entries", "keys", "values"]],
        ["Set.prototype", ["forEach", "entries", "keys", "values"]],
        [
          "Math",
          [
            "imul",
            "clz32",
            "fround",
            "log10",
            "log2",
            "log1p",
            "expm1",
            "cosh",
            "sinh",
            "tanh",
            "acosh",
            "asinh",
            "atanh",
            "hypot",
            "trunc",
            "sign",
            "cbrt",
          ],
        ],
        ["Date.prototype", ["toString"]],
        [
          "Number",
          [
            "isNaN",
            "isFinite",
            "isInteger",
            "parseInt",
            "parseFloat",
            "EPSILON",
            "MAX_SAFE_INTEGER",
            "MIN_SAFE_INTEGER",
            "isSafeInteger",
          ],
        ],
        [
          "Object",
          [
            "is",
            "setPrototypeOf",
            "assign",
            "getOwnPropertySymbols",
            "preventExtensions",
            "isExtensible",
            "getPrototypeOf",
            "setPrototypeOf",
          ],
        ],
        ["Object.prototype", ["__proto__"]],
        ["RegExp.prototype", ["toString"]],
        ["Object.prototype", ["__proto__"]],
        ["String", ["fromCodePoint", "raw"]],
        [
          "String.prototype",
          ["codePointAt", "startsWith", "endsWith", "repeat", "normalize"],
        ],
        [
          "Symbol",
          [
            "iterator",
            "for",
            "match",
            "species",
            "toPrimitive",
            "replace",
            "search",
            "split",
            "hasInstance",
          ],
        ],
      ],
      es7: [["String.prototype", ["includes"]]],
      es8: [
        ["Object", ["values", "entries", "getOwnPropertyDescriptors"]],
        ["String.prototype", ["padEnd", "padStart"]],
      ],
      es9: [
        ["Promise.prototype", ["finally"]],
        ["RegExp.prototype", ["dotAll"]],
      ],
      es10: [
        ["Array.prototype", ["flat", "flatMap"]],
        ["Object", ["fromEntries"]],
        ["String.prototype", ["trimStart", "trimEnd"]],
        ["Symbol.prototype", ["description"]],
      ],
    },
    propWithSymbols: {
      es6: [
        ["ArrayBuffer", ["species"]],
        ["Array", ["species"]],
        ["Map", ["species"]],
        ["Set", ["species"]],
        ["Date.prototype", ["toPrimitive"]],
        ["RegExp", ["species"]],
        ["RegExp.prototype", ["match", "replace", "search", "split"]],
        ["Symbol.prototype", ["toPrimitive"]],
      ],
    },
  };
  var convertCodes = function (t, a, b) {
    ["es6", "es7", "es8", "es9", "es10"].forEach(function (es) {
      var target = t[es];
      t[es] = !!target
        ? target.map(function (x) {
            var result = {};
            result[a] = x[0];
            result[b] = x[1];
            return result;
          })
        : target;
    });
  };
  convertCodes(codes.syntax, "desc", "code");
  convertCodes(codes.props, "parent", "children");
  convertCodes(codes.propWithSymbols, "target", "expects");

  window.DetectES = function (es, isOnly) {
    if (!(this instanceof window.DetectES)) return new DetectES(es, isOnly);
    if (typeof es !== "number" && es !== undefined)
      throw "Invalid argument: number|undefined";
    if (!(6 <= es && es <= 10) && es !== undefined)
      throw "Invalid argument: 6-10";

    this.esVersion = es === undefined ? 10 : es;
    this.isOnly = isOnly;
  };
  window.DetectES.codes = codes;

  var createTestCase = function (code, esVersion, isOnly) {
    var pick = function (trigger, value) {
      var cond = isOnly ? esVersion === trigger : esVersion >= trigger;
      return cond ? value || [] : [];
    };
    return concatArray([
      pick(6, code.es6),
      pick(7, code.es7),
      pick(8, code.es8),
      pick(9, code.es9),
      pick(10, code.es10),
    ]);
  };

  var testSyntax = function (code, esVersion, isOnly) {
    var data = createTestCase(code, esVersion, isOnly)
      .map(function (t) {
        var desc = t.desc;
        var code = t.code;
        try {
          new Function(code);
          return { desc: desc, code: code, e: undefined, result: true };
        } catch (e) {
          return { desc: desc, code: code, e: e, result: false };
        }
      })
      .filter(function (x) {
        return x.result === false;
      })
      .map(function (x) {
        x.error = x.e.toString();
        delete x.e, delete x.result;
        return x;
      });
    return {
      result: data.length === 0,
      data: data,
    };
  };
  window.DetectES.testSyntax = testSyntax;
  window.DetectES.prototype.testSyntax = function (code) {
    return testSyntax(code, this.esVersion, this.isOnly);
  };

  var testProps = function (code, esVersion, isOnly) {
    var data = createTestCase(code, esVersion, isOnly).reduce(function (p, t) {
      var a = t.parent;
      var b = t.children;
      return concatArray([
        p,
        b.map(function (c) {
          var code = "'" + c + "' in " + (a ? "window." + a : "window");
          try {
            return [code, eval(code)];
          } catch (e) {
            return [code, false];
          }
        }),
      ]);
    }, []);
    return {
      result: data.length === 0,
      data: data,
    };
  };
  window.DetectES.testProps = testProps;
  window.DetectES.prototype.testProps = function (code) {
    return testProps(code, this.esVersion, this.isOnly);
  };

  var testPropWithSymbols = function (code, esVersion, isOnly) {
    var data = createTestCase(code, esVersion, isOnly).reduce(function (p, t) {
      var a = t.target;
      var b = t.expects;
      return concatArray([
        p,
        b.map(function (c) {
          var code = (a ? "window." + a : "window") + "[Symbol." + c + "]";
          try {
            return [code, !!eval(code)];
          } catch (e) {
            return [code, false];
          }
        }),
      ]);
    }, []);
    return {
      result: data.length === 0,
      data: data,
    };
  };
  window.DetectES.testPropWithSymbols = testPropWithSymbols;
  window.DetectES.prototype.testPropWithSymbols = function (code) {
    return testPropWithSymbols(code, this.esVersion, this.isOnly);
  };

  var concatArray = function (a) {
    return a.reduce(function (p, c) {
      return p.concat(c);
    }, []);
  };

  /**
   * @param {number|undefined} [es=10] 6-10
   * @param {boolean} [isOnly=false] true にすると指定の ES しか調べない
   */
  window.DetectES.prototype.start = function () {
    var resultSyntax = this.testSyntax(codes.syntax).data;
    var resultProps = concatArray([
      this.testProps(codes.props).data,
      this.testPropWithSymbols(codes.propWithSymbols).data,
    ])
      .filter(function (x) {
        return x[1] === false;
      })
      .map(function (x) {
        return x[0];
      });
    var errorLog = {
      syntax: resultSyntax.map(function (x) {
        return x.desc;
      }),
      props: resultProps,
    };
    var details = {
      syntax: resultSyntax,
      props: resultProps,
    };

    if (errorLog.syntax.length !== 0) {
      console.warn(
        "Your browser does not support " +
          (!this.isOnly ? "ES6 ～ " : "") +
          "ES" +
          this.esVersion +
          "! (syntax):",
        errorLog.syntax
      );
    }
    if (errorLog.props.length !== 0) {
      console.warn(
        "Your browser does not support " +
          (!this.isOnly ? "ES6 ～ " : "") +
          "ES" +
          this.esVersion +
          "! (props):",
        errorLog.props
      );
    }

    return {
      result: errorLog.syntax.length + errorLog.props.length === 0,
      syntax: errorLog.syntax,
      props: errorLog.props,
      details: details,
    };
  };
})();

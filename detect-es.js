/*
 * [[[ 使い方 ]]]
 * - JavaScript（スクリプト）上から実行する。
 * - window.detectES(N) を実行すると、Nに対応したESバージョンの動作テストを行う。
 * - 正常動作を確認したときは true が返り、そうでないなら警告ログと false が返る。
 *
 * detectES(6) // ES6 をテスト
 * detectES(7) // ES7 をテスト
 * detectES(8) // ES8 をテスト
 * detectES(9) // ES9 をテスト
 * detectES(10) // ES10 をテスト
 * detectES() // デフォルト動作として ES10 をテスト
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

/**
 * @param {number|undefined} [es=10] 6-10
 */
window.detectES = function (es) {
  if (typeof es !== "number" && es !== undefined)
    throw "無効な引数: number|undefined";
  if (!(6 <= es && es <= 10) && es !== undefined) throw "無効な引数: 6-10";
  var esVersion = es === undefined ? 10 : es;

  try {
    window = global;
  } catch (e) {}

  var concatArray = function (a) {
    return a.reduce(function (p, c) {
      return p.concat(c);
    }, []);
  };
  var branch = function (o) {
    return concatArray([
      esVersion >= 6 ? o.es6 || [] : [],
      esVersion >= 7 ? o.es7 || [] : [],
      esVersion >= 8 ? o.es8 || [] : [],
      esVersion >= 9 ? o.es9 || [] : [],
      esVersion >= 10 ? o.es10 || [] : [],
    ]);
  };

  var syntaxCode = branch({
    es6: [
      [
        "アロー関数, let/const宣言, for-of/in",
        "()=>{const a=[1,2,3];for(let i in a){for(let j of a){}}}",
      ],
      ["class構文", "class A{};class B extends A{};"],
      ["Unicode", "var \\u{20BB7}='\\u{20BB7}';var x=/\\u{20BB7}/u;"],
      [
        "分割代入, テンプレートリテラル, 配列/引数のspread, 可変長引数, デフォルト引数, メソッド定義",
        "((x=1)=>(...y)=>{var [c,d]=[1,2],{c:e,d:f}={c,d};let a={a(){}};a=1;var b=`${a}`;return {x,y:[...y,e,f],b}})()(1,2,3)",
      ],
      ["new.target構文", "function F(){return new.target};F();"],
      ["yield構文", "function *a(){yield;}"],
      ["2/8/16進数リテラル", "[0b10,0x10,0o10]"],
    ],
    es7: [
      ["べき乗", "()=>1**2"],
      ["TypedArray.prototype.includes", "(new Uint8Array()).includes"],
    ],
    es8: [
      ["async/await", "async ()=>await Promise.resolve()"],
      ["末尾カンマ許容", "((x=[1,2,],)=>({x,}))(1,)"],
    ],
    es9: [
      ["オブジェクトのspread", "(()=>({...[1,2]}))()"],
      [
        "RegExp:先or後読み, UnicodePropEsc, NamedCaptureGroups, /s",
        "!['$a %a a'.replace(/(?<=$)a/g, 'b')===\"$b %a a\",/^p{gc=Letter}+$/u.test('aA\u3042\u30A2\uFF71\u4E9C'),/(?<a>d{1})-(?<b>d{2})/u.exec('1-22').groups.b===\"22\",!/x.y/s.test('x\\ny')].includes(false)",
      ],
      ["for-await-of", "async()=>{for await (let x of []) {}}"],
    ],
    es10: [
      [
        "Well-formed JSON.stringify",
        'JSON.stringify("\uD800")===\'"\\ud800"\'',
      ],
      ["JSONスーパーセット", 'eval(\'"\u2028"\') === "\u2028"'],
      ["try-catchエラー省略", "try{}catch{}"],
    ],
  });
  var testProps = function () {
    var properties = [
      [
        null,
        branch({
          es6: [
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
        }),
      ],
      [
        "Promise.prototype",
        branch({ es6: ["then", "catch"], es9: ["finally"] }),
      ],
      ["Array", branch({ es6: ["from", "of"] })],
      [
        "Array.prototype",
        branch({
          es6: ["fill", "find", "findIndex", "entries", "keys", "copyWithin"],
          es10: ["flat", "flatMap"],
        }),
      ],
      [
        "Map.prototype",
        branch({ es6: ["forEach", "entries", "keys", "values"] }),
      ],
      [
        "Set.prototype",
        branch({ es6: ["forEach", "entries", "keys", "values"] }),
      ],
      [
        "Math",
        branch({
          es6: [
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
        }),
      ],
      ["Date.prototype", branch({ es6: ["toString"] })],
      [
        "Number",
        branch({
          es6: [
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
        }),
      ],
      [
        "Object",
        branch({
          es6: [
            "is",
            "setPrototypeOf",
            "assign",
            "getOwnPropertySymbols",
            "preventExtensions",
            "isExtensible",
            "getPrototypeOf",
            "setPrototypeOf",
          ],
          es8: ["values", "entries", "getOwnPropertyDescriptors"],
          es10: ["fromEntries"],
        }),
      ],
      ["Object.prototype", branch({ es6: ["__proto__"] })],
      ["RegExp.prototype", branch({ es6: ["toString"], es9: ["dotAll"] })],
      ["String", branch({ es6: ["fromCodePoint", "raw"] })],
      [
        "String.prototype",
        branch({
          es6: ["codePointAt", "startsWith", "endsWith", "repeat", "normalize"],
          es7: ["includes"],
          es8: ["padEnd", "padStart"],
          es10: ["trimStart", "trimEnd"],
        }),
      ],
      [
        "Symbol",
        branch({
          es6: [
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
        }),
      ],
      [
        "Symbol.prototype",
        branch({
          es10: ["description"],
        }),
      ],
    ];
    var symbols = branch({
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
    });
    return concatArray([
      properties.reduce(function (p, t) {
        var a = t[0];
        var b = t[1];
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
      }, []),
      symbols.reduce(function (p, t) {
        var a = t[0];
        var b = t[1];
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
      }, []),
    ])
      .filter(function (x) {
        return x[1] === false;
      })
      .map(function (x) {
        return x[0];
      });
  };

  var testSyntax = function () {
    return syntaxCode
      .map(function (t) {
        var desc = t[0];
        var code = t[1];
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
  };

  const errorLog = {
    syntax: testSyntax().map(function (x) {
      return x.desc;
    }),
    props: testProps(),
  };

  if (errorLog.syntax.length !== 0) {
    console.warn("動作要件を満たしていません(構文): \n", errorLog.syntax);
  }
  if (errorLog.props.length !== 0) {
    console.warn("動作要件を満たしていません(プロパティ): \n", errorLog.props);
  }

  return errorLog.syntax.length + errorLog.props.length === 0;
};

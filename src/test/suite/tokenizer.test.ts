import * as assert from "assert";
import { tokenize } from "../../tokenizer";
import { flatten, range } from "lodash";

type TestCase = [string, string[]];
const singleSymbolTests: TestCase[] = getAsciiSymbols().map((s) => [s, [s]]);

const tests: TestCase[] = [
  // Numbers
  ["0.0 0 1 120 2.5 0.1", ["0.0", "0", "1", "120", "2.5", "0.1"]],
  // Semantic versioning
  ["1.22.4", ["1", ".", "22", ".", "4"]],
  // Formatters and identifiers
  ["my variable", ["my", "variable"]],
  ["My Variable", ["My", "Variable"]],
  ["myVariable", ["myVariable"]],
  ["MyVariable", ["MyVariable"]],
  ["my_variable", ["my_variable"]],
  ["MY_VARIABLE", ["MY_VARIABLE"]],
  ["my__variable", ["my__variable"]],
  ["my-variable", ["my", "-", "variable"]],
  ["my.variable", ["my", ".", "variable"]],
  ["my/variable", ["my", "/", "variable"]],
  ["my::variable", ["my", "::", "variable"]],
  // Strings
  ['"my variable"', ['"', "my", "variable", '"']],
  ["'my variable'", ["'", "my", "variable", "'"]],
  // All single ascii symbols
  ...singleSymbolTests,
  // Repeatable symbols
  ["---|||///+++", ["---", "|||", "///", "+++"]],
  // Non repeatable symbols
  ["!!(()){{}}", ["!", "!", "(", "(", ")", ")", "{", "{", "}", "}"]],
  // Fixed tokens
  ["!=>=!====", ["!=", ">=", "!==", "=="]],
  ["=>", ["=>"]],
  ["::", ["::"]],
  ["->", ["->"]],
  ["??", ["??"]],
  ["\\r\\n\\t", ["\\r", "\\n", "\\t"]],
  // Comments
  ["// Hello world", ["//", "Hello", "world"]],
];

suite("tokenizer", () => {
  tests.forEach(([input, expectedOutput]) => {
    test(input, () => {
      const output = tokenize(input, (match) => match[0]);
      assert.deepStrictEqual(output, expectedOutput);
    });
  });
});

/**
    Returns an array of single non-alphanumeric symbols in various ascii ranges to make sure they don't get dropped by the tokeniser
*/
function getAsciiSymbols() {
  const rangesToTest = [
    ["!", "/"],
    [":", "@"],
    ["[", "`"],
    ["{", "~"],
  ];
  return flatten(
    rangesToTest.map(([start, end]) =>
      range(start.charCodeAt(0), end.charCodeAt(0) + 1).map((charCode) =>
        String.fromCharCode(charCode)
      )
    )
  );
}

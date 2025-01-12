import { printSpiral } from "./main.js";

const originalConsoleLog = console.log;
let logStr = "";
console.log = function (str: string) {
  if (logStr === "") {
    logStr = str;
  } else {
    logStr += "\n" + str;
  }
};
function getLogStr(): string {
  const result = logStr;
  logStr = "";
  return result;
}

const TESTS = {
  0: "0",
  1: "0\t1",
  2: "0\t1\n\t2",
  6: `6\t\t
5\t0\t1
4\t3\t2`,
  9: `6\t7\t8\t9
5\t0\t1\t
4\t3\t2\t`,
  12: `6\t7\t8\t9
5\t0\t1\t10
4\t3\t2\t11
\t\t\t12`,
  18: `\t6\t7\t8\t9
18\t5\t0\t1\t10
17\t4\t3\t2\t11
16\t15\t14\t13\t12`,
};
for (const [input, expected] of Object.entries(TESTS)) {
  logStr = "";
  printSpiral(Number(input));
  const actual = getLogStr();
  if (actual !== expected) {
    console.error(`Wrong output for '${input}'`);
    console.error(`expected:\n'${expected}'`);
    console.error(`actual:\n'${actual}'`);
    break;
  }
}

// console.log = originalConsoleLog;
// printSpiral(12);

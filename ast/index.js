const recast  = require('recast');
const fs = require("fs");
let code = fs.readFileSync("./test.js", "utf-8");
// let ast = recast.parse(code);
// console.log(ast);

const esprima = require('esprima');
// let code = 'const a = 1';
console.log(code);

const ast = esprima.parseScript(code);
console.log(ast);

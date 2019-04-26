const recast = require('recast');
const fs = require("fs");
let code = fs.readFileSync("./test.js", "utf-8");
let ast = recast.parse(code);
console.log(ast.program.body);



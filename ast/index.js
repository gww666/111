const recast = require('recast');
const {
    identifier, 
    importDefaultSpecifier, 
    importDeclaration, 
    importSpecifier,
    literal,
    arrowFunctionExpression,
    functionExpression,
    functionDeclaration,
    objectExpression,
    blockStatement,
    returnStatement,
    property
} = recast.types.builders;

const fs = require("fs");
let code = fs.readFileSync("./test.js", "utf-8");
let ast = recast.parse(code);
// ast.program.body.unshift(functionDeclaration(
//     identifier("ddf"),
//     [identifier("a"), identifier("b")],
//     blockStatement([returnStatement(literal(2))])
// ));
// ast.program.body.unshift(arrowFunctionExpression(
//     // [],
//     [identifier("a"), identifier("b")],
//     blockStatement(returnStatement(literal(2)))
// ));
// ast.program.body.unshift(importDeclaration(
//     [importDefaultSpecifier(identifier("test2"))],
//     literal("./components/test1")
// ));
ast.program.body.unshift(importDeclaration(
    [importSpecifier(identifier("test2"))],
    literal("./components/test2")
));

ast.program.body[1].declaration.elements.push(objectExpression([
    property("init", identifier("lala"), literal(123))
]))

const output = recast.print(ast).code;



console.log(output);


// console.log(importDeclaration);
// console.log(variableDeclaration);

// console.log(ast.program.body[0]);
// console.log(JSON.stringify(ast));
// console.log(JSON.stringify(ast.program.body[1].type));
// console.log("type", ast.program.body[1].type);
// console.log("type", ast.program.body[1].declaration.type);
// console.log("element", ast.program.body[1].declaration.elements[0]);



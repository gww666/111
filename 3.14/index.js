const Koa = require("koa");
const app = new Koa();
const test = require("./export");
console.log(test);

// app.use(ctx => {
//     ctx.body = "453";
// });
// app.listen(2237, "127.0.0.1", () => {
//     console.log("server is running on http://127.0.0.1:2237");
// });
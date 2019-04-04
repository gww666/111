const Koa = require("koa");
const app = new Koa();
app.use(ctx => {
    ctx.body = "hello word";
});
app.listen(2233, "127.0.0.1");
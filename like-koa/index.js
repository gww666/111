// const Koa = require("koa");
const Koa = require("./like-koa");
const KoaRouter = require("koa-router");
const app = new Koa();
let router = new KoaRouter();
router.get("/", (ctx, next) => {
    console.log("router");
    
    ctx.status = 200;
    ctx.body = "1233";
});
app.use(router.routes()).use(router.allowedMethods());
app.use((ctx, next) => {
    console.log("url", ctx.url);
    ctx.status = 200;
    ctx.body = "hello word";
});

app.listen(2236, "127.0.0.1", () => {
    console.log("server is running on http://127.0.0.1:2236");
});
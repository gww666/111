const http = require("http");

const server = http.createServer((req, res) => {
    let url = req.url;
    console.log("url", url);
    res.setHeader("content-type", "text/plain;charset=utf8");
    res.end("响应");
});
server.listen(2233, "127.0.0.1", () => {
    console.log("服务正在运行");
});
const http = require("http");
let server = http.createServer((req, res) => {
    res.end("lalala", () => {
        console.log("响应完成调用");
    });
});
server.listen(3400, "127.0.0.1", () => {
    console.log("http://127.0.0.1:3400");
});
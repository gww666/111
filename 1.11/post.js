const http = require("http");
const querystring = require("querystring");
const server = http.createServer((req, res) => {
    console.log("req.method", req.method);
    console.log("req.url", req.url);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    if (req.method === "POST" && req.url === "/test") {
        
        let body = "";
        req.on("data", chunk => {
            console.log("有接收到值");

            body += chunk;
        });
        req.on("end", () => {
            console.log("body", body);
            let params = JSON.parse(body);
            console.log(params);
            res.end("ok");
        });
    } else if (req.url = "/test2") {
        res.end("test2");
    } else {
        res.end("");
    }

});

server.listen(2334, "127.0.0.1", () => {
    console.log("run");
});
const http = require("http");
const fs = require("fs");
const {promisify} = require("util");
const readFile = promisify(fs.readFile);
let server = http.createServer(async (req, res) => {
    console.log("url", req.url);
    let url = req.url;
    if (url === "/index.html") {
        // res.setHeader("Cache-Control", "max-age=" + (1000 * 60));
        // res.setHeader("Cache-Control", "public");
        const reader = fs.createReadStream("./index.html");
        reader.pipe(res);
    } else if (url === "/userinfo") {
        res.setHeader("Cache-Control", "max-age=60");
        // res.writeHeader("200", OK)
        let data = await readFile("./user.json", "utf-8");
        res.end(data);
    } else {
        res.end();
    }
    
    // console.log("url", req.httpVersion);
    // res.end("正在输出文件");
});
server.listen(3300, "127.0.0.1", () => {
    console.log("server is runing on http://127.0.0.1:3300");
});
const http = require("http");
const port = 2233;
const hostname = "127.0.0.1";
const fs = require("fs");
const {promisify} = require("util");
const readFile = promisify(fs.readFile);
const {URL} = require("url");
const server = http.createServer(async (req, res) => {
    // console.log("req", req);
    
    let url = req.url;
    let headers = req.headers;
    // console.log("header", headers);
    let _url = new URL("http://" + headers.host + url);
    let pathname = _url.pathname;
    // console.log("pathname", pathname);
    
    // let getUrlReg = new RegExp();
    //获取用户信息的接口
    if (url === "/userinfo") {
        let data = await readFile("./user.json", "utf-8");
        res.end(data);
    } else if (pathname === "/jsonp") {
        // console.log("jsonp", url);
        let cb = _url.searchParams.get("cb");
        console.log("cb");
        res.end(`${cb}(${123})`);
        // res.end("12222");
    } else if (url === "/cookie") {
        let cookie = ["name=123456;HttpOnly"];
        res.setHeader("Set-Cookie", cookie);
        // res
        res.end("设置cookie");
    } else {
        res.end();
    }
});
server.listen(port, hostname, () => {
    console.log("server is on http://127.0.0.1:2233");
    
});
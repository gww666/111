const http = require("http");
const fs = require("fs");
const path = require("path");
const {promisify} = require("util");
const readFile = promisify(fs.readFile);
const mdPath = path.resolve(__dirname, "./test.md");
const server = http.createServer(async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By",' 3.2.1')
    res.setHeader("Content-Type", "text/plain;charset=utf-8");
    // const readStream = fs.createReadStream(mdPath);
    if (req.url === "/getMdStr") {
        const readStream = fs.createReadStream(mdPath);
        readStream.pipe(res);
        // const str = await readFile(mdPath, "utf-8");
    }
    

});

server.listen(2233, "127.0.0.1", () => {
    console.log("run"); 
});
const http = require("http");
const path = require("path");
const puppeteer = require("puppeteer");
const fs = require("fs");
const port = "3566";
const host = "127.0.0.1";
const uploadPageUrl = `http://${host}:${port}`;
const exitUrl = `${uploadPageUrl}/exit`;
const sleep = (time) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time);
    })
}

module.exports = ({
    zipPath = "/Users/test167/Documents/workspace/project/njrn2/patches/ios/0.0.94.zip",
    env = "1",
    OS = "IOS",
    msg = "暂无信息",
    version = "0.0.94",
} = {}) => {
    const server = http.createServer(async (req, res) => {
            let html = fs.readFileSync(path.resolve(__dirname, "./index.html"), "utf-8");
            res.end(html);
    });
    const upload = async () => {
        //睡眠一秒，保证页面加载完毕
        console.log("等待页面加载……");
        await sleep(1000);
        console.log("页面加载成功！");
        //puppeteer运行
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(uploadPageUrl);
        const elementHandle = await page.$(".zip");
        // const zipPath = path.resolve(__dirname, "../../patches/android/0.0.32.zip");
        //添加压缩包
        await elementHandle.uploadFile(zipPath);
        console.log("压缩包选择成功！", zipPath);
        await page.evaluate(params => {
            const $ = selector => {
                return document.querySelector(selector);
            }
            //设置平台参数
            $(".OS").value = params.OS;
            //设置环境参数
            $(".env").value = params.env;
            //设置发版描述
            $(".msg").value = params.msg;
            //设置版本参数
            $(".version").value = params.version;
            //点击上传按钮
            $(".upload").click();
            return new Promise(resolve => {
                let timer = setInterval(() => {
                    let info = $(".result").innerHTML;
                    if (info === "success") {
                        clearInterval(timer);
                        resolve();
                    }
                }, 200);
            });
        }, {env, OS, msg, version});
        
        await page.screenshot({path: path.resolve(__dirname, "./screenshot.png")});
        console.log("生成页面快照！");
        //上传完毕
        console.log("上传成功！");
        //退出服务器
        // await page.goto(exitUrl);
        server.close();
        process.exit();
    };
    server.listen(port, host, async () => {
        console.log(`server is running on ${uploadPageUrl}`);
        upload();
    });
}
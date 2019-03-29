const archiver = require("archiver");
const path = require("path");
const fs = require("fs");
const {exist, mkdirsSync, copyDir, rmdirsSync, updateJson} = require("./helper.js");
const {pathInfo, getLatestHistoryDir, getFileName, getZipName, getVersion} = require("./config.js");
const upload = require("./server/index.js");
const args = process.argv;
const OS = args[2];//平台
const env = args[3];//环境
const msg = args[4] || "暂无说明";//发版信息

let entry = path.resolve(__dirname, `../${OS}/bundle`);
let output = pathInfo[OS].output.directory;//存放压缩包的目录
let temp = pathInfo[OS].output.temp;//存放临时文件的目录
let updateJsonPath = pathInfo[OS].output.updateJson;//版本升级的日志文件
let zipPath = path.join(output, `./${getZipName()}`);//压缩包地址
let iconfontPath = pathInfo[OS].entry.iconfontPath;

//根据文件名返回
const excludeFile = (name) => {
    let fileName = [
        "index.android.bundle.meta",
        "index.ios.jsbundle.meta"
    ]
    return fileName.includes(name);
}
(async () => {
    //检测有无目标文件夹
    if (!exist(temp)) {
        //没有则进行创建
        mkdirsSync(temp);
    }
    //copy一下文件到temp目录，这里是为了剔除无用文件
    await copyDir(entry, temp, (_path) => {
        if (!excludeFile(path.basename(_path))) {
            return true;
        }
    });
    //如果是android平台，还要把iconfont copy进temp目录
    // if (OS === "android") {
    //     await copyDir(iconfontPath, temp, null, name => {
    //         return name === "fonts";
    //     });
    // }
    // return;
    let archive = archiver('zip');
    let zipStream = fs.createWriteStream(zipPath);
    zipStream.on("close", () => {
        //压缩完毕
        //生成一个节点文件夹
        mkdirsSync(getLatestHistoryDir());
        copyDir(entry, getLatestHistoryDir());
        //删除temp目录
        rmdirsSync(temp);
        //更新日志文件
        updateJson(updateJsonPath, msg);
        console.log("生成压缩包成功!");
        console.log("开始自动上传……");
        //构建所需参数
        let params = {
            zipPath,
            version: getVersion(true),
            OS: OS === "android" ? "Android" : "IOS",
            msg,
            env: env === "test" ? "1" : (env === "pre" ? "2" : "3")
        }
        upload(params);
    });
    archive.pipe(zipStream);
    //指定压缩的目录，第二个参数是指定解压目录的结构，传false代表采用被压缩文件的目录结构
    archive.directory(temp, false);
    //开始压缩
    archive.finalize();
})();





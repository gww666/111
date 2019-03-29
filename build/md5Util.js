const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const {pathInfo} = require("./config");
//测试MD5校验文件一致性
let computedHash = (targetPath) => {
    return new Promise(resolve => {
        let rs = fs.createReadStream(targetPath);
        let hash = crypto.createHash("md5");
        rs.on("data", hash.update.bind(hash));
        rs.on("end", () => {
            let hex = hash.digest("hex");
            resolve(hex);
            // console.log("hex ", hex);
        });
    });
}
// const result = [];
let result = {}
let getFileInfo = async (targetPath) => {
    let files = fs.readdirSync(targetPath);
    // console.log("打印文件名称", files);
    
    for (let name of files) {
        if (name === "index.android.bundle" || name === "assetsInfo.json") continue;
        let _path = path.join(targetPath, name);
        let stats = fs.statSync(_path);
        if (stats.isDirectory()) {
            await getFileInfo(_path);
        } else {
            //是文件直接获取其MD5值
            let jsonItem = {
                fileName: name,
                path: _path,
                directory: path.dirname(_path),
                md5Hash: await computedHash(_path)
            }
            result[jsonItem.md5Hash] = jsonItem;
        }
    }
}

let writeFile = (targetPath = "./android/file-info.json") => {
    fs.writeFileSync(targetPath, JSON.stringify(result));
    result = {};
    console.log("生成文件清单列表");
}

let start = async (targetPath, destPath) => {
    // let targetPath = "./android";
    await getFileInfo(targetPath);
    writeFile(destPath);
}

module.exports = {
    computedHash,
    createHashForAssets: start
}
// computedHash("./android/index.android.bundle");
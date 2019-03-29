const path = require("path");
const fs = require("fs");

// const env = 1;//测试环境：1，预发布环境：2
// const pathInfoMaps = new Map();
// pathInfoMaps.set(1, "test");
// pathInfoMaps.set(2, "pre");
// const _env = pathInfoMaps.get(env);
const args = process.argv;
let OS = args[2];//平台参数
let _env = args[3]; //拿到环境参数

const nextVersion = (version) => {
    let _v = version.split(".");
    _v[2] = _v[2] - 0 + 1;
    return _v.join(".");
}

let updateJson = path.resolve(__dirname, `./${OS}/${_env}/update.json`);
/**
 * 获取版本号的方法
 * @param {Boolean} current 代表是否获取updateJson文件里的最新版本号，
 * 不传入current代表生成下一个版本号，通常在生成新节点时用到
 */
let getVersion = (current) => {
    return current ? JSON.parse(fs.readFileSync(updateJson, "utf-8"))[0].version
        : nextVersion(JSON.parse(fs.readFileSync(updateJson, "utf-8"))[0].version);
}
let getFileName = () => {
    return "patches.txt";
}
let getZipName = (current) => {
    return getVersion(current) + ".zip";
}
let getLatestHistoryDir = () => {
    return path.resolve(__dirname, `./${OS}/${_env}/${getVersion()}`)
}
// let version = JSON.parse(require(this.updateJson))[0].version;
const pathInfo = {
    [OS]: {
        entry: {
            bunldePath: path.resolve(__dirname, `../${OS}/bundle`),
            newBundle: path.resolve(__dirname, "../android/bundle/index.android.bundle"),
            oldBundle: path.resolve(__dirname, `./android/${_env}/current/index.android.bundle`),
            currentDir: path.resolve(__dirname, `./android/${_env}/current`),//存储比对文件的目录
            iconfontPath: path.resolve(__dirname, "../js/helper"),
        },
        output: {
            directory: path.resolve(__dirname, `../patches/${OS}`),//用来存储zip包的目录
            temp: path.resolve(__dirname, `../patches/${OS}/temp`),//用来存储压缩时生成的暂存的文件夹目录
            updateJson: path.resolve(__dirname, `./${OS}/${_env}/update.json`),
            assetsInfo: path.resolve(__dirname, `./${OS}/${_env}/current/assetsInfo.json`),
        }
    }
}
module.exports = {
    pathInfo,
    getFileName,
    getZipName,
    getLatestHistoryDir,
    getVersion
}
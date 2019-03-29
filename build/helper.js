const fs = require("fs");
const path = require("path");
const {getVersion} = require("./config.js");
const ERROR_CODE = {
    ENOTEMPTY: "ENOTEMPTY"
}

//校验路径合法性（是否存在某个文件）
const exist = (targetPath) => {
    let _exist = true;
    try {
        fs.accessSync(targetPath);
    } catch (err) {
        _exist = false;
    }
    return _exist;
}

//递归创建目录
const mkdirsSync = (targetPath, cb) => {
    try {
        fs.mkdirSync(targetPath);
        cb && cb();
    } catch (err) {
        //尝试创建其父目录
        let _path = path.dirname(targetPath);
        let _cb = () => mkdirsSync(targetPath, cb);
        mkdirsSync(_path, _cb);
    }
}

//删除某一个目录下的所有文件夹、文件
//该方法未校验路径合法性
const rmdirsSync = (targetPath) => {
    let files = fs.readdirSync(targetPath);
    files.forEach(_path => {
        _path = path.join(targetPath, _path);
        let stats = fs.statSync(_path);
        if (stats.isDirectory()) {
            rmdirsSync(_path);
        } else {
            //删除文件
            fs.unlinkSync(_path);
        }
    });
    fs.rmdirSync(targetPath);
}

//复制单个文件
const copyFile = async (origin, dest) => {
    return new Promise(resolve => {
        let rs = fs.createReadStream(origin);
        let ws = fs.createWriteStream(dest);
        ws.on("close", () => {
            // console.log("文件复制完毕");
            resolve();
        });
        rs.pipe(ws);
    });
}

//复制方法
//该方法未校验初始传入的目录的有效性
const copyDir = async (originPath, destPath, extraFileFlag, extraDirFlag) => {
    //拿到当前路径下的所有子目录
    let files = fs.readdirSync(originPath);
    // console.log("files", files);
    for (let name of files) {
        let _path = path.join(originPath, name);
        let _destPath = path.join(destPath, name);
        let stats = fs.statSync(_path);
        if (stats.isDirectory()) {
            //判断一下是否有添加额外的文件夹过滤机制
            let _flag = extraDirFlag ? await extraDirFlag(name) : true;
            if (_flag) {
                //判断目标目录是否存在，如果不存在就创建
                if (!exist(_destPath)) {
                    mkdirsSync(_destPath);
                }
                await copyDir(_path, _destPath, extraFileFlag, extraDirFlag);
            }
        } else if (stats.isFile()) {
            // console.log("打印该文件名", _path);
            let _flag = extraFileFlag ? await extraFileFlag(_path) : true;
            //是文件，执行复制操作
            _flag && await copyFile(_path, _destPath);
        }
    }
}



const updateJson = (targetPath, msg) => {
    const logs = JSON.parse(fs.readFileSync(targetPath, "utf-8"));
    // let version = nextVersion(logs[0].version);
    let date = new Date();
    let updateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
    let newLog = {
        version: getVersion(),
        msg,
        updateTime
    }
    logs.unshift(newLog);
    fs.writeFileSync(targetPath, JSON.stringify(logs));
}

module.exports = {
    mkdirsSync,
    rmdirsSync,
    copyFile,
    copyDir,
    updateJson,
    exist
}
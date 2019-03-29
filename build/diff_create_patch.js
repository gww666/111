/**
 * created by gw
 * 生成增量包
 */
const diff_match_patch = require("./diff_lib");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const {promisify} = require("util");
const access = promisify(fs.access);
const {mkdirsSync, rmdirsSync, copyDir, copyFile, updateJson} = require("./helper");
const {computedHash, createHashForAssets} = require("./md5Util");
const {pathInfo, getLatestHistoryDir, getFileName, getZipName} = require("./config.js");
(async () => {
    //第一步：拿到平台参数、初始化一些参数
    //process.argv 
    //第一个元素为process.execPath。第二个元素为当前执行的JavaScript文件路径
    let args = process.argv;
    let OS = args[2]; //拿到平台参数
    let msg = args[4]; //拿到上传的日志信息
    let entry = pathInfo[OS].entry;
    let output = pathInfo[OS].output;
    //第二步：拿到对应平台的新老bundle文件
    let newBundlePath = entry.newBundle;
    let oldBundlePath = entry.oldBundle;
    // console.log("oldBundlePath", oldBundlePath);
    // console.log("newBundlePath", newBundlePath);
    // return;
    let newBundle = fs.readFileSync(newBundlePath, "utf-8");
    let oldBundle = fs.readFileSync(oldBundlePath, "utf-8");
    // return;
    //第三步：生成patches
    // fs.writeFileSync(oldBundlePath, newBundle);
    let diff = new diff_match_patch();
    console.log("生成补丁中……");
    // let diffs = diff.diff_main(oldBundle, newBundle, false);
    let patches = diff.patch_make(oldBundle, newBundle);
    // let patches = diff.patch_make(diffs);
    if (!patches.length) return console.log("没有需要更新的东西");
    
    // console.log("diffs");
    // return;
    //第四步：将patches转为text并写入文件中
    let patchesText = diff.patch_toText(patches);
    console.log("生成补丁文本成功");
    //判断写入的目标地址的合法性
    let directoryExits = true;
    try {
        await access(output.temp, fs.constants.F_OK);
    } catch (err) {
        directoryExits = false;
    }
    //如果文件夹不存在，则创建文件夹
    if (!directoryExits) {
        //递归创建
        mkdirsSync(output.temp);
    }
    //将patchText写入文件
    //写入的目标文件地址
    let tempFilePath = path.join(output.temp, getFileName());
    fs.writeFileSync(tempFilePath, patchesText);
    //生成一个测试bundle
    //这里暂时用全量更新
    // let _str = diff.patch_apply(patches, oldBundle)[0];
    // fs.writeFileSync(path.resolve(__dirname, "../patches/android/temp/index.android.bundle"), newBundle);
    console.log("补丁文本写入文件成功");
    // return;
    //找到改变的文件或者新增的文件
    let assetsInfo = JSON.parse(fs.readFileSync(output.assetsInfo));
    // console.log("assetsInfo", assetsInfo);
    //将打包文件生成的assets目录下的文件进行遍历
    await copyDir(entry.bunldePath, output.temp, async (_path) => {
        let md5Hash = await computedHash(_path);
        // console.log("path.basename(_path)", path.basename(_path));
        if (!assetsInfo[md5Hash] && 
            path.basename(_path) !== "index.android.bundle" &&
            path.basename(_path) !== "index.android.bundle.meta") {
            // console.log("需要复制");
            return true;
        }
        return false;
    });
    console.log("复制资源文件成功");
    // return;
    let archive = archiver('zip');
    //存放增量压缩包的目录
    let zipOutputPath = path.join(output.directory, `./${getZipName()}`);
    let zipOutput = fs.createWriteStream(zipOutputPath);
    zipOutput.on("close", async () => {
        console.log("生成增量压缩包成功，即将进行清理操作");
        // return;
        //压缩完毕之后将oldBundle更新
        fs.writeFileSync(oldBundlePath, newBundle);
        console.log("current文件中的bundle更新完毕");
        //将资源目录的MD5文件更新
        await createHashForAssets(entry.bunldePath, output.assetsInfo);
        console.log("current文件中的assetsInfo文件更新完毕");
        //将current目录复制到对应版本号文件夹，生成一个节点
        mkdirsSync(getLatestHistoryDir());
        copyDir(entry.currentDir, getLatestHistoryDir());
        console.log("新节点生成成功");
        //将日志文件更新
        updateJson(output.updateJson, msg);
        console.log("日志文件更新成功");
        //删除temp目录
        rmdirsSync(output.temp);
        console.log("清理完毕");
    });
    archive.pipe(zipOutput);
    // archive.file(outputPath, {name: "0.0.18.txt"});
    //指定压缩的目录，第二个参数是指定解压目录的结构，传false代表采用被压缩文件的目录结构
    archive.directory(output.temp + "/", false);
    //开始压缩
    archive.finalize();
    //ssssssssssssssss
})();


 

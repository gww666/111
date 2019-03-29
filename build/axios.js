const fs = require("fs");
const path = require("path");
const needle = require("needle");
// const FormData = require("form-data");
// const Blob = require("blob");
const {pathInfo, getZipName} = require("./config.js");
const axios = require("axios");
//上传压缩包的地址
const args = process.argv;
const OS = args[2];//平台
const zipUploadUrl = "http://test.define.report.scn.sunmath.cn/jobExecutorInfo/uploadfile";
const output = pathInfo[OS].output.directory;//存放压缩包的目录
const current = true;
const zipPath = path.join(output, `./${getZipName(current)}`);//压缩包地址
//定义上传压缩包的方法
const uploadZipFile = () => {
    console.log("zipPath", zipPath);
    let buffer = fs.readFileSync(zipPath);//返回buffer类型（二进制）的数据
    let file = fs.createReadStream(zipPath);
    // let formData = new FormData();
    // formData.append("uploadFile", buffer);
    // let b = new Blob(buffer, );
    // formData.append("uploadFile", file);
    // formData.append("name", getZipName(current));
    // let options = {
    //     url: zipUploadUrl,
    //     method: "post",
    //     data: formData,
    //     headers: {
    //         // 'Content-Type': 'multipart/form-data',
    //         sessionId: "dc3d8a7e-fc23-4987-bb95-4be94fa93d33"
    //     }
    // }
    // return axios(options);
    let data = {
        path: zipPath,
        type: "application/zip"
    }
    needle.post(zipUploadUrl, data, { multipart: true })
    .on('done', function(err, resp) {
        console.log('上传完毕');
    });
}

(async () => {
    try {
        // let data = await uploadZipFile();
        uploadZipFile();
        // console.log("uploadZipFile", data);
    } catch (err) {
        console.log("上传zip压缩包出错", err);
    }
    
    
})();
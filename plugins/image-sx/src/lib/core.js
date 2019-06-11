import BMF from "browser-md5-file";
import EXIF from "exif-js";
const md5 = (data) => {
    return new Promise(resolve => {
        let bmf = new BMF();
        bmf.md5(data, (err, md5) => {
            // console.log('err:', err);
            // console.log('md5 string:', md5);
            resolve(md5);
        });
    });
}

const getImgData = (img) => {
    return new Promise(resolve => {
        EXIF.getData(img, function() {
            let res = EXIF.getAllTags(this);
            resolve(res);
        });
    });
}
class Compress {
    constructor(file, options = {}) {
        let initialOptions = {
            quality: 0.4,
            maxWidth: 1000,
            maxHeight: 1000
        }
        this.file = file;
        this.options = Object.assign(initialOptions, options);
    }
    createObjectURL(file) {
        return window.URL.createObjectURL(file);
    }
    createImg(url) {
        return new Promise((resolve) => {
            let img = new Image();
            img.onload = () => {
                resolve(img);
            }
            img.src = url;
        });
    }
    /**
     * 
     * @param {Object} img 
     * @param {Object} options 
     */
    calculateSize(img, options) {
        if (img.width <= options.maxWidth && img.height <= options.maxHeight) {
            //不需要缩减宽高
            return {
                width: img.width,
                height: img.height
            }
        }
        if (img.width >= img.height) {
            //以maxWidth为基准进行等比例缩放
            return {
                width: options.maxWidth,
                height: parseInt(options.maxWidth / (img.width / img.height))
            }
        } else {
            //以maxHeight为基准进行缩放
            return {
                width: parseInt(img.width / img.height * options.maxHeight),
                height: options.maxHeight
            }
        }
    }
    async compress() {
        let file = this.file;
        let options = this.options;
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let mime = file.type || "image/png";
        let url = this.createObjectURL(file);
        let img = await this.createImg(url);
        // document.body.appendChild(img);
        //计算绘制区域的宽高
        let {width, height} = this.calculateSize(img, options);
        let imgInfo = await getImgData(img);
        // console.log("打印图像数据", imgInfo);
        //对竖屏拍摄的照片进行90度旋转修正
        if (imgInfo.Orientation === 6) {
            //设置画布大小
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(90 * (Math.PI / 180));
            ctx.drawImage(img, 0, -height, width, height);
        } else {
            //设置画布大小
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
        }
        // document.body.appendChild(canvas);
        //返回压缩后的blob对象
        return new Promise(resolve => {
            canvas.toBlob(async blob => {
                //拿到md5值
                let value = await md5(blob);
                blob.md5 = value;
                resolve(blob);
            }, mime, options.quality);
        });
    }

}

export default Compress;
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
        console.log("type", file.type);
        
        let options = this.options;
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        let mime = file.type || "image/png";
        let url = this.createObjectURL(file);
        let img = await this.createImg(url);
        //计算绘制区域的宽高
        let {width, height} = this.calculateSize(img, options);
        //设置画布大小
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        //返回压缩后的blob对象
        return new Promise(resolve => {
            canvas.toBlob(blob => {
                resolve(blob);
            }, mime, options.quality);
        });
    }

}

export default Compress;
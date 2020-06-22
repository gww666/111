<template>
    <div class="image-sx-box">
        <!-- 预览的盒子 -->
        <div 
            class="preview-box"
            v-for="(item, index) in previewUrlArray" 
            :key="'preview-' + index"
            :style="{width, height}"
            :ref="'preview' + index"
            @mouseover="showHandle(index)"
            @mouseout="hideHandle(index)">
            <img :src="item" alt="" @load="loadedEvent(index)">
            <div class="handle-box">
                <span @click="deleteImgData(index)">删 除</span>
            </div>
        </div>
        <div v-if="!addSlot" class="add-box" :style="{width, height}" v-show="previewUrlArray.length < maxCount">
            <div></div>
            <div></div>
            <div class="add-box-cover" @click="showPopupWindow"></div>
        </div>
        <input ref="fileInput" type="file" @change="fileChange" class="file-input" />
        <slot name="add" v-bind:addProps="addProps"></slot>
        <div class="menu-box" ref="menuBox">
            <div class="content-box" ref="contentBox">
                <div class="file-box">
                    <span v-if="origin === 'all' || origin === 'album'"
                        @click="selectFile('album')">
                        相册
                    </span>
                    <span v-if="origin === 'all' || origin === 'camera'"
                        @click="selectFile('camera')">
                        照相机
                    </span>
                </div>
                <div class="handle-box">
                    <span @click="hidePopupWindow">取消</span>
                </div>
            </div>
        </div>
    </div>
    
</template>
<script>
import Compress from "./core";
import BMF from "browser-md5-file";
export default {
    props: {
        width: {
            type: String,
            default: "100px"
        },
        height: {
            type: String,
            default: "100px"
        },
        origin: {
            type: String,
            default: "all"//all，既支持相机也支持相册，camera，只支持相机，album，相册
        },
        //data: 只返回数据
        //preview: 带预览框
        //clip: 支持裁切
        mode: {
            type: String,
            default: "data"
        },
        //压缩阙值，单位：kb；大于此值会进行压缩
        maxSize: {
            type: Number,
            default: 300
        },
        //压缩后的最大宽度
        compressWidth: {
            type: Number,
            default: 1000
        },
        compressHeight: {
            type: Number,
            default: 1000
        },
        //压缩后的质量系数
        compressQuality: {
            type: Number,
            default: 0.4
        },
        //已有的图片链接
        imgUrls: {
            type: Array,
            default: () => ([])
        },
        //上传的最大数量
        maxCount: {
            type: Number,
            default: 5
        },
        slotName: {
            type: String | Array,
            default: ""
        }
    },
    data() {
        return {
            previewUrlArray: [...this.imgUrls],
            //储存file对象的数组(二进制数据)
            uploadFileArray: [],
            addSlot: true,
            addProps: {
                text: "test",
                click: this.showPopupWindow
            }
        }
    },
    methods: {
        md5(data) {
            return new Promise(resolve => {
                let bmf = new BMF();
                bmf.md5(data, (err, md5) => {
                    // console.log('err:', err);
                    // console.log('md5 string:', md5);
                    resolve(md5);
                });
            });
        },
        async fileChange(event) {
            this.hidePopupWindow();
            // console.log(event);
            //拿到文件
            let file = event.target.files[0];
            if (file) {
                // console.log(file.size);
                let url = null;
                let originBlob = null;
                //300kb以上进行压缩
                if (file.size / 1024 > this.maxSize) {
                    // console.log("开始压缩");
                    let instance = new Compress(file, {
                        quality: this.compressQuality,
                        maxWidth: this.compressWidth,
                        maxHeight: this.compressHeight
                    });
                    originBlob = await instance.compress();
                    // console.log("originBlob", originBlob);
                    console.log("压缩后的体积", (originBlob.size / 1024) + "KB");
                    url = window.URL.createObjectURL(originBlob);
                } else {
                    console.log("不需要压缩");
                    // console.log("value", value);
                    originBlob = file;
                    //获取其MD5值
                    let value = await this.md5(originBlob);
                    originBlob.md5 = value;
                    url = window.URL.createObjectURL(file);
                }
                if (this.mode === "preview") {
                    this.previewUrlArray.push(url);
                    this.uploadFileArray.push(originBlob);
                    //向父组件发送事件
                    this.$emit("fileChange", this.uploadFileArray);
                } else if (this.mode === "data") {
                    //向父组件发送事件
                    this.$emit("fileChange", originBlob);
                }
                event.target.value = "";
            }
        },
        loadedEvent(index) {
            // console.log("第" + index + "个图片加载完成");
            window.URL.revokeObjectURL(this.previewUrlArray[index]);
        },
        //对图片预览盒子进行操作
        showHandle(index) {
            // console.log("ref", this.$refs);
            
            this.$refs["preview" + index][0].querySelector(".handle-box").style.opacity = "0.5";
            // document.querySelectorAll(".preview-box")[index].querySelector(".handle-box").style.opacity = "0.5";
        },
        hideHandle(index) {
            this.$refs["preview" + index][0].querySelector(".handle-box").style.opacity = "0";
            // document.querySelectorAll(".preview-box")[index].querySelector(".handle-box").style.opacity = "0";
        },
        deleteImgData(index) {
            //假设传入预览图片数据的话，这里需要排除
            let length = this.imgUrls.length;
            //先删除预览数组的数据
            this.previewUrlArray.splice(index, 1);
            // console.log("index", index);
            // console.log("length", length);
            
            //删除上传数据的数组
            if (index >= length) {
                //说明删除的是新添加的图片
                this.uploadFileArray.splice(index - length, 1);
                this.$emit("fileChange", this.uploadFileArray);
            } else {
                //删除的是回显的照片
                this.imgUrls.splice(index, 1);
                this.$emit("previewFileChange", this.previewUrlArray);
            }
        },
        showPopupWindow() {
            let popupWindow = this.$refs.menuBox;
            popupWindow.style.display = "flex";
            let contentBox = this.$refs.contentBox;
            setTimeout(() => {
                contentBox.style.transform = "translateY(0)";
            }, 17);
        },
        hidePopupWindow() {
            let popupWindow = this.$refs.menuBox;
            let contentBox = this.$refs.contentBox;
            contentBox.style.transform = "translateY(100%)";
            popupWindow.style.display = "none";
        },
        selectFile(type) {
            let input = this.$refs.fileInput;
            if (type === "album") {
                input.removeAttribute("accept");
                input.removeAttribute("capture");
            } else if (type === "camera") {
                input.setAttribute("accept", "image/*");
                input.setAttribute("capture", "camera");
            }
            input.click();
        },
    },
    created() {
    },
    mounted() {
    },
    watch: {
        imgUrls(newVal) {
            if (newVal && newVal.length) {
                this.previewUrlArray = [...newVal];
            }
        },
        slotName(newVal) {
            if (newVal) {
                if (this.slotName === "add") {
                    this.addSlot = true;
                } else {
                    this.addSlot = false;
                }
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.image-sx-box {
    display: flex;
    flex-wrap: wrap;

    .preview-box {
        // padding: 1px;
        
        // display: flex;
        // flex-wrap: wrap;
        margin: 0 10px 10px 0;
        position: relative;
        
        img {
            width: 100%;
            height: 100%;
            border: 1px dashed #ddd;
        }
        .handle-box {
            transition: all 0.3s;
            background: rgb(0, 0, 0);
            opacity: 0;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            span {
                color: white;
                font-size: 14px;
                cursor: pointer;
            }
        }
    }
    .add-box {
        position: relative;
        border: 1px dashed #ddd;
        overflow: hidden;

        &>div {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        &>div:nth-of-type(1) {
            width: 70%;
            height: 0;
            border-bottom: 1px dashed #ddd;
        }
        &>div:nth-of-type(2) {
            width: 0;
            height: 70%;
            border-left: 1px dashed #ddd;
        }
        &>.add-box-cover {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            transform: unset;
            z-index: 1;
        }
        // &>label {
        //     display: block;
        //     width: 100%;
        //     height: 100%;
        //     overflow: hidden;
        //     &>div {
        //         width: 100%;
        //         height: 100%;
        //     }
        // }
        input {
            width: 100%;
            height: 100%;
            border: 0;
            outline: none;
            opacity: 0;
        }
    }
    .menu-box {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
        align-items: flex-end;
        display: none;
        z-index: 1;

        .content-box {
            width: 92%;
            transition: all 0.5s;
            transform: translateY(100%);

            .file-box, .handle-box {
                background: #fff;
                border-radius: 5px;

                &>span {
                    // background: #fff;
                    height: 48px;
                    font-size: 16px;
                    color: #999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-bottom: 1px solid #e0e0e0;
                }

                &>span:last-of-type {
                    border-bottom: 0;
                }
            }

            .handle-box {
                margin: 10px 0 5px;
            }
        }

    }
    .file-input {
        width: 0;
        height: 0;
    }
}
</style>


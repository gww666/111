<template>
    <div class="image-sx-box">
        <!-- 预览的盒子 -->
        <!-- <div class="preview-box"> -->
            <div 
                class="preview-box"
                v-for="(item, index) in previewUrlArray" 
                :key="'preview-' + index"
                :style="{width, height}">
                <img :src="item" alt="" @load="loadedEvent(index)">
            </div>
            <div class="add-box" :style="{width, height}">
                <div></div>
                <div></div>
                <input type="file" accept="image/*" @change="fileChange">
            </div>
        <!-- </div> -->
        
        <!-- <canvas class="canvas"></canvas> -->
    </div>
    
</template>
<script>
import Compress from "./core";
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
        //data: 只返回数据
        //preview: 带预览框
        //clip: 支持裁切
        mode: {
            type: String,
            default: "data"
        }
    },
    data() {
        return {
            previewUrlArray: [],
            //储存file对象的数组(二进制数据)
            uploadFileArray: []
        }
    },
    methods: {
        async fileChange(event) {
            console.log(event);
            //拿到文件
            let file = event.target.files[0];
            if (file) {
                console.log(file.size);
                let url = null;
                let originBlob = null;
                //300kb以上进行压缩
                if (file.size / 1024 > 300) {
                    console.log("开始压缩");
                    let instance = new Compress(file);
                    originBlob = await instance.compress();
                    url = window.URL.createObjectURL(originBlob);
                } else {
                    console.log("不需要压缩");
                    originBlob = file;
                    url = window.URL.createObjectURL(file);
                }
                if (this.mode === "preview") {
                    this.previewUrlArray.push(url);
                    this.uploadFileArray.push(originBlob);
                    //调用父组件事件
                    this.$emit("fileChange", this.uploadFileArray);
                } else if (this.mode === "data") {
                    //调用父组件事件
                    this.$emit("fileChange", originBlob);
                }
                event.target.value = "";
                
            }
            
            
        },
        loadedEvent(index) {
            console.log("第" + index + "个图片加载完成");
            
            window.URL.revokeObjectURL(this.previewUrlArray[index]);
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
        
        img {
            width: 100%;
            height: 100%;
            border: 1px dashed #ddd;
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
    
}
</style>


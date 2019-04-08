class Recorder {
    constructor(options) {
        this.chunks = [];
        this.recorder = this.getInstance(options);
        this.initClickEvent(options);
        this.initListenerEvent();
    }
    $(selector) {
        return document.querySelector(selector);
    }
    getInstance(options) {
        const {stream} = options;
        return new MediaRecorder(stream);
    }
    initClickEvent(options) {
        const {startBtn, pauseBtn, stopBtn} = options;
        //开始录制
        this.$(startBtn).onclick = () => {
            this.recorder.start();
            console.log("开始录制视频");
        }
        //结束录制
        this.$(stopBtn).onclick = () => {
            this.recorder.stop();
        }
    }
    initListenerEvent() {
        this.recorder.ondataavailable = (event) => {
            console.log("结束录制视频，进行保存");
            console.log("拿到的数据", event);
            this.chunks.push(event.data);
            this.download(this.chunks);
        }
    }
    download(chunks) {
        let blob = new Blob(chunks);
        let src = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = src;
        a.download = "source.mp4";
        document.body.appendChild(a);
        a.click();
        a.remove();
    }
}
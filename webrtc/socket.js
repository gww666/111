// const http = require("http");
const https = require("https");
const fs = require("fs");

// const server = http.createServer((req, res) => {
//     // res.setHeader("Access-Control-Allow-Origin", "*");
//     // res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     // res.setHeader("Access-Control-Allow-Headers", "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range");
//     res.end("sdsdsd");
// });
let options = {
    key: fs.readFileSync('./a.key'),
    cert: fs.readFileSync('./a.pem')
}
const server = https.createServer(options, (req, res) => {
    res.end("sdsdsd");
});

server.listen(2266, "0.0.0.0", () => {
    console.log("server is running on http://127.0.0.1:2266");
});
const io = require("socket.io").listen(server);
let infos = {};
let callingInfos = {};
const getSocketIdByClientId = (clientId) => {
    for (let key in infos) {
        if (infos[key].id === clientId) {
            return key;
        }
    }
}
io.on("connection", (sockets) => {
    sockets.on("create id", (info) => {
        infos[sockets.id] = info;
        //通知客户端更改id
        sockets.emit("update id list", infos);
        sockets.broadcast.emit("update id list", infos);
    });
    sockets.on("disconnect", (reason) => {
        console.log("离开房间", sockets.id, reason);
        //释放对应socket.id的通信id
        delete callingInfos[infos[sockets.id]];
        //删除id
        delete infos[sockets.id];
        //通知客户端更改id
        sockets.broadcast.emit("update id list", infos);
        sockets.emit("update id list", infos);
    });
    //监听发起通话的事件
    sockets.on("call", obj => {
        let socketId = getSocketIdByClientId(obj.answer.id);
        //通知指定客户端，有人呼叫他
        sockets.to(socketId).emit("call", obj);
        // sockets.broadcast.emit("call", obj);
        //存进占用的id列表
        callingInfos[obj.call.id] = obj.call;
        callingInfos[obj.answer.id] = obj.answer;
        //通知客户端更新占用状态
        sockets.emit("update callingid list", [infos, callingInfos]);
        sockets.broadcast.emit("update callingid list", [infos, callingInfos]);
    });
    //监听接受邀请的事件
    sockets.on("accept", obj => {
        //因为跳转了页面，相当于离开了房间，释放id
        delete callingInfos[obj.call.id];
        delete callingInfos[obj.answer.id];
        //延迟500ms发送
        setTimeout(() => {
            //向指定的客户端发送事件
            //告诉他被呼叫方已经接听了通话
            let socketId = getSocketIdByClientId(obj.call.id);
            sockets.to(socketId).emit("accept", obj);
            // sockets.broadcast.emit("accept", obj);
        }, 1500);
    });
    //监听拒绝邀请的事件
    sockets.on("refuse", obj => {
        //拒绝了邀请，释放ID
        delete callingInfos[obj.call.id];
        delete callingInfos[obj.answer.id];
        //通知客户端更新占用状态
        sockets.emit("update callingid list", [infos, callingInfos]);
        sockets.broadcast.emit("update callingid list", [infos, callingInfos]);
        //向指定的客户端发送事件
        //告诉他自己拒绝了通话
        let socketId = getSocketIdByClientId(obj.call.id);
        sockets.to(socketId).emit("refuse", obj);
        // sockets.broadcast.emit("refuse", obj);
    });
    console.log("one user", sockets.id);
});


const http = require("http");
const server = http.createServer((req, res) => {
    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    // res.setHeader("Access-Control-Allow-Headers", "DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range");
    res.end("sdsdsd");
});
// server.listen(2266, "172.18.249.80", () => {
//     console.log("server is running on http://172.18.249.80");
// });
server.listen(2266, "0.0.0.0", () => {
    console.log("server is running on http://127.0.0.1:2266");
});
const io = require("socket.io").listen(server);
let ids = {};
let callingIds = {};
io.on("connection", (sockets) => {
    sockets.on("create id", (id) => {
        ids[sockets.id] = id;
        //通知客户端更改id
        sockets.emit("update id list", ids);
        sockets.broadcast.emit("update id list", ids);
    });
    sockets.on("disconnect", (reason) => {
        console.log("离开房间", sockets.id, reason);
        //释放对应socket.id的通信id
        delete callingIds[ids[sockets.id]];
        //删除id
        delete ids[sockets.id];
        //通知客户端更改id
        sockets.broadcast.emit("update id list", ids);
        sockets.emit("update id list", ids);
    });
    //监听发起通话的事件
    sockets.on("call", obj => {
        sockets.broadcast.emit("call", obj);
        //存进占用的id列表
        callingIds[obj.call] = 1;
        callingIds[obj.answer] = 1;
        //通知客户端更新占用状态
        sockets.emit("update callingid list", [ids, callingIds]);
        sockets.broadcast.emit("update callingid list", [ids, callingIds]);
    });
    //监听接受邀请的事件
    sockets.on("accept", obj => {
        //因为跳转了页面，相当于离开了房间，释放id
        delete callingIds[obj.call];
        delete callingIds[obj.answer];
        //延迟500ms发送
        setTimeout(() => {
            sockets.broadcast.emit("accept", obj);
        }, 800);
    });
    //监听拒绝邀请的事件
    sockets.on("refuse", obj => {
        //拒绝了邀请，释放ID
        delete callingIds[obj.call];
        delete callingIds[obj.answer];
        //通知客户端更新占用状态
        sockets.emit("update callingid list", [ids, callingIds]);
        sockets.broadcast.emit("update callingid list", [ids, callingIds]);
        sockets.broadcast.emit("refuse", obj);
    });
    console.log("one user", sockets.id);
});


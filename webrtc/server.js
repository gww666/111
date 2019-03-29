var PeerServer = require('peer').PeerServer;
const fs = require("fs");
var server = PeerServer({
    port: 9000,
    ssl: {
        key: fs.readFileSync("./a.key"),
        cert: fs.readFileSync("./a.pem")
    },
    path: '/myapp'
});
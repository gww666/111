var PeerServer = require('peer').PeerServer;
// const fs = require("fs");
var server = PeerServer({
    port: 9000,
    path: '/myapp'
});
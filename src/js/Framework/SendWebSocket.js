'use strict';

var server;
// var serverIP = 'ws://140.124.181.177:9300';
var serverIP = 'ws://140.124.180.1:9300';

var ConnectWebSocket = function () {
    server = new FancyWebSocket(serverIP);
    server.connect();
};

var SendWebSocket = function (name, runtime, result) {
    var date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var sec = date.getSeconds();
    var message = _id + "," + month + "/" + day + " " + hour + ":" + minute + ":" + sec + "," + name + "," + runtime + "," + result;
    server.send('message', message);
};

if (_isConnectWebSocket) {
    ConnectWebSocket();
}
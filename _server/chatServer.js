var express = require('express');

var app = express();

app.use(express.static(__dirname + "/clientFiles"));

var server = require('http').createServer(app);

var io = require('socket.io')(server);

io.on('connection', function (client) {

    client.join("globalChat");

    client.on("shareMessage", function (data) {

        io.sockets.in("globalChat").emit("recieveMessage", {
            ip: client.request.connection.remoteAddress.replace("::ffff:",""),
            message: data.text
        });

    });

});

server.listen(3500);
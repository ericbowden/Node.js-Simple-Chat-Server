var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000);

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

var buffer = [];
io.sockets.on('connection', function(client){

    var clientId = client.id;
    clientId = 'User'+clientId.substr(clientId.length-3,3);

    client.broadcast.emit('client_connect',clientId + ' connected');
    //client.send(JSON.stringify({'messages':buffer}));
    client.emit('message',{'messages':buffer});

    client.on('message', function(message){
    	console.log(message);

        var msg = { user: clientId, message: message};
        buffer.push(msg);
        while (buffer.length > 15)
        	buffer.shift(); //removes first item in array
        client.broadcast.emit('message',{'messages':[msg]});
    });

    client.on('disconnect', function(){
        client.broadcast.emit('client_disconnect',clientId + ' disconnected');
    });
});
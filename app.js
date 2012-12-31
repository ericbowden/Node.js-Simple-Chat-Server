var express = require('express'),
    app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);
    //,util = require('util');

io.set('log level', 2); // reduce logging

server.listen(3000);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var buffer = [];
io.sockets.on('connection', function(client){

    var clientId = client.id;
    clientId = 'User'+clientId.substr(clientId.length-3,3);

    client.broadcast.emit('connect',clientId + ' connected');
    //client.send(JSON.stringify({'messages':buffer}));
    client.emit('message',{'messages':buffer});

    client.on('message', function(message){
    	console.log(message);

        var msg = { user: clientId, message: message};
        buffer.push(msg);
        if (buffer.length > 15)
        	buffer.shift(); //removes first item in array
        client.broadcast.emit('message',{'messages':[msg]});
    });

    client.on('disconnect', function(){
        client.broadcast.emit('disconnect',clientId + ' disconnected');
    });
});
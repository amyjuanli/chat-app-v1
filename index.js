///////////////// import modules ////////////////////////////////
var express = require('express'),
    socketio = require('socket.io');



///////////////// set up App ////////////////////////////////
var app = express();
var server = app.listen(4000, function () {
    console.log('listening for requests on port 4000,');
});
// Socket setup & pass server
var io = socketio(server);
// Static files
app.use(express.static('public'));


///////////////// listen to connection ////////////////////////////////
/**
 * default namespace
 * ('/') root
 */
var count = 0;
io.on('connection', (socket) => {
    count++;
    console.log(' %s sockets connected', io.engine.clientsCount);
    console.log('made socket connection', socket.id);
    console.log('online users', count);

    socket.broadcast.emit('user.events', 'Someone has joined!');
    socket.on('name', (name) => {
        socket.broadcast.emit('user.events', name + ' has joined!');
        socket.broadcast.emit('name', name);
    });

    // users' count
    socket.on('onlineUsers', () => {
        io.sockets.emit('onlineUsersCount', count);
    })

    socket.on('chat', (data) => {
        io.sockets.emit('chat', data);
    });

    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', data);
    });


    socket.on('event', (e) => {
        socket.broadcast.to(e.room).emit('event', e.name + ' says Hello!');
    });

    /**
     *  disconnect
     * happens when user close the browser, for instance.
     * NOTE: refresh page: disconnect and connect (so socket count stay the same)
     */
    socket.on("disconnect", () => {
        // update the count of online users
        count--;
        io.sockets.emit("onlineUsersCount", count);

        socket.broadcast.emit('user.events', 'Someone has left!');
    });
});
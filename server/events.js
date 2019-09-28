const Authentication = require('./events/authentication');
const Messages = require('./events/messages');

function Events(socket, details, io) {
    // handle new user joining
    details.anonymousUserCount++;
    io.sockets.emit('anonymous joined', details.anonymousUserCount);
    io.sockets.emit('user list', details.loggedInUserCount, details.connectedUsers)

    // handle authentication events
    Authentication(socket, details, io);

    // handle message events
    Messages(socket, details, io);

    // keep all clients up to date on disconnected clients
    socket.on('disconnect', function () {
        if (socket.chatter) {
            details.loggedInUserCount--;

            var userIndex = details.connectedUsers.findIndex(user => user === socket.chatter.username);

            socket.broadcast.emit('user left', `${socket.chatter.username} left the chat.`)

            details.connectedUsers.splice(userIndex, 1);

            io.sockets.emit('user list', details.loggedInUserCount ,details.connectedUsers);
        } else {
            details.anonymousUserCount--;
            io.sockets.emit('anonymous left', details.anonymousUserCount);
        }
    });
}

module.exports = Events;
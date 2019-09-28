const secret = require('../config/settings').secret;
const Message = require('../models/message');
const jwt = require('jsonwebtoken');

function Messages(socket, details, io) {
    socket.on('get messages', (token) => {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                socket.emit('auth error', 'Invalid token.');
            } else if (decoded.username !== socket.chatter.username) {
                socket.emit('auth error', 'Someone else has logged in to this browser.');
                socket.disconnect();
            } else {
                Message.find()
                .populate('user', 'local.username -_id')
                .select('user.local.username message created_at -_id')
                .then(messages => {
                    socket.emit('message list', messages);
                })
                .catch(err => {
                    socket.emit('auth error', err);
                });
            }
        });
    });

    // handle users sending messages to chat
    socket.on('send message', (message, token) => {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                socket.emit('auth error', 'Invalid token.');
            } else if (decoded.username !== socket.chatter.username) {
                socket.emit('auth error', 'Someone else has logged in to this browser.');
                socket.disconnect();
            } else {
                var newMessage = new Message();
                newMessage.user = decoded.id;
                newMessage.message = message;

                newMessage.save()
                .then(() => {
                    io.sockets.emit('new message', socket.chatter.username, message, newMessage.created_at);
                })
                .catch(err => {
                    socket.emit('auth error', err);
                })
            }
        });
    });
}

module.exports = Messages;
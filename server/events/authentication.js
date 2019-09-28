const User = require('../models/user');
const bcrypt = require('bcrypt-nodejs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const secret = require('../config/settings').secret;

function Authentication(socket, details, io) {
    socket.on('register', function (username, password) {
        // validate user input
        if (!username) {
            return socket.emit('auth error', 'Username can not be left blank.');
        }

        if (!password) {
            return socket.emit('auth error', 'Password can not be left blank.');
        }

        if (username.match(/^[a-zA-Z0-9_]*$/g) === null) {
            return socket.emit('auth error', 'Usernames must only contain letters, numbers, or underscores.');
        }

        if (!validator.isAscii(password)) {
            return socket.emit('auth error', 'Passwords must only contain letters, numbers, and symbols.');
        }

        User.findOne({'local.username': username})
        .then(user => {
            if (user) {
                throw 'A user with that username already exists';
            }

            var newUser = new User();

            newUser.local.username = username;

            // hash password with bcrypt before storing
            newUser.local.password = bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);

            return newUser.save()
        })
        .then(() => {
            socket.emit('register success', 'Account created successfully. Please log in to continue.');
        })
        .catch(err => {
            socket.emit('auth error', err);
        });
    });

    socket.on('login', function (username, password) {
        var socketUser;

        if (details.connectedUsers.indexOf(username) === -1) {
            User.findOne({ 'local.username': username })
            .then(user => {

                if (bcrypt.compareSync(password, user.local.password)) {
                    details.anonymousUserCount--;
                    details.loggedInUserCount++;

                    details.connectedUsers.push(user.local.username);

                    socket.chatter = {};
                    socket.chatter.username = user.local.username;

                    jwt.sign({id: user._id, username: user.local.username}, secret, function(err, token) {
                        if (err) {
                            return socket.emit('auth error', 'Unable to log in');
                        }

                        io.sockets.emit('anonymous left', details.anonymousUserCount);

                        socket.emit('logged in', token);

                        io.sockets.emit('user joined', `${user.local.username} joined the chat!`, details.loggedInUserCount, details.connectedUsers);
                    });
                } else {
                    throw 'Invalid username or password.';
                }
            })
            .catch(err => {
                socket.emit('auth error', err);
            });
        } else {
            socket.emit('auth error', 'Already logged in.');
        }
    });
}

module.exports = Authentication;
require('dotenv').config();
const express = require('express');
const path = require('path');
const dbConfig = require('./server/config/database');
const Events = require('./server/events.js');
const app = express();

// Set up the server
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5000;

// track the state of the socket server
var serverDetails = {
    anonymousUserCount: 0,
    loggedInUserCount: 0,
    connectedUsers: []
}

// runs database configuration
dbConfig();

// create socket events
io.on('connection', function (socket){
    Events(socket, serverDetails, io);
});

// serve the built version of our client
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
});
  
http.listen(port, function(){
    console.log(`listening on *:${port}`);
});

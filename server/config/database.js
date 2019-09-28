const mongoose = require('mongoose');
const mongoUrl = require('./settings').mongoUrl;

function dbConfig() {
    mongoose.connect(mongoUrl, {
        useNewUrlParser: true
    });
    mongoose.set('useCreateIndex', true);
    mongoose.Promise = require('bluebird');

    // CONNECTION EVENTS
    // When successfully connected
    mongoose.connection.on('connected', function () {  
        console.log(`Mongoose default connection opened`);
    }); 

    // If the connection throws an error
    mongoose.connection.on('error', function (err) {  
        console.log(`Mongoose default connection error: ${err}`);
    }); 

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {  
        console.log('Mongoose default connection disconnected'); 
    });

    // If the Node process ends, close the Mongoose connection 
    process.on('SIGINT', function () {  
        mongoose.connection.close(function () { 
            console.log('Mongoose default connection disconnected through app termination'); 
            process.exit(0); 
        }); 
    });
}

module.exports = dbConfig;
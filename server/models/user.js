// import needed modules
const mongoose = require('mongoose');

// define the schema for our user model
const userSchema = mongoose.Schema({
    local: {
        username: String,
        password: String
    },
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
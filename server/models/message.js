// import needed modules
const mongoose = require('mongoose');

// define the schema for our user model
const messageSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: String
},
{
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
});

messageSchema.index({
    createdAt: 1
},
{
    expireAfterSeconds: 86400
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Message', messageSchema);
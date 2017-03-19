var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    content: {
        type: String,
        trim: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    sender: {
        type: String
    },
    ownerId: {
        type: String
    },
    gender: String,
    image: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
});



module.exports = mongoose.model('Chat', schema);


const mongoose = require('mongoose');

const chats = new mongoose.Schema({
    contactId: {
        type: Number,
        default: 1234,
    },

    contactName: {
        type: String,
    },
    messages: {
        type: String,
    },
    timestamp: {
        type: String,
    },
    unreadCount: {
        type: String,
        default: 0,
    },
});

module.exports = mongoose.model('chats', chats);

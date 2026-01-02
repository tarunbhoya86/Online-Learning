const mongoose = require('mongoose');

const supportSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['ticket', 'chat'],
        required: true
    },
    subject: {
        type: String, // For tickets
    },
    category: {
        type: String,
    },
    description: {
        type: String, // For tickets
    },
    messages: [{
        sender: String, // 'user' or 'agent'
        text: String,
        timestamp: { type: Date, default: Date.now }
    }], // For chat
    email: {
        type: String,
    },
    status: {
        type: String,
        enum: ['open', 'closed', 'in-progress'],
        default: 'open'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Support', supportSchema);

const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    linkedin: {
        type: String
    },
    portfolio: {
        type: String
    },
    coverLetter: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'interview', 'rejected', 'hired'],
        default: 'pending'
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', applicationSchema);

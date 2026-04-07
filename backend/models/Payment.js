const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: String, // Or mongoose.Schema.Types.ObjectId if referencing User model
        required: false // Optional for now as not all checkout flows might have ID
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    courseTitle: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    cardNumberMasked: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Completed'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);

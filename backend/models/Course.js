const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    instructor: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, default: 0 },
    students: { type: String, default: '0' },
    image: { type: String }
});

module.exports = mongoose.model('Course', courseSchema);

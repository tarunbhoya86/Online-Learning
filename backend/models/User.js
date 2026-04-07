const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    zipCode: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: 'Student' }, // Student, Mentor, Admin
    status: { type: String, default: 'Active' },
    image: { type: String },
    expertise: [{ type: String }],
    enrolledCourses: [{
        course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
        progress: { type: Number, default: 0 },
        completedChapters: [{ type: String }],
        enrolledDate: { type: Date, default: Date.now }
    }],
    joinDate: { type: Date, default: Date.now },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

module.exports = mongoose.model('User', userSchema);

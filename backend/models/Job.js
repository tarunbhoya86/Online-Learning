const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    type: {
        type: String, // e.g., Remote, On-site, Hybrid
        required: true
    },
    salaryByYear: {
        type: String, // e.g., '$120k - $160k'
        required: true
    },
    description: {
        type: String,
        // Can add more details later if needed
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Job', jobSchema);

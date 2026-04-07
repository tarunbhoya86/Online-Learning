const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

const jobs = [
    { title: 'Senior Frontend Engineer', department: 'Engineering', type: 'Remote', salaryByYear: '$120k - $160k' },
    { title: 'Product Designer', department: 'Design', type: 'Remote', salaryByYear: '$90k - $130k' },
    { title: 'Customer Success Manager', department: 'Operations', type: 'Hybrid', salaryByYear: '$70k - $90k' },
    { title: 'Backend Developer (Node.js)', department: 'Engineering', type: 'Remote', salaryByYear: '$110k - $150k' },
];

const seedJobs = async () => {
    try {
        await Job.deleteMany(); // Clear existing
        await Job.insertMany(jobs);
        console.log('Jobs seeded successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding jobs:', error);
        process.exit(1);
    }
};

seedJobs();

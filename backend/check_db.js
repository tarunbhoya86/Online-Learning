const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course'); // Ensure Course model is registered

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB. Fetching detailed data...\n');

        // Fetch users and populate course details
        const users = await User.find({}).populate('enrolledCourses.course');

        const students = users.filter(u => u.role === 'Student');
        const mentors = users.filter(u => u.role === 'Mentor');
        const admins = users.filter(u => u.role === 'Admin');

        console.log('=== MENTORS ===');
        mentors.forEach(m => {
            console.log(`ID: ${m._id}`);
            console.log(`Name: ${m.name}`);
            console.log(`Email: ${m.email}`);
            console.log(`Image: ${m.image || 'N/A'}`);
            console.log(`Expertise: ${m.expertise.join(', ') || 'None'}`);
            console.log('-----------------------------------');
        });

        console.log('\n=== STUDENTS ===');
        students.forEach(s => {
            console.log(`ID: ${s._id}`);
            console.log(`Name: ${s.name}`);
            console.log(`Email: ${s.email}`);
            console.log(`Phone: ${s.phone || 'N/A'}`);
            console.log(`Address: ${s.address}, ${s.city}, ${s.country} (Zip: ${s.zipCode})`);

            if (s.enrolledCourses.length > 0) {
                console.log('  Enrolled Courses:');
                s.enrolledCourses.forEach(e => {
                    const courseTitle = e.course ? e.course.title : 'Unknown Course (Deleted?)';
                    console.log(`    - Course: ${courseTitle}`);
                    console.log(`      Progress: ${e.progress}%`);
                    console.log(`      Completed Chapters: ${e.completedChapters.length}`);
                    console.log(`      Enrolled Date: ${e.enrolledDate}`);
                });
            } else {
                console.log('  No courses enrolled.');
            }
            console.log('-----------------------------------');
        });

        console.log('\n=== ADMINS ===');
        admins.forEach(a => {
            console.log(`ID: ${a._id}`);
            console.log(`Name: ${a.name}`);
            console.log(`Email: ${a.email}`);
            console.log('-----------------------------------');
        });

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

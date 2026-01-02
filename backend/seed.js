const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const initialCourses = [
    {
        title: 'Full Stack Web Development',
        category: 'Development',
        instructor: 'Sarah Jenkins',
        price: 'Rs.4999',
        rating: 4.8,
        students: '12k+',
        image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Python for Data Science',
        category: 'Data Science',
        instructor: 'David Chen',
        price: 'Rs.3999',
        rating: 4.9,
        students: '8k+',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'UI/UX Design Masterclass',
        category: 'Design',
        instructor: 'Emily Zhang',
        price: 'Rs.4499',
        rating: 4.7,
        students: '5k+',
        image: 'https://images.unsplash.com/photo-1559028613-e943c797b211?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Deep Learning Specialization',
        category: 'Data Science',
        instructor: 'Michael Brown',
        price: 'Rs.5999',
        rating: 5.0,
        students: '3k+',
        image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    // 10 New Courses
    {
        title: 'Advanced React Patterns',
        category: 'Development',
        instructor: 'Robert Fox',
        price: 'Rs.5499',
        rating: 4.9,
        students: '2.5k+',
        image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Node.js Microservices',
        category: 'Development',
        instructor: 'Kristin Watson',
        price: 'Rs.4999',
        rating: 4.7,
        students: '4k+',
        image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Flutter Mobile App Development',
        category: 'Mobile',
        instructor: 'Cody Fisher',
        price: 'Rs.3999',
        rating: 4.6,
        students: '6k+',
        image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'AWS Certified Solutions Architect',
        category: 'Cloud Computing',
        instructor: 'Jerome Bell',
        price: 'Rs.7999',
        rating: 4.9,
        students: '10k+',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Ethical Hacking 101',
        category: 'Cybersecurity',
        instructor: 'Arlene McCoy',
        price: 'Rs.2999',
        rating: 4.8,
        students: '15k+',
        image: 'https://images.unsplash.com/photo-1563206767-5b1d972f9fb4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Digital Marketing Strategy',
        category: 'Marketing',
        instructor: 'Ralph Edwards',
        price: 'Rs.1999',
        rating: 4.5,
        students: '20k+',
        image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Financial Analysis & Valuation',
        category: 'Finance',
        instructor: 'Darrell Steward',
        price: 'Rs.5999',
        rating: 4.7,
        students: '1.2k+',
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Graphic Design Bootcamp',
        category: 'Design',
        instructor: 'Kathryn Murphy',
        price: 'Rs.3499',
        rating: 4.6,
        students: '7k+',
        image: 'https://images.unsplash.com/photo-1626785774573-4b799312299d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Machine Learning A-Z',
        category: 'Data Science',
        instructor: 'Eleanor Pena',
        price: 'Rs.6999',
        rating: 4.8,
        students: '9k+',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    },
    {
        title: 'Agile Project Management',
        category: 'Business',
        instructor: 'Guy Hawkins',
        price: 'Rs.4499',
        rating: 4.5,
        students: '3k+',
        image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    }
];

const initialUsers = [
    { name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'Student', status: 'Active', image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    { name: 'Jane Smith', email: 'jane@example.com', password: 'password123', role: 'Mentor', status: 'Active', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', expertise: ['Web Development', 'React'] },
    { name: 'Admin User', email: 'admin@gmail.com', password: '123', role: 'Admin', status: 'Active', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
    // 10 New Mentors
    { name: 'Robert Fox', email: 'robert@edu.com', password: 'password123', role: 'Mentor', status: 'Active', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', expertise: ['AI', 'Python', 'Machine Learning'] },
    { name: 'Kristin Watson', email: 'kristin@edu.com', password: 'password123', role: 'Mentor', status: 'Active', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', expertise: ['Node.js', 'Backend', 'Database'] },
    { name: 'Cody Fisher', email: 'cody@edu.com', password: 'password123', role: 'Mentor', status: 'Active', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', expertise: ['Mobile Dev', 'Flutter', 'Dart'] },
    { name: 'Jerome Bell', email: 'jerome@edu.com', password: 'password123', role: 'Mentor', status: 'Active', image: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', expertise: ['Cloud', 'AWS', 'DevOps'] },
    { name: 'Arlene McCoy', email: 'arlene@edu.com', password: 'password123', role: 'Mentor', status: 'Active', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', expertise: ['Cybersecurity', 'Network Seurity'] },
    { name: 'Ralph Edwards', email: 'ralph@edu.com', password: 'password123', role: 'Mentor', status: 'Active', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', expertise: ['Digital Marketing', 'SEO'] },
    { name: 'Darrell Steward', email: 'darrell@edu.com', password: 'password123', role: 'Mentor', status: 'Active', image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', expertise: ['Finance', 'Investment'] },
    { name: 'Kathryn Murphy', email: 'kathryn@edu.com', password: 'password123', role: 'Mentor', status: 'Active', image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', expertise: ['UI/UX Design', 'Figma'] },
    { name: 'Eleanor Pena', email: 'eleanor@edu.com', password: 'password123', role: 'Mentor', status: 'Active', image: 'https://images.unsplash.com/photo-1520813792240-56fc4a37b1a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', expertise: ['Data Science', 'Python'] },
    { name: 'Guy Hawkins', email: 'guy@edu.com', password: 'password123', role: 'Mentor', status: 'Active', image: 'https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', expertise: ['Business', 'Agile'] },
];

const seedDB = async () => {
    try {
        await Course.deleteMany({});
        await User.deleteMany({});

        await Course.insertMany(initialCourses);
        await User.insertMany(initialUsers);

        console.log('Database Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();

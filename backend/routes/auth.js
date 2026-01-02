const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, role, image } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: 'User already exists' });

        user = new User({ name, email, password, role, image });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        if (user.password !== password) { // ideally hash passwords
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

        res.json({ message: 'Login successful', user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Google Login
router.post('/google', async (req, res) => {
    try {
        const { token } = req.body;
        // Verify token and get user info from Google
        const axios = require('axios');
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        const googleUser = response.data;

        const { email, name, picture } = googleUser;

        let user = await User.findOne({ email });
        if (user) {
            res.json({ message: 'Login successful', user });
        } else {
            // Create user
            // Generate a random password since they use Google
            const randomPassword = Math.random().toString(36).slice(-8);
            user = new User({
                name,
                email,
                password: randomPassword,
                image: picture,
                role: 'Student' // Default role
            });
            await user.save();
            res.json({ message: 'User registered via Google', user });
        }

    } catch (err) {
        console.error('Google Auth Error:', err.message);
        res.status(500).json({ message: 'Google Auth Failed', error: err.message });
    }
});

// Phone Login
router.post('/phone-login', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required' });
        }

        let user = await User.findOne({ phone });

        if (user) {
            res.json({ message: 'Login successful', user });
        } else {
            // Create new user for this phone
            const randomPassword = Math.random().toString(36).slice(-8);
            // Ensure unique email
            const dummyEmail = `${phone}@mobile.app`;

            user = new User({
                name: 'Mobile User',
                email: dummyEmail,
                phone: phone,
                password: randomPassword,
                role: 'Student'
            });

            await user.save();
            res.json({ message: 'User registered via Phone', user });
        }
    } catch (err) {
        console.error('Phone Auth Error:', err.message);
        res.status(500).json({ message: 'Phone Auth Failed', error: err.message });
    }
});

// Demo Login (For development/testing without Google Client ID)
router.post('/demo-login', async (req, res) => {
    try {
        const email = 'google@demo.com';
        let user = await User.findOne({ email });

        if (user) {
            res.json({ message: 'Demo login successful', user });
        } else {
            // Create Demo User
            user = new User({
                name: 'Demo Google User',
                email: email,
                password: 'demo_password_123', // Dummy password
                image: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
                role: 'Student',
                status: 'Active'
            });
            await user.save();
            res.json({ message: 'Demo user created', user });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Check User for Avatar Display
router.post('/check-user', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email required' });

        const user = await User.findOne({ email }).select('name image');
        if (user) {
            res.json({ found: true, user });
        } else {
            res.json({ found: false });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Get All Users (Admin)
router.get('/users', async (req, res) => {
    try {
        // Find all users and populate their enrolled courses to calculate payments
        const users = await User.find().populate('enrolledCourses.course');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Update User (Admin)
router.put('/users/:id', async (req, res) => {
    try {
        const { name, email, role, expertise, status, image } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.status = status || user.status;
        if (image) user.image = image;

        if (expertise) {
            user.expertise = expertise;
        }

        await user.save();
        res.json({ message: 'User updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Delete User (Admin)
router.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Enroll in a Course
router.post('/enroll', async (req, res) => {
    try {
        const { userId, courseId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if already enrolled
        const alreadyEnrolled = user.enrolledCourses.some(
            enrollment => enrollment.course.toString() === courseId
        );

        if (!alreadyEnrolled) {
            user.enrolledCourses.push({ course: courseId });
            await user.save();
        }
        res.json({ message: 'Enrolled successfully', enrolledCourses: user.enrolledCourses });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Get User's Enrolled Courses
router.get('/:userId/courses', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('enrolledCourses.course');
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Filter out null courses (if course was deleted) and format
        const courses = user.enrolledCourses
            .filter(e => e.course)
            .map(e => ({
                ...e.course.toObject(),
                progress: e.progress,
                completedChapters: e.completedChapters,
                enrolledDate: e.enrolledDate,
                enrollmentId: e._id // Keep track of the enrollment object ID if needed
            }));

        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Update Course Progress
router.post('/update-progress', async (req, res) => {
    try {
        const { userId, courseId, progress, completedChapters } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const enrollment = user.enrolledCourses.find(
            e => e.course.toString() === courseId || (e.course._id && e.course._id.toString() === courseId)
        );

        if (enrollment) {
            enrollment.progress = progress;
            enrollment.completedChapters = completedChapters;
            await user.save();
            res.json({ success: true, message: 'Progress updated', progress: enrollment.progress });
        } else {
            res.status(404).json({ message: 'Course not found in enrollments' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate token
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and save to DB
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        await user.save();

        // In a real app, send email here. 
        // For development, return the token/link directly.
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;

        res.json({ success: true, message: 'Email sent', resetUrl });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Reset Password
router.put('/reset-password/:token', async (req, res) => {
    try {
        const crypto = require('crypto');
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid token or token expired' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Change Password
router.post('/change-password', async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check current password
        // Note: In production with hashed passwords, use bcrypt.compare
        if (user.password !== currentPassword) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Update Profile
router.put('/update-profile', async (req, res) => {
    try {
        const { userId, name, phone, address, city, country, zipCode } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        if (city) user.city = city;
        if (country) user.country = country;
        if (zipCode) user.zipCode = zipCode;
        if (req.body.image) user.image = req.body.image;

        await user.save();

        res.json({ message: 'Profile updated successfully', user });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Cancel Course
router.post('/cancel-course', async (req, res) => {
    try {
        const { userId, courseId } = req.body;

        await User.findByIdAndUpdate(userId, {
            $pull: { enrolledCourses: { course: courseId } }
        });

        res.json({ message: 'Course cancelled successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;

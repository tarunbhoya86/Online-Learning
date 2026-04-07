const express = require('express');
const router = express.Router();
const Course = require('../models/Course');

// Get All Courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Add Course (Admin)
router.post('/', async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Update Course (Admin)
router.put('/:id', async (req, res) => {
    try {
        const { title, category, instructor, price, image } = req.body;
        const course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        course.title = title || course.title;
        course.category = category || course.category;
        course.instructor = instructor || course.instructor;
        course.price = price || course.price;
        course.image = image || course.image;

        await course.save();
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

// Delete Course (Admin)
router.delete('/:id', async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
});

module.exports = router;

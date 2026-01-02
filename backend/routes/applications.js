const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Submit a new job application
router.post('/', async (req, res) => {
    try {
        const newApplication = new Application(req.body);
        const savedApplication = await newApplication.save();
        res.status(201).json(savedApplication);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all applications (Admin only - potential future use)
router.get('/', async (req, res) => {
    try {
        const applications = await Application.find().sort({ appliedAt: -1 });
        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

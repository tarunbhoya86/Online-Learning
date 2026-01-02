const express = require('express');
const router = express.Router();
const Job = require('../models/Job');

// Get all jobs
router.get('/', async (req, res) => {
    try {
        const jobs = await Job.find().sort({ createdAt: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new job (Admin or Seed)
router.post('/', async (req, res) => {
    try {
        const job = new Job({
            title: req.body.title,
            department: req.body.department,
            type: req.body.type,
            salaryByYear: req.body.salaryByYear,
            description: req.body.description
        });
        const newJob = await job.save();
        res.status(201).json(newJob);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

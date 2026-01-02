const express = require('express');
const router = express.Router();
const Support = require('../models/Support');

// Create a new support ticket or chat session
router.post('/', async (req, res) => {
    try {
        const { type, subject, category, description, messages, email } = req.body;

        const newSupport = new Support({
            type,
            subject,
            category,
            description,
            messages,
            email
        });

        const savedSupport = await newSupport.save();
        res.status(201).json(savedSupport);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all support requests (for admin purposes, potentially)
router.get('/', async (req, res) => {
    try {
        const supports = await Support.find().sort({ createdAt: -1 });
        res.json(supports);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

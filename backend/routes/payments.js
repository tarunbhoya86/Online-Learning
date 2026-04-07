const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');

// Process a new payment
router.post('/', async (req, res) => {
    try {
        const { userName, userEmail, courseTitle, price, cardNumber } = req.body;

        // Mask the card number (only show last 4 digits)
        const maskedCard = `**** **** **** ${cardNumber.slice(-4)}`;

        const newPayment = new Payment({
            userName,
            userEmail,
            courseTitle,
            price,
            cardNumberMasked: maskedCard,
            status: 'Completed'
        });

        const savedPayment = await newPayment.save();
        res.status(201).json(savedPayment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all payments (Admin)
router.get('/', async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');

// GET all guides
router.get('/', async (req, res) => {
    try {
        const guides = await Guide.find().sort({ name: 1 });
        res.json(guides);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single guide
router.get('/:id', async (req, res) => {
    try {
        const guide = await Guide.findById(req.params.id);
        if (!guide) return res.status(404).json({ error: 'Guide not found' });
        res.json(guide);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create guide
router.post('/', async (req, res) => {
    try {
        const guide = new Guide(req.body);
        await guide.save();
        res.status(201).json(guide);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update guide
router.put('/:id', async (req, res) => {
    try {
        const guide = await Guide.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!guide) return res.status(404).json({ error: 'Guide not found' });
        res.json(guide);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE guide
router.delete('/:id', async (req, res) => {
    try {
        const guide = await Guide.findByIdAndDelete(req.params.id);
        if (!guide) return res.status(404).json({ error: 'Guide not found' });
        res.json({ message: 'Guide deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

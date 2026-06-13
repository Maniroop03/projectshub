const express = require('express');
const router = express.Router();
const Group = require('../models/Group');

// GET all groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find().sort({ name: 1 });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single group
router.get('/:id', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ error: 'Group not found' });
        res.json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create group
router.post('/', async (req, res) => {
    try {
        const group = new Group(req.body);
        await group.save();
        res.status(201).json(group);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update group
router.put('/:id', async (req, res) => {
    try {
        const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!group) return res.status(404).json({ error: 'Group not found' });
        res.json(group);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE all groups
router.delete('/all/clear', async (req, res) => {
    try {
        const result = await Group.deleteMany({});
        res.json({ message: `All groups deleted`, count: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE group by id
router.delete('/:id', async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        if (!group) return res.status(404).json({ error: 'Group not found' });
        res.json({ message: 'Group deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST bulk add groups
router.post('/bulk', async (req, res) => {
    try {
        const groups = req.body;
        if (!Array.isArray(groups)) {
            return res.status(400).json({ error: 'Input must be an array of groups' });
        }
        const result = await Group.insertMany(groups, { ordered: false });
        res.status(201).json({ message: `${result.length} groups added successfully`, count: result.length });
    } catch (err) {
        if (err.writeErrors) {
            // Handle partial success/bulk write errors (e.g. duplicate rollNo)
            res.status(400).json({ 
                error: 'Some records failed to import', 
                details: err.writeErrors.map(e => e.errmsg),
                insertedCount: err.result.nInserted
            });
        } else {
            res.status(400).json({ error: err.message });
        }
    }
});

module.exports = router;

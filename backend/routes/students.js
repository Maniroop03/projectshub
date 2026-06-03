const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find().sort({ name: 1 });
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single student
router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create student
router.post('/', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update student
router.put('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE student
router.delete('/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json({ message: 'Student deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST bulk add students
router.post('/bulk', async (req, res) => {
    try {
        const students = req.body;
        if (!Array.isArray(students)) {
            return res.status(400).json({ error: 'Input must be an array of students' });
        }
        const result = await Student.insertMany(students, { ordered: false });
        res.status(201).json({ message: `${result.length} students added successfully`, count: result.length });
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

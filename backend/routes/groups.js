const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const bcrypt = require('bcryptjs');

// GET all groups
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find().sort({ batch: 1 });
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single group
router.get('/:id', async (req, res) => {
    try {
        const student = await Group.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Group not found' });

        // Find all members in the same batch
        let members = [];
        if (student.batch) {
            members = await Group.find({ batch: student.batch });
        } else {
            members = [student];
        }

        // Return a response formatted like the frontend expects
        res.json({
            _id: student._id,
            batch: student.batch,
            section: student.section || '',
            domain: student.domain || '',
            year: student.year || 'III',
            department: student.department || '',
            members: members.map(m => ({
                _id: m._id,
                role: m.role || 'Member',
                name: m.name || '',
                rollNo: m.rollNo || '',
                email: m.email || '',
                phone: m.phone || ''
            }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST group login
router.post('/login', async (req, res) => {
    try {
        const { rollNo, password } = req.body;
        if (!rollNo || !password) return res.status(400).json({ error: 'rollNo and password are required' });

        const student = await Group.findOne({ rollNo }).select('+password');
        if (!student) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, student.password || '');
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        // Return public-facing fields (do not include password)
        const publicStudent = await Group.findById(student._id);
        res.json(publicStudent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create group
router.post('/', async (req, res) => {
    try {
        const { batch, section, domain, year, department, members } = req.body;

        if (!members || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({ error: 'Members array is required' });
        }

        const createdStudents = [];
        for (const m of members) {
            const toSave = {
                batch,
                section,
                domain,
                year: year || 'III',
                department: department || '',
                role: m.role || 'Member',
                name: m.name,
                rollNo: m.rollNo,
                email: m.email,
                phone: m.phone || ''
            };
            if (m.password) {
                // hash provided password
                toSave.password = await bcrypt.hash(m.password, 10);
            }
            const student = new Group(toSave);
            await student.save();
            createdStudents.push(student);
        }

        // Return the first created student to satisfy return type
        res.status(201).json(createdStudents[0]);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update group
router.put('/:id', async (req, res) => {
    try {
        const studentToUpdate = await Group.findById(req.params.id);
        if (!studentToUpdate) return res.status(404).json({ error: 'Group member not found' });

        const originalBatch = studentToUpdate.batch;
        const { batch, section, domain, year, department, members } = req.body;

        if (!members || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({ error: 'Members array is required' });
        }

        // Find existing students in the original batch
        const existingStudents = await Group.find({ batch: originalBatch });
        const updatedIds = members.filter(m => m._id).map(m => m._id.toString());

        // Delete members that were removed
        const idsToDelete = existingStudents
            .filter(s => !updatedIds.includes(s._id.toString()))
            .map(s => s._id);

        if (idsToDelete.length > 0) {
            await Group.deleteMany({ _id: { $in: idsToDelete } });
        }

        // Update existing members and create new ones
        for (const m of members) {
            if (m._id) {
                const updateObj = {
                    batch,
                    section,
                    domain,
                    year: year || 'III',
                    department: department || '',
                    role: m.role || 'Member',
                    name: m.name,
                    rollNo: m.rollNo,
                    email: m.email,
                    phone: m.phone || ''
                };
                if (m.password) {
                    updateObj.password = await bcrypt.hash(m.password, 10);
                }
                await Group.findByIdAndUpdate(m._id, updateObj, { runValidators: true });
            } else {
                const newStudentObj = {
                    batch,
                    section,
                    domain,
                    year: year || 'III',
                    department: department || '',
                    role: m.role || 'Member',
                    name: m.name,
                    rollNo: m.rollNo,
                    email: m.email,
                    phone: m.phone || ''
                };
                if (m.password) newStudentObj.password = await bcrypt.hash(m.password, 10);
                const newStudent = new Group(newStudentObj);
                await newStudent.save();
            }
        }

        // Find and return the updated/current document for the requested ID
        let responseDoc = await Group.findById(req.params.id);
        if (!responseDoc) {
            // If the clicked student was deleted/changed, return any member of this batch
            responseDoc = await Group.findOne({ batch });
        }
        res.json(responseDoc);
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
        // Hash passwords if provided before bulk insert
        const toInsert = await Promise.all(groups.map(async (g) => {
            const copy = { ...g };
            if (copy.password) copy.password = await bcrypt.hash(copy.password, 10);
            return copy;
        }));
        const result = await Group.insertMany(toInsert, { ordered: false });
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

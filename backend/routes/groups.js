const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const adminAuth = require('../middleware/adminAuth');
const bcrypt = require('bcryptjs');

const getLeadRollNo = (members) => {
    if (!Array.isArray(members) || members.length === 0) return '';
    const lead = members.find((m) => m.role === 'Lead') || members[0];
    return (lead?.rollNo || '').trim();
};

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

        const lead = await Group.findOne({ role: 'Lead', rollNo }).select('+password');
        if (!lead) return res.status(401).json({ error: 'Invalid credentials' });

        const validPassword = lead.password
            ? await bcrypt.compare(password, lead.password)
            : password === lead.rollNo;

        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

        if (!lead.password) {
            lead.password = await bcrypt.hash(lead.rollNo, 10);
            await lead.save();
        }

        // Fetch all members in the same batch
        const members = await Group.find({ batch: lead.batch });
        res.json({
            _id: lead._id,
            rollNo: lead.rollNo,
            batch: lead.batch,
            section: lead.section || '',
            domain: lead.domain || '',
            year: lead.year || 'III',
            department: lead.department || '',
            members: members.map((m) => ({
                _id: m._id,
                role: m.role || 'Member',
                name: m.name || '',
                rollNo: m.rollNo || '',
                email: m.email,
                phone: m.phone || ''
            }))
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create group
router.post('/', adminAuth, async (req, res) => {
    try {
        const { batch, section, domain, year, department, members } = req.body;

        if (!members || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({ error: 'Members array is required' });
        }

        const createdStudents = [];
        const leadRollNo = getLeadRollNo(members);
        if (!leadRollNo) {
            return res.status(400).json({ error: 'Lead roll number is required for group login credentials' });
        }
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
                phone: m.phone || '',
                password: await bcrypt.hash(leadRollNo, 10)
            };
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
router.put('/:id', adminAuth, async (req, res) => {
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

        const leadRollNo = getLeadRollNo(members);
        if (!leadRollNo) {
            return res.status(400).json({ error: 'Lead roll number is required for group login credentials' });
        }

        const hashedLeadPassword = await bcrypt.hash(leadRollNo, 10);

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
                    phone: m.phone || '',
                    password: hashedLeadPassword
                };
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
                    phone: m.phone || '',
                    password: hashedLeadPassword
                };
                const newStudent = new Group(newStudentObj);
                await newStudent.save();
            }
        }

        // Ensure any remaining batch members keep the same lead credential
        await Group.updateMany({ batch }, { password: hashedLeadPassword });

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
router.delete('/all/clear', adminAuth, async (req, res) => {
    try {
        const result = await Group.deleteMany({});
        res.json({ message: `All groups deleted`, count: result.deletedCount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE group by id
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        if (!group) return res.status(404).json({ error: 'Group not found' });
        res.json({ message: 'Group deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST bulk add groups
router.post('/bulk', adminAuth, async (req, res) => {
    try {
        const groups = req.body;
        if (!Array.isArray(groups)) {
            return res.status(400).json({ error: 'Input must be an array of groups' });
        }

        const leadRollByBatch = {};
        groups.forEach((g) => {
            if (g.role === 'Lead' && g.batch) {
                leadRollByBatch[g.batch] = leadRollByBatch[g.batch] || g.rollNo;
            }
        });

        const toInsert = await Promise.all(groups.map(async (g) => {
            const copy = { ...g };
            const leadRollNo = leadRollByBatch[g.batch] || copy.rollNo;
            if (leadRollNo) copy.password = await bcrypt.hash(leadRollNo, 10);
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

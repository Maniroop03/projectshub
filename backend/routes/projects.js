const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const adminAuth = require('../middleware/adminAuth');

// Setup multer for file upload
const uploadDir = process.env.VERCEL
    ? path.join('/tmp', 'uploads')
    : path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    fileFilter: (req, file, cb) => {
        const allowed = ['.ppt', '.pptx', '.pdf', '.doc', '.docx'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) cb(null, true);
        else cb(new Error('Only PPT, PPTX, PDF, DOC, DOCX files are allowed'));
    },
});

// GET all projects (with populated guide and students)
router.get('/', async (req, res) => {
    try {
        const { type, status, guide } = req.query;
        const filter = {};
        if (type) filter.projectType = type;
        if (status) filter.status = status;
        if (guide) filter.guide = guide;

        const projects = await Project.find(filter)
            .populate('guide', 'name phone email department')
            .populate('coGuide', 'name phone email')
            .populate('students', 'name rollNo year section department')
            .sort({ createdAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET stats (counts for dashboard)
router.get('/stats', async (req, res) => {
    try {
        const total = await Project.countDocuments();
        const mini = await Project.countDocuments({ projectType: 'Mini' });
        const major = await Project.countDocuments({ projectType: 'Major' });
        const submitted = await Project.countDocuments({ status: 'Submitted' });
        const approved = await Project.countDocuments({ status: 'Approved' });
        const completed = await Project.countDocuments({ status: 'Completed' });
        res.json({ total, mini, major, submitted, approved, completed });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET single project
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate('guide', 'name phone email department')
            .populate('coGuide', 'name phone email')
            .populate('students', 'name rollNo year section department phone email');
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST create project (with optional file upload)
router.post('/', adminAuth, upload.single('pptFile'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.coGuide === '') {
    data.coGuide = null;
}

if (data.guide === '') {
    data.guide = null;
}
        if (typeof data.students === 'string') {
            try { data.students = JSON.parse(data.students); } catch { data.students = [data.students]; }
        }
        if (data.coGuide === '') delete data.coGuide;
        if (data.guide === '') delete data.guide;
        if (req.file) {
            data.pptFilePath = '/uploads/' + req.file.filename;
            data.pptOriginalName = req.file.originalname;
        }
        const project = new Project(data);
        await project.save();
        const populated = await project.populate([
            { path: 'guide', select: 'name phone email' },
            { path: 'students', select: 'name rollNo' },
        ]);
        res.status(201).json(populated);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT update project (with optional file upload)
router.put('/:id', adminAuth, upload.single('pptFile'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.coGuide === '') {
    data.coGuide = null;
}

if (data.guide === '') {
    data.guide = null;
}
        if (typeof data.students === 'string') {
            try { data.students = JSON.parse(data.students); } catch { data.students = [data.students]; }
        }
        if (data.coGuide === '') delete data.coGuide;
        if (data.guide === '') delete data.guide;
        if (req.file) {
            data.pptFilePath = '/uploads/' + req.file.filename;
            data.pptOriginalName = req.file.originalname;
        }
        const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
            .populate('guide', 'name phone email')
            .populate('students', 'name rollNo');
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE project
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const project = await Project.findByIdAndDelete(req.params.id);
        if (!project) return res.status(404).json({ error: 'Project not found' });
        // Clean up uploaded file
        if (project.pptFilePath) {
            const filePath = path.join(__dirname, '..', project.pptFilePath);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

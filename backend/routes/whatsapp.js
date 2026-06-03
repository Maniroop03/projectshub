const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const Project = require('../models/Project');

// POST /api/whatsapp/notify/:projectId
// Sends a WhatsApp message to the project's guide
router.post('/notify/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId)
            .populate('guide', 'name phone')
            .populate('students', 'name rollNo');

        if (!project) return res.status(404).json({ error: 'Project not found' });
        if (!project.guide) return res.status(400).json({ error: 'No guide assigned to this project' });
        if (!project.guide.phone) return res.status(400).json({ error: 'Guide has no phone number' });

        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        const studentNames = project.students.map((s) => `${s.name} (${s.rollNo})`).join(', ');
        const submissionDate = project.submissionDate
            ? new Date(project.submissionDate).toLocaleDateString('en-IN')
            : 'Not specified';

        // Format guide phone as WhatsApp number
        let guidePhone = project.guide.phone.replace(/\D/g, '');
        if (!guidePhone.startsWith('91') && guidePhone.length === 10) {
            guidePhone = '91' + guidePhone;
        }

        // Use Content Template instead of plain text body
        await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_FROM,
            contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
            contentVariables: JSON.stringify({
                "1": project.title || "Project", 
                "2": submissionDate
            }),
            to: `whatsapp:+${guidePhone}`,
        });

        res.json({ success: true, message: `WhatsApp message sent to ${project.guide.name} (${project.guide.phone})` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/whatsapp/custom
// Send a custom WhatsApp message (for bulk notifications)
router.post('/custom', async (req, res) => {
    try {
        const { phone, message } = req.body;
        if (!phone || !message) return res.status(400).json({ error: 'phone and message are required' });

        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

        let guidePhone = phone.replace(/\D/g, '');
        if (!guidePhone.startsWith('91') && guidePhone.length === 10) {
            guidePhone = '91' + guidePhone;
        }

        await client.messages.create({
            body: message,
            from: process.env.TWILIO_WHATSAPP_FROM,
            to: `whatsapp:+${guidePhone}`,
        });

        res.json({ success: true, message: 'WhatsApp message sent successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Project = require('../models/Project');

// Create a nodemailer transporter using Gmail SMTP credentials from .env
function createTransporter() {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
}

// POST /api/email/notify/:projectId
// Sends a styled HTML email notification to the project's guide
router.post('/notify/:projectId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.projectId)
            .populate('guide', 'name email phone department')
            .populate('coGuide', 'name email')
            .populate('students', 'name rollNo year section department');

        if (!project) return res.status(404).json({ error: 'Project not found' });
        if (!project.guide) return res.status(400).json({ error: 'No guide assigned to this project' });
        if (!project.guide.email) return res.status(400).json({ error: 'Guide has no email address on record' });
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS)
            return res.status(500).json({ error: 'Email service not configured. Add SMTP_USER and SMTP_PASS to backend .env' });

        const submissionDate = project.submissionDate
            ? new Date(project.submissionDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
            : 'Not specified';

        const STATUS_COLORS = {
            'Submitted': '#3b82f6',
            'Under Review': '#f59e0b',
            'Approved': '#10b981',
            'Rejected': '#ef4444',
            'Completed': '#8b5cf6',
        };
        const statusColor = STATUS_COLORS[project.status] || '#6b7280';
        const typeColor = project.projectType === 'Major' ? '#7c3aed' : '#2563eb';

        const buildStudentRows = (students) => {
            if (!students || students.length === 0) return '';
            return students.map((s, i) => {
                const bg = i % 2 === 0 ? '#f9f9fb' : '#fff';
                return '<tr style="background:' + bg + '">'
                    + '<td style="padding:10px 16px;border-bottom:1px solid #eee">' + s.name + '</td>'
                    + '<td style="padding:10px 16px;border-bottom:1px solid #eee">' + s.rollNo + '</td>'
                    + '<td style="padding:10px 16px;border-bottom:1px solid #eee">' + (s.year || '--') + '</td>'
                    + '<td style="padding:10px 16px;border-bottom:1px solid #eee">' + (s.department || '--') + '</td>'
                    + '</tr>';
            }).join('');
        };

        const studentRows = buildStudentRows(project.students);

        const abstractSection = project.abstract
            ? '<tr><td style="padding:0 40px 24px;">'
            + '<div style="background:#f9fafb;border-left:4px solid #8b5cf6;border-radius:0 8px 8px 0;padding:16px 20px;">'
            + '<p style="margin:0 0 6px;font-size:12px;font-weight:700;color:#8b5cf6;text-transform:uppercase;">Abstract</p>'
            + '<p style="margin:0;font-size:14px;color:#374151;line-height:1.7;">' + project.abstract + '</p>'
            + '</div></td></tr>'
            : '';

        const teamSection = studentRows
            ? '<tr><td style="padding:0 40px 24px;">'
            + '<p style="margin:0 0 12px;font-size:14px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:0.5px;">Group Team</p>'
            + '<table width="100%" style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">'
            + '<thead><tr style="background:#f3f4f6;">'
            + '<th style="padding:10px 16px;text-align:left;font-size:12px;color:#6b7280;">Name</th>'
            + '<th style="padding:10px 16px;text-align:left;font-size:12px;color:#6b7280;">Roll No</th>'
            + '<th style="padding:10px 16px;text-align:left;font-size:12px;color:#6b7280;">Year</th>'
            + '<th style="padding:10px 16px;text-align:left;font-size:12px;color:#6b7280;">Dept</th>'
            + '</tr></thead>'
            + '<tbody>' + studentRows + '</tbody>'
            + '</table></td></tr>'
            : '';

        const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"></head>'
            + '<body style="margin:0;padding:0;font-family:\'Segoe UI\',Arial,sans-serif;background:#f0f2f5;">'
            + '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:40px 0;"><tr><td align="center">'
            + '<table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">'

            // Header
            + '<tr><td style="background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%);padding:36px 40px;text-align:center;">'
            + '<h1 style="margin:0;color:#fff;font-size:24px;font-weight:700;">&#x1F4CB; Project Notification</h1>'
            + '<p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Group Project Management System</p>'
            + '</td></tr>'

            // Greeting
            + '<tr><td style="padding:32px 40px 0;">'
            + '<p style="margin:0;font-size:16px;color:#374151;">Dear <strong>' + project.guide.name + '</strong>,</p>'
            + '<p style="margin:12px 0 0;font-size:15px;color:#6b7280;line-height:1.6;">You have been assigned as the guide for the following student project. Please review the details below.</p>'
            + '</td></tr>'

            // Project info card
            + '<tr><td style="padding:24px 40px;">'
            + '<div style="background:#f8f7ff;border:1px solid #e0e7ff;border-radius:12px;padding:24px;">'
            + '<table width="100%"><tr>'
            + '<td style="font-size:18px;font-weight:700;color:#1f2937;">' + project.title + '</td>'
            + '<td align="right"><span style="background:' + statusColor + ';color:#fff;padding:4px 14px;border-radius:20px;font-size:12px;font-weight:600;">' + project.status + '</span></td>'
            + '</tr></table>'
            + '<table width="100%" style="margin-top:16px;">'
            + '<tr><td style="padding:7px 0;width:40%;color:#6b7280;font-size:14px;">Type</td>'
            + '<td><span style="background:' + typeColor + ';color:#fff;padding:2px 12px;border-radius:20px;font-size:12px;font-weight:600;">' + project.projectType + ' Project</span></td></tr>'
            + '<tr><td style="padding:7px 0;color:#6b7280;font-size:14px;">Domain</td><td style="padding:7px 0;color:#1f2937;font-size:14px;">' + (project.domain || '--') + '</td></tr>'
            + '<tr><td style="padding:7px 0;color:#6b7280;font-size:14px;">Academic Year</td><td style="padding:7px 0;color:#1f2937;font-size:14px;">' + (project.academicYear || '--') + '</td></tr>'
            + '<tr><td style="padding:7px 0;color:#6b7280;font-size:14px;">Submission Date</td><td style="padding:7px 0;color:#1f2937;font-size:14px;">' + submissionDate + '</td></tr>'
            + '</table></div>'
            + '</td></tr>'

            + abstractSection
            + teamSection

            // Footer
            + '<tr><td style="background:#f8f7ff;padding:24px 40px;border-top:1px solid #e0e7ff;text-align:center;">'
            + '<p style="margin:0;font-size:13px;color:#9ca3af;">Automated notification from the <strong>Group Project Management System</strong>.</p>'
            + '<p style="margin:6px 0 0;font-size:12px;color:#d1d5db;">Please do not reply to this email.</p>'
            + '</td></tr>'

            + '</table></td></tr></table></body></html>';

        const ccAddress = project.coGuide && project.coGuide.email ? project.coGuide.email : undefined;

        const transporter = createTransporter();
        await transporter.sendMail({
            from: '"Project Hub" <' + process.env.SMTP_USER + '>',
            to: project.guide.email,
            cc: ccAddress,
            subject: '[Project Notification] ' + project.title + ' -- ' + project.status,
            html,
        });

        res.json({ success: true, message: 'Email sent to ' + project.guide.name + ' (' + project.guide.email + ')' });
    } catch (err) {
        console.error('Email send error:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST /api/email/custom
// Send a custom plain-text email to any address
router.post('/custom', async (req, res) => {
    try {
        const { to, subject, message } = req.body;
        if (!to || !subject || !message)
            return res.status(400).json({ error: '`to`, `subject` and `message` are required' });
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS)
            return res.status(500).json({ error: 'Email service not configured. Set SMTP_USER and SMTP_PASS.' });

        const transporter = createTransporter();
        await transporter.sendMail({
            from: '"Project Hub" <' + process.env.SMTP_USER + '>',
            to,
            subject,
            text: message,
        });
        res.json({ success: true, message: 'Email sent to ' + to });
    } catch (err) {
        console.error('Email send error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

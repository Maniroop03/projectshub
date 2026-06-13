const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
    {
        projectType: { type: String, enum: ['Mini', 'Major'], required: true },
        title: { type: String, required: true, trim: true },
        domain: { type: String, trim: true },
        abstract: { type: String, trim: true },
        submissionDate: { type: Date },
        status: {
            type: String,
            enum: ['Submitted', 'Under Review', 'Approved', 'Rejected', 'Completed'],
            default: 'Submitted',
        },
        academicYear: { type: String, trim: true },
        batchYear: { type: String, trim: true },
        guide: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide' },
        coGuide: { type: mongoose.Schema.Types.ObjectId, ref: 'Guide' },
        students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
        pptFilePath: { type: String, default: '' },
        pptOriginalName: { type: String, default: '' },
        remarks: { type: String, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);

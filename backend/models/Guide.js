const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, trim: true },
        department: { type: String, trim: true },
        domain: { type: String, trim: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Guide', guideSchema);

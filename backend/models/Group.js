const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema(
{
    batch: {
        type: String,
        required: true,
        trim: true
    },

    role: {
        type: String,
        enum: ['Lead', 'Member'],
        default: 'Member'
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    rollNo: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },

    year: {
        type: String,
        enum: ['I', 'II', 'III', 'IV'],
        default: 'III'
    },

    section: {
        type: String,
        trim: true
    },

    department: {
        type: String,
        trim: true
    },

    email: {
        type: String,
        trim: true
    },

    phone: {
        type: String,
        trim: true
    },

    domain: {
        type: String,
        trim: true
    }
},
{ timestamps: true }
);

module.exports = mongoose.model(
  'Group',
  groupSchema,
  'students'
);


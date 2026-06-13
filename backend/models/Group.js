const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
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
      trim: true
    },

    email: {
      type: String,
      trim: true
    },

    phone: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const groupSchema = new mongoose.Schema(
  {
    batch: {
      type: String,
      required: true,
      trim: true
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

    domain: {
      type: String,
      trim: true
    },

    members: {
      type: [memberSchema],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  'Group',
  groupSchema,
  'students'
);

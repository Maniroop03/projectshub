const Student = require('../models/Student');
const Guide = require('../models/Guide');
const Project = require('../models/Project');
const axios = require('axios');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function test() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const project = await Project.findOne().populate('guide');
        if (!project) {
            console.log('No projects found in database.');
            process.exit(0);
        }

        console.log(`Testing with Project: ${project.title} (ID: ${project._id})`);
        console.log(`Target Guide: ${project.guide?.name} (${project.guide?.phone})`);

        const response = await axios.post(`http://localhost:5000/api/whatsapp/notify/${project._id}`);
        console.log('API Response:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('API Error:', error.response.data);
        } else {
            console.error('Error:', error.message);
        }
    } finally {
        mongoose.connection.close();
    }
}

test();

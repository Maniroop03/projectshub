const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Group = require('../models/Group');
const Guide = require('../models/Guide');
const Project = require('../models/Project');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('MONGO_URI is not defined in .env');
    process.exit(1);
}

const seed = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB');

        // 1. Clear existing data (optional, but good for clean seeding)
        // await Group.deleteMany({});
        // await Guide.deleteMany({});
        // await Project.deleteMany({});

        // 2. Create Faculty (Guides)
        const facultyData = [
            { name: 'Dr. Rajesh Kumar', phone: '9876543210', email: 'rajesh.k@university.edu', department: 'Computer Science', domain: 'Artificial Intelligence' },
            { name: 'Dr. Sunita Sharma', phone: '9123456789', email: 'sunita.s@university.edu', department: 'Information Technology', domain: 'Cloud Computing' },
            { name: 'Prof. Amit Varma', phone: '8887776665', email: 'amit.v@university.edu', department: 'Electronics', domain: 'Embedded Systems' }
        ];

        const guides = await Guide.insertMany(facultyData);
        console.log(`Added ${guides.length} faculty members.`);

        // 3. Create Groups
        const groupData = [
            { batch: 'Batch 1', role: 'Lead', name: 'Arjun Mehta', rollNo: '2022CS01', year: 'IV', section: 'A', department: 'Computer Science', email: 'arjun.m@student.edu', phone: '7001112223', domain: 'Machine Learning' },
            { batch: 'Batch 1', role: 'Member', name: 'Priya Rai', rollNo: '2022CS02', year: 'IV', section: 'A', department: 'Computer Science', email: 'priya.r@student.edu', phone: '7001112224', domain: 'Neural Networks' },
            { batch: 'Batch 2', role: 'Lead', name: 'Karan Singh', rollNo: '2022IT05', year: 'III', section: 'B', department: 'Information Technology', email: 'karan.s@student.edu', phone: '7001112225', domain: 'Web Security' },
            { batch: 'Batch 2', role: 'Member', name: 'Sneha Gupta', rollNo: '2022IT06', year: 'III', section: 'B', department: 'Information Technology', email: 'sneha.g@student.edu', phone: '7001112226', domain: 'App Development' },
            { batch: 'Batch 3', role: 'Lead', name: 'Rahul Joshi', rollNo: '2022EC10', year: 'IV', section: 'A', department: 'Electronics', email: 'rahul.j@student.edu', phone: '7001112227', domain: 'Robotics' }
        ];

        const groups = await Group.insertMany(groupData);
        console.log(`Added ${groups.length} groups.`);

        // 4. Join them with Projects
        const projectData = [
            {
                projectType: 'Major',
                title: 'AI Driven Traffic Management',
                domain: 'Artificial Intelligence',
                abstract: 'A system to optimize traffic lights using real-time camera feeds.',
                status: 'Approved',
                academicYear: '2025-26',
                batchYear: '2022-26',
                guide: guides[0]._id, // Dr. Rajesh Kumar
                students: [groups[0]._id, groups[1]._id] // Arjun and Priya
            },
            {
                projectType: 'Mini',
                title: 'Secure File Storage on Cloud',
                domain: 'Cloud Computing',
                abstract: 'An encrypted cloud storage solution for student records.',
                status: 'Submitted',
                academicYear: '2025-26',
                batchYear: '2022-26',
                guide: guides[1]._id, // Dr. Sunita Sharma
                students: [groups[2]._id, groups[3]._id] // Karan and Sneha
            },
            {
                projectType: 'Major',
                title: 'Autonomous Drone for Delivery',
                domain: 'Embedded Systems',
                abstract: 'A drone capable of minor package deliveries using GPS.',
                status: 'Approved',
                academicYear: '2025-26',
                batchYear: '2022-26',
                guide: guides[2]._id, // Prof. Amit Varma
                students: [groups[4]._id] // Rahul
            }
        ];

        await Project.insertMany(projectData);
        console.log('Successfully joined groups with faculty via sample projects.');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seed();

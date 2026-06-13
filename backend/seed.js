require('dotenv').config();
const mongoose = require('mongoose');
const Group = require('./models/Group');
const Guide = require('./models/Guide');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Connected to DB');

    try {
        // Create Guides
        const guides = [
            { name: 'Dr. Alan Turing', phone: '+1234567890', email: 'alan@example.com', department: 'Computer Science', domain: 'AI/ML' },
            { name: 'Dr. Ada Lovelace', phone: '+0987654321', email: 'ada@example.com', department: 'Computer Science', domain: 'Web Development' },
            { name: 'Dr. Grace Hopper', phone: '+1122334455', email: 'grace@example.com', department: 'Information Technology', domain: 'Cybersecurity' }
        ];

        await Guide.insertMany(guides);
        console.log('Guides added');

        // Create Groups
        const groups = [
            { name: 'Alice Smith', rollNo: 'CS101', year: 'IV', section: 'A', department: 'Computer Science', email: 'alice@example.com', phone: '1112223333', domain: 'Machine Learning' },
            { name: 'Bob Johnson', rollNo: 'CS102', year: 'IV', section: 'B', department: 'Computer Science', email: 'bob@example.com', phone: '4445556666', domain: 'Cloud Computing' },
            { name: 'Charlie Brown', rollNo: 'CS103', year: 'III', section: 'A', department: 'Computer Science', email: 'charlie@example.com', phone: '7778889999', domain: 'Web Development' },
            { name: 'Diana Prince', rollNo: 'IT201', year: 'IV', section: 'A', department: 'Information Technology', email: 'diana@example.com', phone: '1231231234', domain: 'Data Science' },
            { name: 'Evan Rachel', rollNo: 'IT202', year: 'III', section: 'A', department: 'Information Technology', email: 'evan@example.com', phone: '3213214321', domain: 'Cybersecurity' }
        ];

        await Group.insertMany(groups);
        console.log('Groups added');
    } catch (err) {
        console.error('Error inserting data:', err);
    }

    process.exit();
}).catch(err => {
    console.error(err);
    process.exit(1);
});

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN || '[AuthToken]';
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        from: 'whatsapp:+14155238886',
        contentSid: 'HXb5b62575e6e4ff6129ad7c8efe1f983e',
        contentVariables: '{"1":"12/1","2":"3pm"}',
        to: 'whatsapp:+919885795006'
    })
    .then(message => console.log('Success! Message SID:', message.sid))
    .catch(error => console.error('Error:', error.message));

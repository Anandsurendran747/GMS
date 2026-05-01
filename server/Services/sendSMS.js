const accountSid = process.env.TWILO_ACCOUNT_SID;
const authToken = process.env.TWILO_AUTH_TOKEN;

const client = require('twilio')(accountSid, authToken);


const sendSMS = async (body, from, to) => {
    let msgOptions = {
        body: body,
        from: `whatsapp:${from}`,
        to: `whatsapp:${to}`// Replace with the recipient's phone number
    };
    try {
        const message = await client.messages.create(msgOptions);
        console.log('Message sent successfully:', message.sid);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

sendSMS("Hello from Gym Management System! Your membership is about to expire. Please renew it soon.", "+14155238886", "+919876543210");

module.exports = sendSMS;
const express  = require('express');
const app = express();
const adminRoutes = require('./routes/admin');
const gymRoutes = require('./routes/gym');
const dotenv = require('dotenv');
const connectDB = require('./DB/connect');
const cors = require('cors');
const {initWhatsApp} = require('./Services/whatsapp-service');
const startExpiryChecker = require('./Services/expiryChecker');
const cookieParser = require("cookie-parser");
// const sendSMS = require('./Services/sendSMS');


dotenv.config();

app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/admin', adminRoutes);
app.use('/gym', gymRoutes);


// sendSMS("Hello from Gym Management System! Your membership is about to expire. Please renew it soon.");
// startExpiryChecker();
// Initialize WhatsApp Bot
// initWhatsApp();

connectDB().then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
});




app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
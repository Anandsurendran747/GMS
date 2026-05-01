const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    gymId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    method: {
        type: String,
        enum: ['QR', 'Manual', 'Face Recognition'],
        default: 'QR'
    }
}, {
    timestamps: true
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
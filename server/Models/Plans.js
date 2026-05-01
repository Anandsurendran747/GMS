const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    gymId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    durationDays: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
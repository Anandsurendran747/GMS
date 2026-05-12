const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gymId: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    availability: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    }
}, { timestamps: true });
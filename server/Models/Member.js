const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    gymId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    advanceAmount: {
        type: Number,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    place: {
        type: String,
        required: true
    },
    planId: {
        type: String,
        required: true
    },
    paidDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active'
    },
    trainerId: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Member', MemberSchema);
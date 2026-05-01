const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: true
    },
    planId: {
        type: String,
        required: true
    },
    paymentDate: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        enum: ['cash', 'card', 'upi', 'online'],
        default: 'cash'
    },
    status: {
        type: String,
        enum: ['paid', 'pending', 'failed'],
        default: 'paid'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
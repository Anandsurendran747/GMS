const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    gymId: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date
    }
});

module.exports = mongoose.model('Expense', expenseSchema);
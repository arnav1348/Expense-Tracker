const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['income', 'expense']
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', TransactionSchema);
const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    learnerName: { type: String, required: true },
    courseName: { type: String, required: true },
    certificateId: { type: String, required: true, unique: true },
    issueDate: { type: Date, default: Date.now }
}, { timestamps: true });

// THIS LINE IS THE MOST IMPORTANT
module.exports = mongoose.model('Certificate', certificateSchema);
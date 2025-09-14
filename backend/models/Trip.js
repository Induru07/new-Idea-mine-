const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    destination: {
        type: String,
        required: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Beach', 'Mountain', 'City', 'Historical', 'Adventure', 'Nature', 'Cultural']
    },
    photos: [{
        type: String,
        required: true
    }]
}, {
    timestamps: true
});

// Add index for search functionality
tripSchema.index({ destination: 'text', description: 'text' });

const Trip = mongoose.model('Trip', tripSchema);
module.exports = Trip;

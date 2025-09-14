const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../middleware/auth');
const Trip = require('../models/Trip');
const router = express.Router();

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
});

// Create trip
router.post('/', auth, upload.array('photos', 10), async (req, res) => {
    try {
        const tripData = {
            ...req.body,
            userId: req.user._id,
            photos: req.files.map(file => file.path)
        };
        
        const trip = new Trip(tripData);
        await trip.save();
        res.status(201).json(trip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all trips for user
router.get('/', auth, async (req, res) => {
    try {
        const { category, startDate, endDate, search } = req.query;
        let query = { userId: req.user._id };

        if (category) {
            query.category = category;
        }

        if (startDate && endDate) {
            query.startDate = { $gte: new Date(startDate) };
            query.endDate = { $lte: new Date(endDate) };
        }

        if (search) {
            query.$text = { $search: search };
        }

        const trips = await Trip.find(query).sort({ startDate: -1 });
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single trip
router.get('/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        res.json(trip);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update trip
router.put('/:id', auth, upload.array('photos', 10), async (req, res) => {
    try {
        const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const updates = { ...req.body };
        if (req.files?.length > 0) {
            updates.photos = [...trip.photos, ...req.files.map(file => file.path)];
        }

        Object.assign(trip, updates);
        await trip.save();
        res.json(trip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete trip
router.delete('/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id });
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        // Delete associated photos
        trip.photos.forEach(photoPath => {
            try {
                fs.unlinkSync(photoPath);
            } catch (error) {
                console.error('Error deleting photo:', error);
            }
        });

        await trip.remove();
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

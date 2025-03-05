const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const uri = process.env.DATABASE_URL;
        if (!uri) throw new Error('DATABASE_URL is not defined in the environment variables');

        await mongoose.connect(uri); // No need for deprecated options
        console.log('MongoDB connected');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
};

module.exports = connectDB;

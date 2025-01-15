const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env file

const connectDB = async () => {
    try {
        // MongoDB URI from environment variables
        const dbURI = process.env.MONGODB_URI;

        // Connect to MongoDB
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);  // Exit the process if connection fails
    }
};

module.exports = connectDB;

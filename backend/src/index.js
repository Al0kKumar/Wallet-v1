const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/user');
const accountRoutes = require('./routes/transferMoney');
const  connectDB = require('./db');

require('dotenv').config();


connectDB();

app.use(express.json());
const allowedOrigins = ['https://wallet-op.vercel.app','http://localhost:5173'];


app.use(cors({
  origin: allowedOrigins,
  credentials: true // Only if you need to send cookies/auth headers
}));

// app.options('*', cors()); 

app.use('/api/users',userRoutes);

app.use('/api/accounts',accountRoutes)


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running at ${PORT} `);
});

module.exports = app;


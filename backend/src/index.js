const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/user');
const accountRoutes = require('./routes/transferMoney');
import connectDB from './db';

connectDB();

app.use(express.json());
const allowedOrigins = ['https://wallet-op.vercel.app','http://localhost:5173'];


app.use(cors({
    origin: function (origin, callback) {
       
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
}));

app.options('*', cors()); 

app.use('/api/users',userRoutes);

app.use('/api/accounts',accountRoutes)


const PORT = process.env.PORT || 10000;


app.listen(PORT, () => {
    console.log(`Server is running  `);
});

module.exports = app;


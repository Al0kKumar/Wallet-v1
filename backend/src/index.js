const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/user');
const accountRoutes = require('./routes/transferMoney');

app.use(express.json());
const allowedOrigins = ['https://wallet-op.vercel.app'];

app.use(cors({
    origin: allowedOrigins,
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


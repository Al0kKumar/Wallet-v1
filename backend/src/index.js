const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/user');
const accountRoutes = require('./routes/transferMoney');

app.use(express.json());
app.use(cors());

app.use('/api/users',userRoutes);

app.use('/api/accounts',accountRoutes)


const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
    console.log(`Server is running  `);
});

module.exports = app;


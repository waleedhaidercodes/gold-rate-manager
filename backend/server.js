const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./src/routes/authRoutes');
const authenticationMiddleware = require('./src/middlewares/authentication');

app.use('/api/auth', authRoutes);

const goldRateRoutes = require('./src/routes/goldRateRoutes');
app.use('/api/gold-rates', goldRateRoutes);

const investmentRoutes = require('./src/routes/investmentRoutes');
app.use('/api/investments', authenticationMiddleware, investmentRoutes);

const silverRateRoutes = require('./src/routes/silverRateRoutes');
app.use('/api/silver-rates', silverRateRoutes);

const silverInvestmentRoutes = require('./src/routes/silverInvestmentRoutes');
app.use('/api/silver-investments', authenticationMiddleware, silverInvestmentRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

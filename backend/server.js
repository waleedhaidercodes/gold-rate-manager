const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

const goldRateRoutes = require('./src/routes/goldRateRoutes');
app.use('/api/gold-rates', goldRateRoutes);

const investmentRoutes = require('./src/routes/investmentRoutes');
app.use('/api/investments', investmentRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));

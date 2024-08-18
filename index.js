const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { connectRabbitMQ } = require('./controllers/paymentController');

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Connect to RabbitMQ
connectRabbitMQ();

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Payment Service running on port ${PORT}`);
});

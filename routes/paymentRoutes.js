const express = require('express');
const { consumeOrderCreated } = require('../controllers/paymentController');

const router = express.Router();

consumeOrderCreated();

module.exports = router;

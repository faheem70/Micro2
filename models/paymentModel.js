const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: { type: String, required: true, unique: true },
  orderId: { type: String, required: true },
  status: { type: String, required: true, default: 'pending' },
  amount: { type: Number, required: true },
}, {
  timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;

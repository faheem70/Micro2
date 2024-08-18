const Payment = require('../models/paymentModel');
const redisClient = require('../config/redis');
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');

let channel, connection;

const connectRabbitMQ = async () => {
  try {
    connection = await amqp.connect(process.env.RABBITMQ_URI);
    channel = await connection.createChannel();
    await channel.assertQueue('order.created');
    await channel.assertQueue('payment.processed');
    console.log('Connected to RabbitMQ');
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
  }
};

const processPayment = async (order) => {
  const paymentId = uuidv4();
  const payment = new Payment({
    paymentId,
    orderId: order.orderId,
    amount: order.price,
    status: 'processed',
  });

  await payment.save();
  redisClient.setex(order.orderId, 3600, JSON.stringify(payment));

  await channel.sendToQueue('payment.processed', Buffer.from(JSON.stringify(payment)));
};

const consumeOrderCreated = async () => {
  channel.consume('order.created', async (msg) => {
    const order = JSON.parse(msg.content.toString());
    console.log('Processing payment for Order ID:', order.orderId);

    // Mock payment processing
    await processPayment(order);
    channel.ack(msg);
  });
};

module.exports = { connectRabbitMQ, consumeOrderCreated };

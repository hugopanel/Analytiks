
const kafka = require('kafka-node');
const { KafkaClient, Producer } = kafka;

const client = new KafkaClient({ kafkaHost: 'localhost:9092' });

const producer = new Producer(client);

producer.on('ready', () => {
  console.log('Kafka Producer is connected and ready.');
});

producer.on('error', (error) => {
  console.error('Kafka Producer error:', error);
});

module.exports = { producer };

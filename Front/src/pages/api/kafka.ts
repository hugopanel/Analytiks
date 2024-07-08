// src/pages/api/kafka.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { producer } from '../../lib/kafka';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { event, data } = req.body;

    const payloads = [
      {
        topic: 'your_topic_name', // Replace with your Kafka topic name
        messages: JSON.stringify({ event, data }),
      },
    ];

    producer.send(payloads, (err, data) => {
      if (err) {
        console.error('Kafka Producer error:', err);
        return res.status(500).json({ success: false, message: 'Failed to send event to Kafka' });
      }
      console.log('Event sent to Kafka:', data);
      return res.status(200).json({ success: true });
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;

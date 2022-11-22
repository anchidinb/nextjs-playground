import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongobd';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db('mydb');
    const collection = db.collection('count');
    const { method } = req;

    switch (method) {
      case 'POST':
        await collection.insertOne({ dateAdded: new Date() });
      case 'GET':
        const count = await collection.countDocuments();
        res.status(200).json({ count });
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
        break;
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

import { connectToDatabase } from '../../util/firebase';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const body = req.body;

    const db = await connectToDatabase();

    try {
      await db.ref().child('status').child(body.time).set(!body.status);
      res.status(200).json({success: true})
    } catch (err) {
      console.error(err);
      res.status(200).json({success: false})
    }
  } else {
  }
}

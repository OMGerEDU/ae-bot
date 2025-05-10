import type { NextApiRequest, NextApiResponse } from 'next';
import { generateLink } from '../../../lib/aliexpress';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'url required' });
  }

  try {
    const link = await generateLink(url);
    return res.status(200).json({ link });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'AliExpress API failed' });
  }
}

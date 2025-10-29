import type { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';
import { findClientById } from '@/lib/clients';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { id } = req.query;
  if (typeof id !== 'string') {
    return res.status(400).json({ success: false, message: 'Invalid client identifier' });
  }

  const client = await findClientById(id);
  if (!client) {
    return res.status(404).json({ success: false, message: 'Client not found' });
  }

  const qrCode = await QRCode.toDataURL(client.id, {
    errorCorrectionLevel: 'M',
    margin: 2,
    scale: 6
  });

  return res.status(200).json({ success: true, client, qrCode });
}

import type { NextApiRequest, NextApiResponse } from 'next';
import QRCode from 'qrcode';
import { generateClientId } from '@/utils/id';
import { addClient } from '@/lib/clients';
import { buildConfirmationEmail } from '@/utils/email';
import type { ClientInput, ClientRecord } from '@/types/client';

type ConfirmResponse =
  | {
      success: true;
      client: ClientRecord;
      qrCode: string;
      confirmationUrl: string;
      emailPreview: { subject: string; html: string; text: string };
    }
  | { success: false; message: string };

function isClientInput(payload: unknown): payload is ClientInput {
  if (typeof payload !== 'object' || payload === null) {
    return false;
  }

  const { firstName, lastName, email, gender, phone } = payload as Record<string, unknown>;

  const isString = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

  if (!isString(firstName) || !isString(lastName) || !isString(email)) {
    return false;
  }

  if (gender !== 'M' && gender !== 'F') {
    return false;
  }

  if (phone !== undefined && typeof phone !== 'string') {
    return false;
  }

  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ConfirmResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const payload = req.body;

  if (!isClientInput(payload)) {
    return res.status(400).json({ success: false, message: 'Invalid client payload' });
  }

  const clientId = generateClientId(payload.gender);
  const client: ClientRecord = {
    ...payload,
    id: clientId,
    createdAt: new Date().toISOString()
  };

  try {
    await addClient(client);
    const qrCode = await QRCode.toDataURL(clientId, {
      errorCorrectionLevel: 'M',
      margin: 2,
      scale: 6
    });

    const protocol = (req.headers['x-forwarded-proto'] as string | undefined) ?? 'http';
    const host = req.headers.host ?? 'localhost:3000';
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? process.env.APP_URL ?? `${protocol}://${host}`;
    const confirmationUrl = `${baseUrl.replace(/\/$/, '')}/registration/success?id=${clientId}`;

    const emailPreview = buildConfirmationEmail({
      firstName: client.firstName,
      confirmationUrl
    });

    return res.status(201).json({ success: true, client, qrCode, confirmationUrl, emailPreview });
  } catch (error) {
    console.error('Failed to confirm client', error);
    return res.status(500).json({ success: false, message: 'Failed to confirm client' });
  }
}

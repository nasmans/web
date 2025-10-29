import type { NextApiRequest, NextApiResponse } from 'next';

interface ResetPasswordResponse {
  success?: boolean;
  message?: string;
  error?: string;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<ResetPasswordResponse>
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  const { email } = request.body ?? {};

  if (typeof email !== 'string' || email.trim() === '') {
    return response.status(400).json({ error: 'البريد الإلكتروني مطلوب.' });
  }

  await new Promise((resolve) => setTimeout(resolve, 200));

  console.info(`Password reset requested for ${email}`);

  return response.status(200).json({ success: true, message: 'تم إرسال البريد بنجاح.' });
}

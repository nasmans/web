interface ConfirmationEmailOptions {
  firstName: string;
  confirmationUrl: string;
}

export function buildConfirmationEmail({ firstName, confirmationUrl }: ConfirmationEmailOptions): { subject: string; html: string; text: string } {
  const subject = 'تأكيد تسجيل العميل';
  const text = `مرحباً ${firstName},\n\nاضغط على الرابط التالي لإكمال عملية تأكيد تسجيلك: ${confirmationUrl}`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937;">
      <h2 style="color: #2563eb;">مرحباً ${firstName}،</h2>
      <p>شكراً لانضمامك إلى منصتنا. لإكمال عملية التسجيل يرجى الضغط على الزر التالي:</p>
      <p style="text-align: center; margin: 32px 0;">
        <a href="${confirmationUrl}" style="background:#2563eb;padding:14px 28px;border-radius:9999px;color:#fff;text-decoration:none;font-weight:600;">
          تأكيد التسجيل
        </a>
      </p>
      <p>في حال عدم تمكنك من الضغط على الزر، انسخ الرابط التالي والصقه في متصفحك:</p>
      <p style="direction:ltr; background:#f3f4f6; padding:12px 16px; border-radius:12px;">${confirmationUrl}</p>
      <p>تحياتنا،<br/>فريق خدمة العملاء</p>
    </div>
  `;

  return { subject, html, text };
}

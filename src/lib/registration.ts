import { RegistrationData } from "../components/RegistrationReviewDialog";

export interface RegistrationPayload extends RegistrationData {
  status: "pending";
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
}

/**
 * Prepares the payload and triggers the registration API to persist a pending request
 * and send the confirmation email.
 */
export async function submitRegistration(
  data: RegistrationData,
  signal?: AbortSignal
): Promise<RegistrationResponse> {
  const payload: RegistrationPayload = {
    ...data,
    status: "pending",
  };

  const response = await fetch("/api/registrations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      registration: payload,
      sendConfirmationEmail: true,
    }),
    signal,
  });

  if (!response.ok) {
    throw new Error("فشل إرسال طلب التسجيل. يرجى المحاولة لاحقًا.");
  }

  return (await response.json()) as RegistrationResponse;
}

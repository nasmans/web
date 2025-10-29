import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBookingFlow } from '../hooks/useBookingFlow';

export function BookingModal() {
  const { user } = useAuth();
  const { isBookingModalOpen, closeBookingModal } = useBookingFlow();
  const [details, setDetails] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);

  if (!isBookingModalOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    setConfirmation('تم استلام حجزك وسيتم التواصل معك قريباً.');
    setSubmitting(false);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h2>نموذج الحجز</h2>
        <p>مرحباً {user?.name ?? 'بالعميل'}! أخبرنا بالمزيد عن طلبك.</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="booking-details">تفاصيل الخدمة</label>
            <textarea
              id="booking-details"
              style={{ minHeight: '120px', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d0d0d0' }}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              required
            />
          </div>
          {confirmation && <div className="alert" role="status">{confirmation}</div>}
          <div className="modal-actions">
            <button className="secondary-button" type="button" onClick={closeBookingModal}>
              إغلاق
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

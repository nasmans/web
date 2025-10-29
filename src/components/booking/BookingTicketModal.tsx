import React from 'react';
import styles from './BookingTicketModal.module.css';
import { ClientProfile } from '../../context/ClientContext';

export interface ParticipantDetail {
  name: string;
  age?: string;
  note?: string;
}

export interface BookingTicketDetails {
  service: string;
  date: string;
  period: string;
  visitType: 'center' | 'home';
  homeVisitTime?: string;
  participants: ParticipantDetail[];
  visitAddress?: string;
}

export interface BookingTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenDashboard: () => void;
  booking: BookingTicketDetails;
  client: ClientProfile;
}

const periodLabels: Record<string, string> = {
  morning: 'الفترة الصباحية',
  afternoon: 'الفترة المسائية',
  evening: 'الفترة الليلية',
};

export const BookingTicketModal: React.FC<BookingTicketModalProps> = ({
  isOpen,
  onClose,
  onOpenDashboard,
  booking,
  client,
}) => {
  if (!isOpen) {
    return null;
  }

  const readablePeriod = periodLabels[booking.period] ?? booking.period;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <article className={styles.ticket}>
        <header className={styles.header}>
          <h2 className={styles.title}>تأكيد الحجز</h2>
          <p className={styles.subtitle}>
            تم إنشاء تذكرتك بنجاح. احتفظ بالبيانات التالية للرجوع إليها لاحقًا.
          </p>
        </header>

        <section className={styles.body}>
          <div>
            <h3 className={styles.sectionTitle}>بيانات العميل</h3>
            <p className={styles.detail}>الاسم: {client.name}</p>
            <p className={styles.detail}>رقم الجوال: {client.phone}</p>
            {client.email && <p className={styles.detail}>البريد الإلكتروني: {client.email}</p>}
            {booking.visitType === 'home' && booking.visitAddress && (
              <p className={styles.detail}>العنوان: {booking.visitAddress}</p>
            )}
          </div>

          <div>
            <h3 className={styles.sectionTitle}>معلومات الخدمة</h3>
            <p className={styles.detail}>الخدمة: {booking.service}</p>
            <p className={styles.detail}>التاريخ: {booking.date}</p>
            <p className={styles.detail}>الفترة: {readablePeriod}</p>
            {booking.visitType === 'home' && booking.homeVisitTime && (
              <p className={styles.detail}>موعد الزيارة المنزلية: {booking.homeVisitTime}</p>
            )}
          </div>

          {booking.participants.length > 0 && (
            <div>
              <h3 className={styles.sectionTitle}>تفاصيل الأفراد</h3>
              {booking.participants.map((participant, index) => (
                <div key={index} className={styles.participantCard}>
                  <strong>الفرد {index + 1}</strong>
                  <p className={styles.detail}>الاسم: {participant.name || '—'}</p>
                  {participant.age && <p className={styles.detail}>العمر: {participant.age}</p>}
                  {participant.note && <p className={styles.detail}>ملاحظات: {participant.note}</p>}
                </div>
              ))}
            </div>
          )}
        </section>

        <footer className={styles.footer}>
          <button type="button" className={styles.closeButton} onClick={onClose}>
            إغلاق
          </button>
          <button type="button" className={styles.actionButton} onClick={onOpenDashboard}>
            عرض التذكرة في الداشبورد
          </button>
        </footer>
      </article>
    </div>
  );
};

export default BookingTicketModal;

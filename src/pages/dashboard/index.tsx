import { AnimatePresence, motion } from 'framer-motion';
import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';

type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

type Booking = {
  id: string;
  guestName: string;
  reference: string;
  date: string;
  status: BookingStatus;
};

type ContactChannel = 'phone' | 'email';

type ContactFieldState = {
  value: string;
  otp: string;
  verifying: boolean;
  verified: boolean;
  sending: boolean;
  verifyingOtp: boolean;
  message: string | null;
};

type TabKey = 'welcome' | 'bookings' | 'blessed-days' | 'settings';

const tabOrder: Array<{ key: TabKey; label: string }> = [
  { key: 'welcome', label: 'مرحباً' },
  { key: 'bookings', label: 'حجوزاتي' },
  { key: 'blessed-days', label: 'الأيام المباركات' },
  { key: 'settings', label: 'الإعدادات' },
];

const DashboardPage: NextPage = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('welcome');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState<boolean>(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [actionState, setActionState] = useState<{
    bookingId: string;
    action: 'update' | 'cancel';
  } | null>(null);
  const [editingBookingId, setEditingBookingId] = useState<string | null>(null);
  const [editingDraft, setEditingDraft] = useState<Partial<Booking>>({});

  const [phoneState, setPhoneState] = useState<ContactFieldState>({
    value: '',
    otp: '',
    verifying: false,
    verified: false,
    sending: false,
    verifyingOtp: false,
    message: null,
  });

  const [emailState, setEmailState] = useState<ContactFieldState>({
    value: '',
    otp: '',
    verifying: false,
    verified: false,
    sending: false,
    verifyingOtp: false,
    message: null,
  });

  useEffect(() => {
    const controller = new AbortController();

    const bootstrap = async () => {
      setBookingsLoading(true);
      setBookingsError(null);
      try {
        const response = await fetch('/api/bookings', {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error('تعذّر تحميل الحجوزات حالياً.');
        }
        const payload: { bookings: Booking[] } = await response.json();
        setBookings(payload.bookings);
      } catch (error) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
        setBookingsError((error as Error).message);
        setBookings([
          {
            id: 'bk-001',
            guestName: 'أحمد علي',
            reference: 'REF-01',
            date: new Date().toISOString().slice(0, 10),
            status: 'confirmed',
          },
          {
            id: 'bk-002',
            guestName: 'سارة يوسف',
            reference: 'REF-02',
            date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
            status: 'pending',
          },
        ]);
      } finally {
        setBookingsLoading(false);
      }
    };

    bootstrap();

    return () => controller.abort();
  }, []);

  const sendAdminEvent = async (bookingId: string, action: 'update' | 'cancel') => {
    try {
      await fetch('/api/admin/booking-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          action,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Failed to send admin event', error);
    }
  };

  const applyBookingUpdate = (updatedBooking: Booking) => {
    setBookings((current) =>
      current.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking)),
    );
  };

  const handleUpdateBooking = async (bookingId: string, payload: Partial<Booking>) => {
    setActionState({ bookingId, action: 'update' });
    setBookingsError(null);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('تعذّر تحديث الحجز.');
      }

      const data = (await response.json()) as { booking?: Booking };
      if (data.booking) {
        applyBookingUpdate(data.booking);
      } else {
        setBookings((current) =>
          current.map((booking) =>
            booking.id === bookingId ? { ...booking, ...payload } : booking,
          ),
        );
      }
      await sendAdminEvent(bookingId, 'update');
    } catch (error) {
      setBookingsError((error as Error).message);
    } finally {
      setActionState(null);
      setEditingBookingId(null);
      setEditingDraft({});
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (typeof window !== 'undefined' && !window.confirm('هل تريد إلغاء هذا الحجز؟')) {
      return;
    }

    setActionState({ bookingId, action: 'cancel' });
    setBookingsError(null);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('تعذّر إلغاء الحجز.');
      }

      setBookings((current) => current.filter((booking) => booking.id !== bookingId));
      await sendAdminEvent(bookingId, 'cancel');
    } catch (error) {
      setBookingsError((error as Error).message);
    } finally {
      setActionState(null);
    }
  };

  const initiateContactVerification = async (
    type: ContactChannel,
    setter: React.Dispatch<React.SetStateAction<ContactFieldState>>,
    state: ContactFieldState,
  ) => {
    if (!state.value) {
      setter((current) => ({ ...current, message: 'الرجاء إدخال قيمة صالحة.' }));
      return;
    }

    setter((current) => ({ ...current, sending: true, message: null }));
    try {
      const response = await fetch('/api/settings/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel: type, value: state.value }),
      });

      if (!response.ok) {
        throw new Error('تعذّر إرسال رمز التحقق.');
      }

      setter((current) => ({
        ...current,
        sending: false,
        verifying: true,
        message: 'تم إرسال رمز التحقق. الرجاء إدخاله أدناه.',
      }));
    } catch (error) {
      setter((current) => ({
        ...current,
        sending: false,
        message: (error as Error).message,
      }));
    }
  };

  const verifyContactChannel = async (
    type: ContactChannel,
    setter: React.Dispatch<React.SetStateAction<ContactFieldState>>,
    state: ContactFieldState,
  ) => {
    if (!state.otp) {
      setter((current) => ({ ...current, message: 'الرجاء إدخال رمز التحقق.' }));
      return;
    }

    setter((current) => ({ ...current, verifyingOtp: true, message: null }));
    try {
      const response = await fetch('/api/settings/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ channel: type, value: state.value, otp: state.otp }),
      });

      if (!response.ok) {
        throw new Error('رمز التحقق غير صحيح.');
      }

      setter((current) => ({
        ...current,
        verifyingOtp: false,
        verifying: false,
        verified: true,
        message: 'تم التحقق بنجاح!',
      }));
    } catch (error) {
      setter((current) => ({
        ...current,
        verifyingOtp: false,
        message: (error as Error).message,
      }));
    }
  };

  const settingsSection = (
    <div className="card">
      <h2>ضبط بيانات التواصل</h2>
      <p className="helper">قم بتحديث بيانات الاتصال لتلقي التنبيهات والإشعارات الحساسة.</p>

      <div className="form-group">
        <label htmlFor="phone-input">رقم الجوال</label>
        <div className="stack">
          <input
            id="phone-input"
            type="tel"
            placeholder="05xxxxxxxx"
            value={phoneState.value}
            onChange={(event) =>
              setPhoneState((current) => ({ ...current, value: event.target.value, message: null }))
            }
          />
          <div className="actions">
            <button
              type="button"
              className="primary"
              disabled={phoneState.sending}
              onClick={() => initiateContactVerification('phone', setPhoneState, phoneState)}
            >
              {phoneState.sending ? '...جاري الإرسال' : 'إرسال رمز التحقق'}
            </button>
          </div>
        </div>
        {phoneState.verifying && (
          <div className="stack">
            <input
              type="text"
              placeholder="رمز التحقق"
              value={phoneState.otp}
              onChange={(event) =>
                setPhoneState((current) => ({ ...current, otp: event.target.value, message: null }))
              }
            />
            <button
              type="button"
              className="secondary"
              disabled={phoneState.verifyingOtp}
              onClick={() => verifyContactChannel('phone', setPhoneState, phoneState)}
            >
              {phoneState.verifyingOtp ? '...جاري التحقق' : 'تأكيد'}
            </button>
          </div>
        )}
        {phoneState.message && <p className="feedback">{phoneState.message}</p>}
        {phoneState.verified && <span className="badge success">مؤكد</span>}
      </div>

      <div className="form-group">
        <label htmlFor="email-input">البريد الإلكتروني</label>
        <div className="stack">
          <input
            id="email-input"
            type="email"
            placeholder="you@example.com"
            value={emailState.value}
            onChange={(event) =>
              setEmailState((current) => ({ ...current, value: event.target.value, message: null }))
            }
          />
          <div className="actions">
            <button
              type="button"
              className="primary"
              disabled={emailState.sending}
              onClick={() => initiateContactVerification('email', setEmailState, emailState)}
            >
              {emailState.sending ? '...جاري الإرسال' : 'إرسال رسالة التحقق'}
            </button>
          </div>
        </div>
        {emailState.verifying && (
          <div className="stack">
            <input
              type="text"
              placeholder="رمز التحقق"
              value={emailState.otp}
              onChange={(event) =>
                setEmailState((current) => ({ ...current, otp: event.target.value, message: null }))
              }
            />
            <button
              type="button"
              className="secondary"
              disabled={emailState.verifyingOtp}
              onClick={() => verifyContactChannel('email', setEmailState, emailState)}
            >
              {emailState.verifyingOtp ? '...جاري التحقق' : 'تأكيد'}
            </button>
          </div>
        )}
        {emailState.message && <p className="feedback">{emailState.message}</p>}
        {emailState.verified && <span className="badge success">مؤكد</span>}
      </div>
    </div>
  );

  const bookingsSection = (
    <div className="card">
      <div className="card-header">
        <div>
          <h2>حجوزاتي</h2>
          <p className="helper">إدارة حجوزاتك ومتابعة حالة التذاكر.</p>
        </div>
        <button className="secondary" type="button" onClick={() => setActiveTab('blessed-days')}>
          استكشف الأيام المباركات
        </button>
      </div>

      {bookingsLoading && <p>...جاري التحميل</p>}
      {bookingsError && <p className="error">{bookingsError}</p>}

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>الضيف</th>
              <th>المرجع</th>
              <th>التاريخ</th>
              <th>الحالة</th>
              <th>التحكم</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => {
              const isEditing = editingBookingId === booking.id;
              return (
                <tr key={booking.id}>
                  <td>{booking.guestName}</td>
                  <td>{booking.reference}</td>
                  <td>
                    {isEditing ? (
                      <input
                        type="date"
                        value={editingDraft.date ?? booking.date}
                        onChange={(event) =>
                          setEditingDraft((current) => ({ ...current, date: event.target.value }))
                        }
                      />
                    ) : (
                      booking.date
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <select
                        value={editingDraft.status ?? booking.status}
                        onChange={(event) =>
                          setEditingDraft((current) => ({
                            ...current,
                            status: event.target.value as BookingStatus,
                          }))
                        }
                      >
                        <option value="confirmed">مؤكد</option>
                        <option value="pending">قيد الانتظار</option>
                        <option value="cancelled">ملغى</option>
                      </select>
                    ) : (
                      <span className={`badge status-${booking.status}`}>{translateStatus(booking.status)}</span>
                    )}
                  </td>
                  <td>
                    <div className="row-actions">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            className="primary"
                            disabled={actionState?.bookingId === booking.id}
                            onClick={() =>
                              handleUpdateBooking(booking.id, {
                                status: (editingDraft.status ?? booking.status) as BookingStatus,
                                date: editingDraft.date ?? booking.date,
                              })
                            }
                          >
                            حفظ
                          </button>
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => {
                              setEditingBookingId(null);
                              setEditingDraft({});
                            }}
                          >
                            تراجع
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => {
                              setEditingBookingId(booking.id);
                              setEditingDraft({ status: booking.status, date: booking.date });
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="secondary"
                            onClick={() => handleShowTicket(booking.id)}
                          >
                            Show Ticket
                          </button>
                          <button
                            type="button"
                            className="danger"
                            disabled={actionState?.bookingId === booking.id}
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const welcomeSection = (
    <div className="card">
      <h1>أهلاً بك في لوحة التحكم</h1>
      <p className="helper">
        استخدم شريط التنقل في الأعلى للانتقال بين الحجوزات، الأيام المباركات، والإعدادات.
      </p>
      <ul className="list">
        <li>تابع حالة الحجوزات الخاصة بك وتأكد من اكتمال بيانات التذاكر.</li>
        <li>استكشف الأيام المباركات القادمة ورتب جدولك.</li>
        <li>قم بتحديث بيانات التواصل لتصلك الإشعارات فوراً.</li>
      </ul>
    </div>
  );

  const blessedDaysSection = (
    <div className="card">
      <h2>الأيام المباركات</h2>
      <p className="helper">تذكير بالأيام المفضلة للزيارة والعبادة. سيتم تخصيص المحتوى قريباً.</p>
      <ul className="list">
        <li>ليلة الجمعة</li>
        <li>الأيام العشر من ذي الحجة</li>
        <li>العشر الأواخر من رمضان</li>
      </ul>
    </div>
  );

  const renderSection = () => {
    switch (activeTab) {
      case 'bookings':
        return bookingsSection;
      case 'blessed-days':
        return blessedDaysSection;
      case 'settings':
        return settingsSection;
      case 'welcome':
      default:
        return welcomeSection;
    }
  };

  return (
    <>
      <Head>
        <title>لوحة التحكم</title>
      </Head>
      <div className="dashboard">
        <nav className="tab-bar">
          {tabOrder.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={tab.key === activeTab ? 'active' : ''}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <AnimatePresence mode="wait">
          <motion.section
            key={activeTab}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="section"
          >
            {renderSection()}
          </motion.section>
        </AnimatePresence>
      </div>

      <style jsx>{`
        :global(body) {
          margin: 0;
          font-family: 'Tajawal', 'Segoe UI', sans-serif;
          background-color: #f7f7f7;
          direction: rtl;
        }

        .dashboard {
          min-height: 100vh;
          padding: 32px 24px 48px;
        }

        .tab-bar {
          display: flex;
          gap: 8px;
          justify-content: flex-start;
          flex-wrap: wrap;
          background-color: #fff;
          padding: 12px;
          border-radius: 12px;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
          margin-bottom: 24px;
        }

        .tab-bar button {
          border: none;
          background: transparent;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 15px;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease;
          color: #475569;
        }

        .tab-bar button:hover {
          background-color: #f1f5f9;
        }

        .tab-bar button.active {
          background: linear-gradient(135deg, #1d4ed8, #2563eb);
          color: #fff;
          box-shadow: 0 4px 10px rgba(37, 99, 235, 0.35);
        }

        .section {
          position: relative;
        }

        .card {
          background-color: #fff;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 20px 45px -24px rgba(15, 23, 42, 0.35);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        h1,
        h2 {
          margin: 0 0 12px;
          color: #0f172a;
        }

        .helper {
          margin: 0 0 12px;
          color: #64748b;
        }

        .list {
          margin: 0;
          padding-inline-start: 20px;
          color: #475569;
        }

        .table-wrapper {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th,
        td {
          text-align: right;
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          color: #0f172a;
        }

        th {
          font-weight: 700;
          color: #1e293b;
        }

        .row-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        button {
          font-family: inherit;
        }

        button.primary {
          background-color: #2563eb;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
        }

        button.secondary {
          background-color: transparent;
          color: #2563eb;
          border: 1px solid #cbd5f5;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
        }

        button.danger {
          background-color: #ef4444;
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 8px 16px;
          cursor: pointer;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 12px;
        }

        .badge.success {
          background-color: #d1fae5;
          color: #047857;
        }

        .badge.status-confirmed {
          background-color: #dbeafe;
          color: #1d4ed8;
        }

        .badge.status-pending {
          background-color: #fef3c7;
          color: #b45309;
        }

        .badge.status-cancelled {
          background-color: #fee2e2;
          color: #dc2626;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 24px;
        }

        .form-group label {
          font-weight: 600;
          color: #0f172a;
        }

        .stack {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .stack input,
        .stack select {
          flex: 1;
          min-width: 220px;
          padding: 10px 12px;
          border: 1px solid #cbd5f5;
          border-radius: 8px;
          font-size: 14px;
        }

        .actions {
          display: flex;
          gap: 8px;
        }

        .feedback {
          margin: 0;
          color: #2563eb;
          font-size: 13px;
        }

        .error {
          color: #dc2626;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .dashboard {
            padding: 24px 12px 32px;
          }

          .card {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
};

const translateStatus = (status: BookingStatus) => {
  switch (status) {
    case 'confirmed':
      return 'مؤكد';
    case 'pending':
      return 'قيد الانتظار';
    case 'cancelled':
      return 'ملغى';
    default:
      return status;
  }
};

const handleShowTicket = (bookingId: string) => {
  if (typeof window !== 'undefined') {
    window.open(`/api/bookings/${bookingId}/ticket`, '_blank', 'noopener,noreferrer');
  }
};

export default DashboardPage;

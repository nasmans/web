import React, { FormEvent, useMemo, useState } from 'react';
import { useClientProfile } from '../../context/ClientContext';
import styles from './BookingForm.module.css';
import BookingTicketModal, {
  BookingTicketDetails,
  ParticipantDetail,
} from './BookingTicketModal';

export interface BookingFormProps {
  onSubmitBooking?: (details: BookingTicketDetails) => void;
  onShowTicketInDashboard?: (details: BookingTicketDetails) => void;
}

interface ParticipantsState extends ParticipantDetail {
  id: number;
}

interface BookingFormState {
  service: string;
  date: string;
  period: 'morning' | 'afternoon' | 'evening';
  visitType: 'center' | 'home';
  homeVisitTime: string;
  participantsCount: number;
  participants: ParticipantsState[];
  visitAddress: string;
}

const serviceOptions: string[] = [
  'جلسة استشارية',
  'خدمة علاجية',
  'متابعة شهرية',
  'زيارة منزلية',
];

const periodOptions: { value: BookingFormState['period']; label: string }[] = [
  { value: 'morning', label: 'الفترة الصباحية' },
  { value: 'afternoon', label: 'الفترة المسائية' },
  { value: 'evening', label: 'الفترة الليلية' },
];

const buildParticipants = (count: number): ParticipantsState[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    name: '',
    age: '',
    note: '',
  }));
};

const BookingForm: React.FC<BookingFormProps> = ({
  onSubmitBooking,
  onShowTicketInDashboard,
}) => {
  const client = useClientProfile();

  const [formState, setFormState] = useState<BookingFormState>({
    service: serviceOptions[0],
    date: '',
    period: 'morning',
    visitType: 'center',
    homeVisitTime: '',
    participantsCount: 1,
    participants: buildParticipants(1),
    visitAddress: '',
  });

  const [isTicketOpen, setIsTicketOpen] = useState(false);

  const visibleParticipants = useMemo(() => {
    if (formState.participants.length === formState.participantsCount) {
      return formState.participants;
    }

    const next = buildParticipants(formState.participantsCount);
    return next.map((participant, index) => ({
      ...participant,
      ...formState.participants[index],
    }));
  }, [formState.participants, formState.participantsCount]);

  const updateField = <K extends keyof BookingFormState>(key: K, value: BookingFormState[K]) => {
    setFormState((prev) => ({
      ...prev,
      [key]: value,
      ...(key === 'participantsCount'
        ? {
            participants: buildParticipants(value as number).map((participant, index) => ({
              ...participant,
              ...prev.participants[index],
            })),
          }
        : null),
    }));
  };

  const updateParticipant = (index: number, key: keyof ParticipantDetail, value: string) => {
    setFormState((prev) => {
      const nextParticipants = [...visibleParticipants];
      nextParticipants[index] = {
        ...nextParticipants[index],
        [key]: value,
      } as ParticipantsState;

      return {
        ...prev,
        participants: nextParticipants,
      };
    });
  };

  const buildTicketDetails = (): BookingTicketDetails => ({
    service: formState.service,
    date: formState.date,
    period: formState.period,
    visitType: formState.visitType,
    homeVisitTime: formState.visitType === 'home' ? formState.homeVisitTime : undefined,
    visitAddress: formState.visitType === 'home' ? formState.visitAddress : undefined,
    participants:
      formState.visitType === 'home'
        ? visibleParticipants.map(({ name, age, note }) => ({
            name,
            age,
            note,
          }))
        : [],
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const ticket = buildTicketDetails();
    onSubmitBooking?.(ticket);
    setIsTicketOpen(true);
  };

  const handleOpenDashboard = () => {
    const ticket = buildTicketDetails();
    onShowTicketInDashboard?.(ticket);
    setIsTicketOpen(false);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <fieldset className={styles.fieldset} disabled>
          <legend>بيانات العميل</legend>
          <label className={styles.label}>
            الاسم الكامل
            <input type="text" value={client.name} readOnly />
          </label>
          <label className={styles.label}>
            البريد الإلكتروني
            <input type="email" value={client.email} readOnly />
          </label>
          <label className={styles.label}>
            رقم الجوال
            <input type="tel" value={client.phone} readOnly />
          </label>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>تفاصيل الحجز</legend>

          <label className={styles.label}>
            نوع الخدمة
            <select
              value={formState.service}
              onChange={(event) => updateField('service', event.target.value)}
            >
              {serviceOptions.map((option) => (
                <option value={option} key={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.label}>
            التاريخ
            <input
              type="date"
              value={formState.date}
              onChange={(event) => updateField('date', event.target.value)}
              required
            />
          </label>

          <label className={styles.label}>
            الفترة الزمنية
            <select
              value={formState.period}
              onChange={(event) => updateField('period', event.target.value as BookingFormState['period'])}
            >
              {periodOptions.map((period) => (
                <option value={period.value} key={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>طريقة الحضور</legend>
          <div className={styles.radioGroup}>
            <label>
              <input
                type="radio"
                name="visitType"
                value="center"
                checked={formState.visitType === 'center'}
                onChange={() => updateField('visitType', 'center')}
              />
              زيارة المركز
            </label>
            <label>
              <input
                type="radio"
                name="visitType"
                value="home"
                checked={formState.visitType === 'home'}
                onChange={() => updateField('visitType', 'home')}
              />
              زيارة منزلية
            </label>
          </div>

          {formState.visitType === 'home' && (
            <div className={styles.homeOptions}>
              <label className={styles.label}>
                توقيت الزيارة
                <input
                  type="time"
                  value={formState.homeVisitTime}
                  onChange={(event) => updateField('homeVisitTime', event.target.value)}
                  required
                />
              </label>

              <label className={styles.label}>
                عنوان الزيارة
                <input
                  type="text"
                  value={formState.visitAddress}
                  onChange={(event) => updateField('visitAddress', event.target.value)}
                  placeholder="اسم الحي، الشارع، رقم المبنى"
                  required
                />
              </label>

              <label className={styles.label}>
                عدد الأفراد
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={formState.participantsCount}
                  onChange={(event) => updateField('participantsCount', Number(event.target.value))}
                />
              </label>

              <div className={styles.participants}>
                {visibleParticipants.map((participant, index) => (
                  <div key={participant.id} className={styles.participantCard}>
                    <h4>الفرد {index + 1}</h4>
                    <label className={styles.label}>
                      الاسم
                      <input
                        type="text"
                        value={participant.name}
                        onChange={(event) => updateParticipant(index, 'name', event.target.value)}
                        placeholder="الاسم الكامل"
                        required
                      />
                    </label>
                    <label className={styles.label}>
                      العمر
                      <input
                        type="number"
                        min={0}
                        value={participant.age ?? ''}
                        onChange={(event) => updateParticipant(index, 'age', event.target.value)}
                        placeholder="مثال: 34"
                      />
                    </label>
                    <label className={styles.label}>
                      ملاحظات إضافية
                      <textarea
                        value={participant.note ?? ''}
                        onChange={(event) => updateParticipant(index, 'note', event.target.value)}
                        rows={2}
                        placeholder="احتياجات خاصة، تفاصيل إضافية"
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
        </fieldset>

        <div className={styles.actions}>
          <button type="submit" className={styles.submitButton}>
            إصدار التذكرة
          </button>
        </div>
      </form>

      <BookingTicketModal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
        onOpenDashboard={handleOpenDashboard}
        booking={buildTicketDetails()}
        client={client}
      />
    </>
  );
};

export default BookingForm;

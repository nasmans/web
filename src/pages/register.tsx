import React, { FormEvent, useMemo, useState } from "react";
import Head from "next/head";
import RegistrationReviewDialog, {
  RegistrationData,
} from "../components/RegistrationReviewDialog";
import { submitRegistration } from "../lib/registration";

const wilayas: string[] = [
  "أدرار",
  "الشلف",
  "الأغواط",
  "أم البواقي",
  "باتنة",
  "بجاية",
  "بسكرة",
  "بشار",
  "البليدة",
  "البويرة",
  "تمنراست",
  "تبسة",
  "تلمسان",
  "تيارت",
  "تيزي وزو",
  "الجزائر العاصمة",
  "الجلفة",
  "جيجل",
  "سطيف",
  "سعيدة",
  "سكيكدة",
  "سيدي بلعباس",
  "عنابة",
  "قالمة",
  "قسنطينة",
  "المدية",
  "مستغانم",
  "المسيلة",
  "معسكر",
  "ورقلة",
  "وهران",
  "البيض",
  "إليزي",
  "برج بوعريريج",
  "بومرداس",
  "الطارف",
  "تندوف",
  "تيسمسيلت",
  "الوادي",
  "خنشلة",
  "سوق أهراس",
  "تيبازة",
  "ميلة",
  "عين الدفلى",
  "النعامة",
  "عين تموشنت",
  "غرداية",
  "غليزان",
  "تيميمون",
  "برج باجي مختار",
  "أولاد جلال",
  "بني عباس",
  "عين صالح",
  "عين قزام",
  "تقرت",
  "جانت",
  "المغير",
  "المنيعة",
];

const defaultFormState: RegistrationData = {
  fullName: "",
  email: "",
  phone: "",
  wilaya: "",
  city: "",
  address: "",
  notes: "",
  guests: 1,
};

const RegisterPage: React.FC = () => {
  const initialData = useMemo(() => ({ ...defaultFormState }), []);
  const [formData, setFormData] = useState<RegistrationData>(initialData);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [agreementChecked, setAgreementChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "guests" ? Number(value) || 0 : value,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsReviewOpen(true);
  };

  const handleDialogConfirm = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      await submitRegistration(formData);
      setShowThankYou(true);
      setIsReviewOpen(false);
      setAgreementChecked(false);
    } catch (submissionError) {
      const message =
        submissionError instanceof Error
          ? submissionError.message
          : "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData(initialData);
    setError(null);
  };

  const handleConfirmBooking = () => {
    // Placeholder for navigation or additional confirmation behaviour.
    alert("تم تأكيد الحجز! سيتم التواصل معك عبر البريد الإلكتروني قريبًا.");
  };

  return (
    <>
      <Head>
        <title>التسجيل لحجز الفعالية</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 py-10">
        <div className="container mx-auto px-4">
          <div className={`flip-card ${showThankYou ? "is-flipped" : ""}`}>
            <div className="flip-card-inner">
              <section className="flip-card-front">
                <div className="mx-auto max-w-3xl rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur">
                  <h1 className="text-3xl font-bold text-gray-900">سجّل الآن لحجز مكانك</h1>
                  <p className="mt-2 text-gray-600">
                    يرجى تعبئة جميع الحقول بدقة حتى نتمكن من تأكيد حجزك وإرسال بريد التأكيد.
                  </p>

                  {error ? (
                    <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
                  ) : null}

                  <form className="mt-8 space-y-6" onSubmit={handleSubmit} onReset={handleReset}>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="fullName" className="font-semibold text-gray-800">
                          الاسم الكامل
                        </label>
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={handleChange}
                          className="rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          placeholder="مثال: محمد بن أحمد"
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <label htmlFor="email" className="font-semibold text-gray-800">
                          البريد الإلكتروني
                        </label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          placeholder="example@email.com"
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <label htmlFor="phone" className="font-semibold text-gray-800">
                          رقم الهاتف
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={handleChange}
                          className="rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          placeholder="0X-XX-XX-XX-XX"
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <label htmlFor="wilaya" className="font-semibold text-gray-800">
                          الولاية
                        </label>
                        <select
                          id="wilaya"
                          name="wilaya"
                          required
                          value={formData.wilaya}
                          onChange={handleChange}
                          className="rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        >
                          <option value="" disabled>
                            اختر الولاية
                          </option>
                          {wilayas.map((wilaya) => (
                            <option key={wilaya} value={wilaya}>
                              {wilaya}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col space-y-2">
                        <label htmlFor="city" className="font-semibold text-gray-800">
                          البلدية / المدينة
                        </label>
                        <input
                          id="city"
                          name="city"
                          type="text"
                          required
                          value={formData.city}
                          onChange={handleChange}
                          className="rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          placeholder="مثال: باب الزوار"
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <label htmlFor="address" className="font-semibold text-gray-800">
                          العنوان التفصيلي
                        </label>
                        <input
                          id="address"
                          name="address"
                          type="text"
                          required
                          value={formData.address}
                          onChange={handleChange}
                          className="rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          placeholder="رقم المنزل، الشارع، الرمز البريدي"
                        />
                      </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="flex flex-col space-y-2">
                        <label htmlFor="guests" className="font-semibold text-gray-800">
                          عدد الضيوف المتوقع
                        </label>
                        <input
                          id="guests"
                          name="guests"
                          type="number"
                          min={1}
                          required
                          value={formData.guests}
                          onChange={handleChange}
                          className="rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                        />
                      </div>

                      <div className="flex flex-col space-y-2">
                        <label htmlFor="notes" className="font-semibold text-gray-800">
                          ملاحظات إضافية (اختياري)
                        </label>
                        <textarea
                          id="notes"
                          name="notes"
                          rows={3}
                          value={formData.notes}
                          onChange={handleChange}
                          className="rounded-xl border border-gray-200 px-4 py-3 text-gray-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          placeholder="أي معلومات تساعد فريقنا على تجهيز طلبك"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between sm:items-center">
                      <button
                        type="reset"
                        className="w-full rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 sm:w-auto"
                      >
                        إعادة ضبط النموذج
                      </button>
                      <button
                        type="submit"
                        className="w-full rounded-full bg-indigo-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400 sm:w-auto"
                      >
                        مراجعة التفاصيل
                      </button>
                    </div>
                  </form>
                </div>
              </section>

              <section className="flip-card-back">
                <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center rounded-3xl bg-white/80 p-10 text-center shadow-xl backdrop-blur">
                  <h2 className="text-4xl font-extrabold text-emerald-600">شكراً لك!</h2>
                  <p className="mt-4 max-w-xl text-lg text-gray-600">
                    تم استلام طلبك بنجاح وسيتواصل معك فريقنا بعد مراجعة التفاصيل. تأكد من بريدك الإلكتروني لتصلك رسالة التأكيد.
                  </p>
                  <button
                    onClick={handleConfirmBooking}
                    className="mt-8 rounded-full bg-emerald-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    تأكيد الحجز
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <RegistrationReviewDialog
        open={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onConfirm={handleDialogConfirm}
        data={formData}
        agreementChecked={agreementChecked}
        onAgreementChange={setAgreementChecked}
      />

      {isSubmitting ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <span className="loader" aria-hidden />
            <p className="text-sm font-semibold text-gray-700">جارٍ إرسال طلبك...</p>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .flip-card {
          perspective: 2000px;
          position: relative;
        }

        .flip-card-inner {
          position: relative;
          width: 100%;
          transform-style: preserve-3d;
          transition: transform 0.9s cubic-bezier(0.22, 0.61, 0.36, 1);
        }

        .flip-card.is-flipped .flip-card-inner {
          transform: rotateY(180deg);
        }

        .flip-card-front,
        .flip-card-back {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          min-height: 600px;
        }

        .flip-card-front {
          transform: rotateY(0deg);
        }

        .flip-card-back {
          position: absolute;
          inset: 0;
          transform: rotateY(180deg);
        }

        .loader {
          width: 2.75rem;
          height: 2.75rem;
          border-radius: 9999px;
          border: 4px solid rgba(99, 102, 241, 0.35);
          border-top-color: rgba(99, 102, 241, 1);
          animation: spin 0.9s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
};

export default RegisterPage;

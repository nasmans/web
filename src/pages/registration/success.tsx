import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styles from '@/styles/RegistrationSuccess.module.css';

interface SuccessPayload {
  success: boolean;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    gender: 'M' | 'F';
    phone?: string;
    createdAt: string;
  };
  qrCode?: string;
  message?: string;
}

export default function RegistrationSuccessPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [payload, setPayload] = useState<SuccessPayload | null>(null);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (typeof id !== 'string') {
      setError('معرّف العميل غير صالح.');
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    fetch(`/api/clients/${id}`, { signal: controller.signal })
      .then(async (response) => {
        const data: SuccessPayload = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message ?? 'تعذّر تحميل بيانات العميل.');
        }
        setPayload(data);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message);
        setPayload(null);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, [id, router.isReady]);

  return (
    <>
      <Head>
        <title>نجاح التسجيل</title>
      </Head>
      <main className={styles.page}>
        {loading && <p className={styles.loading}>جاري تحميل تفاصيل العميل...</p>}
        {!loading && error && <p className={styles.error}>{error}</p>}
        {!loading && !error && payload?.client && payload.qrCode && (
          <article className={styles.card}>
            <header className={styles.header}>
              <div className={styles.statusBadge}>تم التفعيل بنجاح</div>
              <h1>مرحبا {payload.client.firstName}!</h1>
              <p>
                اكتملت عملية تأكيد تسجيلك. يمكنك مشاركة معرّف العميل الخاص بك أو حفظ رمز QR التالي
                للوصول السريع إلى بياناتك.
              </p>
            </header>

            <section className={styles.clientInfo}>
              <div className={styles.infoBlock}>
                <span>معرّف العميل</span>
                <strong>{payload.client.id}</strong>
              </div>
              <div className={styles.infoBlock}>
                <span>الاسم الكامل</span>
                <strong>
                  {payload.client.firstName} {payload.client.lastName}
                </strong>
              </div>
              <div className={styles.infoBlock}>
                <span>البريد الإلكتروني</span>
                <strong>{payload.client.email}</strong>
              </div>
              <div className={styles.infoBlock}>
                <span>الجنس</span>
                <strong>{payload.client.gender === 'M' ? 'ذكر' : 'أنثى'}</strong>
              </div>
              {payload.client.phone && (
                <div className={styles.infoBlock}>
                  <span>رقم الجوال</span>
                  <strong>{payload.client.phone}</strong>
                </div>
              )}
              <div className={styles.infoBlock}>
                <span>تاريخ الإنشاء</span>
                <strong>{new Date(payload.client.createdAt).toLocaleString('ar-SA')}</strong>
              </div>
            </section>

            <div className={styles.qrWrapper}>
              <img src={payload.qrCode} alt="رمز QR لمعرّف العميل" />
            </div>

            <footer className={styles.meta}>
              <Link href="/" className={styles.backLink}>
                العودة للواجهة الرئيسية
              </Link>
              <span>يمكنك حفظ هذه البطاقة أو مشاركتها مع فريق الدعم.</span>
            </footer>
          </article>
        )}
      </main>
    </>
  );
}

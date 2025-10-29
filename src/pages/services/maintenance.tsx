import Head from 'next/head';
import Link from 'next/link';
import { useBookingFlow } from '../../hooks/useBookingFlow';

export default function MaintenanceService() {
  const { openBookingFlow } = useBookingFlow();

  return (
    <>
      <Head>
        <title>صيانة المنازل - منصة الخدمات المنزلية</title>
      </Head>
      <main>
        <article style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h1>صيانة المنازل</h1>
          <p>
            نقدّم خدمات صيانة شاملة تشمل الكهرباء، السباكة، والأجهزة المنزلية مع ضمان الجودة وسرعة
            الاستجابة.
          </p>
          <button onClick={openBookingFlow}>احجز زيارة صيانة</button>
          <p style={{ marginTop: '1.5rem' }}>
            <Link href="/">العودة إلى الرئيسية</Link>
          </p>
        </article>
      </main>
    </>
  );
}

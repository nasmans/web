import Head from 'next/head';
import { useBookingFlow } from '../hooks/useBookingFlow';

export default function Home() {
  const { openBookingFlow } = useBookingFlow();

  return (
    <>
      <Head>
        <title>منصة الخدمات المنزلية</title>
      </Head>
      <main>
        <section style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
          <h1>احجز خدمتك المنزلية خلال دقائق</h1>
          <p>
            نوفر لك فريقاً محترفاً من المختصين في التنظيف والصيانة والحدائق وغيرها. اختر الخدمة
            المناسبة وسنكون عند بابك في أقرب وقت.
          </p>
          <button onClick={openBookingFlow}>ابدأ الحجز الآن</button>
        </section>
      </main>
    </>
  );
}

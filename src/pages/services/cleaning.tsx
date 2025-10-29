import Head from 'next/head';
import Link from 'next/link';
import { useBookingFlow } from '../../hooks/useBookingFlow';

export default function CleaningService() {
  const { openBookingFlow } = useBookingFlow();

  return (
    <>
      <Head>
        <title>تنظيف المنازل - منصة الخدمات المنزلية</title>
      </Head>
      <main>
        <article style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h1>تنظيف المنازل</h1>
          <p>
            استمتع بمنزل نظيف ومنظم مع فريقنا المتخصص في تنظيف الأسطح، الأثاث، والمطابخ باستخدام أفضل
            المواد الصديقة للبيئة.
          </p>
          <button onClick={openBookingFlow}>احجز جلسة تنظيف</button>
          <p style={{ marginTop: '1.5rem' }}>
            <Link href="/">العودة إلى الرئيسية</Link>
          </p>
        </article>
      </main>
    </>
  );
}

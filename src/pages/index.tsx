import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Client Registration Portal</title>
      </Head>
      <main className={styles.container}>
        <section className={styles.hero}>
          <h1>مرحباً بكم في بوابة تسجيل العملاء</h1>
          <p>
            ابدأ عملية التسجيل أو تحقق من رسالة التأكيد للوصول إلى بطاقة النجاح الجديدة.
          </p>
          <Link href="/registration/success?id=demo" className={styles.cta}>
            عرض نموذج بطاقة النجاح
          </Link>
        </section>
      </main>
    </>
  );
}

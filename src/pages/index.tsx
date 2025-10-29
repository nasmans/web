/**
 * @file Landing page showcasing the initial project structure.
 */
import Head from 'next/head';

import { Hero } from '@/components/Hero';
import { Layout } from '@/components/Layout';

const HomePage = () => {
  return (
    <Layout>
      <Head>
        <title>Next.js TypeScript Starter</title>
        <meta
          name="description"
          content="Kick-start your Next.js project with opinionated tooling."
        />
      </Head>
      <Hero />
    </Layout>
  );
};

export default HomePage;

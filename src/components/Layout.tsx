/**
 * @file Layout component providing consistent page chrome.
 */
import { PropsWithChildren } from 'react';

import styles from '@/styles/Home.module.css';

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span className={styles.brand}>Next TypeScript Starter</span>
      </header>
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        Crafted with Next.js • {new Date().getFullYear()}
      </footer>
    </div>
  );
};

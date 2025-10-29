import type { AppProps } from 'next/app';
import { AuthProvider } from '../context/AuthContext';
import { BookingFlowProvider } from '../context/BookingFlowContext';
import { AccountModal } from '../components/AccountModal';
import { BookingModal } from '../components/BookingModal';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <BookingFlowProvider>
        <Component {...pageProps} />
        <AccountModal />
        <BookingModal />
      </BookingFlowProvider>
    </AuthProvider>
  );
}

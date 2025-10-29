import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState
} from 'react';
import { useAuthContext } from './AuthContext';

interface BookingFlowContextValue {
  openBookingFlow: () => void;
  isAccountModalOpen: boolean;
  isBookingModalOpen: boolean;
  closeAccountModal: () => void;
  closeBookingModal: () => void;
  setAuthNotification: (message: string | null) => void;
  authNotification: string | null;
}

const BookingFlowContext = createContext<BookingFlowContextValue | undefined>(undefined);

export function BookingFlowProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuthContext();
  const [isAccountModalOpen, setAccountModalOpen] = useState(false);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [authNotification, setAuthNotification] = useState<string | null>(null);

  const openBookingFlow = useCallback(() => {
    if (!isAuthenticated) {
      setAuthNotification(null);
      setBookingModalOpen(false);
      setAccountModalOpen(true);
    } else {
      setAccountModalOpen(false);
      setAuthNotification(null);
      setBookingModalOpen(true);
    }
  }, [isAuthenticated]);

  const closeAccountModal = useCallback(() => {
    setAccountModalOpen(false);
  }, []);

  const closeBookingModal = useCallback(() => {
    setBookingModalOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      openBookingFlow,
      isAccountModalOpen,
      isBookingModalOpen,
      closeAccountModal,
      closeBookingModal,
      setAuthNotification,
      authNotification
    }),
    [
      authNotification,
      closeAccountModal,
      closeBookingModal,
      isAccountModalOpen,
      isBookingModalOpen,
      openBookingFlow
    ]
  );

  return <BookingFlowContext.Provider value={value}>{children}</BookingFlowContext.Provider>;
}

export function useBookingFlowContext() {
  const context = useContext(BookingFlowContext);
  if (!context) {
    throw new Error('useBookingFlowContext must be used within a BookingFlowProvider');
  }
  return context;
}

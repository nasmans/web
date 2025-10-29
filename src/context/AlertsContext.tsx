import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

export type Alert = {
  id: string;
  title: string;
  description: string;
  dueAt?: string;
};

type AlertsContextValue = {
  alerts: Alert[];
  hasAlerts: boolean;
  seedDemoAlerts: () => void;
  clearAlerts: () => void;
};

const AlertsContext = createContext<AlertsContextValue | undefined>(undefined);

const demoAlerts: Alert[] = [
  {
    id: 'appointment-1',
    title: 'موعد صيانة',
    description: 'لا تنس حجز موعد الصيانة الدورية للسيارة قبل نهاية الأسبوع.',
    dueAt: '2024-06-18T09:30:00',
  },
  {
    id: 'payment-1',
    title: 'فاتورة مستحقة',
    description: 'هناك فاتورة مستحقة سيتم خصمها خلال يومين. تأكد من توفر الرصيد الكافي.',
  },
];

export const AlertsProvider = ({ children }: PropsWithChildren) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const seedDemoAlerts = useCallback(() => {
    setAlerts(demoAlerts.map((alert) => ({ ...alert })));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  const value = useMemo(
    () => ({
      alerts,
      hasAlerts: alerts.length > 0,
      seedDemoAlerts,
      clearAlerts,
    }),
    [alerts, seedDemoAlerts, clearAlerts]
  );

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);

  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }

  return context;
};

import { useAuth } from './context/AuthContext';
import { useAlerts } from './context/AlertsContext';
import Navbar from './components/Navbar';
import ClientDashboard from './components/ClientDashboard';
import './styles/App.css';

const App = () => {
  const { isAuthenticated, toggleAuth } = useAuth();
  const { alerts, seedDemoAlerts, clearAlerts } = useAlerts();

  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <section className="app-controls">
          <button type="button" onClick={toggleAuth} className="app-button">
            {isAuthenticated ? 'تسجيل الخروج' : 'تسجيل الدخول'}
          </button>
          <button type="button" onClick={seedDemoAlerts} className="app-button">
            إضافة تذكيرات تجريبية
          </button>
          <button
            type="button"
            onClick={clearAlerts}
            className="app-button"
            disabled={alerts.length === 0}
          >
            مسح التذكيرات
          </button>
        </section>
        <ClientDashboard />
      </main>
    </div>
  );
};

export default App;

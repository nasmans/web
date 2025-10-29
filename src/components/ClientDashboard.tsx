import { formatDateTime } from '../utils/formatDateTime';
import { useAlerts } from '../context/AlertsContext';
import '../styles/ClientDashboard.css';

const ClientDashboard = () => {
  const { alerts, hasAlerts } = useAlerts();

  return (
    <section className="dashboard">
      <header className="dashboard__header">
        <h2>التذكيرات</h2>
        {hasAlerts && <span className="dashboard__badge">{alerts.length}</span>}
      </header>
      {hasAlerts ? (
        <ul className="dashboard__reminders" aria-live="polite">
          {alerts.map((alert) => (
            <li key={alert.id} className="dashboard__card">
              <h3 className="dashboard__card-title">{alert.title}</h3>
              <p className="dashboard__card-description">{alert.description}</p>
              {alert.dueAt && (
                <time dateTime={alert.dueAt} className="dashboard__card-due">
                  {formatDateTime(alert.dueAt)}
                </time>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="dashboard__empty">لا توجد تذكيرات حالياً.</p>
      )}
    </section>
  );
};

export default ClientDashboard;

import clsx from 'clsx';
import { useAuth } from '../context/AuthContext';
import { useAlerts } from '../context/AlertsContext';
import '../styles/Navbar.css';

const AccountButton = ({ variant }: { variant: 'mobile' | 'desktop' }) => {
  const { isAuthenticated } = useAuth();
  const { hasAlerts } = useAlerts();

  return (
    <button
      type="button"
      className={clsx('navbar__account', `navbar__account--${variant}`, {
        'navbar__account--authenticated': isAuthenticated,
        'navbar__account--has-alerts': hasAlerts,
      })}
      aria-label={isAuthenticated ? 'الانتقال إلى حسابي' : undefined}
    >
      {isAuthenticated ? (
        <span className="navbar__avatar" aria-hidden="true">
          <span className="navbar__avatar-icon" />
        </span>
      ) : (
        'حسابي'
      )}
      {hasAlerts && <span className="navbar__alerts-dot" aria-hidden="true" />}
    </button>
  );
};

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand" aria-label="العودة للصفحة الرئيسية">
          لوحة العميل
        </div>
        <div className="navbar__right">
          <button type="button" className="navbar__hamburger" aria-label="فتح القائمة">
            <span />
            <span />
            <span />
          </button>
          <AccountButton variant="mobile" />
          <div className="navbar__desktop-controls">
            <button type="button" className="navbar__mode-toggle">
              وضع الليل
            </button>
            <AccountButton variant="desktop" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

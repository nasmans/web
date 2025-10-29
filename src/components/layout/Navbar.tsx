import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export const Navbar = () => {
  const { isAuthenticated, openAccountModal } = useAuth();

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      openAccountModal();
      return;
    }

    if (typeof window !== 'undefined') {
      window.location.href = '/client/dashboard';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">WebApp</div>
      <button type="button" className="navbar__account-button" onClick={handleAccountClick}>
        حسابي
      </button>
    </nav>
  );
};

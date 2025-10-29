import { FormEvent, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AccountModal.css';

export const AccountModal = () => {
  const { isAccountModalOpen, closeAccountModal, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAccountModalOpen) {
    return null;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await login({ email, password });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="account-modal__backdrop" role="dialog" aria-modal="true">
      <div className="account-modal">
        <header className="account-modal__header">
          <h2>تسجيل الدخول</h2>
          <button type="button" className="account-modal__close" onClick={closeAccountModal} aria-label="إغلاق">
            ×
          </button>
        </header>

        <form className="account-modal__form" onSubmit={handleSubmit}>
          <label className="account-modal__field">
            البريد الإلكتروني
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="name@example.com"
            />
          </label>

          <label className="account-modal__field">
            كلمة المرور
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />
          </label>

          {error && <p className="account-modal__error">{error}</p>}

          <div className="account-modal__actions">
            <button type="submit" className="account-modal__primary" disabled={isSubmitting}>
              {isSubmitting ? 'جاري الدخول…' : 'تسجيل الدخول'}
            </button>
            <button
              type="button"
              className="account-modal__secondary"
              onClick={() => {
                closeAccountModal();
                if (typeof window !== 'undefined') {
                  window.location.href = '/signup';
                }
              }}
              disabled={isSubmitting}
            >
              مستخدم جديد
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useBookingFlow } from '../hooks/useBookingFlow';

export function AccountModal() {
  const { login } = useAuth();
  const {
    isAccountModalOpen,
    closeAccountModal,
    openBookingFlow,
    setAuthNotification,
    authNotification
  } = useBookingFlow();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setResetting] = useState(false);

  useEffect(() => {
    if (!isAccountModalOpen) {
      setShowReset(false);
      setError(null);
      setResetEmail('');
      setSubmitting(false);
      setResetting(false);
      setAuthNotification(null);
    }
  }, [isAccountModalOpen, setAuthNotification]);

  if (!isAccountModalOpen) {
    return null;
  }

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      setAuthNotification(null);
      closeAccountModal();
      openBookingFlow();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'حدث خطأ غير متوقع.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setResetting(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: resetEmail })
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? 'تعذّر إرسال رسالة استرجاع كلمة المرور.');
      }

      setAuthNotification('تم إرسال رسالة استرجاع كلمة المرور إلى بريدك الإلكتروني.');
      setShowReset(false);
      setResetEmail('');
    } catch (resetError) {
      setError(resetError instanceof Error ? resetError.message : 'تعذّر إرسال الرسالة.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        {showReset ? (
          <>
            <h2>استعادة كلمة المرور</h2>
            <p>أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين.</p>
            <form onSubmit={handleResetPassword}>
              <div className="input-group">
                <label htmlFor="reset-email">البريد الإلكتروني</label>
                <input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(event) => setResetEmail(event.target.value)}
                  required
                />
              </div>
              {error && <div className="alert" role="alert">{error}</div>}
              <div className="modal-actions">
                <button className="secondary-button" type="button" onClick={() => setShowReset(false)}>
                  رجوع
                </button>
                <button type="submit" disabled={isResetting}>
                  {isResetting ? 'جاري الإرسال...' : 'أرسل الرابط'}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <h2>تسجيل الدخول</h2>
            {authNotification && (
              <div className="alert" role="status">
                {authNotification}
              </div>
            )}
            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="login-email">البريد الإلكتروني</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="login-password">كلمة المرور</label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              {error && <div className="alert" role="alert">{error}</div>}
              <div className="modal-actions">
                <button className="secondary-button" type="button" onClick={closeAccountModal}>
                  إغلاق
                </button>
                <button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'جاري الدخول...' : 'دخول'}
                </button>
              </div>
            </form>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#3358f4',
                  fontSize: '0.95rem',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setError(null);
                  setAuthNotification(null);
                  setShowReset(true);
                  setResetEmail(email);
                }}
              >
                نسيت الرقم السري؟
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

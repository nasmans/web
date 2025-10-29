import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  isAccountModalOpen: boolean;
  openAccountModal: () => void;
  closeAccountModal: () => void;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
  onLoginSuccess?: () => void;
}

export const AuthProvider = ({ children, onLoginSuccess }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);

  const openAccountModal = useCallback(() => setIsAccountModalOpen(true), []);
  const closeAccountModal = useCallback(() => setIsAccountModalOpen(false), []);

  const login = useCallback(
    async (_credentials: { email: string; password: string }) => {
      // TODO: replace with real API integration once backend is ready.
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsAuthenticated(true);
      setIsAccountModalOpen(false);

      if (onLoginSuccess) {
        onLoginSuccess();
      } else if (typeof window !== 'undefined') {
        window.location.href = '/client/dashboard';
      }
    },
    [onLoginSuccess]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      isAccountModalOpen,
      openAccountModal,
      closeAccountModal,
      login,
      logout,
    }),
    [isAuthenticated, isAccountModalOpen, openAccountModal, closeAccountModal, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

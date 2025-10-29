import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

type AuthContextValue = {
  isAuthenticated: boolean;
  toggleAuth: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleAuth = useCallback(() => {
    setIsAuthenticated((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      toggleAuth,
    }),
    [isAuthenticated, toggleAuth]
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

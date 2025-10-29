import { createContext, ReactNode, useContext } from 'react';

export interface ClientProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
}

const ClientContext = createContext<ClientProfile | null>(null);

export interface ClientProviderProps {
  client: ClientProfile;
  children: ReactNode;
}

export const ClientProvider = ({ client, children }: ClientProviderProps) => {
  return <ClientContext.Provider value={client}>{children}</ClientContext.Provider>;
};

export const useClientProfile = () => {
  const client = useContext(ClientContext);

  if (!client) {
    throw new Error('useClientProfile must be used inside a ClientProvider');
  }

  return client;
};

export default ClientContext;

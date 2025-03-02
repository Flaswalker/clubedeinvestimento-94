
export interface User {
  name: string;
  email: string;
  celular: string;
  isAdmin?: boolean;
}

export interface Investment {
  id: string;
  userEmail: string;
  amount: number;
  period: number; // in months
  startDate: string;
  endDate: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (user: User, password: string) => Promise<void>;
  logout: () => void;
}

export interface InvestmentFormData {
  userEmail: string;
  amount: number;
  period: number;
}

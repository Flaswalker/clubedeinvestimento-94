
export interface User {
  name: string;
  email: string;
  celular: string;
  isAdmin?: boolean;
  isVerified?: boolean;
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
  changeAdminCredentials: (
    currentEmail: string, 
    newEmail: string, 
    newName: string, 
    newCelular: string, 
    newPassword: string
  ) => Promise<boolean>;
  sendPasswordResetEmail: (email: string) => Promise<boolean>;
  updateUser: (email: string, updatedUser: Partial<User>) => Promise<boolean>;
  deleteUser: (email: string) => Promise<boolean>;
  getUserPassword: (email: string) => string | null;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  resendVerificationCode: (email: string) => Promise<boolean>;
}

export interface InvestmentFormData {
  userEmail: string;
  amount: number;
  period: number;
}


import { User, Investment } from "@/lib/types";

// Type definitions for our "database"
export interface DB {
  getUsers(): User[];
  getUser(email: string): User | null;
  getUserByCpf(cpf: string): User | null;
  getCurrentUser(): User | null;
  saveUser(user: User): void;
  updateUser(email: string, updatedUser: Partial<User>): boolean;
  deleteUser(email: string): boolean;
  setCurrentUser(user: User | null): void;
  getUserPassword(email: string): string | null;
  savePassword(email: string, password: string): void;
  getInvestments(): Investment[];
  getUserInvestments(userEmail: string): Investment[];
  saveInvestment(investment: Investment): void;
  deleteInvestment(id: string): boolean;
  isAdmin(user: User | null): boolean;
  initializeDefaultClients(): void;
}

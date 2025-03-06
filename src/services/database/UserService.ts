
import { User } from "@/lib/types";
import { KEYS } from "./constants";

export const UserService = {
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");
  },
  
  getUser(email: string): User | null {
    const users = this.getUsers();
    return users.find((user: User) => user.email === email) || null;
  },
  
  getUserByCpf(cpf: string): User | null {
    if (!cpf) return null;
    const users = this.getUsers();
    return users.find((user: User) => user.cpf === cpf) || null;
  },
  
  getCurrentUser(): User | null {
    const storedUser = localStorage.getItem(KEYS.CURRENT_USER);
    return storedUser ? JSON.parse(storedUser) : null;
  },
  
  saveUser(user: User): void {
    const users = this.getUsers();
    const existingUserIndex = users.findIndex((u: User) => u.email === user.email);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },
  
  updateUser(email: string, updatedUser: Partial<User>): boolean {
    const users = this.getUsers();
    const userIndex = users.findIndex((u: User) => u.email === email);
    
    if (userIndex === -1) {
      return false;
    }
    
    const passwordHashes = JSON.parse(localStorage.getItem(KEYS.PASSWORDS) || "{}");
    
    // If email is changing, update password hash key
    if (updatedUser.email && updatedUser.email !== email) {
      passwordHashes[updatedUser.email] = passwordHashes[email];
      delete passwordHashes[email];
      
      // Also update any investments
      const investments = JSON.parse(localStorage.getItem(KEYS.INVESTMENTS) || "[]");
      const updatedInvestments = investments.map((inv: any) => {
        if (inv.userEmail === email) {
          return { ...inv, userEmail: updatedUser.email };
        }
        return inv;
      });
      
      localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(updatedInvestments));
    }
    
    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      ...updatedUser
    };
    
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
    localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(passwordHashes));
    
    // If current user is being updated, update that too
    const currentUser = this.getCurrentUser();
    if (currentUser && currentUser.email === email) {
      const updatedCurrentUser = { ...currentUser, ...updatedUser };
      this.setCurrentUser(updatedCurrentUser);
    }
    
    return true;
  },
  
  deleteUser(email: string): boolean {
    const users = this.getUsers();
    const updatedUsers = users.filter((u: User) => u.email !== email);
    
    if (users.length === updatedUsers.length) {
      return false;
    }
    
    // Remove password
    const passwordHashes = JSON.parse(localStorage.getItem(KEYS.PASSWORDS) || "{}");
    delete passwordHashes[email];
    
    // Remove investments
    const investments = JSON.parse(localStorage.getItem(KEYS.INVESTMENTS) || "[]");
    const updatedInvestments = investments.filter((inv: any) => inv.userEmail !== email);
    
    localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
    localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(passwordHashes));
    localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(updatedInvestments));
    
    return true;
  },
  
  setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },
  
  isAdmin(user: User | null): boolean {
    return !!user?.isAdmin;
  }
};

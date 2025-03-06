
import { KEYS } from "./constants";

export const AuthService = {
  getUserPassword(email: string): string | null {
    try {
      const passwordHashes = JSON.parse(localStorage.getItem(KEYS.PASSWORDS) || "{}");
      return passwordHashes[email] || null;
    } catch (error) {
      return null;
    }
  },
  
  savePassword(email: string, password: string): void {
    const passwordHashes = JSON.parse(localStorage.getItem(KEYS.PASSWORDS) || "{}");
    passwordHashes[email] = password;
    localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(passwordHashes));
  }
};

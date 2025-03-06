
import { Investment } from "@/lib/types";
import { KEYS } from "./constants";

export const InvestmentService = {
  getInvestments(): Investment[] {
    return JSON.parse(localStorage.getItem(KEYS.INVESTMENTS) || "[]");
  },
  
  getUserInvestments(userEmail: string): Investment[] {
    const investments = this.getInvestments();
    return investments.filter((inv: Investment) => inv.userEmail === userEmail);
  },
  
  saveInvestment(investment: Investment): void {
    const investments = this.getInvestments();
    const existingIndex = investments.findIndex((inv: Investment) => inv.id === investment.id);
    
    if (existingIndex >= 0) {
      investments[existingIndex] = investment;
    } else {
      investments.push(investment);
    }
    
    localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(investments));
  },
  
  deleteInvestment(id: string): boolean {
    const investments = this.getInvestments();
    const updatedInvestments = investments.filter((inv: Investment) => inv.id !== id);
    
    if (investments.length === updatedInvestments.length) {
      return false;
    }
    
    localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(updatedInvestments));
    return true;
  }
};

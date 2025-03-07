
import { Investment } from "@/lib/types";
import { KEYS } from "./constants";

export const InvestmentService = {
  getInvestments(): Investment[] {
    try {
      return JSON.parse(localStorage.getItem(KEYS.INVESTMENTS) || "[]");
    } catch (error) {
      console.error("Error getting investments:", error);
      return [];
    }
  },
  
  getUserInvestments(userEmail: string): Investment[] {
    try {
      const investments = this.getInvestments();
      return investments.filter((inv: Investment) => inv.userEmail === userEmail);
    } catch (error) {
      console.error("Error getting user investments:", error);
      return [];
    }
  },
  
  saveInvestment(investment: Investment): void {
    try {
      if (!investment || !investment.id) {
        throw new Error("Invalid investment data");
      }
      
      const investments = this.getInvestments();
      const existingIndex = investments.findIndex((inv: Investment) => inv.id === investment.id);
      
      if (existingIndex >= 0) {
        investments[existingIndex] = investment;
      } else {
        investments.push(investment);
      }
      
      localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(investments));
      
      // Dispatch a custom event to notify other components
      const updateEvent = new CustomEvent('investment-update', { 
        detail: { 
          type: existingIndex >= 0 ? 'update' : 'add',
          investment: investment
        } 
      });
      window.dispatchEvent(updateEvent);
      
      console.log(`Investment ${existingIndex >= 0 ? 'updated' : 'added'} successfully`, investment);
      
    } catch (error) {
      console.error("Error saving investment:", error);
      throw error;
    }
  },
  
  deleteInvestment(id: string): boolean {
    try {
      if (!id) {
        return false;
      }
      
      const investments = this.getInvestments();
      const investmentToDelete = investments.find((inv: Investment) => inv.id === id);
      const updatedInvestments = investments.filter((inv: Investment) => inv.id !== id);
      
      if (investments.length === updatedInvestments.length) {
        return false;
      }
      
      localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(updatedInvestments));
      
      // Dispatch a custom event to notify other components
      const updateEvent = new CustomEvent('investment-update', { 
        detail: { 
          type: 'delete',
          investment: investmentToDelete
        } 
      });
      window.dispatchEvent(updateEvent);
      
      console.log("Investment deleted successfully", id);
      
      return true;
    } catch (error) {
      console.error("Error deleting investment:", error);
      return false;
    }
  }
};

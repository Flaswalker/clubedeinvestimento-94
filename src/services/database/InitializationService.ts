
import { User, Investment } from "@/lib/types";
import { KEYS } from "./constants";
import { UserService } from "./UserService";
import { AuthService } from "./AuthService";
import { InvestmentService } from "./InvestmentService";

export const InitializationService = {
  initializeAdminUser: () => {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");
    const adminExists = users.some((user: User) => user.isAdmin);
    
    // If admin doesn't exist, create default admin
    if (!adminExists) {
      const defaultAdmin: User = {
        name: "Administrador",
        email: "admin@banko.com",
        celular: "(00) 00000-0000",
        cpf: "000.000.000-00",
        isAdmin: true,
        isVerified: true
      };
      
      // Store admin user
      const updatedUsers = [...users, defaultAdmin];
      localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
      
      // Set default admin password
      const passwordHashes = JSON.parse(localStorage.getItem(KEYS.PASSWORDS) || "{}");
      passwordHashes[defaultAdmin.email] = "admin";
      localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(passwordHashes));
    }
  },
  
  initializeDefaultClients: () => {
    // Remove Felipe João Jorge Brito
    const felipeCpf = "129.353.395-50";
    const felipeUser = UserService.getUserByCpf(felipeCpf);
    if (felipeUser) {
      UserService.deleteUser(felipeUser.email);
      console.log("Removed user Felipe João Jorge Brito");
    }
    
    // Remove Diogo Fagundes Silva
    const diogoCpf = "139.697.725-24";
    const diogoUser = UserService.getUserByCpf(diogoCpf);
    if (diogoUser) {
      UserService.deleteUser(diogoUser.email);
    }
    
    // Update Gabriela's investment amount to 120.00
    const gabrielaCpf = "146.322.995-02";
    const gabrielaUser = UserService.getUserByCpf(gabrielaCpf);
    
    if (gabrielaUser) {
      const investments = InvestmentService.getUserInvestments(gabrielaUser.email);
      const gabrielaInvestment = investments.find(inv => inv.id.startsWith("51fb544a"));
      
      if (gabrielaInvestment) {
        gabrielaInvestment.amount = 120.00;
        InvestmentService.saveInvestment(gabrielaInvestment);
      }
    }
    
    // Add Edson Marcos Vinicius Rezende
    const edsonCpf = "079.726.265-29";
    const edsonUser = UserService.getUserByCpf(edsonCpf);
    
    if (!edsonUser) {
      const newUser: User = {
        name: "Edson Marcos Vinicius Rezende",
        email: "ian_rezende@uninorte.com.br",
        celular: "(75) 98343-5881",
        cpf: edsonCpf,
        isAdmin: false,
        isVerified: true
      };
      
      // Add user
      UserService.saveUser(newUser);
      
      // Add password
      AuthService.savePassword(newUser.email, "be2hOj7qbrukTMR");
      
      // Add investment for Edson
      const startDate = new Date("2025-03-07");
      const endDate = new Date("2025-09-07");

      const newInvestment: Investment = {
        id: crypto.randomUUID(),
        userEmail: newUser.email,
        amount: 110.25,
        period: 6,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      InvestmentService.saveInvestment(newInvestment);
      console.log("Added user Edson with investment:", newInvestment);
    }
    
    // Add Luciana Favorin Brito
    const lucianaCpf = "849.152.725-75";
    const lucianaUser = UserService.getUserByCpf(lucianaCpf);
    
    if (!lucianaUser) {
      const newUser: User = {
        name: "Luciana Favorin Brito",
        email: "lucianafavorinbrito@life.com",
        celular: "(77) 98536-1390",
        cpf: lucianaCpf,
        isAdmin: false,
        isVerified: true
      };
      
      // Add user
      UserService.saveUser(newUser);
      
      // Add password
      AuthService.savePassword(newUser.email, "1wM79wxKB4wAqgJ");
      
      // Add investment for Luciana
      const startDate = new Date("2025-03-07");
      const endDate = new Date("2025-09-07");

      const newInvestment: Investment = {
        id: "74d77321",
        userEmail: newUser.email,
        amount: 115.30,
        period: 6,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      InvestmentService.saveInvestment(newInvestment);
      console.log("Added user Luciana with investment:", newInvestment);
    }
  }
};


import { User } from "@/lib/types";
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
    // Remove Diogo Fagundes Silva
    const diogoCpf = "139.697.725-24";
    const diogoUser = UserService.getUserByCpf(diogoCpf);
    if (diogoUser) {
      UserService.deleteUser(diogoUser.email);
    }
    
    // Check if Felipe already has investments
    const felipeCpf = "129.353.395-50";
    const felipeUser = UserService.getUserByCpf(felipeCpf);
    
    // Add investment for Felipe if he exists
    if (felipeUser) {
      // Add new investment for Felipe
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 6); // 6 months

      const newInvestment = {
        id: crypto.randomUUID(),
        userEmail: felipeUser.email,
        amount: 100.01,
        period: 6,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      InvestmentService.saveInvestment(newInvestment);
    }
    
    // Initialize other default clients if needed
    const defaultClients = [
      {
        name: "Felipe João Jorge Brito",
        email: "felipe.joao.brito@jerasistemas.com.br",
        password: "HZkG1lOUqD6i1hp",
        celular: "(75) 98986-3193",
        cpf: "129.353.395-50"
      }
    ];
    
    // Add default clients if they don't exist yet
    defaultClients.forEach(client => {
      const existingUser = UserService.getUserByCpf(client.cpf);
      
      if (!existingUser) {
        const newUser: User = {
          name: client.name,
          email: client.email,
          celular: client.celular,
          cpf: client.cpf,
          isAdmin: false,
          isVerified: true
        };
        
        // Add user
        UserService.saveUser(newUser);
        
        // Add password
        AuthService.savePassword(client.email, client.password);
        
        // For Felipe, add an investment
        if (client.cpf === "129.353.395-50") {
          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + 6); // 6 months

          const newInvestment = {
            id: crypto.randomUUID(),
            userEmail: client.email,
            amount: 100.01,
            period: 6,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString()
          };

          InvestmentService.saveInvestment(newInvestment);
        }
      }
    });
  }
};

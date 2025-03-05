
import { User, Investment } from "@/lib/types";

// Database keys
const KEYS = {
  USERS: "banko-users",
  CURRENT_USER: "banko-current-user",
  ADMIN_CONFIG: "banko-admin-config",
  PASSWORDS: "banko-passwords",
  INVESTMENTS: "banko-investments",
};

// Type definitions for our "database"
interface DB {
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

// Initialize admin user if not exists
const initializeAdminUser = () => {
  const users = JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");
  
  // Check if admin config exists, if not create a default one
  if (!localStorage.getItem(KEYS.ADMIN_CONFIG)) {
    const defaultAdminConfig = {
      initialized: false,
      lastModified: new Date().toISOString()
    };
    localStorage.setItem(KEYS.ADMIN_CONFIG, JSON.stringify(defaultAdminConfig));
  }
  
  const adminConfig = JSON.parse(localStorage.getItem(KEYS.ADMIN_CONFIG) || "{}");
  
  // Only initialize default admin if no admin exists and admin setup hasn't been completed
  if (!users.some((user: User) => user.isAdmin) && !adminConfig.initialized) {
    // Custom admin credentials - PERSONALIZADAS AQUI
    const adminEmail = "lucasalves.analista@hotmail.com"; // Email personalizado
    const adminPassword = "San!$@&@toS7@"; // Senha personalizada forte
    
    const adminUser = {
      name: "Administrador do Sistema",  // Nome personalizado
      email: adminEmail,
      celular: "(75) 99801-2820",  // Número personalizado
      cpf: "000.000.000-00",
      isAdmin: true,
    };
    
    // Store password hash separately (in a real app, this would be properly hashed)
    const passwordHashes = JSON.parse(localStorage.getItem(KEYS.PASSWORDS) || "{}");
    passwordHashes[adminEmail] = adminPassword;
    
    localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(passwordHashes));
    localStorage.setItem(KEYS.USERS, JSON.stringify([...users, adminUser]));
    
    // Log the initial admin credentials to console (in a real app, this would be shown via a secure setup process)
    console.log("CREDENCIAIS INICIAIS DO ADMINISTRADOR - USE PARA O PRIMEIRO LOGIN:");
    console.log("Email:", adminUser.email);
    console.log("Senha:", adminPassword);
    console.log("IMPORTANTE: Altere essas credenciais após o primeiro login!");
    
    // Mark admin as initialized
    adminConfig.initialized = true;
    adminConfig.lastModified = new Date().toISOString();
    localStorage.setItem(KEYS.ADMIN_CONFIG, JSON.stringify(adminConfig));
  }
};

// Database service implementation
const DatabaseService: DB = {
  getUsers() {
    return JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");
  },
  
  getUser(email: string) {
    const users = this.getUsers();
    return users.find((user: User) => user.email === email) || null;
  },
  
  getUserByCpf(cpf: string) {
    if (!cpf) return null;
    const users = this.getUsers();
    return users.find((user: User) => user.cpf === cpf) || null;
  },
  
  getCurrentUser() {
    const storedUser = localStorage.getItem(KEYS.CURRENT_USER);
    return storedUser ? JSON.parse(storedUser) : null;
  },
  
  saveUser(user: User) {
    const users = this.getUsers();
    const existingUserIndex = users.findIndex((u: User) => u.email === user.email);
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = user;
    } else {
      users.push(user);
    }
    
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  },
  
  updateUser(email: string, updatedUser: Partial<User>) {
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
      const investments = this.getInvestments();
      const updatedInvestments = investments.map((inv: Investment) => {
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
  
  deleteUser(email: string) {
    const users = this.getUsers();
    const updatedUsers = users.filter((u: User) => u.email !== email);
    
    if (users.length === updatedUsers.length) {
      return false;
    }
    
    // Remove password
    const passwordHashes = JSON.parse(localStorage.getItem(KEYS.PASSWORDS) || "{}");
    delete passwordHashes[email];
    
    // Remove investments
    const investments = this.getInvestments();
    const updatedInvestments = investments.filter((inv: Investment) => inv.userEmail !== email);
    
    localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
    localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(passwordHashes));
    localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(updatedInvestments));
    
    return true;
  },
  
  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  },
  
  getUserPassword(email: string) {
    try {
      const passwordHashes = JSON.parse(localStorage.getItem(KEYS.PASSWORDS) || "{}");
      return passwordHashes[email] || null;
    } catch (error) {
      return null;
    }
  },
  
  savePassword(email: string, password: string) {
    const passwordHashes = JSON.parse(localStorage.getItem(KEYS.PASSWORDS) || "{}");
    passwordHashes[email] = password;
    localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(passwordHashes));
  },
  
  getInvestments() {
    return JSON.parse(localStorage.getItem(KEYS.INVESTMENTS) || "[]");
  },
  
  getUserInvestments(userEmail: string) {
    const investments = this.getInvestments();
    return investments.filter((inv: Investment) => inv.userEmail === userEmail);
  },
  
  saveInvestment(investment: Investment) {
    const investments = this.getInvestments();
    const existingIndex = investments.findIndex((inv: Investment) => inv.id === investment.id);
    
    if (existingIndex >= 0) {
      investments[existingIndex] = investment;
    } else {
      investments.push(investment);
    }
    
    localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(investments));
  },
  
  deleteInvestment(id: string) {
    const investments = this.getInvestments();
    const updatedInvestments = investments.filter((inv: Investment) => inv.id !== id);
    
    if (investments.length === updatedInvestments.length) {
      return false;
    }
    
    localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(updatedInvestments));
    return true;
  },
  
  isAdmin(user: User | null) {
    return !!user?.isAdmin;
  },
  
  // Initialize default clients and their investments
  initializeDefaultClients() {
    const defaultClients = [
      {
        name: "Eliane Fabiana Moura",
        email: "elianefabianamoura101@life.com",
        cpf: "683.612.305-64",
        celular: "(75) 98157-6315",
        password: "dH15sErZEL",
        investment: {
          id: "1a1111aa",
          amount: 101.01,
          period: 6,
          startDate: new Date("2025-03-05").toISOString(),
          endDate: new Date("2025-09-05").toISOString()
        }
      },
      {
        name: "Diogo Fagundes Silva",
        email: "diogofagundessilva202@life.com",
        cpf: "139.697.725-24",
        celular: "(75) 99237-1822",
        password: "W3SouMQ2Ju",
        investments: [
          {
            id: "2b222bbb",
            amount: 202.02,
            period: 6,
            startDate: new Date("2025-03-05").toISOString(),
            endDate: new Date("2025-09-05").toISOString()
          },
          {
            id: "74d77321",
            amount: 505.05,
            period: 6,
            startDate: new Date("2025-03-05").toISOString(),
            endDate: new Date("2025-09-05").toISOString()
          },
          {
            id: "104e9bbc",
            amount: 606.06,
            period: 6,
            startDate: new Date("2025-03-05").toISOString(),
            endDate: new Date("2025-09-05").toISOString()
          }
        ]
      },
      {
        name: "Marlene Ayla Alves",
        email: "marlene_ayla_alves303@life.com",
        cpf: "655.814.065-96",
        celular: "(75) 99689-5982",
        password: "372IqLtzfM",
        investment: {
          id: "c3333333",
          amount: 303.03,
          period: 6,
          startDate: new Date("2025-03-05").toISOString(),
          endDate: new Date("2025-09-05").toISOString()
        }
      },
      // Adicionando a nova cliente Gabriela Luana Brito
      {
        name: "Gabriela Luana Brito",
        email: "gabrielaluanabrito@life.com",
        cpf: "146.322.995-02",
        celular: "(77) 98536-1390",
        password: "GNNAiLhzzB",
        investments: [
          {
            id: "51fb544a",
            amount: 404.04,
            period: 6,
            startDate: new Date("2025-03-05").toISOString(),
            endDate: new Date("2025-09-05").toISOString()
          },
          {
            id: "67f492f9",
            amount: 707.07,
            period: 6,
            startDate: new Date("2025-03-05").toISOString(),
            endDate: new Date("2025-09-05").toISOString()
          }
        ]
      },
       // Adicionando a nova cliente Sebastiana Clara Aparício
      {
        name: "Sebastiana Clara Aparício",
        email: "sebastiana-aparicio79@orbisat.com.br",
        cpf: "711.777.385-54",
        celular: "(75) 98761-3911",
        password: "YL58eRace2Wr4hK",
        investments: [
          {
            id: "90148248",
            amount: 840.00,
            period: 6,
            startDate: new Date("2025-03-05").toISOString(),
            endDate: new Date("2025-09-05").toISOString()
          }
        ]
      },
    const users = this.getUsers();
    const passwordHashes = JSON.parse(localStorage.getItem(KEYS.PASSWORDS) || "{}");
    const investments = this.getInvestments();
    let newUsers = [...users];
    let newInvestments = [...investments];
    
    // Add each default client and their investment if they don't already exist
    defaultClients.forEach(client => {
      // Check if user already exists
      if (!users.some((u: User) => u.email === client.email || u.cpf === client.cpf)) {
        // Create user
        const newUser: User = {
          name: client.name,
          email: client.email,
          cpf: client.cpf,
          celular: client.celular,
          isAdmin: false,
          isVerified: true
        };
        
        newUsers.push(newUser);
        passwordHashes[client.email] = client.password;
        
        // Se o cliente possui vários investimentos (como a Gabriela)
        if (client.investments && Array.isArray(client.investments)) {
          client.investments.forEach(inv => {
            const newInvestment: Investment = {
              id: inv.id,
              userEmail: client.email,
              amount: inv.amount,
              period: inv.period,
              startDate: inv.startDate,
              endDate: inv.endDate
            };
            
            newInvestments.push(newInvestment);
          });
        } 
        // Se o cliente possui apenas um investimento (clientes anteriores)
        else if (client.investment) {
          const newInvestment: Investment = {
            id: client.investment.id,
            userEmail: client.email,
            amount: client.investment.amount,
            period: client.investment.period,
            startDate: client.investment.startDate,
            endDate: client.investment.endDate
          };
          
          newInvestments.push(newInvestment);
        }
      } else {
        // Se o usuário já existe, vamos verificar se precisamos adicionar novos investimentos
        const existingUserEmail = client.email;
        
        // Se o cliente possui vários investimentos
        if (client.investments && Array.isArray(client.investments)) {
          client.investments.forEach(inv => {
            // Verifica se este investimento já existe
            if (!investments.some((existingInv: Investment) => existingInv.id === inv.id)) {
              const newInvestment: Investment = {
                id: inv.id,
                userEmail: existingUserEmail,
                amount: inv.amount,
                period: inv.period,
                startDate: inv.startDate,
                endDate: inv.endDate
              };
              
              newInvestments.push(newInvestment);
            }
          });
        }
      }
    });
    
    // Save updated data
    localStorage.setItem(KEYS.USERS, JSON.stringify(newUsers));
    localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(passwordHashes));
    localStorage.setItem(KEYS.INVESTMENTS, JSON.stringify(newInvestments));
  }
};

// Initialize the database
initializeAdminUser();

// Create default clients
DatabaseService.initializeDefaultClients();

export default DatabaseService;

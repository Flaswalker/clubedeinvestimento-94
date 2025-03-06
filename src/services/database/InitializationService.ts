
import { User, Investment } from "@/lib/types";
import { KEYS } from "./constants";

export const InitializationService = {
  initializeAdminUser(): void {
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
  },
  
  initializeDefaultClients(): void {
    const defaultClients = [
      {
        name: "Eliane Fabiana Moura",
        email: "elianefabianamoura101@life.com",
        cpf: "683.612.305-64",
        celular: "(75) 98157-6315",
        password: "dH15sErZEL",
        investment: {
          id: "FeUURWde",
          amount: 100.01,
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
            id: "8hyeMKYR",
            amount: 100.01,
            period: 6,
            startDate: new Date("2025-03-05").toISOString(),
            endDate: new Date("2025-09-05").toISOString()
          },
          {
            id: "0YgdTSUR",
            amount: 100.01,
            period: 6,
            startDate: new Date("2025-03-05").toISOString(),
            endDate: new Date("2025-09-05").toISOString()
          },
          {
            id: "lp4KzzQl",
            amount: 100.01,
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
          id: "lqrdu1bX",
          amount: 100.01,
          period: 6,
          startDate: new Date("2025-03-05").toISOString(),
          endDate: new Date("2025-09-05").toISOString()
        }
      },
      {
        name: "Gabriela Luana Brito",
        email: "gabrielaluanabrito@life.com",
        cpf: "146.322.995-02",
        celular: "(77) 98536-1390",
        password: "GNNAiLhzzB",
        investments: [
          {
            id: "rQnfwO6J",
            amount: 100.01,
            period: 6,
            startDate: new Date("2025-03-05").toISOString(),
            endDate: new Date("2025-09-05").toISOString()
          },
          {
            id: "dWwl19Qw",
            amount: 100.01,
            period: 6,
            startDate: new Date("2025-03-05").toISOString(),
            endDate: new Date("2025-09-05").toISOString()
          },
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
      {
        name: "Sebastiana Clara Aparício",
        email: "sebastiana-aparicio79@orbisat.com.br",
        cpf: "711.777.385-54",
        celular: "(75) 98761-3911",
        password: "YL58eRace2Wr4hK",
        investment: {
          id: "ZSZ4zBej",
          amount: 10.01,
          period: 6,
          startDate: new Date("2025-03-05").toISOString(),
          endDate: new Date("2025-09-05").toISOString()
        }
      },
      {
        name: "Murilo Carlos Assis",
        email: "murilo_assis@sociedadeweb.com.br",
        cpf: "538.721.715-50",
        celular: "(75) 99866-0137",
        password: "OLR2Eym3yH",
        investment: {
          id: "0W3DjTi8",
          amount: 100.01,
          period: 6,
          startDate: new Date("2025-03-05").toISOString(),
          endDate: new Date("2025-09-05").toISOString()
        }
      },
      {
        name: "Felipe João Jorge Brito",
        email: "felipe.joao.brito@jerasistemas.com.br",
        cpf: "129.353.395-50",
        celular: "(75) 98986-3193",
        password: "HZkG1lOUqD6i1hp",
        investments: []
      }
    ];
    
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || "[]");
    const passwordHashes = JSON.parse(localStorage.getItem(KEYS.PASSWORDS) || "{}");
    const investments = JSON.parse(localStorage.getItem(KEYS.INVESTMENTS) || "[]");
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


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
        name: "Lucas Alves",
        email: "lucasalves.analista@hotmail.com",
        celular: "(75) 99801-2820",
        cpf: "448.990.765-68",
        isAdmin: true,
        isVerified: true
    };
      
      // Store admin user
      const updatedUsers = [...users, defaultAdmin];
      localStorage.setItem(KEYS.USERS, JSON.stringify(updatedUsers));
      
      // Set default admin password
      const passwordHashes = JSON.parse(localStorage.getItem(KEYS.PASSWORDS) || "{}");
      passwordHashes[defaultAdmin.email] = "San!$@&@toS7@Vit";
      localStorage.setItem(KEYS.PASSWORDS, JSON.stringify(passwordHashes));
    }
  },
  
  initializeDefaultClients: () => {
    
    // Add Genilda Soares Rocha Lima
    const genildaCpf = "021.109.835-31";
    const genildaUser = UserService.getUserByCpf(genildaCpf);
    
    if (!genildaUser) {
      const newUser: User = {
        name: "Genilda Soares Rocha Lima",
        email: "genildasoaresrocha@gmail.com",
        celular: "(75) 88231-1813",
        cpf: genildaCpf,
        isAdmin: false,
        isVerified: true
      };
      
      // Add user
      UserService.saveUser(newUser);
      
      // Add password
      AuthService.savePassword(newUser.email, "03015076");
      
      // Add investment for Genilda
      const startDate = new Date("2025-03-13");
      const endDate = new Date("2025-09-13");

      const newInvestment: Investment = {
        id: "2d054d5c",
        userEmail: newUser.email,
        amount: 100.00,
        period: 6,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      InvestmentService.saveInvestment(newInvestment);
      console.log("Added user Genilda with investment:", newInvestment);
    }

        // Add Maria de Cássia Borges Lins
    const mariaCpf = "335.062.995-49";
    const mariaUser = UserService.getUserByCpf(mariaCpf);
    
    if (!mariaUser) {
      const newUser: User = {
        name: "Maria de Cássia Borges Lins",
        email: "cassiaborgeslins@hotmail.com",
        celular: "(75) 99999-1915",
        cpf: mariaCpf,
        isAdmin: false,
        isVerified: true
      };
      
      // Add user
      UserService.saveUser(newUser);
      
      // Add password
      AuthService.savePassword(newUser.email, "021214");
      
      // Add investment for Maria
      const startDate = new Date("2025-03-14");
      const endDate = new Date("2025-09-14");

      const newInvestment: Investment = {
        id: "5da26df4",
        userEmail: newUser.email,
        amount: 100.00,
        period: 6,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      InvestmentService.saveInvestment(newInvestment);
      console.log("Added user Maria with investment:", newInvestment);
    }

    // Add Sandra Mara Alves Ramos
    const sandraCpf = "349.823.615-68";
    const sandraUser = UserService.getUserByCpf(sandraCpf);
    
    if (!sandraUser) {
      const newUser: User = {
        name: "Sandra Mara Alves Ramos",
        email: "sandramguiga11@yahoo.com.br",
        celular: "(75) 99984-1554",
        cpf: sandraCpf,
        isAdmin: false,
        isVerified: true
      };
      
      // Add user
      UserService.saveUser(newUser);
      
      // Add password
      AuthService.savePassword(newUser.email, "11130750");
      
      // Add investment for Sandra
      const startDate = new Date("2025-03-14");
      const endDate = new Date("2025-09-14");

      const newInvestment: Investment = {
        id: "b868fedb",
        userEmail: newUser.email,
        amount: 100.00,
        period: 6,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      InvestmentService.saveInvestment(newInvestment);
      console.log("Added user Sandra with investment:", newInvestment);
    }

    // Add Mônica Maria Menezes de Barros
    const mônicaCpf = "631.867.805-00";
    const mônicaUser = UserService.getUserByCpf(mônicaCpf);
    
    if (!mônicaUser) {
      const newUser: User = {
        name: "Mônica Maria Menezes de Barros",
        email: "reservas.pousadacasarao@gmail.com",
        celular: "(75) 99855-3316",
        cpf: mônicaCpf,
        isAdmin: false,
        isVerified: true
      };
      
      // Add user
      UserService.saveUser(newUser);
      
      // Add password
      AuthService.savePassword(newUser.email, "Dan227698");
      
      // Add investment for Mônica
      const startDate = new Date("2025-03-14");
      const endDate = new Date("2025-09-14");

      const newInvestment: Investment = {
        id: "3d6eb228",
        userEmail: newUser.email,
        amount: 100.00,
        period: 6,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      InvestmentService.saveInvestment(newInvestment);
      console.log("Added user Mônica with investment:", newInvestment);
    }

        // Add Isabel Cristina Santana Moura
    const isabelCpf = "977.061.245-68";
    const isabelUser = UserService.getUserByCpf(isabelCpf);
    
    if (!isabelUser) {
      const newUser: User = {
        name: "Isabel Cristina Santana Moura",
        email: "isabelcsm_@hotmail.com",
        celular: "(75) 99927-2287",
        cpf: isabelCpf,
        isAdmin: false,
        isVerified: true
      };
      
      // Add user
      UserService.saveUser(newUser);
      
      // Add password
      AuthService.savePassword(newUser.email, "07122825");
      
      // Add investment for Isabel
      const startDate = new Date("2025-03-15");
      const endDate = new Date("2025-09-15");

      const newInvestment: Investment = {
        id: "5a761c46",
        userEmail: newUser.email,
        amount: 100.00,
        period: 6,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      InvestmentService.saveInvestment(newInvestment);
      console.log("Added user Isabel with investment:", newInvestment);
    }
        // Add Cristiana dos Santos Silva
    const cristianaCpf = "020.437.604-16";
    const cristianaUser = UserService.getUserByCpf(cristianaCpf);
    
    if (!cristianaUser) {
      const newUser: User = {
        name: "Cristiana dos Santos Silva",
        email: "crisbjs.unica@hotmail.com",
        celular: "(75) 99927-5886",
        cpf: cristianaCpf,
        isAdmin: false,
        isVerified: true
      };
      
      // Add user
      UserService.saveUser(newUser);
      
      // Add password
      AuthService.savePassword(newUser.email, "Geladeira123;");
      
      // Add investment for cristiana
      const startDate = new Date("2025-03-29");
      const endDate = new Date("2025-09-29");

      const newInvestment: Investment = {
        id: "4579b691",
        userEmail: newUser.email,
        amount: 100.00,
        period: 6,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      InvestmentService.saveInvestment(newInvestment);
      console.log("Added user cristiana with investment:", newInvestment);
    }
       // Add Administrador do Sistema
    const adminCpf = "123.456.789-01";
    const adminUser = UserService.getUserByCpf(adminCpf);
    
    if (!adminUser) {
      const newUser: User = {
        name: "Administrador do Sistema",
        email: "admin@invistaeganhe.com",
        celular: "(75) 99801-2820",
        cpf: adminCpf,
        isAdmin: false,
        isVerified: true
      };
      
      // Add user
      UserService.saveUser(newUser);
      
      // Add password
      AuthService.savePassword(newUser.email, "admin123");
      
      // Add investment for admin
      const startDate = new Date("2025-04-04");
      const endDate = new Date("2025-10-04");

      const newInvestment: Investment = {
        id: "3b145c6b",
        userEmail: newUser.email,
        amount: 100.00,
        period: 6,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      InvestmentService.saveInvestment(newInvestment);
      console.log("Added user admin with investment:", newInvestment);
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
        amount: 100.00,
        period: 6,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      InvestmentService.saveInvestment(newInvestment);
      console.log("Added user Luciana with investment:", newInvestment);
    }
    
    // Add Verônica Santos Teles
    const verônicaCpf = "076.243.035-40";
    const verônicaUser = UserService.getUserByCpf(verônicaCpf);
    
    if (!verônicaUser) {
      const newUser: User = {
        name: "Verônica Santos Teles",
        email: "veronicasteles@gmail.com",
        celular: "(75) 99952-8256",
        cpf: verônicaCpf,
        isAdmin: false,
        isVerified: true
      };
      
      // Add user
      UserService.saveUser(newUser);
      
      // Add password
      AuthService.savePassword(newUser.email, "Vst28051997");
        // PRIMEIRO INVESTIMENTO (101.00)
  const firstInvestmentStartDate = new Date("2025-03-08");
  const firstInvestmentEndDate = new Date("2025-09-08");

  const firstInvestment: Investment = {
    id: "e2c303ce",
    userEmail: newUser.email,
    amount: 100.00,
    period: 6,
    startDate: firstInvestmentStartDate.toISOString(),
    endDate: firstInvestmentEndDate.toISOString()
  }

  InvestmentService.saveInvestment(firstInvestment);

  // SEGUNDO INVESTIMENTO (115.00 - PARÂMETROS SOLICITADOS)
  const secondInvestmentStartDate = new Date("2025-03-09"); // 09/03/2025
  const secondInvestmentEndDate = new Date("2025-09-09");    // 09/09/2025

  const secondInvestment: Investment = {
    id: "73eac82a",
    userEmail: newUser.email,
    amount: 150.00,
    period: 6,
    startDate: secondInvestmentStartDate.toISOString(),
    endDate: secondInvestmentEndDate.toISOString()
  }

  InvestmentService.saveInvestment(secondInvestment);

  console.log("Usuário Verônica adicionado com dois investimentos:", {
    firstInvestment,
    secondInvestment
  });
}
// Add Matheus Hugo Teixeira
const matheusCpf = "832.957.505-56";
const matheusUser = UserService.getUserByCpf(matheusCpf);

if (!matheusUser) {
  const newUser: User = {
    name: "Matheus Hugo Teixeira",
    email: "matheus_hugo_teixeira@life.com.br",
    celular: "(75) 99825-3933",
    cpf: matheusCpf,
    isAdmin: false,
    isVerified: true
  };

  // Add user
  UserService.saveUser(newUser);

  // Add password
  AuthService.savePassword(newUser.email, "r63CSOAtF1");

  // Primeiro Investimento (150.00)
  const firstInvestment: Investment = {
    id: "6a290543",
    userEmail: newUser.email,
    amount: 100.00,
    period: 6,
    startDate: new Date("2025-03-08").toISOString(), // 08/03/2025
    endDate: new Date("2025-09-08").toISOString()    // 08/09/2025
  };

  InvestmentService.saveInvestment(firstInvestment);

  // Segundo Investimento (100.00)
  const secondInvestment: Investment = {
    id: "f604ca03",
    userEmail: newUser.email,
    amount: 100.00,
    period: 6,
    startDate: new Date("2025-03-09").toISOString(), // 09/03/2025
    endDate: new Date("2025-09-09").toISOString()     // 09/09/2025
  };

  InvestmentService.saveInvestment(secondInvestment);

  // TERCEIRO INVESTIMENTO (120.00 - NOVOS PARÂMETROS)
  const thirdInvestment: Investment = {
    id: "12345678",                  // ID novo
    userEmail: newUser.email,
    amount: 100.00,                  // Valor corrigido
    period: 6,
    startDate: new Date("2025-03-09").toISOString(), // 09/03/2025
    endDate: new Date("2025-09-09").toISOString()     // 09/09/2025
  };

  InvestmentService.saveInvestment(thirdInvestment);

  console.log("Usuário Matheus criado com 3 investimentos:", {
    user: newUser,
    investments: [firstInvestment, secondInvestment, thirdInvestment] // Lista atualizada
  });
  }
  }
};


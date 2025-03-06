
import { DB } from "./database/types";
import { UserService } from "./database/UserService";
import { AuthService } from "./database/AuthService";
import { InvestmentService } from "./database/InvestmentService";
import { InitializationService } from "./database/InitializationService";

// Initialize the database
InitializationService.initializeAdminUser();

// Create default clients
InitializationService.initializeDefaultClients();

// Database service implementation
const DatabaseService: DB = {
  // User methods
  getUsers: UserService.getUsers,
  getUser: UserService.getUser,
  getUserByCpf: UserService.getUserByCpf,
  getCurrentUser: UserService.getCurrentUser,
  saveUser: UserService.saveUser,
  updateUser: UserService.updateUser,
  deleteUser: UserService.deleteUser,
  setCurrentUser: UserService.setCurrentUser,
  isAdmin: UserService.isAdmin,
  
  // Auth methods
  getUserPassword: AuthService.getUserPassword,
  savePassword: AuthService.savePassword,
  
  // Investment methods
  getInvestments: InvestmentService.getInvestments,
  getUserInvestments: InvestmentService.getUserInvestments,
  saveInvestment: InvestmentService.saveInvestment,
  deleteInvestment: InvestmentService.deleteInvestment,
  
  // Initialization method
  initializeDefaultClients: InitializationService.initializeDefaultClients
};

export default DatabaseService;

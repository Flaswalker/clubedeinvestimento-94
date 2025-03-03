import { createContext, useContext, useEffect, useState } from "react";
import { User, AuthContextType } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

// Mock database for our demo
const USERS_KEY = "banko-users";
const CURRENT_USER_KEY = "banko-current-user";
const ADMIN_CONFIG_KEY = "banko-admin-config";

// Initialize admin user with custom credentials
const initializeAdminUser = () => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  
  // Check if admin config exists, if not create a default one
  if (!localStorage.getItem(ADMIN_CONFIG_KEY)) {
    const defaultAdminConfig = {
      initialized: false,
      lastModified: new Date().toISOString()
    };
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(defaultAdminConfig));
  }
  
  const adminConfig = JSON.parse(localStorage.getItem(ADMIN_CONFIG_KEY) || "{}");
  
  // Only initialize default admin if no admin exists and admin setup hasn't been completed
  if (!users.some((user: User) => user.isAdmin) && !adminConfig.initialized) {
    // Custom admin credentials - PERSONALIZADAS AQUI
    const adminEmail = "lucasalves.analista@hotmail.com"; // Email personalizado
    const adminPassword = "San!$@&@toS7@"; // Senha personalizada forte
    
    const adminUser = {
      name: "Administrador do Sistema",  // Nome personalizado
      email: adminEmail,
      celular: "(75) 99801-2820",  // Número personalizado
      isAdmin: true,
    };
    
    // Store password hash separately (in a real app, this would be properly hashed)
    const passwordHashes = JSON.parse(localStorage.getItem("banko-passwords") || "{}");
    passwordHashes[adminEmail] = adminPassword;
    
    localStorage.setItem("banko-passwords", JSON.stringify(passwordHashes));
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, adminUser]));
    
    // Log the initial admin credentials to console (in a real app, this would be shown via a secure setup process)
    console.log("CREDENCIAIS INICIAIS DO ADMINISTRADOR - USE PARA O PRIMEIRO LOGIN:");
    console.log("Email:", adminUser.email);
    console.log("Senha:", adminPassword);
    console.log("IMPORTANTE: Altere essas credenciais após o primeiro login!");
    
    // Mark admin as initialized
    adminConfig.initialized = true;
    adminConfig.lastModified = new Date().toISOString();
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(adminConfig));
  }
};

// Function to change admin credentials
const changeAdminCredentials = (email: string, newEmail: string, newName: string, newCelular: string, newPassword: string) => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  const passwordHashes = JSON.parse(localStorage.getItem("banko-passwords") || "{}");
  
  // Find the admin user
  const adminIndex = users.findIndex((user: User) => user.email === email && user.isAdmin);
  
  if (adminIndex !== -1) {
    // Update admin info
    const oldEmail = users[adminIndex].email;
    users[adminIndex].name = newName;
    users[adminIndex].celular = newCelular;
    users[adminIndex].email = newEmail;
    
    // Update password if provided
    if (newPassword && newPassword.trim() !== "") {
      // Remove old password entry
      delete passwordHashes[oldEmail];
      // Add new password entry
      passwordHashes[newEmail] = newPassword;
      localStorage.setItem("banko-passwords", JSON.stringify(passwordHashes));
    } else if (oldEmail !== newEmail) {
      // If email changed but not password, update the key in passwordHashes
      passwordHashes[newEmail] = passwordHashes[oldEmail];
      delete passwordHashes[oldEmail];
      localStorage.setItem("banko-passwords", JSON.stringify(passwordHashes));
    }
    
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    // Update admin config
    const adminConfig = JSON.parse(localStorage.getItem(ADMIN_CONFIG_KEY) || "{}");
    adminConfig.lastModified = new Date().toISOString();
    localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(adminConfig));
    
    return true;
  }
  
  return false;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  changeAdminCredentials: async () => false,
  sendPasswordResetEmail: async () => false,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize admin user
    initializeAdminUser();
    
    // Check if user is logged in
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const passwordHashes = JSON.parse(localStorage.getItem("banko-passwords") || "{}");
      
      const foundUser = users.find((u: User) => u.email === email);
      
      if (!foundUser || passwordHashes[email] !== password) {
        throw new Error("Credenciais inválidas");
      }
      
      setUser(foundUser);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(foundUser));
      
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${foundUser.name}!`,
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no login",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao fazer login",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (user: User, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      
      if (users.some((u: User) => u.email === user.email)) {
        throw new Error("Email já cadastrado");
      }
      
      const newUser = { ...user, isAdmin: false };
      const updatedUsers = [...users, newUser];
      
      // Store user
      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      
      // Store password (in a real app, this would be hashed)
      const passwordHashes = JSON.parse(localStorage.getItem("banko-passwords") || "{}");
      passwordHashes[user.email] = password;
      localStorage.setItem("banko-passwords", JSON.stringify(passwordHashes));
      
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua conta foi criada. Faça login para continuar.",
      });
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: error instanceof Error ? error.message : "Ocorreu um erro no cadastro",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    });
  };

  const handleChangeAdminCredentials = async (
    currentEmail: string, 
    newEmail: string, 
    newName: string, 
    newCelular: string, 
    newPassword: string
  ) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const success = changeAdminCredentials(currentEmail, newEmail, newName, newCelular, newPassword);
      
      if (!success) {
        throw new Error("Não foi possível atualizar as credenciais do administrador");
      }
      
      // If the current user is the admin being modified, update the current user
      if (user && user.email === currentEmail && user.isAdmin) {
        const updatedUser = {
          ...user,
          email: newEmail,
          name: newName,
          celular: newCelular
        };
        setUser(updatedUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      }
      
      toast({
        title: "Credenciais atualizadas",
        description: "As credenciais de administrador foram atualizadas com sucesso.",
      });
      
      return success;
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na atualização",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar as credenciais",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      
      // Check if email exists
      const userExists = users.some((u: User) => u.email === email);
      
      if (!userExists) {
        throw new Error("E-mail não encontrado.");
      }
      
      // In a real app, this would send an actual email
      // For our demo, we'll just log to console and return success
      console.log(`Password reset email sent to ${email}`);
      
      toast({
        title: "Email enviado",
        description: "As instruções de recuperação de senha foram enviadas para seu email.",
      });
      
      return true;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao enviar o email de recuperação",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      changeAdminCredentials: handleChangeAdminCredentials,
      sendPasswordResetEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

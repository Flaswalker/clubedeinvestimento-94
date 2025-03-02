
import { createContext, useContext, useEffect, useState } from "react";
import { User, AuthContextType } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";

// Mock database for our demo
const USERS_KEY = "banko-users";
const CURRENT_USER_KEY = "banko-current-user";

// Initialize admin user if not exists
const initializeAdminUser = () => {
  const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  
  if (!users.some((user: User) => user.isAdmin)) {
    const adminUser = {
      name: "Admin",
      email: "admin@banko.com",
      celular: "999-999-9999",
      isAdmin: true,
    };
    
    // Store password hash separately (in a real app, this would be hashed)
    const passwordHashes = JSON.parse(localStorage.getItem("banko-passwords") || "{}");
    passwordHashes["admin@banko.com"] = "admin123"; // In a real app, this would be hashed
    
    localStorage.setItem("banko-passwords", JSON.stringify(passwordHashes));
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, adminUser]));
  }
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
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

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

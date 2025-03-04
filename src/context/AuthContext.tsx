
import { createContext, useContext, useEffect, useState } from "react";
import { User, AuthContextType, Investment } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import DatabaseService from "@/services/DatabaseService";

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  changeAdminCredentials: async () => false,
  sendPasswordResetEmail: async () => false,
  updateUser: async () => false,
  deleteUser: async () => false,
  getUserPassword: () => null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const storedUser = DatabaseService.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = DatabaseService.getUser(email);
      const storedPassword = DatabaseService.getUserPassword(email);
      
      if (!foundUser || storedPassword !== password) {
        throw new Error("Credenciais inválidas");
      }
      
      setUser(foundUser);
      DatabaseService.setCurrentUser(foundUser);
      
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
      
      const existingUser = DatabaseService.getUser(user.email);
      
      if (existingUser) {
        throw new Error("Email já cadastrado");
      }
      
      const newUser = { ...user, isAdmin: false };
      
      // Store user
      DatabaseService.saveUser(newUser);
      
      // Store password
      DatabaseService.savePassword(user.email, password);
      
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
    DatabaseService.setCurrentUser(null);
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
      
      const adminUser = DatabaseService.getUser(currentEmail);
      
      if (!adminUser || !adminUser.isAdmin) {
        throw new Error("Usuário administrador não encontrado");
      }
      
      // Update admin info
      const success = DatabaseService.updateUser(currentEmail, {
        name: newName,
        email: newEmail,
        celular: newCelular
      });
      
      if (!success) {
        throw new Error("Não foi possível atualizar as credenciais do administrador");
      }
      
      // Update password if provided
      if (newPassword && newPassword.trim() !== "") {
        DatabaseService.savePassword(newEmail, newPassword);
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
        DatabaseService.setCurrentUser(updatedUser);
      }
      
      toast({
        title: "Credenciais atualizadas",
        description: "As credenciais de administrador foram atualizadas com sucesso.",
      });
      
      return true;
      
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
      
      // Check if email exists
      const userExists = DatabaseService.getUser(email);
      
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

  const updateUser = async (email: string, updatedUser: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const success = DatabaseService.updateUser(email, updatedUser);
      
      if (success) {
        toast({
          title: "Conta atualizada",
          description: "Os dados da conta foram atualizados com sucesso.",
        });
      } else {
        throw new Error("Usuário não encontrado");
      }
      
      return success;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na atualização",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar o usuário",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API request delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const success = DatabaseService.deleteUser(email);
      
      if (success) {
        toast({
          title: "Conta excluída",
          description: "A conta foi excluída com sucesso.",
        });
      } else {
        throw new Error("Usuário não encontrado");
      }
      
      return success;
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro na exclusão",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao excluir o usuário",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserPassword = (email: string): string | null => {
    return DatabaseService.getUserPassword(email);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      register, 
      logout,
      changeAdminCredentials: handleChangeAdminCredentials,
      sendPasswordResetEmail,
      updateUser,
      deleteUser,
      getUserPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Investment, User } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminTabContent from "@/components/admin/AdminTabContent";
import DatabaseService from "@/services/DatabaseService";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  useEffect(() => {
    if (user && !isLoading) {
      if (!user.isAdmin) {
        navigate("/dashboard");
        return;
      }
      
      loadInvestments();
      loadClients();
      
      toast({
        title: "Bem-vindo ao painel administrativo",
        description: "Aqui você pode gerenciar investimentos e clientes."
      });
    } else if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate, toast]);
  
  const loadInvestments = async () => {
    setIsLoadingData(true);
    try {
      const allInvestments = await DatabaseService.getInvestments();
      setInvestments(allInvestments);
      console.log("Loaded investments:", allInvestments);
    } catch (error) {
      console.error("Error loading investments:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar investimentos",
        description: "Não foi possível carregar a lista de investimentos."
      });
    } finally {
      setIsLoadingData(false);
    }
  };
  
  const loadClients = async () => {
    setIsLoadingData(true);
    try {
      const allUsers = await DatabaseService.getUsers();
      const clientUsers = allUsers.filter((u: User) => !u.isAdmin);
      setClients(clientUsers);
      console.log("Loaded clients:", clientUsers);
    } catch (error) {
      console.error("Error loading clients:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes."
      });
    } finally {
      setIsLoadingData(false);
    }
  };
  
  const handleInvestmentAdded = () => {
    loadInvestments();
    loadClients(); // Reload clients as well to refresh their investment totals
  };
  
  const handleInvestmentDeleted = () => {
    loadInvestments();
    loadClients(); // Reload clients as well to refresh their investment totals
  };
  
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  useEffect(() => {
    const handleStorageChange = () => {
      loadClients();
      loadInvestments();
    };
    
    const handleInvestmentUpdate = (event: any) => {
      console.log("Investment update detected - triggering data refresh");
      loadClients();
      loadInvestments();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('investment-update', handleInvestmentUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('investment-update', handleInvestmentUpdate);
    };
  }, []);

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando o painel administrativo...</p>
        </div>
      </div>
    );
  }

  // Calculate total invested
  const totalInvested = investments.reduce((total, inv) => total + inv.amount, 0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdminHeader 
            totalInvested={totalInvested} 
            investments={investments.length} 
            clients={clients.length} 
          />
          
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl mb-6 glass-panel">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="investments">Investimentos</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
              <TabsTrigger value="settings">Configurações</TabsTrigger>
            </TabsList>
            
            <AdminTabContent 
              investments={investments}
              clients={clients}
              totalInvested={totalInvested}
              onInvestmentAdded={handleInvestmentAdded}
              onInvestmentDeleted={handleInvestmentDeleted}
            />
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Admin;

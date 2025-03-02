
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

const Admin = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  
  useEffect(() => {
    if (user && !isLoading) {
      if (!user.isAdmin) {
        navigate("/dashboard");
        return;
      }
      
      loadInvestments();
      
      const allUsers = JSON.parse(localStorage.getItem("banko-users") || "[]");
      const clientUsers = allUsers.filter((u: User) => !u.isAdmin);
      setClients(clientUsers);
      
      toast({
        title: "Bem-vindo ao painel administrativo",
        description: "Aqui você pode gerenciar investimentos e clientes."
      });
    } else if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate, toast]);
  
  const loadInvestments = () => {
    const allInvestments = JSON.parse(localStorage.getItem("banko-investments") || "[]");
    setInvestments(allInvestments);
  };
  
  const handleInvestmentAdded = () => {
    loadInvestments();
  };
  
  const handleInvestmentDeleted = () => {
    loadInvestments();
  };
  
  const totalInvested = investments.reduce((total, investment) => total + investment.amount, 0);
  
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-32 px-4">
        <div className="container mx-auto max-w-6xl">
          <AdminHeader 
            totalInvested={totalInvested} 
            investments={investments.length} 
            clients={clients.length} 
          />
          
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="glass-panel">
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

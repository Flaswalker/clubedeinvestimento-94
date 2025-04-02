
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import InvestmentCard from "@/components/dashboard/InvestmentCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Investment } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import DatabaseService from "@/services/DatabaseService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoadingInvestments, setIsLoadingInvestments] = useState(true);

  useEffect(() => {
    // If user is admin, redirect to admin page
    if (user && user.isAdmin) {
      navigate("/admin");
      return;
    }
    
    // If not logged in and not loading, redirect to login
    if (!isLoading && !user) {
      navigate("/login");
      return;
    }
    
    // If user is logged in, load investments
    if (user && !isLoading) {
      loadUserInvestments();
    }
  }, [user, isLoading, navigate]);

  const loadUserInvestments = async () => {
    if (!user) return;
    
    setIsLoadingInvestments(true);
    try {
      const userInvestments = await DatabaseService.getUserInvestments(user.email);
      setInvestments(userInvestments);
    } catch (error) {
      console.error("Error loading investments:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar investimentos",
        description: "Não foi possível carregar seus investimentos. Tente novamente mais tarde."
      });
    } finally {
      setIsLoadingInvestments(false);
    }
  };
  
  useEffect(() => {
    // Listen for investment updates
    const handleInvestmentUpdate = () => {
      console.log("Investment update detected");
      if (user) {
        loadUserInvestments();
      }
    };
    
    window.addEventListener('investment-update', handleInvestmentUpdate);
    window.addEventListener('storage', handleInvestmentUpdate);
    
    return () => {
      window.removeEventListener('investment-update', handleInvestmentUpdate);
      window.removeEventListener('storage', handleInvestmentUpdate);
    };
  }, [user]);

  if (isLoading || isLoadingInvestments) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando suas informações...</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calculate total invested
  const totalInvested = investments.reduce((total, inv) => total + inv.amount, 0);
  
  // Calculate expected return (simple example)
  const calculateTotalReturn = () => {
    return investments.reduce((total, inv) => {
      // 15% annual return for this demo
      const annualRate = 0.15;
      const monthlyRate = annualRate / 6;
      const investmentReturn = inv.amount * Math.pow(1 + monthlyRate, inv.period);
      return total + investmentReturn;
    }, 0);
  };
  
  const totalExpectedReturn = calculateTotalReturn();
  const totalProfit = totalExpectedReturn - totalInvested;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {user && (
            <>
              <div className="mb-8 animate-fade-in">
                <h1 className="text-3xl font-bold mb-2">Olá, {user.name}</h1>
                <p className="text-muted-foreground">
                  Bem-vindo ao seu painel de investimentos.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Total Investido</CardTitle>
                    <CardDescription>Soma de todos os seus investimentos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(totalInvested)}</p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Retorno Esperado</CardTitle>
                    <CardDescription>Valor total esperado no vencimento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(totalExpectedReturn)}</p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Lucro Projetado</CardTitle>
                    <CardDescription>Lucro estimado de todos os investimentos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-500">{formatCurrency(totalProfit)}</p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="mb-8 animate-fade-in">
                <h2 className="text-2xl font-bold mb-6">Seus Investimentos</h2>
                
                {investments.length === 0 ? (
                  <div className="text-center py-12 glass-card rounded-lg">
                    <h3 className="text-xl font-medium mb-2">Nenhum investimento encontrado</h3>
                    <p className="text-muted-foreground mb-6">
                      Você ainda não possui nenhum investimento cadastrado no sistema.
                    </p>
                    <Button onClick={() => navigate("/")}>
                      Conhecer Nossos Planos
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {investments.map((investment) => (
                      <InvestmentCard key={investment.id} investment={investment} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

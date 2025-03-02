
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InvestmentCard from "@/components/dashboard/InvestmentCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Investment, User } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  
  // Load investments for the current user
  useEffect(() => {
    if (user && !isLoading) {
      if (user.isAdmin) {
        // Redirect admin to admin dashboard
        navigate("/admin");
        return;
      }
      
      // Load investments from localStorage
      const allInvestments = JSON.parse(localStorage.getItem("banko-investments") || "[]");
      
      // Filter investments for current user
      const userInvestments = allInvestments.filter(
        (investment: Investment) => investment.userEmail === user.email
      );
      
      setInvestments(userInvestments);
      
      // Show welcome toast
      toast({
        title: "Bem-vindo ao seu painel",
        description: "Aqui você pode visualizar seus investimentos."
      });
    } else if (!isLoading && !user) {
      // If not logged in and not loading, redirect to login
      navigate("/login");
    }
  }, [user, isLoading, navigate, toast]);
  
  // Calculate total investment amount
  const totalInvested = investments.reduce((total, investment) => total + investment.amount, 0);
  
  // Format currency with Brazilian locale
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
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
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">Bem-vindo, {user.name}!</h1>
            <p className="text-muted-foreground">
              Aqui você pode acompanhar seus investimentos e ver o progresso dos seus objetivos financeiros.
            </p>
          </div>
          
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="glass-panel">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-8">
              {/* Overview Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Total Investido</CardTitle>
                    <CardDescription>Valor total dos seus investimentos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(totalInvested)}</p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Investimentos Ativos</CardTitle>
                    <CardDescription>Número de investimentos em andamento</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">{investments.length}</p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Próximo Vencimento</CardTitle>
                    <CardDescription>Data do próximo investimento a vencer</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {investments.length > 0 ? (
                      <p className="text-3xl font-bold text-primary">
                        {new Date(
                          investments.reduce((nearest, inv) => {
                            const invDate = new Date(inv.endDate);
                            const nearestDate = new Date(nearest);
                            return invDate < nearestDate ? inv.endDate : nearest;
                          }, new Date(8640000000000000).toISOString())
                        ).toLocaleDateString('pt-BR')}
                      </p>
                    ) : (
                      <p className="text-3xl font-bold text-muted-foreground">-</p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Investments Cards */}
              <div>
                <h2 className="text-2xl font-bold mb-6">Seus Investimentos</h2>
                
                {investments.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {investments.map((investment) => (
                      <InvestmentCard key={investment.id} investment={investment} />
                    ))}
                  </div>
                ) : (
                  <Card className="glass-card p-8 text-center animate-fade-in">
                    <CardTitle className="mb-4">Nenhum investimento encontrado</CardTitle>
                    <CardDescription>
                      Você ainda não possui investimentos cadastrados. Entre em contato com a administração para iniciar seu primeiro investimento.
                    </CardDescription>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="profile" className="mt-6 animate-fade-in">
              <Card className="glass-card overflow-hidden">
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>Seus dados cadastrais</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Nome Completo</h4>
                      <p className="text-lg font-medium">{user.name}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">E-mail</h4>
                      <p className="text-lg font-medium">{user.email}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Celular</h4>
                      <p className="text-lg font-medium">{user.celular}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

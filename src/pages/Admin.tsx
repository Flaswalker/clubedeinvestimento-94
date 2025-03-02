
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Investment, User } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import InvestmentForm from "@/components/admin/InvestmentForm";
import InvestmentTable from "@/components/admin/InvestmentTable";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [clients, setClients] = useState<User[]>([]);
  
  // Load data
  useEffect(() => {
    if (user && !isLoading) {
      if (!user.isAdmin) {
        // Redirect non-admin to client dashboard
        navigate("/dashboard");
        return;
      }
      
      // Load investments
      loadInvestments();
      
      // Load clients
      const allUsers = JSON.parse(localStorage.getItem("banko-users") || "[]");
      const clientUsers = allUsers.filter((u: User) => !u.isAdmin);
      setClients(clientUsers);
      
      // Show welcome toast
      toast({
        title: "Bem-vindo ao painel administrativo",
        description: "Aqui você pode gerenciar investimentos e clientes."
      });
    } else if (!isLoading && !user) {
      // If not logged in and not loading, redirect to login
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
            <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
            <p className="text-muted-foreground">
              Gerencie investimentos e clientes da plataforma.
            </p>
          </div>
          
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="glass-panel">
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="investments">Investimentos</TabsTrigger>
              <TabsTrigger value="clients">Clientes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-8">
              {/* Overview Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Total Investido</CardTitle>
                    <CardDescription>Valor total de todos os investimentos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(totalInvested)}</p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Investimentos Ativos</CardTitle>
                    <CardDescription>Número total de investimentos</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">{investments.length}</p>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Clientes</CardTitle>
                    <CardDescription>Número total de clientes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-primary">{clients.length}</p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Recent Investments */}
              <Card className="glass-card overflow-hidden animate-fade-in">
                <CardHeader>
                  <CardTitle>Investimentos Recentes</CardTitle>
                  <CardDescription>Últimos investimentos cadastrados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Período</TableHead>
                          <TableHead>Data Inicial</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {investments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                              Nenhum investimento encontrado
                            </TableCell>
                          </TableRow>
                        ) : (
                          investments
                            .slice(0, 5)
                            .map((investment) => (
                              <TableRow key={investment.id} className="transition hover:bg-secondary/20">
                                <TableCell className="font-medium">#{investment.id.substring(0, 8)}</TableCell>
                                <TableCell>{investment.userEmail}</TableCell>
                                <TableCell>{formatCurrency(investment.amount)}</TableCell>
                                <TableCell>{investment.period} meses</TableCell>
                                <TableCell>{new Date(investment.startDate).toLocaleDateString('pt-BR')}</TableCell>
                              </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="investments" className="mt-6 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <InvestmentForm onInvestmentAdded={handleInvestmentAdded} />
                </div>
                
                <div className="lg:col-span-2">
                  <InvestmentTable 
                    investments={investments}
                    onInvestmentDeleted={handleInvestmentDeleted}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="clients" className="mt-6">
              <Card className="glass-card overflow-hidden animate-fade-in">
                <CardHeader>
                  <CardTitle>Lista de Clientes</CardTitle>
                  <CardDescription>Todos os clientes cadastrados na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Celular</TableHead>
                          <TableHead>Investimentos</TableHead>
                          <TableHead>Total Investido</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clients.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                              Nenhum cliente cadastrado
                            </TableCell>
                          </TableRow>
                        ) : (
                          clients.map((client) => {
                            const clientInvestments = investments.filter(
                              inv => inv.userEmail === client.email
                            );
                            const clientTotal = clientInvestments.reduce(
                              (total, inv) => total + inv.amount, 0
                            );
                            
                            return (
                              <TableRow key={client.email} className="transition hover:bg-secondary/20">
                                <TableCell className="font-medium">{client.name}</TableCell>
                                <TableCell>{client.email}</TableCell>
                                <TableCell>{client.celular}</TableCell>
                                <TableCell>{clientInvestments.length}</TableCell>
                                <TableCell>{formatCurrency(clientTotal)}</TableCell>
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
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

export default Admin;

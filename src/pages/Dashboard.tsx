import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InvestmentCard from "@/components/dashboard/InvestmentCard";
import { Investment } from "@/lib/types";
import DatabaseService from "@/services/DatabaseService";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  // Verificamos se os termos já foram aceitos no localStorage
  const [termsAccepted, setTermsAccepted] = useState(() => {
    const savedState = localStorage.getItem(`terms-accepted-${user?.email}`);
    return savedState ? JSON.parse(savedState) : false;
  });

  useEffect(() => {
    if (!user) return;

    const loadInvestments = () => {
      setLoading(true);
      try {
        const userInvestments = DatabaseService.getInvestmentsByUser(user.email);
        setInvestments(userInvestments);
      } catch (error) {
        console.error("Error loading investments:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar investimentos",
          description: "Não foi possível carregar seus investimentos."
        });
      } finally {
        setLoading(false);
      }
    };

    loadInvestments();

    // Storage event handler to update investments
    const handleStorageChange = () => {
      loadInvestments();
    };

    // Add event listener for storage changes
    window.addEventListener('storage', handleStorageChange);

    // Add event listener for custom investment update events
    window.addEventListener('investment-update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('investment-update', handleStorageChange);
    };
  }, [user, toast]);

  const handleAcceptTerms = () => {
    setTermsAccepted(true);
    // Salvamos o estado no localStorage para persistir entre sessões
    localStorage.setItem(`terms-accepted-${user?.email}`, JSON.stringify(true));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Olá, {user.name}!</h1>
              <p className="text-muted-foreground mt-1">
                Bem-vindo ao seu painel de investimentos
              </p>
            </div>
          </div>

          {!termsAccepted && (
            <Alert className="animate-fade-in">
              <AlertTitle>Termos e Condições</AlertTitle>
              <AlertDescription className="mt-2">
                <p className="mb-2">
                  Ao investir em nossa plataforma, você concorda com os termos e condições de serviço.
                  Por favor, leia atentamente e aceite para continuar.
                </p>
                <Button onClick={handleAcceptTerms} className="mt-2">
                  Aceito os Termos
                </Button>
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Seus Investimentos</h2>
            
            {loading ? (
              <div className="py-20 text-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando seus investimentos...</p>
              </div>
            ) : investments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {investments.map((investment) => (
                  <InvestmentCard key={investment.id} investment={investment} />
                ))}
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Nenhum investimento encontrado</CardTitle>
                  <CardDescription>
                    Você ainda não possui nenhum investimento ativo em sua conta.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Entre em contato com nosso suporte para começar a investir.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight">Informações da Conta</h2>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Detalhes Pessoais</CardTitle>
                <CardDescription>
                  Suas informações cadastradas em nossa plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Nome Completo</h4>
                      <p className="font-medium">{user.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">E-mail</h4>
                      <p className="font-medium">{user.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">CPF</h4>
                      <p className="font-medium">{user.cpf || "Não informado"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Celular</h4>
                      <p className="font-medium">{user.celular || "Não informado"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

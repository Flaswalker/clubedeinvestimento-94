import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import InvestmentCard from "@/components/dashboard/InvestmentCard";
import WithdrawalRequestButton from "@/components/dashboard/WithdrawalRequestButton";
import ProposalRequestButton from "@/components/dashboard/ProposalRequestButton";
import PixPayment from "@/components/dashboard/PixPayment";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Investment } from "@/lib/types";
import { useToast } from "@/components/ui/use-toast";
import DatabaseService from "@/services/DatabaseService";
import { CheckCircle, FileCheck, Shield } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading, updateUser } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoadingInvestments, setIsLoadingInvestments] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showPixPayment, setShowPixPayment] = useState(false);

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
    
    // If user is logged in, load investments and check terms status
    if (user && !isLoading) {
      loadUserInvestments();
      
      // Check if user has already accepted terms
      const acceptedTerms = localStorage.getItem(`terms-accepted-${user.email}`);
      if (acceptedTerms === 'true' || user.termsAccepted) {
        setTermsAccepted(true);
      } else {
        setTermsAccepted(false);
      }
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

  const handleTermsAcceptance = async (checked: boolean) => {
    if (!user) return;

    if (checked) {
      try {
        // Update user in database
        const success = await updateUser(user.email, { termsAccepted: true });
        
        if (success) {
          setTermsAccepted(true);
          
          // Store acceptance in localStorage to avoid showing the terms again
          localStorage.setItem(`terms-accepted-${user.email}`, 'true');
          
          toast({
            title: "Termos aceitos",
            description: "Obrigado por aceitar os termos e condições."
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro",
            description: "Não foi possível atualizar os termos aceitos."
          });
        }
      } catch (error) {
        console.error("Error updating terms acceptance:", error);
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Ocorreu um erro ao aceitar os termos."
        });
      }
    }
  };

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

  // Decide whether to show terms section
  const showTermsSection = !termsAccepted;

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
              
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                  <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-6 space-y-8">
                  {showTermsSection && (
                    <Card className="glass-card overflow-hidden">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <FileCheck className="h-5 w-5 mr-2 text-primary" />
                          Termos e Condições
                        </CardTitle>
                        <CardDescription>Por favor, aceite os termos do seu investimento</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="border p-4 rounded-md bg-slate-50/30">
                            <p className="text-sm leading-6">
                              Estou ciente das condições deste investimento, que{" "}
                             <span className="font-bold">conferem</span> um retorno aproximado de 15% no semestre (seis meses). O resgate será após 365 dias contados a partir da data do investimento. O investidor deve entrar no site pelo menos uma vez a cada seis meses para solicitar,{" "}
                              <span className="font-bold">através do envio de PROPOSTA,</span> o reinvestimento do valor para mais seis meses e, assim,{" "}
                              <span className="font-bold">lucrar mais de 30% ao ano.</span> Caso esqueça, o valor será corrigido pelos juros da poupança no ano vigente,{" "}
                              <span className="font-bold">conforme estabelecido pelo Banco Central,</span> calculado de forma proporcional ao tempo de investimento.{" "}
                              <span className="font-bold">Não há taxas adicionais para saque; o valor será creditado exclusivamente na conta do investidor.</span>  O pagamento será efetuado em até 48 horas,{" "}
                              <span className="font-bold"> contadas a partir da solicitação.</span> Declaro a{" "}
                              <span className="font-bold">irrevogabilidade</span> de quaisquer reclamações futuras,{" "}
                              <span className="font-bold">em conformidade</span> com as normas legais aplicáveis.
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 pt-2">
                            <Checkbox 
                              id="terms" 
                              className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500" 
                              onCheckedChange={handleTermsAcceptance} 
                              checked={false}
                            />
                            <Label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                              ACEITO OS TERMOS
                            </Label>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {showTermsSection && (
                    <Card className="glass-card bg-amber-50/20 border-amber-300 animate-pulse">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-xl flex items-center">
                          <Shield className="h-5 w-5 mr-2 text-amber-500" />
                          Termos e Condições Pendentes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-amber-700">
                          Por favor, aceite os termos e condições acima para visualizar seus investimentos.
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {(!showTermsSection) && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-fade-in">
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
                      
                      <div className="flex justify-center space-x-4 mb-6">
                        <WithdrawalRequestButton />
                        <ProposalRequestButton />
                        <Button 
                          onClick={() => setShowPixPayment(!showPixPayment)} 
                          className="bg-green-500 hover:bg-green-600 px-6"
                        >
                          {showPixPayment ? "Ocultar PIX" : "Investimento via PIX"}
                        </Button>
                      </div>
                      
                      {showPixPayment && (
                        <div className="mb-6 animate-fade-in">
                          <PixPayment />
                        </div>
                      )}
                      
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
                </TabsContent>
                
                <TabsContent value="profile" className="mt-6 space-y-8">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle>Informações Pessoais</CardTitle>
                      <CardDescription>Seus dados cadastrados na plataforma</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Nome</Label>
                          <p className="font-medium">{user.name}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Email</Label>
                          <p className="font-medium">{user.email}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">CPF</Label>
                          <p className="font-medium">{user.cpf || 'Não informado'}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Celular</Label>
                          <p className="font-medium">{user.celular || 'Não informado'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;

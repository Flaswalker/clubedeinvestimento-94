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
import DatabaseService from "@/services/DatabaseService";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CheckCircle, FileCheck, Shield } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading, updateUser } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  
  useEffect(() => {
    if (user && !isLoading) {
      if (user.isAdmin) {
        navigate("/admin");
        return;
      }
      
      const userInvestments = DatabaseService.getUserInvestments(user.email);
      setInvestments(userInvestments);
      
      setTermsAccepted(user.termsAccepted || false);
      
      toast({
        title: "Bem-vindo ao seu painel",
        description: "Aqui você pode visualizar seus investimentos."
      });
    } else if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate, toast]);
  
  const handleTermsAcceptance = async () => {
    if (!user) return;
    
    try {
      const updatedUser: User = {
        ...user,
        termsAccepted: true
      };
      
      const success = await updateUser(user.email, updatedUser);
      
      if (success) {
        setTermsAccepted(true);
        
        toast({
          title: "Termos aceitos",
          description: "Obrigado por aceitar os termos do investimento."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar sua aceitação dos termos."
      });
    }
  };
  
  const totalInvested = investments.reduce((total, investment) => total + investment.amount, 0);
  
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
                <p
                className="text-sm leading-6"
                dangerouslySetInnerHTML={{
                    __html: `
                        Estou ciente das condições deste investimento, que
                        <span class="font-bold">conferem</span> um retorno aproximado de 15% no semestre (seis meses). Em caso de resgate antecipado, após o decurso do prazo mínimo de 30 dias,
                        <span class="font-bold">contados a partir da data</span> de aplicação,
                        <span class="font-bold">o pagamento</span> será efetuado em até 48 horas,
                        <span class="font-bold">contadas</span> a partir da solicitação. O montante resgatado
                        <span class="font-bold">coresponderá</span> ao principal aplicado, acrescido de juros equivalentes à taxa média da poupança
                        <span class="font-bold">VIGENTE,</span> conforme estabelecido pelo Banco Central, 
                        <span class="font-bold">calculados</span> de forma proporcional ao tempo de investimento. Não há
                        <span class="font-bold">requisitos</span> ou taxas adicionais. Declaro a irrevogabilidade de quaisquer
                        <span class="font-bold">reclamações futuras,</span> em conformidade com as normas legais aplicáveis.
                    `,
                }}
                />
                </div>
                    {termsAccepted ? (
                      <div className="bg-primary text-primary-foreground p-3 rounded-md flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Declaro ter lido, compreendido e aceito integralmente as condições deste instrumento.</span>
                      </div>
                    ) : (
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
                    )}
                  </div>
                </CardContent>
              </Card>
              
              {!termsAccepted && (
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
              
              {termsAccepted && (
                <>
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
                </>
              )}
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

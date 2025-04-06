
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InvestmentCard from "@/components/dashboard/InvestmentCard";
import TermsAndConditions from "@/components/dashboard/TermsAndConditions";
import { Investment, User } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import DatabaseService from "@/services/DatabaseService";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoadingInvestments, setIsLoadingInvestments] = useState(true);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
    
    if (user) {
      // Check if terms are accepted
      setTermsAccepted(!!user.termsAccepted);
      
      // Load user investments
      const loadInvestments = async () => {
        setIsLoadingInvestments(true);
        try {
          const userInvestments = await DatabaseService.getUserInvestments(user.email);
          setInvestments(userInvestments);
        } catch (error) {
          console.error("Error loading investments", error);
          toast({
            variant: "destructive",
            title: "Erro ao carregar investimentos",
            description: "Não foi possível carregar seus investimentos no momento."
          });
        } finally {
          setIsLoadingInvestments(false);
        }
      };
      
      loadInvestments();
    }
  }, [user, isLoading, navigate, toast]);
  
  const handleAcceptTerms = async () => {
    if (!user) return;
    
    try {
      // Update user profile with terms acceptance
      const updatedUser = {
        ...user,
        termsAccepted: true
      };
      
      const success = await DatabaseService.updateUser(user.email, { termsAccepted: true });
      
      if (success) {
        setTermsAccepted(true);
        toast({
          title: "Termos aceitos",
          description: "Obrigado por aceitar os termos e condições."
        });
      } else {
        throw new Error("Failed to update user");
      }
    } catch (error) {
      console.error("Error accepting terms", error);
      toast({
        variant: "destructive",
        title: "Erro ao aceitar termos",
        description: "Não foi possível registrar a aceitação dos termos no momento."
      });
    }
  };
  
  // Calculate total invested amount
  const totalInvested = investments.reduce((total, investment) => total + investment.amount, 0);
  
  if (isLoading || isLoadingInvestments) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando seu painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow pt-32 pb-20">
        <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!termsAccepted ? (
            <TermsAndConditions onAccept={handleAcceptTerms} />
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">Bem-vindo, {user?.name}!</h1>
                <p className="text-muted-foreground">Veja abaixo seus investimentos e rendimentos.</p>
              </div>
              
              <div className="glass-card p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Investido</h3>
                    <p className="text-3xl font-bold text-primary">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested)}
                    </p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Investimentos Ativos</h3>
                    <p className="text-3xl font-bold text-primary">{investments.length}</p>
                  </div>
                  
                  <div className="glass-panel p-6 rounded-xl">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Rendimento Projetado</h3>
                    <p className="text-3xl font-bold text-primary">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalInvested * 0.12)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">Estimativa anual (12% a.a.)</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Seus Investimentos</h2>
                {investments.length === 0 ? (
                  <div className="glass-card p-8 text-center">
                    <p className="text-muted-foreground mb-4">Você ainda não possui investimentos ativos.</p>
                    <p className="text-sm">Entre em contato com nosso time para começar a investir.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {investments.map((investment) => (
                      <InvestmentCard key={investment.id} investment={investment} />
                    ))}
                  </div>
                )}
              </div>
              
              <div className="glass-card p-6">
                <h2 className="text-2xl font-bold mb-4">Termos e Condições</h2>
                <div className="prose prose-sm max-w-none opacity-75">
                  <TermsAndConditions readOnly={true} />
                </div>
                <div className="mt-4 text-center">
                  <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm">
                    Assinado e aceito em {new Date().toLocaleDateString('pt-BR')}
                  </div>
                </div>
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

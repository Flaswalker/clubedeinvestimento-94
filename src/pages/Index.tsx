
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ArrowRight, BarChart3, ShieldCheck, Wallet } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background/50 z-0"></div>
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6 animate-fade-in">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
                  Investimentos inteligentes para o seu futuro financeiro
                </h1>
                <p className="mt-6 text-lg text-muted-foreground text-balance">
                  Invista com segurança e confiança em uma plataforma que prioriza seus objetivos financeiros. 
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Começar agora
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Acessar conta
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 animate-fade-in">
              <div className="glass-card rounded-2xl overflow-hidden w-full aspect-square md:aspect-video relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-background/0"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-8 text-center">
                    <BarChart3 className="h-16 w-16 mx-auto mb-6 text-primary" />
                    <h3 className="text-2xl font-bold mb-4">Crescimento sustentável</h3>
                    <p className="text-muted-foreground">Nossa plataforma oferece investimentos com desempenho consistente ao longo do tempo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            <div className="glass-card p-6 rounded-xl animate-fade-in">
              <h3 className="text-3xl font-bold">+5000</h3>
              <p className="text-muted-foreground">Clientes satisfeitos</p>
            </div>
            <div className="glass-card p-6 rounded-xl animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-3xl font-bold">R$ 100M+</h3>
              <p className="text-muted-foreground">Em investimentos</p>
            </div>
            <div className="glass-card p-6 rounded-xl animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <h3 className="text-3xl font-bold">95%</h3>
              <p className="text-muted-foreground">Taxa de retenção</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="services" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nossos Serviços</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Oferecemos soluções financeiras completas para ajudar você a atingir seus objetivos.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-8 rounded-xl transition hover:-translate-y-1 hover:shadow-lg animate-fade-in">
              <ShieldCheck className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-2">Segurança garantida</h3>
              <p className="text-muted-foreground mb-4">
                Proteção DDoS, certificados SSL e políticas rígidas de segurança para proteger seus dados e investimentos.
              </p>
              <Link to="/register" className="text-primary hover:underline inline-flex items-center">
                Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="glass-card p-8 rounded-xl transition hover:-translate-y-1 hover:shadow-lg animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <BarChart3 className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-2">Investimentos personalizados</h3>
              <p className="text-muted-foreground mb-4">
                Planos de investimento adaptados ao seu perfil e objetivos financeiros, com acompanhamento contínuo.
              </p>
              <Link to="/register" className="text-primary hover:underline inline-flex items-center">
                Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="glass-card p-8 rounded-xl transition hover:-translate-y-1 hover:shadow-lg animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <Wallet className="h-12 w-12 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-2">Gestão transparente</h3>
              <p className="text-muted-foreground mb-4">
                Acesso em tempo real a informações sobre seus investimentos, com relatórios detalhados e atualizados.
              </p>
              <Link to="/register" className="text-primary hover:underline inline-flex items-center">
                Saiba mais <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section id="about" className="py-20 px-4 bg-gradient-to-b from-background to-secondary/10">
        <div className="container mx-auto">
          <div className="glass-card p-8 md:p-12 rounded-2xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-background/0"></div>
            <div className="relative z-10">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para começar a investir?</h2>
                <p className="text-muted-foreground mb-8">
                  Junte-se a milhares de investidores que já estão construindo seu futuro financeiro com a Banko.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/register">
                    <Button size="lg" className="w-full sm:w-auto">
                      Criar uma conta
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Acessar conta
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Entre em Contato</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Estamos aqui para ajudar. Entre em contato conosco para saber mais sobre nossos serviços.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Informações de Contato</h3>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Email: contato@banko.com.br</p>
                    <p className="text-muted-foreground">Telefone: (11) 9999-9999</p>
                    <p className="text-muted-foreground">Endereço: Av. Paulista, 1000 - São Paulo, SP</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Horário de Atendimento</h3>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">Segunda a Sexta: 9h às 18h</p>
                    <p className="text-muted-foreground">Sábado: 9h às 13h</p>
                    <p className="text-muted-foreground">Domingo: Fechado</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;


import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { initRecaptchaScript } from "@/utils/recaptchaUtils";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // Se já estiver logado, redirecionar para o dashboard apropriado
    if (user) {
      navigate(user.isAdmin ? "/admin" : "/dashboard");
    }
    
    // Adicionar script reCAPTCHA
    const cleanup = initRecaptchaScript();
    
    return cleanup;
  }, [user, navigate]);
  
  const handleSuccess = () => {
    // Exibir toast de sucesso
    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Faça login com suas credenciais para acessar sua conta."
    });
    
    // Redirecionar para login após registro bem-sucedido
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-32">
        <div className="w-full max-w-md">
          <AuthForm type="register" onSuccess={handleSuccess} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;

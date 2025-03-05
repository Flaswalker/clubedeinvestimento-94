
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // If already logged in, redirect to appropriate dashboard
    if (user) {
      navigate(user.isAdmin ? "/admin" : "/dashboard");
    }
    
    // Add reCAPTCHA script
    const script = document.createElement("script");
    script.src = "https://www.google.com/recaptcha/api.js";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    
    return () => {
      // Clean up script on component unmount
      document.head.removeChild(script);
    };
  }, [user, navigate]);
  
  const handleSuccess = () => {
    // Show success toast
    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Faça login com suas credenciais para acessar sua conta."
    });
    
    // Redirect to login after successful registration
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

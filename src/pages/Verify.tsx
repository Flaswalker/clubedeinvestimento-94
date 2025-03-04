
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { verifyEmail, resendVerificationCode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!email) {
      navigate("/login");
      toast({
        variant: "destructive",
        title: "E-mail não fornecido",
        description: "Não foi possível verificar seu e-mail. Por favor, tente novamente.",
      });
    }
  }, [email, navigate, toast]);
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await verifyEmail(email, code);
      
      if (success) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResend = async () => {
    setIsResending(true);
    
    try {
      await resendVerificationCode(email);
    } catch (error) {
      console.error("Resend error:", error);
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center px-4 py-32">
        <Card className="glass-card w-full max-w-md mx-auto animate-scale-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Verificação de E-mail
            </CardTitle>
            <CardDescription>
              Digite o código de verificação que foi enviado para {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Código de Verificação</Label>
                <Input
                  id="code"
                  placeholder="Digite o código de 6 dígitos"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="glass-input"
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-6" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verificando...
                  </span>
                ) : "Verificar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col space-y-4">
            <div className="text-sm text-center">
              Não recebeu o código?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="text-primary hover:underline"
              >
                {isResending ? "Reenviando..." : "Reenviar"}
              </button>
            </div>
            <div className="text-sm text-center">
              <a href="/login" className="text-primary hover:underline">
                Voltar para o login
              </a>
            </div>
          </CardFooter>
        </Card>
      </main>
      
      <Footer />
    </div>
  );
};

export default Verify;

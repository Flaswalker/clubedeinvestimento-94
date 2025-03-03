
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem("banko-users") || "[]");
      
      // Check if email exists
      const userExists = users.some((user: any) => user.email === email);
      
      if (!userExists) {
        throw new Error("E-mail não encontrado.");
      }
      
      // Simulate sending email (in a real app, this would call an API)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message
      setIsSuccess(true);
      
      toast({
        title: "Email enviado",
        description: "As instruções de recuperação de senha foram enviadas para seu email.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar sua solicitação",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card w-full max-w-md mx-auto animate-scale-in">
      <CardHeader>
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-2 p-1 rounded-full hover:bg-muted/50"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <CardTitle className="text-xl font-bold">
              Recuperação de senha
            </CardTitle>
            <CardDescription>
              Digite seu e-mail para receber as instruções de recuperação
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recovery-email">E-mail</Label>
              <Input
                id="recovery-email"
                type="email"
                placeholder="seu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input"
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
                  Processando...
                </span>
              ) : "Enviar instruções"}
            </Button>
          </form>
        ) : (
          <div className="text-center py-6">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-4">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-foreground">Email enviado</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Enviamos as instruções de recuperação de senha para {email}. 
              Por favor, verifique sua caixa de entrada e spam.
            </p>
            <Button 
              onClick={onBack} 
              variant="outline" 
              className="mt-6"
            >
              Voltar ao login
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          Lembrou sua senha?{" "}
          <button 
            onClick={onBack}
            className="text-primary hover:underline"
          >
            Voltar ao login
          </button>
        </p>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;

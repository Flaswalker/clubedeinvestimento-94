
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ReCAPTCHA from "react-google-recaptcha";

interface AuthFormProps {
  type: "login" | "register";
  onSuccess: (email: string) => void;
}

const AuthForm = ({ type, onSuccess }: AuthFormProps) => {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    celular: "",
    cpf: "",
    investmentAmount: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Formatação específica para o campo CPF
    if (name === "cpf") {
      // Remove todos os caracteres não numéricos
      let cpfValue = value.replace(/\D/g, '');
      
      // Aplica a máscara de CPF (xxx.xxx.xxx-xx)
      if (cpfValue.length <= 11) {
        cpfValue = cpfValue.replace(/(\d{3})(\d)/, '$1.$2');
        cpfValue = cpfValue.replace(/(\d{3})(\d)/, '$1.$2');
        cpfValue = cpfValue.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      }
      
      setFormData(prev => ({ ...prev, [name]: cpfValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  const validateCaptcha = async (captchaToken: string | null) => {
    if (!captchaToken) return false;
    
    try {
      // Since we can't use PHP on the client side, we'll validate the token using a client-side approach
      // This is a simplified validation for demonstration purposes
      // In a real app, you'd send this token to your backend for validation with Google's API
      return true;
    } catch (error) {
      console.error("reCAPTCHA validation error:", error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    try {
      if (type === "register") {
        // Validate captcha for registration
        if (!captchaValue) {
          throw new Error("Por favor, confirme que você não é um robô completando o reCAPTCHA.");
        }
        
        const isCaptchaValid = await validateCaptcha(captchaValue);
        if (!isCaptchaValid) {
          throw new Error("Verificação do reCAPTCHA falhou. Por favor, tente novamente.");
        }
        
        // Validação do CPF
        if (!formData.cpf || formData.cpf.replace(/\D/g, '').length !== 11) {
          throw new Error("CPF inválido. Digite um CPF válido com 11 dígitos.");
        }
        
        await register(
          {
            name: formData.name,
            email: formData.email,
            celular: formData.celular,
            cpf: formData.cpf
          },
          formData.password
        );
      } else {
        // No captcha required for login
        await login(formData.email, formData.password);
      }
      onSuccess(formData.email);
    } catch (error) {
      console.error("Auth error:", error);
      setErrorMessage(error instanceof Error ? error.message : "Ocorreu um erro durante a autenticação");
      // Reset captcha on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <Card className="glass-card w-full max-w-md mx-auto animate-scale-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          {type === "login" ? "Entrar na sua conta" : "Criar uma nova conta"}
        </CardTitle>
        <CardDescription>
          {type === "login"
            ? "Entre com seu email e senha para acessar sua conta"
            : "Preencha os campos abaixo para criar sua conta"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-md text-destructive text-sm">
              {errorMessage}
            </div>
          )}
          
          {type === "register" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Seu nome completo"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  placeholder="000.000.000-00"
                  required
                  value={formData.cpf}
                  onChange={handleChange}
                  className="glass-input"
                  maxLength={14}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  name="celular"
                  placeholder="(00) 00000-0000"
                  required
                  value={formData.celular}
                  onChange={handleChange}
                  className="glass-input"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investmentAmount">Valor que pretende investir (R$)</Label>
                <Input
                  id="investmentAmount"
                  name="investmentAmount"
                  type="number"
                  placeholder="0.00"
                  required
                  value={formData.investmentAmount}
                  onChange={handleChange}
                  className="glass-input"
                />
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="glass-input"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={formData.password}
                onChange={handleChange}
                className="glass-input pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
              </button>
            </div>
          </div>
          
          {type === "login" && (
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
                onClick={() => setShowForgotPassword(true)}
              >
                Esqueci minha senha
              </button>
            </div>
          )}
          
          {type === "register" && (
            <div className="mt-4">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LcEW-oqAAAAAC2lk7BRcQnzynka1B00DgE6D3si"
                onChange={handleCaptchaChange}
              />
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={isLoading || (type === "register" && !captchaValue)}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processando...
              </span>
            ) : type === "login" ? "Entrar" : "Cadastrar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        {type === "login" ? (
          <p className="text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <a href="/register" className="text-primary hover:underline">
              Cadastre-se
            </a>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <a href="/login" className="text-primary hover:underline">
              Faça login
            </a>
          </p>
        )}
      </CardFooter>
    </Card>
  );
};

export default AuthForm;

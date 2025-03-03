
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import ForgotPasswordForm from "./ForgotPasswordForm";

interface AuthFormProps {
  type: "login" | "register";
  onSuccess: () => void;
}

const AuthForm = ({ type, onSuccess }: AuthFormProps) => {
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    celular: "",
    investmentAmount: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (type === "login") {
        await login(formData.email, formData.password);
      } else {
        await register(
          {
            name: formData.name,
            email: formData.email,
            celular: formData.celular,
          },
          formData.password
        );
      }
      onSuccess();
    } catch (error) {
      console.error("Auth error:", error);
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


import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";

const AdminSettingsForm = () => {
  const { user, changeAdminCredentials } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    celular: user?.celular || "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormSuccess(false);
    
    try {
      const success = await changeAdminCredentials(
        user?.email || "",
        formData.email,
        formData.name,
        formData.celular,
        formData.password
      );
      
      if (success) {
        setFormSuccess(true);
        setFormData(prev => ({ ...prev, password: "" }));
      }
    } catch (error) {
      console.error("Erro ao atualizar configurações do administrador:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (!user?.isAdmin) {
    return null;
  }

  return (
    <Card className="glass-card w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          Configurações de Administrador
        </CardTitle>
        <CardDescription>
          Atualize suas informações de administrador e senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label htmlFor="password">Nova Senha (deixe em branco para manter a atual)</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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
            <p className="text-xs text-muted-foreground mt-1">
              A senha deve conter pelo menos 8 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos para maior segurança.
            </p>
          </div>
          
          {formSuccess && (
            <div className="text-green-500 text-sm font-medium my-2">
              Informações atualizadas com sucesso!
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
                Atualizando...
              </span>
            ) : "Atualizar Informações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminSettingsForm;

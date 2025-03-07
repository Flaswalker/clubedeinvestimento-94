
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { InvestmentFormData, User } from "@/lib/types";
import DatabaseService from "@/services/DatabaseService";

interface InvestmentFormProps {
  onInvestmentAdded: () => void;
}

const InvestmentForm = ({ onInvestmentAdded }: InvestmentFormProps) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<InvestmentFormData>({
    userEmail: "",
    amount: 0,
    period: 6, // Default to 6 months
  });

  useEffect(() => {
    // Load users from DatabaseService
    const loadUsers = () => {
      try {
        const loadedUsers = DatabaseService.getUsers();
        // Filter out admin users
        const clientUsers = loadedUsers.filter((user: User) => !user.isAdmin);
        setUsers(clientUsers);
      } catch (error) {
        console.error("Error loading users:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar clientes",
          description: "Não foi possível carregar a lista de clientes."
        });
      }
    };
    
    loadUsers();
    
    // Add event listener for storage changes to refresh user list
    window.addEventListener('storage', loadUsers);
    
    return () => {
      window.removeEventListener('storage', loadUsers);
    };
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "amount" || name === "period" ? Number(value) : value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      userEmail: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.userEmail) {
        throw new Error("Selecione um cliente");
      }
      
      if (formData.amount <= 0) {
        throw new Error("O valor do investimento deve ser maior que zero");
      }
      
      if (formData.period <= 0) {
        throw new Error("O período do investimento deve ser maior que zero");
      }

      // Generate investment with dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + formData.period);

      // Create a new investment
      const newInvestment = {
        id: crypto.randomUUID(),
        userEmail: formData.userEmail,
        amount: formData.amount,
        period: formData.period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      };

      // Store using DatabaseService
      DatabaseService.saveInvestment(newInvestment);

      // Trigger event for data sync
      const updateEvent = new CustomEvent('investment-update', { 
        detail: { 
          type: 'add',
          investment: newInvestment
        } 
      });
      window.dispatchEvent(updateEvent);

      // Show success toast
      toast({
        title: "Investimento adicionado",
        description: `Investimento de R$ ${formData.amount.toFixed(2)} adicionado para o cliente.`
      });

      // Reset form
      setFormData({
        userEmail: "",
        amount: 0,
        period: 6
      });

      // Notify parent component
      onInvestmentAdded();
      
      console.log("Investment added successfully:", newInvestment);
    } catch (error) {
      console.error("Error adding investment:", error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar investimento",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao adicionar o investimento"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle>Adicionar Novo Investimento</CardTitle>
        <CardDescription>Cadastre um novo investimento para um cliente</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userEmail">Cliente</Label>
            <Select
              value={formData.userEmail}
              onValueChange={handleSelectChange}
            >
              <SelectTrigger id="userEmail" className="glass-input w-full">
                <SelectValue placeholder="Selecionar cliente" />
              </SelectTrigger>
              <SelectContent position="popper" className="bg-background/95 backdrop-blur-sm border border-border">
                {users.length > 0 ? (
                  users.map((user) => (
                    <SelectItem key={user.email} value={user.email}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-users" disabled>
                    Nenhum cliente cadastrado
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor do Investimento (R$)</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.amount || ""}
              onChange={handleChange}
              className="glass-input"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Período (meses)</Label>
            <Input
              id="period"
              name="period"
              type="number"
              min="1"
              max="60"
              placeholder="12"
              value={formData.period || ""}
              onChange={handleChange}
              className="glass-input"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
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
            ) : "Adicionar Investimento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default InvestmentForm;

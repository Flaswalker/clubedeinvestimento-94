
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import DatabaseService from "@/services/DatabaseService";
import { CreditCard } from "lucide-react";

const WithdrawalRequestButton = () => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and one decimal point
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
      setAmount(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para solicitar um saque."
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, informe um valor válido para saque."
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const success = await DatabaseService.requestWithdrawal(
        user.email,
        parseFloat(amount)
      );
      
      if (success) {
        toast({
          title: "Solicitação enviada",
          description: `Sua solicitação de saque de R$ ${parseFloat(amount).toFixed(2)} foi enviada com sucesso.`
        });
        setOpen(false);
        setAmount("");
      } else {
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Não foi possível processar sua solicitação. Tente novamente."
        });
      }
    } catch (error) {
      console.error("Error requesting withdrawal:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex justify-center items-center gap-2">
          <CreditCard className="h-4 w-4" />
          Solicitar Saque
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Solicitar Saque</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor do Saque (R$)</Label>
            <Input
              id="amount"
              type="text"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              required
              disabled={loading}
            />
            <p className="text-sm text-muted-foreground">
              Informe o valor que deseja sacar de sua conta.
            </p>
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading || !amount || parseFloat(amount) <= 0}
            >
              {loading ? "Processando..." : "Solicitar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalRequestButton;

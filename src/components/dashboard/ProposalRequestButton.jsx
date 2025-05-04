import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { FileText } from "lucide-react";

const ProposalRequestButton = () => {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        description: "Você precisa estar logado para enviar uma proposta."
      });
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, informe um valor válido para investimento."
      });
      return;
    }

    if (!period) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione um prazo para o investimento."
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('proposta')
        .insert([
          {
            email: user.email,
            celular: user.celular || "",
            valor_investir: parseFloat(amount),
            prazo: period,
            data_registro: new Date().toISOString(),
            status: 'pendente'
          }
        ])
        .select();
      
      if (error) throw error;
      
      if (data) {
        toast({
          title: "Proposta enviada",
          description: `Sua proposta de investimento de R$ ${parseFloat(amount).toFixed(2)} foi enviada com sucesso.`
        });
        setOpen(false);
        setAmount("");
        setPeriod("");
      }
    } catch (error: any) {
      console.error("Error sending proposal:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message || "Ocorreu um erro ao enviar sua proposta. Tente novamente."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-[calc(100%-16px)] md:w-[calc(100%-48px)] flex justify-center items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Enviar Proposta
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar Proposta de Investimento</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Valor a Investir (R$)</Label>
            <Input
              id="amount"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={handleAmountChange}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="period">Prazo de Investimento</Label>
            <Select 
              value={period} 
              onValueChange={setPeriod}
              disabled={loading}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione o prazo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6 meses">6 meses</SelectItem>
                <SelectItem value="12 meses">12 meses</SelectItem>
                <SelectItem value="18 meses">18 meses</SelectItem>
                <SelectItem value="24 meses">24 meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">
            Ao enviar esta proposta, você concorda com os termos e condições de investimento.
          </p>
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={loading || !amount || parseFloat(amount) <= 0 || !period}
              aria-disabled={loading}
            >
              {loading ? "Processando..." : "Enviar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProposalRequestButton;

// src/components/dashboard/WithdrawalRequestButton.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast'; // Opcional

export default function WithdrawalRequestButton() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState<number>(100.01); // Valor inicial já válido
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação FRENTE + BACKEND (dupla camada)
    if (amount <= 100) {
      toast({
        title: "Valor inválido",
        description: "O valor mínimo para saque é R$ 100,01.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('SolicitarSaque')
        .insert({ 
          email, 
          valor: amount 
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Saque solicitado com sucesso.",
      });

      // Reset
      setEmail('');
      setAmount(100.01);
    } catch (error) {
      toast({
        title: "Erro no servidor",
        description: error.message.includes("check constraint") 
          ? "Valor inválido: mínimo R$ 100,01" 
          : error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <h3 className="font-semibold text-lg">Solicitar Saque</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Valor (R$)
          </label>
          <input
            type="number"
            min="100.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-2 border rounded-md"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Mínimo: R$ 100,01
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || amount <= 100}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
        >
          {isLoading ? "Enviando..." : "Solicitar"}
        </button>
      </form>
    </div>
  );
}

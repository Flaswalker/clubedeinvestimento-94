// src/components/dashboard/WithdrawalRequestButton.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast'; // Opcional: Se você usa shadcn/ui ou similar

export default function WithdrawalRequestButton() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState<number>(100);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); // Opcional: Para feedback visual elegante

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação rápida
    if (amount < 100) {
      toast({ title: "Valor mínimo: R$ 100,00", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('SolicitarSaque')
        .insert({ 
          email, 
          valor: amount 
        })
        .select();

      if (error) throw error;

      // Feedback de sucesso
      toast({
        title: "Saque solicitado!",
        description: "Seu pedido foi registrado com sucesso.",
      });

      // Reset do formulário
      setEmail('');
      setAmount(100);
    } catch (error) {
      toast({
        title: "Erro ao solicitar saque",
        description: error.message,
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
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Valor (R$)
          </label>
          <input
            id="amount"
            type="number"
            min="100"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Enviando...' : 'Solicitar Saque'}
        </button>
      </form>
    </div>
  );
}

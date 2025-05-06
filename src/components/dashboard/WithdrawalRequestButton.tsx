// src/components/dashboard/WithdrawalRequestButton.tsx

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast'; // Opcional

export default function WithdrawalRequestButton() {
  const [email, setEmail] = useState('');
  const [amount, setAmount] = useState<number>(100.01); // Valor inicial já válido
  const [pix, setPix] = useState(''); // Added PIX state
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

    if (!pix) {
      toast({
        title: "PIX necessário",
        description: "Por favor, informe sua chave PIX para o saque.",
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
          valor: amount,
          pix // Added PIX field
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Saque solicitado com sucesso.",
      });

      // Reset
      setEmail('');
      setAmount(100.01);
      setPix(''); // Reset PIX field
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
    <div className="space-y-4 p-4 border border-green-600 rounded-lg bg-green-600/10"> {/* Borda verde e fundo verde claro */}
      <h3 className="font-semibold text-lg text-white">Solicitar Saque</h3> {/* Texto branco */}
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
            className="w-fit p-2 border rounded-md text-blue-800 font-medium"
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
            className="w-fit p-2 border rounded-md"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Mínimo: R$ 100,01
          </p>
        </div>

        <div>
          <label htmlFor="pix" className="block text-sm font-medium mb-1">
            Chave PIX
          </label>
          <input
            type="text"
            value={pix}
            onChange={(e) => setPix(e.target.value)}
            placeholder="CPF, e-mail, telefone ou chave aleatória"
            className="w-fit p-2 border rounded-md"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Informe a chave PIX para recebimento
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || amount <= 100 || !pix}
          className="w-fit py-2 px-4 bg-green-600 text-white rounded-md disabled:bg-gray-400"
        >
          {isLoading ? "Enviando..." : "Solicitar"}
        </button>
      </form>
    </div>
  );
}

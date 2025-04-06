import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const PixPayment = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(100.00);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pixData, setPixData] = useState<{
    qr_code: string;
    qr_code_base64: string;
    transaction_id?: string;
  } | null>(null);

  const MINIMUM_AMOUNT = 100;

// ... (código existente permanece igual até o handleGeneratePix)

  const handleGeneratePix = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "É necessário estar logado",
        description: "Faça login para continuar com o pagamento"
      });
      return;
    }

    if (amount < MINIMUM_AMOUNT) {
      toast({
        variant: "destructive",
        title: "Valor mínimo não atingido",
        description: `O valor mínimo para investimento é R$ ${MINIMUM_AMOUNT},00`
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // 1. Obter sessão ATUALIZADA (com verificação de erro)
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error("Falha ao verificar sessão");
      }

      // 2. Verificar validade do token
      const now = Math.floor(Date.now() / 1000);
      if (session.expires_at && now >= session.expires_at) {
        throw new Error("Sessão expirada");
      }

      // 3. Chamada para a Edge Function com tratamento melhorado
      const { data, error } = await supabase.functions.invoke("create-pix", {
        body: {
          amount,
          email: user.email,
          cpf: user.cpf?.replace(/\D/g, '') || "00000000000",
        },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      // 4. Tratamento específico para erros 401
      if (error) {
        if (error.message.includes("401")) {
          await supabase.auth.signOut();
          throw new Error("Sessão expirada. Faça login novamente.");
        }
        throw error;
      }

      if (!data?.qr_code) {
        throw new Error("Resposta inválida da API");
      }

      // 5. Salvamento da transação (código existente)
      const { error: dbError } = await supabase
        .from('pix_transactions')
        .insert([{
          user_id: user.id,
          email: user.email,
          amount,
          status: 'pending',
          transaction_id: data.transaction_id,
          qr_code: data.qr_code,
          qr_code_image: data.qr_code_base64,
          expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }]);

      if (dbError) throw dbError;

      setPixData(data);
      toast({
        title: "PIX gerado com sucesso",
        description: "Escaneie o QR code para finalizar o pagamento"
      });

    } catch (error) {
      console.error("Erro detalhado:", error);
      
      // Mensagens customizadas por tipo de erro
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro ao processar solicitação";
      
      toast({
        variant: "destructive",
        title: "Erro ao gerar PIX",
        description: errorMessage.includes("Sessão") 
          ? "Sua sessão expirou. Por favor, faça login novamente."
          : errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

// ... (o restante do código existente permanece EXATAMENTE IGUAL)

  return (
    <Card className="glass-card w-full">
      <CardHeader>
        <CardTitle>Pagamento via PIX</CardTitle>
        <CardDescription>
          Investimento mínimo: R$ {MINIMUM_AMOUNT},00
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Valor do Investimento (R$)
          </label>
          <Input
            id="amount"
            type="number"
            min={MINIMUM_AMOUNT}
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            className="glass-input"
            placeholder={`${MINIMUM_AMOUNT},00`}
          />
          <p className="text-xs text-muted-foreground">
            Valor mínimo: R$ {MINIMUM_AMOUNT},00
          </p>
        </div>

        <Button 
          onClick={handleGeneratePix} 
          className="w-full bg-green-500 hover:bg-green-600" 
          disabled={isLoading || amount < MINIMUM_AMOUNT}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Gerando PIX...
            </span>
          ) : "Gerar PIX para Investimento"}
        </Button>

        {pixData && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-medium mb-2">Escaneie o QR Code</h3>
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <img
                src={`data:image/png;base64,${pixData.qr_code_base64}`}
                alt="QR Code PIX"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Código PIX Copia e Cola:</p>
              <div className="relative">
                <textarea
                  value={pixData.qr_code}
                  readOnly
                  className="w-full h-20 p-2 glass-input text-xs"
                  onClick={(e) => {
                    (e.target as HTMLTextAreaElement).select();
                    navigator.clipboard.writeText(pixData.qr_code);
                    toast({
                      title: "Código copiado!",
                      description: "O código PIX foi copiado para a área de transferência"
                    });
                  }}
                />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  Clique para copiar
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PixPayment;

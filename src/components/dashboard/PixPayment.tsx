import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

const PixPayment = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [amount, setAmount] = useState<number>(100.00);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pixData, setPixData] = useState<{
    qr_code: string;
    qr_code_base64?: string;
    transaction_id?: string;
  } | null>(null);

  const MINIMUM_AMOUNT = 100;

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
      
      // Chamada para a Netlify Function
      const response = await fetch('/.netlify/functions/generatePixQr', {
        method: 'POST',
        body: JSON.stringify({ 
          cpf: user.cpf?.replace(/\D/g, '') || "00000000000",
          valor: amount.toFixed(2)
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar QR Code');
      }

      const data = await response.json();

      if (!data?.qr_code) {
        throw new Error("Resposta inválida da API");
      }

      setPixData({
        qr_code: data.qr_code,
        qr_code_base64: data.qr_code_base64
      });

      toast({
        title: "PIX gerado com sucesso",
        description: "Escaneie o QR code para finalizar o pagamento"
      });

    } catch (error) {
      console.error("Erro detalhado:", error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Erro ao processar solicitação";
      
      toast({
        variant: "destructive",
        title: "Erro ao gerar PIX",
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando PIX...
            </>
          ) : "Gerar PIX para Investimento"}
        </Button>

        {pixData && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-medium mb-2">Escaneie o QR Code</h3>
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pixData.qr_code}`}
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

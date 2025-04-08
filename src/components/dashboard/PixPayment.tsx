
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
  const [amount, setAmount] = useState<string>("100.00"); // Alterado para string
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pixData, setPixData] = useState<{
    qr_code: string;
    qr_code_base64?: string;
  } | null>(null);

  const MINIMUM_AMOUNT = 100;

  const handleGeneratePix = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Faça login para continuar"
      });
      return;
    }

    // Convertendo e validando o valor
    const numericAmount = parseFloat(amount.replace(",", "."));
    if (isNaN(numericAmount) || numericAmount < MINIMUM_AMOUNT) {
      toast({
        variant: "destructive",
        title: "Valor inválido",
        description: `O valor mínimo é R$ ${MINIMUM_AMOUNT},00`
      });
      return;
    }

    setIsLoading(true);
    setPixData(null); // Resetar dados anteriores

    try {
      const response = await fetch('/.netlify/functions/generatePixQr', {
        method: 'POST',
        body: JSON.stringify({ 
          cpf: user.cpf?.replace(/\D/g, '') || "",
          valor: numericAmount.toFixed(2)
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.qr_code) {
        throw new Error("QR Code não foi gerado");
      }

      setPixData({
        qr_code: data.qr_code,
        qr_code_base64: data.qr_code_base64
      });

    } catch (error) {
      console.error("Falha ao gerar PIX:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: error instanceof Error ? error.message : "Tente novamente mais tarde"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Formatador de valor monetário
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    value = (Number(value) / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    setAmount(value);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Investir com PIX</CardTitle>
        <CardDescription>
          Valor mínimo: R$ {MINIMUM_AMOUNT.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="amount">Valor (R$)</Label>
          <Input
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            placeholder="100,00"
            className="text-lg font-medium"
          />
        </div>

        <Button
          onClick={handleGeneratePix}
          disabled={isLoading || parseFloat(amount.replace(",", ".")) < MINIMUM_AMOUNT}
          className="w-full py-6 text-lg bg-green-600 hover:bg-green-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Gerando...
            </>
          ) : "Gerar QR Code PIX"}
        </Button>

        {pixData && (
          <div className="animate-fade-in">
            <div className="mt-6 p-4 bg-white rounded-lg">
              <img
                src={pixData.qr_code_base64 
                  ? `data:image/png;base64,${pixData.qr_code_base64}`
                  : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixData.qr_code)}`
                }
                alt="QR Code PIX"
                className="w-full max-w-xs mx-auto"
              />
            </div>
            
            <div className="mt-4 space-y-2">
              <Label>Código PIX:</Label>
              <div
                className="p-3 bg-gray-100 rounded-md text-sm font-mono cursor-pointer hover:bg-gray-200 transition"
                onClick={() => {
                  navigator.clipboard.writeText(pixData.qr_code);
                  toast({ title: "Código copiado!" });
                }}
              >
                {pixData.qr_code}
              </div>
              <p className="text-xs text-muted-foreground">Clique para copiar</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PixPayment;

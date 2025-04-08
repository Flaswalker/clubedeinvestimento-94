import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

// Mapeamento de valores para payloads PIX
const PIX_OPTIONS = [
  { value: 100, payload: "00020126330014BR.GOV.BCB.PIX0111448990765685204000053039865406100.005802BR5911LUCAS ALVES6010ENTRE RIOS62200516INVISTAEGANHE10063042E18" },
  { value: 200, payload: "00020126330014BR.GOV.BCB.PIX0111448990765685204000053039865406200.005802BR5911LUCAS ALVES6010ENTRE RIOS62200516INVISTAEGANHE200630456B1" },
  { value: 300, payload: "00020126330014BR.GOV.BCB.PIX0111448990765685204000053039865406300.005802BR5911LUCAS ALVES6010ENTRE RIOS62200516INVISTAEGANHE30063048EC9" },
  { value: 400, payload: "00020126330014BR.GOV.BCB.PIX0111448990765685204000053039865406400.005802BR5911LUCAS ALVES6010ENTRE RIOS62200516INVISTAEGANHE4006304A7E3" },
  { value: 500, payload: "00020126330014BR.GOV.BCB.PIX0111448990765685204000053039865406500.005802BR5911LUCAS ALVES6010ENTRE RIOS62200516INVISTAEGANHE50063047F9B" },
  { value: 1000, payload: "00020126330014BR.GOV.BCB.PIX01114489907656852040000530398654071000.005802BR5911LUCAS ALVES6010ENTRE RIOS62210517INVISTAEGANHE100063047E4C" },
  { value: 2000, payload: "00020126330014BR.GOV.BCB.PIX01114489907656852040000530398654072000.005802BR5911LUCAS ALVES6010ENTRE RIOS62210517INVISTAEGANHE200063043E4E" },
  { value: 3000, payload: "00020126330014BR.GOV.BCB.PIX01114489907656852040000530398654073000.005802BR5911LUCAS ALVES6010ENTRE RIOS62210517INVISTAEGANHE30006304F1AF" },
  { value: 4000, payload: "00020126330014BR.GOV.BCB.PIX01114489907656852040000530398654074000.005802BR5911LUCAS ALVES6010ENTRE RIOS62210517INVISTAEGANHE40006304BE4A" },
  { value: 5000, payload: "00020126330014BR.GOV.BCB.PIX01114489907656852040000530398654075000.005802BR5911LUCAS ALVES6010ENTRE RIOS62210517INVISTAEGANHE5000630471AB" }
];

const PixPayment = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedValue, setSelectedValue] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPix, setShowPix] = useState<boolean>(false);

  const handleGeneratePix = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "É necessário estar logado",
        description: "Faça login para continuar com o pagamento"
      });
      return;
    }

    setIsLoading(true);
    
    // Simula um delay para feedback visual
    setTimeout(() => {
      setIsLoading(false);
      setShowPix(true);
      toast({
        title: "PIX gerado com sucesso",
        description: "Escaneie o QR code para finalizar o pagamento"
      });
    }, 1000);
  };

  // Encontra o payload PIX correspondente ao valor selecionado
  const selectedPix = PIX_OPTIONS.find(option => option.value === selectedValue);

  return (
    <Card className="glass-card w-full">
      <CardHeader>
        <CardTitle>Pagamento via PIX</CardTitle>
        <CardDescription>
          Selecione o valor do investimento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="amount" className="text-sm font-medium">
            Valor do Investimento (R$)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {PIX_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={selectedValue === option.value ? "default" : "outline"}
                onClick={() => setSelectedValue(option.value)}
                className="h-12"
              >
                R$ {option.value.toLocaleString()}
              </Button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleGeneratePix} 
          className="w-full bg-green-500 hover:bg-green-600" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando PIX...
            </>
          ) : "Gerar PIX para Investimento"}
        </Button>

        {/* Exibe o QR Code e payload após clicar no botão */}
        {showPix && selectedPix && (
          <div className="mt-6 text-center">
            <h3 className="text-lg font-medium mb-2">
              PIX de R$ {selectedValue.toLocaleString()}
            </h3>
            <div className="bg-white p-4 rounded-lg inline-block mb-4">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(selectedPix.payload)}`}
                alt="QR Code PIX"
                className="w-48 h-48 mx-auto"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Código PIX Copia e Cola:</p>
              <div className="relative">
                <textarea
                  value={selectedPix.payload}
                  readOnly
                  className="w-full h-20 p-2 glass-input text-xs"
                  onClick={(e) => {
                    (e.target as HTMLTextAreaElement).select();
                    navigator.clipboard.writeText(selectedPix.payload);
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

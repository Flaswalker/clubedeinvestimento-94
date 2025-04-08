
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

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
  const [selectedValue, setSelectedValue] = useState<number>(100);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPix, setShowPix] = useState<boolean>(false);

  const handleGeneratePix = () => {
    setIsLoading(true);
    setTimeout(() => {
      setShowPix(true);
      setIsLoading(false);
      toast({ title: "PIX gerado com sucesso!" });
    }, 500); // Delay simulado
  };

  const selectedPix = PIX_OPTIONS.find(option => option.value === selectedValue);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Investimento via PIX</CardTitle>
        <CardDescription>Selecione o valor:</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Botões de valor */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {PIX_OPTIONS.map((option) => (
            <Button
              key={option.value}
              variant={selectedValue === option.value ? "default" : "outline"}
              onClick={() => setSelectedValue(option.value)}
            >
              R$ {option.value.toLocaleString()}
            </Button>
          ))}
        </div>

        {/* Botão de gerar PIX */}
        <Button
          onClick={handleGeneratePix}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="animate-spin" /> : "Gerar PIX"}
        </Button>

        {/* QR Code (exibido após clique) */}
        {showPix && selectedPix && (
          <div className="mt-6 p-4 bg-white rounded-lg text-center">
            <h3 className="font-medium mb-2">PIX de R$ {selectedValue.toLocaleString()}</h3>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(selectedPix.payload)}`}
              alt="QR Code PIX"
              className="mx-auto mb-4"
            />
            <div className="relative">
              <textarea
                value={selectedPix.payload}
                readOnly
                className="w-full p-2 text-xs border rounded"
                onClick={(e) => {
                  e.currentTarget.select();
                  navigator.clipboard.writeText(selectedPix.payload);
                  toast({ title: "Código copiado!" });
                }}
              />
              <span className="absolute bottom-1 right-1 text-xs text-gray-500">
                Clique para copiar
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PixPayment;

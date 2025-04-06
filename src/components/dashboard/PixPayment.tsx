
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { QrCode, Clipboard, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

// Normalmente, você inicializaria o Mercado Pago com sua chave pública
// initMercadoPago("TEST-xxxxxx-xxxx-xxxx-xxxx-xxxxxx", { locale: 'pt-BR' });

export interface PixData {
  qr_code: string;
  qr_code_base64: string;
  payment_id: string;
}

const PixPayment = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState<number>(100);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleGeneratePix = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      // Aqui você faria a requisição para o seu backend ou uma Edge Function
      // Como estamos fazendo uma demonstração, vamos simular a resposta
      
      // const response = await fetch('/.netlify/functions/create-pix', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     amount,
      //     email: user.email,
      //     cpf: user.cpf || '00000000000',
      //     firstName: user.name.split(' ')[0],
      //     lastName: user.name.split(' ').slice(1).join(' ') || 'Sobrenome',
      //   }),
      // });
      
      // Simulando a resposta do backend
      setTimeout(() => {
        setPixData({
          qr_code: "https://cdn.discordapp.com/attachments/1237876111371943937/1274878257764311080/mercadopago-qr-exemplo.png?ex=665c8dce&is=664a18ce&hm=34c3f95d2efd39c47e3a86e81f3eccea293d8b4af2dc2979d1b30ca7a12343d1&",
          qr_code_base64: "00020126580014BR.GOV.BCB.PIX0136a6aeac5e-b0e4-4cee-a81d-47cd2f761a0352040000530398654042.005802BR5923MERCADOPAGO PAGAMENTOS SA6009SAO PAULO62070503***6304B76C",
          payment_id: "12345678"
        });
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PIX",
        description: "Não foi possível gerar o código PIX. Tente novamente."
      });
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = () => {
    if (!pixData) return;
    
    navigator.clipboard.writeText(pixData.qr_code_base64);
    setCopied(true);
    
    toast({
      title: "Código PIX copiado!",
      description: "O código PIX foi copiado para a área de transferência."
    });
    
    setTimeout(() => setCopied(false), 3000);
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when closing
      setPixData(null);
      setCopied(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full lg:w-auto">
          Investir via PIX
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pagamento via PIX</DialogTitle>
          <DialogDescription>
            Realize seu investimento de forma rápida e segura usando PIX.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!pixData ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Valor do Investimento (R$)</Label>
                <Input
                  id="amount"
                  type="number"
                  min={1}
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="glass-input"
                />
              </div>
              <Button 
                onClick={handleGeneratePix} 
                className="w-full" 
                disabled={isLoading || amount <= 0}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gerando PIX...
                  </span>
                ) : "Gerar PIX"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <div className="bg-white p-4 rounded-lg">
                  <img 
                    src={pixData.qr_code} 
                    alt="QR Code PIX" 
                    className="w-48 h-48 mx-auto" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Escaneie o QR Code acima com o aplicativo do seu banco ou copie o código PIX abaixo:
                </p>
                
                <div className="flex items-center space-x-2">
                  <Input 
                    value={pixData.qr_code_base64} 
                    readOnly 
                    className="font-mono text-xs"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleCopyToClipboard}
                    className="flex-shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-muted-foreground mb-2">
                  Após o pagamento, seu investimento será confirmado automaticamente.
                </p>
                <p className="text-xs text-muted-foreground">
                  ID da transação: {pixData.payment_id}
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PixPayment;



import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Investment } from "@/lib/types";
import { CalendarDays, DollarSign, Clock } from "lucide-react";

interface InvestmentCardProps {
  investment: Investment;
}

const InvestmentCard = ({ investment }: InvestmentCardProps) => {
  // Format currency with Brazilian locale
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };

  // Calculate expected return (simple example)
  const calculateExpectedReturn = () => {
    // Simple 30% annual return, scaled by months
    const annualRate = 0.30;
    const monthlyRate = annualRate / 12;
    const totalReturn = investment.amount * Math.pow(1 + monthlyRate, investment.period);
    return totalReturn;
  };

  // Calculate days remaining
  const calculateDaysRemaining = () => {
    const endDate = new Date(investment.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <Card className="glass-card overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle>Investimento #{investment.id.substring(0, 8)}</CardTitle>
        <CardDescription>
          Iniciado em {formatDate(investment.startDate)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-start gap-2">
            <DollarSign className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Valor Investido</h4>
              <p className="text-xl font-bold">{formatCurrency(investment.amount)}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Clock className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Período</h4>
              <p className="text-xl font-bold">{investment.period} meses</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <CalendarDays className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Data de Término</h4>
              <p className="text-xl font-bold">{formatDate(investment.endDate)}</p>
              <p className="text-sm text-muted-foreground">{calculateDaysRemaining()} dias restantes</p>
            </div>
          </div>
          
          <div className="pt-4 border-t border-white/10">
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Retorno Esperado</h4>
            <p className="text-2xl font-bold text-primary">{formatCurrency(calculateExpectedReturn())}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentCard;

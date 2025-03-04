import { useState } from "react";
import { Investment } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import DatabaseService from "@/services/DatabaseService";

interface InvestmentTableProps {
  investments: Investment[];
  onInvestmentDeleted: () => void;
}

const InvestmentTable = ({ investments, onInvestmentDeleted }: InvestmentTableProps) => {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const handleDelete = (id: string) => {
    setDeletingId(id);
    try {
      // Delete investment using DatabaseService
      const success = DatabaseService.deleteInvestment(id);
      
      if (success) {
        // Show success message
        toast({
          title: "Investimento removido",
          description: "O investimento foi removido com sucesso."
        });
        
        // Notify parent component
        onInvestmentDeleted();
      } else {
        throw new Error("Investimento não encontrado");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Ocorreu um erro ao tentar remover o investimento."
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor (R$)</TableHead>
              <TableHead>Período</TableHead>
              <TableHead>Data Inicial</TableHead>
              <TableHead>Data Final</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                  Nenhum investimento encontrado
                </TableCell>
              </TableRow>
            ) : (
              investments.map((investment) => (
                <TableRow key={investment.id} className="transition hover:bg-secondary/20">
                  <TableCell className="font-medium">#{investment.id.substring(0, 8)}</TableCell>
                  <TableCell>{investment.userEmail}</TableCell>
                  <TableCell>{formatCurrency(investment.amount)}</TableCell>
                  <TableCell>{investment.period} meses</TableCell>
                  <TableCell>{formatDate(investment.startDate)}</TableCell>
                  <TableCell>{formatDate(investment.endDate)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(investment.id)}
                      disabled={deletingId === investment.id}
                      className="hover:text-destructive hover:bg-destructive/10"
                    >
                      {deletingId === investment.id ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default InvestmentTable;

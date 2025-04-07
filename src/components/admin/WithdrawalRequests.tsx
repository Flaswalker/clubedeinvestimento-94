
import React, { useState } from "react";
import { WithdrawalRequest } from "@/lib/types";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, UserCircle, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import DatabaseService from "@/services/DatabaseService";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface WithdrawalRequestsTableProps {
  requests: WithdrawalRequest[];
  onStatusUpdate: () => void;
}

const WithdrawalRequestsTable = ({ requests, onStatusUpdate }: WithdrawalRequestsTableProps) => {
  const { toast } = useToast();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (error) {
      return dateString;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setProcessingId(id);
    try {
      const success = await DatabaseService.updateWithdrawalStatus(id, newStatus);
      
      if (success) {
        toast({
          title: "Status atualizado",
          description: `Solicitação marcada como ${newStatus}`,
          variant: "default"
        });
        onStatusUpdate();
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o status da solicitação",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status da solicitação",
        variant: "destructive"
      });
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'aprovado':
        return <Badge variant="success" className="bg-green-500">Aprovado</Badge>;
      case 'recusado':
        return <Badge variant="destructive">Recusado</Badge>;
      case 'pendente':
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
    }
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Solicitações de Saque</CardTitle>
          <CardDescription>Acompanhe as solicitações de saque dos clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Não há solicitações de saque no momento.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Solicitações de Saque</CardTitle>
        <CardDescription>Acompanhe as solicitações de saque dos clientes</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Chave PIX</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  {formatDate(request.data)}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  {request.email}
                </TableCell>
                <TableCell className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  {formatCurrency(request.valor)}
                </TableCell>
                <TableCell className="max-w-[200px] truncate" title={request.pix}>
                  {request.pix}
                </TableCell>
                <TableCell>
                  {getStatusBadge(request.status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {request.status.toLowerCase() === 'pendente' && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 gap-1 bg-green-50 hover:bg-green-100 text-green-600"
                          onClick={() => handleUpdateStatus(request.id, 'aprovado')}
                          disabled={processingId === request.id}
                        >
                          <CheckCircle className="h-4 w-4" />
                          Aprovar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 gap-1 bg-red-50 hover:bg-red-100 text-red-600"
                          onClick={() => handleUpdateStatus(request.id, 'recusado')}
                          disabled={processingId === request.id}
                        >
                          <XCircle className="h-4 w-4" />
                          Recusar
                        </Button>
                      </>
                    )}
                    {request.status.toLowerCase() !== 'pendente' && (
                      <span className="text-sm text-muted-foreground">
                        {request.status === 'aprovado' ? 'Pagamento aprovado' : 'Solicitação recusada'}
                      </span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WithdrawalRequestsTable;

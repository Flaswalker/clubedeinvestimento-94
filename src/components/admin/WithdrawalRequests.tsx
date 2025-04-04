
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check, X } from "lucide-react";
import DatabaseService from "@/services/DatabaseService";

interface WithdrawalRequestsProps {
  onRequestProcessed?: () => void;
}

const WithdrawalRequests = ({ onRequestProcessed }: WithdrawalRequestsProps) => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadWithdrawalRequests();
    
    // Listen for withdrawal request updates
    const handleWithdrawalRequest = () => loadWithdrawalRequests();
    const handleWithdrawalStatusUpdate = () => loadWithdrawalRequests();
    
    window.addEventListener('withdrawal-request', handleWithdrawalRequest);
    window.addEventListener('withdrawal-status-update', handleWithdrawalStatusUpdate);
    
    return () => {
      window.removeEventListener('withdrawal-request', handleWithdrawalRequest);
      window.removeEventListener('withdrawal-status-update', handleWithdrawalStatusUpdate);
    };
  }, []);

  const loadWithdrawalRequests = async () => {
    setLoading(true);
    try {
      const requests = await DatabaseService.getWithdrawalRequests();
      setWithdrawalRequests(requests);
    } catch (error) {
      console.error("Error loading withdrawal requests:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar as solicitações de saque."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const success = await DatabaseService.updateWithdrawalStatus(id, 'approved');
      
      if (success) {
        toast({
          title: "Solicitação aprovada",
          description: "A solicitação de saque foi aprovada com sucesso."
        });
        loadWithdrawalRequests();
        if (onRequestProcessed) onRequestProcessed();
      }
    } catch (error) {
      console.error("Error approving withdrawal:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível aprovar a solicitação de saque."
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    try {
      const success = await DatabaseService.updateWithdrawalStatus(id, 'rejected');
      
      if (success) {
        toast({
          title: "Solicitação rejeitada",
          description: "A solicitação de saque foi rejeitada."
        });
        loadWithdrawalRequests();
        if (onRequestProcessed) onRequestProcessed();
      }
    } catch (error) {
      console.error("Error rejecting withdrawal:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível rejeitar a solicitação de saque."
      });
    } finally {
      setProcessingId(null);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">Pendente</span>;
      case 'approved':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Aprovado</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">Rejeitado</span>;
      default:
        return status;
    }
  };

  const pendingRequests = withdrawalRequests.filter(req => req.status === 'pending');

  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <CardHeader>
        <CardTitle>Solicitações de Saque</CardTitle>
        <CardDescription>Gerencie as solicitações de saque dos clientes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data da Solicitação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32">
                    <div className="flex justify-center items-center h-full">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : pendingRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    Nenhuma solicitação de saque pendente
                  </TableCell>
                </TableRow>
              ) : (
                pendingRequests.map((req) => (
                  <TableRow key={req.id} className="transition hover:bg-secondary/20">
                    <TableCell className="font-medium">
                      {req.users?.name || "Cliente"} 
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({req.user_email})
                      </span>
                    </TableCell>
                    <TableCell>{formatCurrency(req.amount)}</TableCell>
                    <TableCell>{formatDate(req.requested_at)}</TableCell>
                    <TableCell>{getStatusBadge(req.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleApprove(req.id)}
                          disabled={processingId === req.id}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(req.id)}
                          disabled={processingId === req.id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default WithdrawalRequests;

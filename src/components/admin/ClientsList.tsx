
import React, { useState, useEffect } from "react";
import { User, Investment } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DatabaseService from "@/services/DatabaseService";

interface ClientsListProps {
  clients: User[];
  investments: Investment[];
}

const ClientsList = ({ clients, investments }: ClientsListProps) => {
  const [withdrawalRequests, setWithdrawalRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadWithdrawalRequests();
    
    const handleWithdrawalEvent = () => {
      loadWithdrawalRequests();
    };
    
    window.addEventListener('withdrawal-request', handleWithdrawalEvent);
    window.addEventListener('withdrawal-status-update', handleWithdrawalEvent);
    
    return () => {
      window.removeEventListener('withdrawal-request', handleWithdrawalEvent);
      window.removeEventListener('withdrawal-status-update', handleWithdrawalEvent);
    };
  }, [clients]);
  
  const loadWithdrawalRequests = async () => {
    setLoading(true);
    try {
      const requests = await DatabaseService.getWithdrawalRequests();
      setWithdrawalRequests(requests);
    } catch (error) {
      console.error("Error loading withdrawal requests:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  const clientHasPendingWithdrawal = (email: string) => {
    return withdrawalRequests.some(req => 
      req.user_email === email && req.status === 'pending'
    );
  };
  
  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <CardHeader>
        <CardTitle>Lista de Clientes</CardTitle>
        <CardDescription>Todos os clientes cadastrados na plataforma</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Celular</TableHead>
                <TableHead>Investimentos</TableHead>
                <TableHead>Total Investido</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    Nenhum cliente cadastrado
                  </TableCell>
                </TableRow>
              ) : (
                clients.map((client) => {
                  const clientInvestments = investments.filter(
                    inv => inv.userEmail === client.email
                  );
                  const clientTotal = clientInvestments.reduce(
                    (total, inv) => total + inv.amount, 0
                  );
                  
                  const hasPendingWithdrawal = clientHasPendingWithdrawal(client.email);
                  
                  return (
                    <TableRow key={client.email} className="transition hover:bg-secondary/20">
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.celular}</TableCell>
                      <TableCell>{clientInvestments.length}</TableCell>
                      <TableCell>{formatCurrency(clientTotal)}</TableCell>
                      <TableCell>
                        {hasPendingWithdrawal && (
                          <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">
                            Saque Solicitado
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsList;

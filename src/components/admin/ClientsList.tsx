
import React from "react";
import { User, Investment } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ClientsListProps {
  clients: User[];
  investments: Investment[];
}

const ClientsList = ({ clients, investments }: ClientsListProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
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
                  
                  return (
                    <TableRow key={client.email} className="transition hover:bg-secondary/20">
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.celular}</TableCell>
                      <TableCell>{clientInvestments.length}</TableCell>
                      <TableCell>{formatCurrency(clientTotal)}</TableCell>
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

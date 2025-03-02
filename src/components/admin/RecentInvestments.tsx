
import React from "react";
import { Investment } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface RecentInvestmentsProps {
  investments: Investment[];
}

const RecentInvestments = ({ investments }: RecentInvestmentsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <CardHeader>
        <CardTitle>Investimentos Recentes</CardTitle>
        <CardDescription>Últimos investimentos cadastrados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Período</TableHead>
                <TableHead>Data Inicial</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {investments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    Nenhum investimento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                investments
                  .slice(0, 5)
                  .map((investment) => (
                    <TableRow key={investment.id} className="transition hover:bg-secondary/20">
                      <TableCell className="font-medium">#{investment.id.substring(0, 8)}</TableCell>
                      <TableCell>{investment.userEmail}</TableCell>
                      <TableCell>{formatCurrency(investment.amount)}</TableCell>
                      <TableCell>{investment.period} meses</TableCell>
                      <TableCell>{new Date(investment.startDate).toLocaleDateString('pt-BR')}</TableCell>
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

export default RecentInvestments;

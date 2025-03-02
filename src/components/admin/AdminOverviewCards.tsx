
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AdminOverviewCardsProps {
  totalInvested: number;
  investmentsCount: number;
  clientsCount: number;
}

const AdminOverviewCards = ({ totalInvested, investmentsCount, clientsCount }: AdminOverviewCardsProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Total Investido</CardTitle>
          <CardDescription>Valor total de todos os investimentos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{formatCurrency(totalInvested)}</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Investimentos Ativos</CardTitle>
          <CardDescription>Número total de investimentos</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{investmentsCount}</p>
        </CardContent>
      </Card>
      
      <Card className="glass-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Clientes</CardTitle>
          <CardDescription>Número total de clientes</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">{clientsCount}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminOverviewCards;

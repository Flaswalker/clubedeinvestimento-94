
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, Users, LineChart, ArrowDownCircle } from "lucide-react";

interface AdminHeaderProps {
  totalInvested: number;
  investments: number;
  clients: number;
  withdrawalRequests?: number;
}

const AdminHeader = ({ totalInvested, investments, clients, withdrawalRequests = 0 }: AdminHeaderProps) => {
  // Format currency
  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(totalInvested);
  
  const statCards = [
    {
      title: "Total Investido",
      value: formattedTotal,
      icon: <Banknote className="h-8 w-8 text-primary" />,
      description: "Soma de todos os investimentos"
    },
    {
      title: "Investimentos",
      value: investments,
      icon: <LineChart className="h-8 w-8 text-indigo-500" />,
      description: "Número de contratos ativos"
    },
    {
      title: "Clientes",
      value: clients,
      icon: <Users className="h-8 w-8 text-blue-500" />,
      description: "Clientes registrados"
    },
    {
      title: "Solicitações de Saque",
      value: withdrawalRequests,
      icon: <ArrowDownCircle className="h-8 w-8 text-amber-500" />,
      description: "Solicitações pendentes e processadas"
    }
  ];
  
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Painel Administrativo</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
                  <h2 className="text-3xl font-bold">{stat.value}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminHeader;

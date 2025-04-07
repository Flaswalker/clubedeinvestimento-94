
import React from "react";

interface AdminHeaderProps {
  totalInvested: number;
  investments: number;
  clients: number;
}

const AdminHeader = ({ totalInvested, investments, clients }: AdminHeaderProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="mb-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
      <p className="text-muted-foreground">
        Gerencie investimentos e clientes da plataforma.
      </p>
    </div>
  );
};

export default AdminHeader;

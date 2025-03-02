
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const SecurityInfo = () => {
  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <CardHeader>
        <CardTitle>Informações de Segurança</CardTitle>
        <CardDescription>Detalhes sobre segurança do sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-1">Credenciais do Administrador</h3>
          <p className="text-sm text-muted-foreground">
            Suas credenciais de administrador são altamente sensíveis. 
            Nunca compartilhe sua senha com ninguém e altere-a periodicamente.
          </p>
        </div>
        
        <div>
          <h3 className="font-medium mb-1">Última Atualização</h3>
          <p className="text-sm text-muted-foreground">
            As configurações de administrador foram configuradas inicialmente
            quando o sistema foi carregado pela primeira vez.
          </p>
        </div>
        
        <div className="p-4 bg-orange-100 rounded-md text-orange-800 text-sm">
          <strong>Lembrete de Segurança:</strong> Em um ambiente de produção,
          recomenda-se implementar autenticação de dois fatores e backup regular
          das informações do administrador.
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityInfo;

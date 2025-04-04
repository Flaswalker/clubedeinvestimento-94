
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Investment, User } from "@/lib/types";

interface ClientsListProps {
  clients: User[];
  investments: Investment[];
  proposalEmails?: string[];
}

const ClientsList: React.FC<ClientsListProps> = ({ clients, investments, proposalEmails = [] }) => {
  // Filter clients to show only those with investments
  const activeClients = clients.filter(client => 
    investments.some(inv => inv.userEmail === client.email)
  );

  // Get clients with pending withdrawal requests
  const [withdrawalRequests, setWithdrawalRequests] = React.useState<string[]>([]);

  React.useEffect(() => {
    const fetchWithdrawalRequests = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const { data } = await supabase
          .from('withdrawal_requests')
          .select('user_email')
          .eq('status', 'pending');
        
        if (data) {
          const emails = data.map(req => req.user_email);
          setWithdrawalRequests(emails);
        }
      } catch (error) {
        console.error("Error fetching withdrawal requests:", error);
      }
    };

    fetchWithdrawalRequests();

    // Listen for withdrawal request updates
    const handleWithdrawalUpdate = () => {
      fetchWithdrawalRequests();
    };
    
    window.addEventListener('withdrawal-request', handleWithdrawalUpdate);
    window.addEventListener('withdrawal-status-update', handleWithdrawalUpdate);
    
    return () => {
      window.removeEventListener('withdrawal-request', handleWithdrawalUpdate);
      window.removeEventListener('withdrawal-status-update', handleWithdrawalUpdate);
    };
  }, []);

  // Calculate total invested by a client
  const getClientTotalInvested = (email: string) => {
    return investments
      .filter(inv => inv.userEmail === email)
      .reduce((total, inv) => total + inv.amount, 0);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes Ativos</CardTitle>
        <CardDescription>
          Clientes com investimentos ativos na plataforma
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeClients.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Nenhum cliente ativo encontrado.</p>
            </div>
          ) : (
            activeClients.map(client => {
              const totalInvested = getClientTotalInvested(client.email);
              const hasPendingWithdrawal = withdrawalRequests.includes(client.email);
              const hasProposal = proposalEmails.includes(client.email);
              const initials = client.name
                .split(' ')
                .map(part => part[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);

              return (
                <div key={client.email} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{initials}</AvatarFallback>
                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(client.name)}`} />
                    </Avatar>
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        {client.name}
                        {hasPendingWithdrawal && (
                          <Badge className="ml-2" variant="destructive">
                            Saque Solicitado
                          </Badge>
                        )}
                        {hasProposal && (
                          <Badge className="ml-2" variant="outline">
                            Proposta Enviada
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">{client.email}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total Investido</div>
                    <div className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(totalInvested)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientsList;

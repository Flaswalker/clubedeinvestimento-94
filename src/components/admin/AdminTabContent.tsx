
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Investment, User, WithdrawalRequest } from "@/lib/types";
import AdminOverviewCards from "./AdminOverviewCards";
import RecentInvestments from "./RecentInvestments";
import InvestmentForm from "./InvestmentForm";
import InvestmentTable from "./InvestmentTable";
import ClientsList from "./ClientsList";
import AdminSettingsForm from "./AdminSettingsForm";
import SecurityInfo from "./SecurityInfo";
import UserAccountsTable from "./UserAccountsTable";
import WithdrawalRequestsTable from "./WithdrawalRequestsTable";

interface AdminTabContentProps {
  investments: Investment[];
  clients: User[];
  totalInvested: number;
  withdrawalRequests: WithdrawalRequest[];
  onInvestmentAdded: () => void;
  onInvestmentDeleted: () => void;
  onWithdrawalStatusUpdated: () => void;
}

const AdminTabContent = ({
  investments,
  clients,
  totalInvested,
  withdrawalRequests,
  onInvestmentAdded,
  onInvestmentDeleted,
  onWithdrawalStatusUpdated
}: AdminTabContentProps) => {
  return (
    <>
      <TabsContent value="overview" className="mt-6 space-y-8">
        <AdminOverviewCards 
          totalInvested={totalInvested} 
          investmentsCount={investments.length} 
          clientsCount={clients.length} 
          withdrawalRequestsCount={withdrawalRequests.length}
        />
        <RecentInvestments investments={investments} />
        {withdrawalRequests.length > 0 && (
          <WithdrawalRequestsTable 
            requests={withdrawalRequests} 
            onStatusUpdate={onWithdrawalStatusUpdated} 
          />
        )}
      </TabsContent>
      
      <TabsContent value="investments" className="mt-6 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <InvestmentForm onInvestmentAdded={onInvestmentAdded} />
          </div>
          
          <div className="lg:col-span-2">
            <InvestmentTable 
              investments={investments}
              onInvestmentDeleted={onInvestmentDeleted}
            />
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="clients" className="mt-6 space-y-8">
        <ClientsList clients={clients} investments={investments} />
        <UserAccountsTable users={clients} investments={investments} />
      </TabsContent>
      
      <TabsContent value="withdrawals" className="mt-6">
        <WithdrawalRequestsTable 
          requests={withdrawalRequests} 
          onStatusUpdate={onWithdrawalStatusUpdated} 
        />
      </TabsContent>
      
      <TabsContent value="settings" className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-1">
            <AdminSettingsForm />
          </div>
          
          <div className="md:col-span-1">
            <SecurityInfo />
          </div>
        </div>
      </TabsContent>
    </>
  );
};

export default AdminTabContent;

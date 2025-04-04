
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Investment, User } from "@/lib/types";
import AdminOverviewCards from "./AdminOverviewCards";
import RecentInvestments from "./RecentInvestments";
import InvestmentForm from "./InvestmentForm";
import InvestmentTable from "./InvestmentTable";
import ClientsList from "./ClientsList";
import WithdrawalRequests from "./WithdrawalRequests";
import AdminSettingsForm from "./AdminSettingsForm";
import SecurityInfo from "./SecurityInfo";
import UserAccountsTable from "./UserAccountsTable";

interface AdminTabContentProps {
  investments: Investment[];
  clients: User[];
  totalInvested: number;
  onInvestmentAdded: () => void;
  onInvestmentDeleted: () => void;
}

const AdminTabContent = ({
  investments,
  clients,
  totalInvested,
  onInvestmentAdded,
  onInvestmentDeleted
}: AdminTabContentProps) => {
  const handleRequestProcessed = () => {
    // This would be a good place to refresh data if needed
  };

  return (
    <>
      <TabsContent value="overview" className="mt-6 space-y-8">
        <AdminOverviewCards 
          totalInvested={totalInvested} 
          investmentsCount={investments.length} 
          clientsCount={clients.length} 
        />
        <WithdrawalRequests onRequestProcessed={handleRequestProcessed} />
        <RecentInvestments investments={investments} />
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

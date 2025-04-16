
import React, { useEffect, useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  CreditCard,
  DollarSign,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatCard from "@/components/dashboard/StatCard";
import { getGreeting } from "@/utils/nepali-date";
import DateTimeDisplay from "@/components/dashboard/DateTimeDisplay";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentActivity from "@/components/dashboard/RecentActivity";
import { useNavigate } from "react-router-dom";
import DailyTransactionDialog from "@/components/daily-transactions/DailyTransactionDialog";
import TransactionLog from "@/components/daily-transactions/TransactionLog";
import PaymentAlerts from "@/components/dashboard/PaymentAlerts";
import { getDashboardSummary } from "@/utils/report-utils";
import { toast } from "@/components/ui/toast-utils";
import { formatCurrency } from "@/utils/currency";

const Dashboard = () => {
  const greeting = getGreeting();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>({
    monthlySales: 0,
    monthlyPurchases: 0,
    totalReceivables: 0,
    totalPayables: 0,
    salesGrowth: 0,
    purchasesGrowth: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const result = await getDashboardSummary();
        
        if (result.success && result.data) {
          setDashboardData(result.data);
        } else {
          console.error('Failed to fetch dashboard data:', result.error);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const handleCustomerClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };
  
  const handleSupplierClick = (supplierId: string) => {
    navigate(`/suppliers/${supplierId}`);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{greeting}, Administrator</h1>
            <p className="text-muted-foreground">
              Here's what's happening with your business today.
            </p>
          </div>
          
          <DailyTransactionDialog />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Sales"
            value={`रू ${formatCurrency(dashboardData.monthlySales)}`}
            description="This Month"
            icon={CreditCard}
            trend={{ value: dashboardData.salesGrowth, isPositive: dashboardData.salesGrowth >= 0 }}
            navigateTo="/analytics?tab=sales"
            isLoading={loading}
          />
          <StatCard
            title="Total Purchases"
            value={`रू ${formatCurrency(dashboardData.monthlyPurchases)}`}
            description="This Month"
            icon={ShoppingCart}
            trend={{ value: dashboardData.purchasesGrowth, isPositive: dashboardData.purchasesGrowth >= 0 }}
            navigateTo="/analytics?tab=purchases"
            isLoading={loading}
          />
          <StatCard
            title="Total Receivable"
            value={`रू ${formatCurrency(dashboardData.totalReceivables)}`}
            description="Outstanding"
            icon={DollarSign}
            navigateTo="/analytics?tab=receivables"
            isLoading={loading}
          />
          <StatCard
            title="Total Payable"
            value={`रू ${formatCurrency(dashboardData.totalPayables)}`}
            description="Outstanding"
            icon={DollarSign}
            navigateTo="/analytics?tab=payables"
            isLoading={loading}
          />
        </div>
        
        <div className="grid gap-6 md:grid-cols-7">
          <div className="md:col-span-5">
            <Tabs defaultValue="customers">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customers">Recent Customers</TabsTrigger>
                <TabsTrigger value="suppliers">Recent Suppliers</TabsTrigger>
              </TabsList>
              <TabsContent value="customers" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Customers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/20 p-2 rounded cursor-pointer transition-colors"
                          onClick={() => handleCustomerClick(`CN00${i + 1}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-vyc-primary/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-vyc-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">
                                Customer {i + 1}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Last transaction: 3 days ago
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">रू {formatCurrency(15000)}</p>
                            <p className="text-xs text-vyc-success">CR</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="suppliers" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Suppliers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/20 p-2 rounded cursor-pointer transition-colors"
                          onClick={() => handleSupplierClick(`SP00${i + 1}`)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-vyc-primary/10 flex items-center justify-center">
                              <ShoppingCart className="h-5 w-5 text-vyc-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">
                                Supplier {i + 1}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                Last transaction: 5 days ago
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">रू {formatCurrency(25000)}</p>
                            <p className="text-xs text-vyc-error">DR</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            <div className="mt-6">
              <TransactionLog />
            </div>
            
            <div className="mt-6">
              <RecentActivity />
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <DateTimeDisplay />
            
            <PaymentAlerts />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

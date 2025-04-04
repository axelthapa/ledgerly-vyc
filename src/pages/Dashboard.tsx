
import React from "react";
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

const Dashboard = () => {
  const greeting = getGreeting();
  const navigate = useNavigate();
  
  const handleCustomerClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };
  
  const handleSupplierClick = (supplierId: string) => {
    navigate(`/suppliers/${supplierId}`);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greeting}, Administrator</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your business today.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Sales"
            value="Rs 1,25,000.00"
            description="This Month"
            icon={CreditCard}
            trend={{ value: 12, isPositive: true }}
            navigateTo="/analytics?tab=sales"
          />
          <StatCard
            title="Total Purchases"
            value="Rs 85,000.00"
            description="This Month"
            icon={ShoppingCart}
            trend={{ value: 5, isPositive: false }}
            navigateTo="/analytics?tab=purchases"
          />
          <StatCard
            title="Total Receivable"
            value="Rs 45,000.00"
            description="Outstanding"
            icon={DollarSign}
            trend={{ value: 18, isPositive: true }}
            navigateTo="/analytics?tab=receivables"
          />
          <StatCard
            title="Total Payable"
            value="Rs 32,000.00"
            description="Outstanding"
            icon={DollarSign}
            trend={{ value: 10, isPositive: false }}
            navigateTo="/analytics?tab=payables"
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
                            <p className="text-sm font-medium">Rs 15,000.00</p>
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
                            <p className="text-sm font-medium">Rs 25,000.00</p>
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
              <RecentActivity />
            </div>
          </div>
          
          <div className="md:col-span-2">
            <DateTimeDisplay />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

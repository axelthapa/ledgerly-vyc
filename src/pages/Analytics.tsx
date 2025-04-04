
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar, FileDown, Printer } from "lucide-react";
import { getCurrentFiscalYear } from "@/utils/nepali-fiscal-year";
import { formatCurrency } from "@/utils/currency";
import { useSearchParams } from "react-router-dom";
import { exportToPdf, printComponent } from "@/utils/print-utils";

const Analytics = () => {
  const [searchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [dateRange, setDateRange] = useState("month");
  const [selectedTab, setSelectedTab] = useState(tabFromUrl || "sales");
  const fiscalYear = getCurrentFiscalYear();
  
  // Update tab when URL parameter changes
  useEffect(() => {
    if (tabFromUrl && ["sales", "purchases", "receivables", "payables", "customers", "products"].includes(tabFromUrl)) {
      setSelectedTab(tabFromUrl);
    }
  }, [tabFromUrl]);
  
  // Mock sales data for charts
  const salesData = [
    { name: "Shrawan", sales: 15000, purchases: 10000 },
    { name: "Bhadra", sales: 25000, purchases: 15000 },
    { name: "Ashwin", sales: 18000, purchases: 12000 },
    { name: "Kartik", sales: 30000, purchases: 20000 },
    { name: "Mangsir", sales: 22000, purchases: 14000 },
    { name: "Poush", sales: 28000, purchases: 16000 },
    { name: "Magh", sales: 32000, purchases: 19000 },
    { name: "Falgun", sales: 24000, purchases: 18000 },
    { name: "Chaitra", sales: 35000, purchases: 22000 },
    { name: "Baishakh", sales: 30000, purchases: 20000 },
    { name: "Jestha", sales: 27000, purchases: 17000 },
    { name: "Ashadh", sales: 33000, purchases: 21000 },
  ];
  
  // Mock data for pie charts
  const customerData = [
    { name: "Customer A", value: 25000 },
    { name: "Customer B", value: 18000 },
    { name: "Customer C", value: 15000 },
    { name: "Customer D", value: 12000 },
    { name: "Others", value: 20000 },
  ];
  
  const productData = [
    { name: "Laptops", value: 35000 },
    { name: "Desktops", value: 25000 },
    { name: "Accessories", value: 15000 },
    { name: "Software", value: 10000 },
    { name: "Services", value: 15000 },
  ];
  
  const receivablesData = [
    { name: "0-30 days", value: 25000 },
    { name: "31-60 days", value: 15000 },
    { name: "61-90 days", value: 8000 },
    { name: "91+ days", value: 5000 },
  ];
  
  const payablesData = [
    { name: "0-30 days", value: 18000 },
    { name: "31-60 days", value: 10000 },
    { name: "61-90 days", value: 5000 },
    { name: "91+ days", value: 2000 },
  ];
  
  // Colors for pie charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];
  
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    // In a real app, this would fetch new data based on the date range
  };
  
  // Mock totals
  const totals = {
    sales: 250000,
    purchases: 150000,
    profit: 100000,
    customers: 45,
    suppliers: 12,
    transactions: 135,
    receivables: 53000,
    payables: 35000
  };
  
  // Handle print/export
  const handlePrint = () => {
    printComponent('analytics-content');
  };
  
  const handleExport = () => {
    exportToPdf('analytics-content', `Analytics_Report_${fiscalYear.year}.pdf`);
  };
  
  // Function to render receivables/payables tab
  const renderAgingTab = (type: 'receivables' | 'payables') => {
    const data = type === 'receivables' ? receivablesData : payablesData;
    const total = type === 'receivables' ? totals.receivables : totals.payables;
    
    return (
      <>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{type === 'receivables' ? 'Accounts Receivable' : 'Accounts Payable'} Summary</CardTitle>
            <CardDescription>
              Total {type === 'receivables' ? 'outstanding from customers' : 'due to suppliers'}: रू {formatCurrency(total)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `रू ${formatCurrency(Number(value))}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Aging Analysis</CardTitle>
            <CardDescription>
              Breakdown of {type === 'receivables' ? 'receivables' : 'payables'} by age
            </CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Age Period</th>
                  <th className="py-2 text-right">Amount</th>
                  <th className="py-2 text-right">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="py-2 text-right">रू {formatCurrency(item.value)}</td>
                    <td className="py-2 text-right">
                      {((item.value / total) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
                <tr className="font-bold">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-right">रू {formatCurrency(total)}</td>
                  <td className="py-2 text-right">100%</td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              View detailed reports and analytics of your business for {fiscalYear.year}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <select 
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
              <option value="custom">Custom Range</option>
            </select>
            
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            
            <Button variant="outline" onClick={handleExport}>
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        
        <div id="analytics-content">
          {/* Overview Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs. {totals.sales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% from last {dateRange}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Purchases</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs. {totals.purchases.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +8.2% from last {dateRange}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rs. {totals.profit.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +15.3% from last {dateRange}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mt-6">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="receivables">Receivables</TabsTrigger>
              <TabsTrigger value="payables">Payables</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
            </TabsList>
            
            {/* Sales Tab */}
            <TabsContent value="sales">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trend ({fiscalYear.year})</CardTitle>
                  <CardDescription>
                    Monthly sales performance for current fiscal year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `रू ${formatCurrency(Number(value))}`} />
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#0088FE" activeDot={{ r: 8 }} name="Sales" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Purchases Tab */}
            <TabsContent value="purchases">
              <Card>
                <CardHeader>
                  <CardTitle>Purchases Trend ({fiscalYear.year})</CardTitle>
                  <CardDescription>
                    Monthly purchase history for current fiscal year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => `रू ${formatCurrency(Number(value))}`} />
                        <Legend />
                        <Line type="monotone" dataKey="purchases" stroke="#00C49F" activeDot={{ r: 8 }} name="Purchases" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Receivables Tab */}
            <TabsContent value="receivables">
              {renderAgingTab('receivables')}
            </TabsContent>
            
            {/* Payables Tab */}
            <TabsContent value="payables">
              {renderAgingTab('payables')}
            </TabsContent>
            
            {/* Customers Tab */}
            <TabsContent value="customers">
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers</CardTitle>
                  <CardDescription>
                    Revenue distribution by customer
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center justify-between">
                  <div className="w-full md:w-1/2 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={customerData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {customerData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `रू ${formatCurrency(Number(value))}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left">Customer</th>
                          <th className="py-2 text-right">Revenue</th>
                          <th className="py-2 text-right">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customerData.map((customer, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{customer.name}</td>
                            <td className="py-2 text-right">रू {formatCurrency(customer.value)}</td>
                            <td className="py-2 text-right">
                              {(customer.value / customerData.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Products Tab */}
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Top Products</CardTitle>
                  <CardDescription>
                    Revenue distribution by product category
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row items-center justify-between">
                  <div className="w-full md:w-1/2 h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={productData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {productData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `रू ${formatCurrency(Number(value))}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="w-full md:w-1/2">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2 text-left">Product</th>
                          <th className="py-2 text-right">Revenue</th>
                          <th className="py-2 text-right">Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productData.map((product, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2">{product.name}</td>
                            <td className="py-2 text-right">रू {formatCurrency(product.value)}</td>
                            <td className="py-2 text-right">
                              {(product.value / productData.reduce((sum, item) => sum + item.value, 0) * 100).toFixed(1)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Sales vs Purchases ({fiscalYear.year})</CardTitle>
              <CardDescription>
                A comparison of sales and purchases over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `रू ${formatCurrency(Number(value))}`} />
                    <Legend />
                    <Bar dataKey="sales" fill="#0088FE" name="Sales" />
                    <Bar dataKey="purchases" fill="#00C49F" name="Purchases" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Activity Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Activity Summary</CardTitle>
              <CardDescription>Overview of business activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-1">Total Customers</h3>
                  <p className="text-2xl font-bold">{totals.customers}</p>
                  <p className="text-xs text-muted-foreground">+3 new this {dateRange}</p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-1">Total Suppliers</h3>
                  <p className="text-2xl font-bold">{totals.suppliers}</p>
                  <p className="text-xs text-muted-foreground">+1 new this {dateRange}</p>
                </div>
                <div className="border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-1">Total Transactions</h3>
                  <p className="text-2xl font-bold">{totals.transactions}</p>
                  <p className="text-xs text-muted-foreground">+22 new this {dateRange}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Analytics;

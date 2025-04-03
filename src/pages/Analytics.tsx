
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("month");
  
  // Mock sales data for charts
  const salesData = [
    { name: "Jan", sales: 15000, purchases: 10000 },
    { name: "Feb", sales: 25000, purchases: 15000 },
    { name: "Mar", sales: 18000, purchases: 12000 },
    { name: "Apr", sales: 30000, purchases: 20000 },
    { name: "May", sales: 22000, purchases: 14000 },
    { name: "Jun", sales: 28000, purchases: 16000 },
    { name: "Jul", sales: 32000, purchases: 19000 },
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
    transactions: 135
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              View detailed reports and analytics of your business
            </p>
          </div>
          
          <div className="flex">
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
          </div>
        </div>
        
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
        
        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
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
                  <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="sales" fill="#0088FE" name="Sales" />
                  <Bar dataKey="purchases" fill="#00C49F" name="Purchases" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="customers">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customers">Customer Analysis</TabsTrigger>
            <TabsTrigger value="products">Product Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="customers" className="mt-4">
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
                      <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
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
                          <td className="py-2 text-right">Rs. {customer.value.toLocaleString()}</td>
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
          <TabsContent value="products" className="mt-4">
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
                      <Tooltip formatter={(value) => `Rs. ${value.toLocaleString()}`} />
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
                          <td className="py-2 text-right">Rs. {product.value.toLocaleString()}</td>
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
        
        {/* Activity Summary */}
        <Card>
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
    </MainLayout>
  );
};

export default Analytics;

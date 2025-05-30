
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  FileDown, 
  Printer, 
  Calendar, 
  RefreshCw, 
  Search, 
  BarChart3, 
  ArrowRight, 
  FileText, 
  Users, 
  ShoppingCart 
} from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { toast } from "@/components/ui/toast-utils";
import { generateTransactionReport } from "@/utils/print-utils";
import TransactionPrintTemplate from "@/components/print/TransactionPrintTemplate";
import { getCurrentFiscalYear } from "@/utils/nepali-fiscal-year";
import { formatNepaliDateNP } from "@/utils/nepali-date";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [printVisible, setPrintVisible] = useState(false);

  const handleExport = () => {
    const summaryData = generateSummaryData(activeTab);
    const reportData = generateReportData(activeTab);

    // Get current date and time
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const currentTime = now.toLocaleTimeString('en-US');
    const currentNepaliDate = formatNepaliDateNP(now);
    const fiscalYear = getCurrentFiscalYear();

    // Create a mock transaction for export
    const mockTransaction = {
      id: `RPT-${Date.now()}`,
      date: currentDate,
      nepaliDate: currentNepaliDate,
      type: activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
      description: `${summaryData.title} from ${dateRange.from || 'All time'} to ${dateRange.to || 'Present'}`,
      amount: summaryData.total,
      balance: summaryData.total,
      currentDate,
      currentTime,
      currentNepaliDate,
      fiscalYear: fiscalYear.year,
      items: reportData.map(item => ({
        id: item.id,
        name: item.description,
        quantity: 1,
        rate: item.amount,
        amount: item.amount
      }))
    };

    // Create a mock entity
    const mockEntity = {
      id: "REPORT",
      name: "Report Generation",
      address: "System Generated",
      phone: "",
      type: "Report"
    };

    generateTransactionReport({
      companyName: "Your Company",
      companyAddress: "Kathmandu, Nepal",
      companyPhone: "01-1234567",
      companyEmail: "info@yourcompany.com",
      companyPan: "123456789",
      transaction: mockTransaction,
      entity: mockEntity,
      dateRange: {
        from: dateRange.from || "All time",
        to: dateRange.to || "Present"
      },
      transactions: reportData,
      showTransactions: true,
      reportTitle: summaryData.title
    });
    
    toast.success("Report exported successfully!");
  };

  const handlePrint = () => {
    setPrintVisible(true);
    setTimeout(() => {
      window.print();
      setPrintVisible(false);
      toast.success("Printing initiated.");
    }, 100);
  };
  
  const generateSummaryData = (tab: string) => {
    switch (tab) {
      case "sales":
        return {
          title: "Sales Summary",
          total: 78000,
          count: 12,
          avgValue: 6500,
          topEntity: "John Doe",
          topEntityValue: 18000
        };
      case "purchases":
        return {
          title: "Purchases Summary",
          total: 57000,
          count: 8,
          avgValue: 7125,
          topEntity: "Tech Solutions Ltd",
          topEntityValue: 45000
        };
      case "payments":
        return {
          title: "Payments Summary",
          total: 49000,
          count: 15,
          avgValue: 3267,
          topEntity: "Tech Solutions Ltd",
          topEntityValue: 10000
        };
      case "transactions":
        return {
          title: "Transactions Summary",
          total: 184000,
          count: 35,
          avgValue: 5257,
          topEntity: "Tech Solutions Ltd",
          topEntityValue: 55000
        };
      default:
        return {
          title: "Summary",
          total: 0,
          count: 0,
          avgValue: 0,
          topEntity: "",
          topEntityValue: 0
        };
    }
  };

  const generateReportData = (tab: string) => {
    switch (tab) {
      case "sales":
        return [
          { id: "T001", date: "२०८१-०१-१५", description: "Initial Purchase", entity: "John Doe", amount: 5000 },
          { id: "T003", date: "२०८१-०२-०५", description: "Additional Items", entity: "John Doe", amount: 8000 },
          { id: "T006", date: "२०८१-०१-१०", description: "Initial Purchase", entity: "Sarah Smith", amount: 3000 },
          { id: "T010", date: "२०८१-०२-२०", description: "Electronic Goods", entity: "John Doe", amount: 15000 },
          { id: "T015", date: "२०८१-०३-०५", description: "Office Equipment", entity: "New Corp Ltd", amount: 47000 },
        ];
      case "purchases":
        return [
          { id: "ST001", date: "२०८१-०१-१०", description: "Computer Equipment", entity: "Tech Solutions Ltd", amount: 25000 },
          { id: "ST003", date: "२०८१-०२-१५", description: "Networking Equipment", entity: "Tech Solutions Ltd", amount: 20000 },
          { id: "ST004", date: "२०८१-०१-०५", description: "Office Supplies", entity: "Office Supplies Co", amount: 12000 },
        ];
      case "payments":
        return [
          { id: "T002", date: "२०८१-०१-२०", description: "Partial Payment", entity: "John Doe", amount: 2000 },
          { id: "T004", date: "२०८१-०२-१५", description: "Monthly Payment", entity: "John Doe", amount: 3000 },
          { id: "T007", date: "२०८१-०१-३०", description: "Partial Payment", entity: "Sarah Smith", amount: 2000 },
          { id: "ST002", date: "२०८१-०१-२५", description: "Partial Payment", entity: "Tech Solutions Ltd", amount: 10000 },
        ];
      case "transactions":
        return [
          { id: "T001", date: "२०८१-०१-१५", description: "Initial Purchase", entity: "John Doe", amount: 5000 },
          { id: "T002", date: "२०८१-०१-२०", description: "Partial Payment", entity: "John Doe", amount: 2000 },
          { id: "T003", date: "२०८१-०२-०५", description: "Additional Items", entity: "John Doe", amount: 8000 },
          { id: "T004", date: "२०८१-०२-१५", description: "Monthly Payment", entity: "John Doe", amount: 3000 },
          { id: "ST001", date: "२०८१-०१-१०", description: "Computer Equipment", entity: "Tech Solutions Ltd", amount: 25000 },
          { id: "ST002", date: "२०८१-०१-२५", description: "Partial Payment", entity: "Tech Solutions Ltd", amount: 10000 },
          { id: "T006", date: "२०८१-०१-१०", description: "Initial Purchase", entity: "Sarah Smith", amount: 3000 },
          { id: "T007", date: "२०८१-०१-३०", description: "Partial Payment", entity: "Sarah Smith", amount: 2000 },
          { id: "ST003", date: "२०८१-०२-१५", description: "Networking Equipment", entity: "Tech Solutions Ltd", amount: 20000 },
          { id: "ST004", date: "२०८१-०१-०५", description: "Office Supplies", entity: "Office Supplies Co", amount: 12000 },
        ];
      default:
        return [];
    }
  };

  const summaryData = generateSummaryData(activeTab);
  const reportData = generateReportData(activeTab);

  // Get current date and time for print template
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const currentTime = now.toLocaleTimeString('en-US');
  const currentNepaliDate = formatNepaliDateNP(now);
  const fiscalYear = getCurrentFiscalYear();

  // Create data for print template
  const printData = {
    companyName: "Your Company",
    companyAddress: "Kathmandu, Nepal",
    companyPhone: "01-1234567",
    companyEmail: "info@yourcompany.com",
    companyPan: "123456789",
    transaction: {
      id: `RPT-${activeTab.toUpperCase()}`,
      date: currentDate,
      nepaliDate: currentNepaliDate,
      type: activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
      description: `${summaryData.title} from ${dateRange.from || 'All time'} to ${dateRange.to || 'Present'}`,
      amount: summaryData.total,
      balance: summaryData.total,
      currentDate,
      currentTime,
      currentNepaliDate,
      fiscalYear: fiscalYear.year
    },
    entity: {
      id: "REPORT",
      name: summaryData.title,
      address: `Date Range: ${dateRange.from || 'All time'} to ${dateRange.to || 'Present'}`,
      phone: "",
      type: "Report"
    },
    dateRange: {
      from: dateRange.from || "All time",
      to: dateRange.to || "Present"
    },
    transactions: reportData,
    showTransactions: true
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Generate and view reports for your business.
            </p>
          </div>
          
          <div className="flex gap-2 items-center">
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="flex items-center gap-1 hover:bg-slate-100 transition-colors"
            >
              <FileDown className="h-4 w-4" /> Export
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="flex items-center gap-1 hover:bg-slate-100 transition-colors"
            >
              <Printer className="h-4 w-4" /> Print
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="sales" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-6 bg-slate-100 p-1 rounded-md">
            <TabsTrigger value="sales" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Sales Report
            </TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Purchases Report
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              Payments Report
            </TabsTrigger>
            <TabsTrigger value="transactions" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">
              All Transactions
            </TabsTrigger>
          </TabsList>
          
          {["sales", "purchases", "payments", "transactions"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6">
              {/* Report Filters */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Report Filters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        placeholder="From"
                        className="w-[150px]"
                        value={dateRange.from}
                        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                      />
                    </div>
                    <span>to</span>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        placeholder="To"
                        className="w-[150px]"
                        value={dateRange.to}
                        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                      />
                    </div>
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search records..."
                        className="pl-10"
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Report Summary */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-slate-200 shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(summaryData.total)}</div>
                  </CardContent>
                </Card>
                
                <Card className="border-slate-200 shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Number of {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{summaryData.count}</div>
                  </CardContent>
                </Card>
                
                <Card className="border-slate-200 shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Average Value
                    </CardTitle>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(summaryData.avgValue)}</div>
                  </CardContent>
                </Card>
                
                <Card className="border-slate-200 shadow-sm hover:shadow transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Top {tab === "sales" ? "Customer" : tab === "purchases" ? "Supplier" : "Entity"}
                    </CardTitle>
                    {tab === "sales" ? (
                      <Users className="h-4 w-4 text-muted-foreground" />
                    ) : tab === "purchases" ? (
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Users className="h-4 w-4 text-muted-foreground" />
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold">{summaryData.topEntity}</div>
                    <div className="text-sm text-muted-foreground">
                      रू {formatCurrency(summaryData.topEntityValue)}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Report Table */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle>{summaryData.title} - Report Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-50">
                          <TableHead>ID</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>{tab === "sales" ? "Customer" : tab === "purchases" ? "Supplier" : "Entity"}</TableHead>
                          <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportData.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-6">
                              No records found
                            </TableCell>
                          </TableRow>
                        ) : (
                          reportData.map((item) => (
                            <TableRow key={item.id} className="hover:bg-slate-50 transition-colors">
                              <TableCell className="font-mono">{item.id}</TableCell>
                              <TableCell>{item.date}</TableCell>
                              <TableCell>{item.description}</TableCell>
                              <TableCell>{item.entity}</TableCell>
                              <TableCell className="text-right">
                                रू {formatCurrency(item.amount)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  
                  {reportData.length > 0 && (
                    <div className="mt-4 text-sm text-muted-foreground">
                      Showing {reportData.length} records
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Print Template (hidden by default) */}
        <div className={`print-only ${printVisible ? '' : 'hidden'}`}>
          <TransactionPrintTemplate
            companyName={printData.companyName}
            companyAddress={printData.companyAddress}
            companyPhone={printData.companyPhone}
            companyEmail={printData.companyEmail}
            companyPan={printData.companyPan}
            transaction={printData.transaction}
            entity={printData.entity}
            dateRange={printData.dateRange}
            transactions={printData.transactions}
            showTransactions={printData.showTransactions}
          />
        </div>
      </div>

      {/* Print-specific styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .print-only, .print-only * {
              visibility: visible;
            }
            .print-only {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            @page {
              size: A4;
              margin: 10mm;
            }
          }
        `
      }} />
    </MainLayout>
  );
};

export default Reports;

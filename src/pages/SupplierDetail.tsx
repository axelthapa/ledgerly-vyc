import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { 
  ArrowLeft, 
  Calendar, 
  RefreshCw, 
  Printer, 
  FileDown,
  X
} from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { formatNepaliDate, formatNepaliDateNP } from "@/utils/nepali-date";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InvoiceView from "@/components/transactions/InvoiceView";
import TransactionActionButtons from "@/components/transactions/TransactionActionButtons";
import TransactionForm from "@/components/transactions/TransactionForm";
import { toast } from "@/components/ui/toast-utils";
import { getCurrentFiscalYear } from "@/utils/nepali-fiscal-year";
import { generateTransactionReport } from "@/utils/print-utils";
import TransactionPrintTemplate from "@/components/print/TransactionPrintTemplate";

const mockSuppliersData = {
  "SP001": { 
    id: "SP001", 
    name: "Tech Solutions Ltd", 
    address: "Kathmandu, Nepal", 
    phone: "9801234111", 
    pan: "987650001", 
    balance: 35000, 
    type: "DR" 
  },
  "SP002": { 
    id: "SP002", 
    name: "Office Supplies Co", 
    address: "Lalitpur, Nepal", 
    phone: "9807654222", 
    pan: "987650002", 
    balance: -8000, 
    type: "CR" 
  },
  "SP003": { 
    id: "SP003", 
    name: "Nepal Electronics", 
    address: "Bhaktapur, Nepal", 
    phone: "9812345333", 
    pan: "987650003", 
    balance: 12000, 
    type: "DR" 
  },
  "SP004": { 
    id: "SP004", 
    name: "Green Grocers", 
    address: "Patan, Nepal", 
    phone: "9854321444", 
    pan: "987650004", 
    balance: 0, 
    type: "CR" 
  },
  "SP005": { 
    id: "SP005", 
    name: "Modern Furniture", 
    address: "Pokhara, Nepal", 
    phone: "9867890555", 
    pan: "987650005", 
    balance: 18000, 
    type: "DR" 
  },
};

const mockTransactions = {
  "SP001": [
    { id: "ST001", date: "2081-01-10", nepaliDate: "२०८१-०१-१०", type: "Purchase", description: "Computer Equipment", amount: 25000, balance: 25000 },
    { id: "ST002", date: "2081-01-25", nepaliDate: "२०८१-०१-२५", type: "Payment", description: "Partial Payment", amount: -10000, balance: 15000 },
    { id: "ST003", date: "2081-02-15", nepaliDate: "२०८१-०२-१५", type: "Purchase", description: "Networking Equipment", amount: 20000, balance: 35000 }
  ],
  "SP002": [
    { id: "ST004", date: "2081-01-05", nepaliDate: "२०८१-०१-०५", type: "Purchase", description: "Office Supplies", amount: 12000, balance: 12000 },
    { id: "ST005", date: "2081-02-10", nepaliDate: "२०८१-०२-१०", type: "Payment", description: "Full Payment", amount: -12000, balance: 0 },
    { id: "ST006", date: "2081-03-05", nepaliDate: "२०८१-०३-०५", type: "Purchase", description: "Stationery", amount: 8000, balance: 8000 },
    { id: "ST007", date: "2081-03-20", nepaliDate: "२०८१-०३-२०", type: "Payment", description: "Excess Payment", amount: -16000, balance: -8000 }
  ],
  "SP003": [
    { id: "ST008", date: "2081-01-15", nepaliDate: "२०८१-०१-१५", type: "Purchase", description: "Electronics", amount: 18000, balance: 18000 },
    { id: "ST009", date: "2081-02-20", nepaliDate: "२०८१-०२-२०", type: "Payment", description: "Partial Payment", amount: -6000, balance: 12000 }
  ],
  "SP004": [
    { id: "ST010", date: "2081-01-10", nepaliDate: "२०८१-०१-१०", type: "Purchase", description: "Groceries", amount: 15000, balance: 15000 },
    { id: "ST011", date: "2081-02-15", nepaliDate: "२०८१-०२-१५", type: "Payment", description: "Full Payment", amount: -15000, balance: 0 }
  ],
  "SP005": [
    { id: "ST012", date: "2081-01-20", nepaliDate: "२०८१-०१-२०", type: "Purchase", description: "Office Furniture", amount: 30000, balance: 30000 },
    { id: "ST013", date: "2081-02-25", nepaliDate: "२०८१-०२-२५", type: "Payment", description: "Partial Payment", amount: -12000, balance: 18000 }
  ]
};

const SupplierDetail = () => {
  const { supplierId } = useParams<{ supplierId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"sale" | "purchase" | "payment">("purchase");
  const [printVisible, setPrintVisible] = useState(false);
  
  const supplier = supplierId ? mockSuppliersData[supplierId] : null;
  const transactions = supplierId ? (mockTransactions[supplierId] || []) : [];
  
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "all") return true;
    return transaction.type.toLowerCase() === activeTab.toLowerCase();
  });
  
  const handleBack = () => {
    navigate("/suppliers");
  };

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setInvoiceDialogOpen(true);
  };
  
  const handleNewPurchase = () => {
    setTransactionType("purchase");
    setTransactionFormOpen(true);
  };
  
  const handleNewPayment = () => {
    setTransactionType("payment");
    setTransactionFormOpen(true);
  };
  
  const handlePrint = () => {
    if (!selectedTransaction && (!supplier || transactions.length === 0)) {
      toast.error("No transaction data available to print");
      return;
    }
    
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const currentTime = now.toLocaleTimeString('en-US');
    const currentNepaliDate = formatNepaliDateNP(now);
    const fiscalYear = getCurrentFiscalYear();
    
    if (selectedTransaction) {
      generateTransactionReport({
        companyName: "Vyas Accounting",
        companyAddress: "Kathmandu, Nepal",
        companyPhone: "+977 1234567890",
        companyEmail: "info@vyasaccounting.com",
        companyPan: "123456789",
        transaction: {
          ...selectedTransaction,
          currentDate,
          currentTime,
          currentNepaliDate,
          fiscalYear: fiscalYear.year,
          items: selectedTransaction.type === "Purchase" ? [
            { id: "item1", name: "Product 1", quantity: 2, rate: 5000, amount: 10000 },
            { id: "item2", name: "Product 2", quantity: 1, rate: 7500, amount: 7500 }
          ] : []
        },
        entity: supplier,
        showTransactions: false,
        reportTitle: selectedTransaction.type === "Purchase" ? "Purchase Invoice" : "Payment Receipt"
      });
    } else {
      generateTransactionReport({
        companyName: "Vyas Accounting",
        companyAddress: "Kathmandu, Nepal",
        companyPhone: "+977 1234567890",
        companyEmail: "info@vyasaccounting.com",
        companyPan: "123456789",
        transaction: {
          id: `STMT-${supplier.id}-${Date.now()}`,
          date: currentDate,
          nepaliDate: currentNepaliDate,
          type: "Report",
          description: `Supplier Statement - ${supplier.name}`,
          amount: supplier.balance,
          balance: supplier.balance,
          currentDate,
          currentTime,
          currentNepaliDate,
          fiscalYear: fiscalYear.year
        },
        entity: supplier,
        dateRange: dateFilter.from && dateFilter.to ? {
          from: dateFilter.from,
          to: dateFilter.to
        } : undefined,
        transactions: filteredTransactions,
        showTransactions: true,
        reportTitle: "Supplier Statement"
      });
    }
    
    toast.success("Printing initiated");
  };
  
  const handleDownload = () => {
    if (!selectedTransaction && (!supplier || transactions.length === 0)) {
      toast.error("No transaction data available to export");
      return;
    }
    
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const currentTime = now.toLocaleTimeString('en-US');
    const currentNepaliDate = formatNepaliDateNP(now);
    const fiscalYear = getCurrentFiscalYear();
    
    if (selectedTransaction) {
      generateTransactionReport({
        companyName: "Vyas Accounting",
        companyAddress: "Kathmandu, Nepal",
        companyPhone: "+977 1234567890",
        companyEmail: "info@vyasaccounting.com",
        companyPan: "123456789",
        transaction: {
          ...selectedTransaction,
          currentDate,
          currentTime,
          currentNepaliDate,
          fiscalYear: fiscalYear.year,
          items: selectedTransaction.type === "Purchase" ? [
            { id: "item1", name: "Product 1", quantity: 2, rate: 5000, amount: 10000 },
            { id: "item2", name: "Product 2", quantity: 1, rate: 7500, amount: 7500 }
          ] : []
        },
        entity: supplier,
        showTransactions: false,
        reportTitle: selectedTransaction.type === "Purchase" ? "Purchase Invoice" : "Payment Receipt"
      });
    } else {
      generateTransactionReport({
        companyName: "Vyas Accounting",
        companyAddress: "Kathmandu, Nepal",
        companyPhone: "+977 1234567890",
        companyEmail: "info@vyasaccounting.com",
        companyPan: "123456789",
        transaction: {
          id: `STMT-${supplier.id}-${Date.now()}`,
          date: currentDate,
          nepaliDate: currentNepaliDate,
          type: "Report",
          description: `Supplier Statement - ${supplier.name}`,
          amount: supplier.balance,
          balance: supplier.balance,
          currentDate,
          currentTime,
          currentNepaliDate,
          fiscalYear: fiscalYear.year
        },
        entity: supplier,
        dateRange: dateFilter.from && dateFilter.to ? {
          from: dateFilter.from,
          to: dateFilter.to
        } : undefined,
        transactions: filteredTransactions,
        showTransactions: true,
        reportTitle: "Supplier Statement"
      });
    }
    
    toast.success("PDF export successful");
  };
  
  if (!supplier) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <h2 className="text-xl">Supplier not found</h2>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Suppliers
          </Button>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              className="flex items-center gap-1 hover:bg-slate-100"
            >
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              className="flex items-center gap-1 hover:bg-slate-100"
            >
              <FileDown className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Supplier Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-bold text-lg">{supplier.name}</h3>
                <p className="text-muted-foreground">{supplier.address}</p>
                <p className="text-muted-foreground">Phone: {supplier.phone}</p>
                {supplier.pan && <p className="text-muted-foreground">PAN: {supplier.pan}</p>}
              </div>
              
              <div className="md:text-center">
                <p className="text-sm text-muted-foreground">Supplier ID</p>
                <p className="font-mono font-bold">{supplier.id}</p>
              </div>
              
              <div className="md:text-right">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className={`font-bold text-xl ${supplier.type === "CR" ? "text-vyc-success" : "text-vyc-error"}`}>
                  रू {formatCurrency(Math.abs(supplier.balance))} {supplier.type}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <TransactionActionButtons 
            entityType="supplier" 
            entityId={supplier.id}
            onNewPurchase={handleNewPurchase}
            onNewPayment={handleNewPayment}
          />
        </div>
        
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Transaction History</h2>
            
            <div className="flex items-center space-x-2 mt-2 sm:mt-0">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="From"
                  className="w-[130px]"
                  value={dateFilter.from}
                  onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                />
              </div>
              <span>-</span>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input
                  type="date"
                  placeholder="To"
                  className="w-[130px]"
                  value={dateFilter.to}
                  onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                />
              </div>
              <Button variant="ghost" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="purchase">Purchases</TabsTrigger>
              <TabsTrigger value="payment">Payments</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <TransactionTable transactions={filteredTransactions} onTransactionClick={handleTransactionClick} />
            </TabsContent>
            <TabsContent value="purchase" className="mt-4">
              <TransactionTable transactions={filteredTransactions} onTransactionClick={handleTransactionClick} />
            </TabsContent>
            <TabsContent value="payment" className="mt-4">
              <TransactionTable transactions={filteredTransactions} onTransactionClick={handleTransactionClick} />
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle>Transaction Details</DialogTitle>
              <Button variant="ghost" size="icon" onClick={() => setInvoiceDialogOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </DialogHeader>
            {selectedTransaction && (
              <InvoiceView 
                transaction={selectedTransaction} 
                customer={supplier}
                onPrint={handlePrint}
                onDownload={handleDownload}
              />
            )}
          </DialogContent>
        </Dialog>
        
        {supplier && (
          <TransactionForm
            open={transactionFormOpen}
            onOpenChange={setTransactionFormOpen}
            type={transactionType}
            entity={supplier}
          />
        )}
        
        {supplier && selectedTransaction && (
          <div className="print-only hidden">
            <TransactionPrintTemplate
              companyName="Vyas Accounting"
              companyAddress="Kathmandu, Nepal"
              companyPhone="+977 1234567890"
              companyEmail="info@vyasaccounting.com"
              companyPan="123456789"
              transaction={{
                ...selectedTransaction,
                currentDate: new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }),
                currentTime: new Date().toLocaleTimeString('en-US'),
                currentNepaliDate: formatNepaliDateNP(new Date()),
                fiscalYear: getCurrentFiscalYear().year,
                items: selectedTransaction.type === "Purchase" ? [
                  { id: "item1", name: "Product 1", quantity: 2, rate: 5000, amount: 10000 },
                  { id: "item2", name: "Product 2", quantity: 1, rate: 7500, amount: 7500 }
                ] : []
              }}
              entity={supplier}
              showTransactions={false}
            />
          </div>
        )}
      </div>
      
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

const TransactionTable = ({ transactions, onTransactionClick }) => {
  if (transactions.length === 0) {
    return (
      <div className="text-center p-8 bg-muted rounded-md">
        <p>No transactions found</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Balance</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow 
              key={transaction.id} 
              className="hover:bg-muted/30 cursor-pointer"
              onClick={() => onTransactionClick(transaction)}
            >
              <TableCell className="font-mono">{transaction.id}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{transaction.nepaliDate}</span>
                  <span className="text-xs text-muted-foreground">{transaction.date}</span>
                </div>
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                <span className={transaction.type === 'Purchase' ? 'text-vyc-error' : 'text-vyc-success'}>
                  {transaction.type}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className={transaction.amount < 0 ? 'text-vyc-success' : 'text-vyc-error'}>
                  रू {formatCurrency(Math.abs(transaction.amount))}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className={transaction.balance < 0 ? 'text-vyc-success' : 'text-vyc-error'}>
                  रू {formatCurrency(Math.abs(transaction.balance))}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupplierDetail;

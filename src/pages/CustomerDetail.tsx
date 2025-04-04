import React, { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
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
  X,
  Clock
} from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import InvoiceView from "@/components/transactions/InvoiceView";
import TransactionActionButtons from "@/components/transactions/TransactionActionButtons";
import TransactionForm from "@/components/transactions/TransactionForm";
import { toast } from "@/components/ui/toast-utils";
import { getCurrentFiscalYear, formatFiscalYear } from "@/utils/nepali-fiscal-year";
import { handleFiscalYearTransition, generateTransactionReport, printComponent, exportToPdf } from "@/utils/print-utils";
import TransactionPrintTemplate from "@/components/print/TransactionPrintTemplate";

const mockCustomersData = {
  "CN001": { 
    id: "CN001", 
    name: "John Doe", 
    address: "Kathmandu, Nepal", 
    phone: "9801234567", 
    pan: "123456789", 
    balance: 15000, 
    type: "CR" 
  },
  "CN002": { 
    id: "CN002", 
    name: "Sarah Smith", 
    address: "Pokhara, Nepal", 
    phone: "9807654321", 
    pan: "987654321", 
    balance: -5000, 
    type: "DR" 
  },
  "CN003": { 
    id: "CN003", 
    name: "Rajesh Kumar", 
    address: "Lalitpur, Nepal", 
    phone: "9812345678", 
    pan: "234567891", 
    balance: 25000, 
    type: "CR" 
  },
  "CN004": { 
    id: "CN004", 
    name: "Anita Sharma", 
    address: "Bhaktapur, Nepal", 
    phone: "9854321098", 
    pan: "345678912", 
    balance: 0, 
    type: "CR" 
  },
  "CN005": { 
    id: "CN005", 
    name: "Bikash Thapa", 
    address: "Chitwan, Nepal", 
    phone: "9867890123", 
    pan: "456789123", 
    balance: -12000, 
    type: "DR" 
  },
};

const mockTransactions = {
  "CN001": [
    { id: "T001", date: "2081-01-15", nepaliDate: "२०८१-०१-१५", type: "Purchase", description: "Initial Purchase", amount: 5000, balance: 5000, fiscalYear: "2080/2081" },
    { id: "T002", date: "2081-01-20", nepaliDate: "२०८१-०१-२०", type: "Payment", description: "Partial Payment", amount: -2000, balance: 3000, fiscalYear: "2080/2081" },
    { id: "T003", date: "2081-02-05", nepaliDate: "२०८१-०२-०५", type: "Purchase", description: "Additional Items", amount: 8000, balance: 11000, fiscalYear: "2080/2081" },
    { id: "T004", date: "2081-02-15", nepaliDate: "२०८१-०२-१५", type: "Payment", description: "Monthly Payment", amount: -3000, balance: 8000, fiscalYear: "2080/2081" },
    { id: "T005", date: "2081-03-10", nepaliDate: "२०८१-०३-१०", type: "Purchase", description: "Seasonal Products", amount: 7000, balance: 15000, fiscalYear: "2080/2081" }
  ],
  "CN002": [
    { id: "T006", date: "2081-01-10", nepaliDate: "२०८१-०१-१०", type: "Purchase", description: "Initial Purchase", amount: 3000, balance: 3000, fiscalYear: "2080/2081" },
    { id: "T007", date: "2081-01-30", nepaliDate: "२०८१-०१-३०", type: "Payment", description: "Partial Payment", amount: -2000, balance: 1000, fiscalYear: "2080/2081" },
    { id: "T008", date: "2081-02-15", nepaliDate: "२०८१-०२-१५", type: "Purchase", description: "Bulk Order", amount: 7000, balance: 8000, fiscalYear: "2080/2081" },
    { id: "T009", date: "2081-02-25", nepaliDate: "२०८१-०२-२५", type: "Payment", description: "Installment", amount: -13000, balance: -5000, fiscalYear: "2080/2081" }
  ],
  "CN003": [
    { id: "T010", date: "2081-01-05", nepaliDate: "२०८१-०१-०५", type: "Purchase", description: "Initial Purchase", amount: 15000, balance: 15000, fiscalYear: "2080/2081" },
    { id: "T011", date: "2081-01-25", nepaliDate: "२०८१-०१-२५", type: "Payment", description: "Down Payment", amount: -5000, balance: 10000, fiscalYear: "2080/2081" },
    { id: "T012", date: "2081-02-10", nepaliDate: "२०८१-०२-१०", type: "Purchase", description: "Supplementary Items", amount: 10000, balance: 20000, fiscalYear: "2080/2081" },
    { id: "T013", date: "2081-03-05", nepaliDate: "२०८१-०३-०५", type: "Payment", description: "Partial Payment", amount: -5000, balance: 15000, fiscalYear: "2080/2081" },
    { id: "T014", date: "2081-03-20", nepaliDate: "२०८१-०३-२०", type: "Purchase", description: "New Inventory", amount: 10000, balance: 25000, fiscalYear: "2080/2081" }
  ],
  "CN004": [
    { id: "T015", date: "2081-01-15", nepaliDate: "२०८१-०१-१५", type: "Purchase", description: "Initial Purchase", amount: 8000, balance: 8000, fiscalYear: "2080/2081" },
    { id: "T016", date: "2081-02-10", nepaliDate: "२०८१-०२-१०", type: "Payment", description: "Full Payment", amount: -8000, balance: 0, fiscalYear: "2080/2081" }
  ],
  "CN005": [
    { id: "T017", date: "2081-01-05", nepaliDate: "२०८१-०१-०५", type: "Purchase", description: "Initial Purchase", amount: 10000, balance: 10000, fiscalYear: "2080/2081" },
    { id: "T018", date: "2081-02-15", nepaliDate: "२०८१-०२-१५", type: "Payment", description: "Partial Payment", amount: -4000, balance: 6000, fiscalYear: "2080/2081" },
    { id: "T019", date: "2081-03-01", nepaliDate: "२०८१-०३-०१", type: "Purchase", description: "Additional Products", amount: 6000, balance: 12000, fiscalYear: "2080/2081" }
  ]
};

const mockPreviousTransactions = {
  "CN001": [
    { id: "PT001", date: "2080-01-10", nepaliDate: "२०८०-०१-१०", type: "Purchase", description: "Initial Purchase", amount: 12000, balance: 12000, fiscalYear: "2079/2080" },
    { id: "PT002", date: "2080-02-15", nepaliDate: "२०८०-०२-१५", type: "Payment", description: "Partial Payment", amount: -7000, balance: 5000, fiscalYear: "2079/2080" },
    { id: "PT003", date: "2080-03-20", nepaliDate: "२०८०-०३-२०", type: "Purchase", description: "Additional Items", amount: 8000, balance: 13000, fiscalYear: "2079/2080" },
    { id: "PT004", date: "2080-03-30", nepaliDate: "२०८०-०३-३०", type: "Payment", description: "End Year Payment", amount: -8000, balance: 5000, fiscalYear: "2079/2080", isClosing: true }
  ]
};

const CustomerDetail = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("all");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<"sale" | "purchase" | "payment">("sale");
  const [showPreviousFiscalYear, setShowPreviousFiscalYear] = useState(false);
  const [printViewOpen, setPrintViewOpen] = useState(false);
  
  const customer = customerId ? mockCustomersData[customerId] : null;
  const currentTransactions = customerId ? (mockTransactions[customerId] || []) : [];
  const previousTransactions = customerId ? (mockPreviousTransactions[customerId] || []) : [];
  
  const currentFiscalYear = getCurrentFiscalYear().year;
  
  const transactions = showPreviousFiscalYear 
    ? previousTransactions 
    : currentTransactions;
  
  const processedTransactions = handleFiscalYearTransition(
    [...currentTransactions, ...previousTransactions], 
    currentFiscalYear
  );
  
  const filteredTransactions = transactions.filter(transaction => {
    if (activeTab === "all") return true;
    return transaction.type.toLowerCase() === activeTab.toLowerCase();
  });
  
  const handleBack = () => {
    navigate("/customers");
  };

  const handleTransactionClick = (transaction) => {
    if (transaction.isOpening) {
      setShowPreviousFiscalYear(true);
      return;
    }
    
    setSelectedTransaction(transaction);
    setInvoiceDialogOpen(true);
  };
  
  const handleNewSale = () => {
    setTransactionType("sale");
    setTransactionFormOpen(true);
  };
  
  const handleNewPayment = () => {
    setTransactionType("payment");
    setTransactionFormOpen(true);
  };
  
  const handlePrint = () => {
    setPrintViewOpen(true);
  };
  
  const executePrint = () => {
    printComponent("customer-print-view");
  };
  
  const handleDownload = () => {
    setPrintViewOpen(true);
    setTimeout(() => {
      exportToPdf("customer-print-view", `Customer_${customerId}_Report.pdf`);
    }, 500);
  };
  
  const handleFiscalYearToggle = () => {
    setShowPreviousFiscalYear(!showPreviousFiscalYear);
  };
  
  if (!customer) {
    return (
      <MainLayout>
        <div className="p-8 text-center">
          <h2 className="text-xl">Customer not found</h2>
          <Button onClick={handleBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Customers
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
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <FileDown className="mr-2 h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Customer Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-bold text-lg">{customer.name}</h3>
                <p className="text-muted-foreground">{customer.address}</p>
                <p className="text-muted-foreground">Phone: {customer.phone}</p>
                {customer.pan && <p className="text-muted-foreground">PAN: {customer.pan}</p>}
              </div>
              
              <div className="md:text-center">
                <p className="text-sm text-muted-foreground">Customer ID</p>
                <p className="font-mono font-bold">{customer.id}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Fiscal Year: {showPreviousFiscalYear ? "2079/2080" : currentFiscalYear}
                </p>
              </div>
              
              <div className="md:text-right">
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className={`font-bold text-xl ${customer.type === "DR" ? "text-vyc-error" : "text-vyc-success"}`}>
                  रू {formatCurrency(Math.abs(customer.balance))} {customer.type}
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1"
                  onClick={handleFiscalYearToggle}
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {showPreviousFiscalYear ? "Show Current Year" : "Show Previous Year"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <TransactionActionButtons 
            entityType="customer"
            entityId={customer.id}
            onNewSale={handleNewSale}
            onNewPayment={handleNewPayment}
          />
        </div>
        
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              Transaction History
              {showPreviousFiscalYear && (
                <span className="ml-2 text-sm bg-amber-100 text-amber-800 py-1 px-2 rounded-full">
                  Previous Fiscal Year (2079/2080)
                </span>
              )}
            </h2>
            
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
              <TransactionTable 
                transactions={filteredTransactions} 
                onTransactionClick={handleTransactionClick}
              />
            </TabsContent>
            <TabsContent value="purchase" className="mt-4">
              <TransactionTable 
                transactions={filteredTransactions} 
                onTransactionClick={handleTransactionClick}
              />
            </TabsContent>
            <TabsContent value="payment" className="mt-4">
              <TransactionTable 
                transactions={filteredTransactions} 
                onTransactionClick={handleTransactionClick}
              />
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
                customer={customer}
                onPrint={handlePrint}
                onDownload={handleDownload}
              />
            )}
          </DialogContent>
        </Dialog>
        
        {customer && (
          <TransactionForm
            open={transactionFormOpen}
            onOpenChange={setTransactionFormOpen}
            type={transactionType}
            entity={customer}
          />
        )}
        
        <Dialog open={printViewOpen} onOpenChange={setPrintViewOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader className="flex items-center justify-between">
              <DialogTitle>Print Preview</DialogTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={executePrint}>
                  <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
                <Button variant="outline" size="sm" onClick={() => exportToPdf("customer-print-view", `Customer_${customerId}_Report.pdf`)}>
                  <FileDown className="mr-2 h-4 w-4" /> Save as PDF
                </Button>
              </div>
            </DialogHeader>
            
            <div id="customer-print-view">
              <TransactionPrintTemplate 
                companyName="Vyas Accounting"
                companyAddress="Kathmandu, Nepal"
                companyPhone="+977 1234567890"
                companyEmail="info@vyasaccounting.com"
                transaction={selectedTransaction || {
                  id: "SUMMARY",
                  date: new Date().toISOString().split('T')[0],
                  nepaliDate: "२०८१-०४-०१",
                  type: "Customer Statement",
                  description: "Statement of Account",
                  amount: customer.balance,
                  balance: customer.balance
                }}
                entity={customer}
                dateRange={dateFilter.from && dateFilter.to ? {
                  from: dateFilter.from,
                  to: dateFilter.to
                } : undefined}
              />
              
              <div className="mt-8 px-8">
                <h3 className="font-bold mb-4">Transaction History</h3>
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-left">Date</th>
                      <th className="border p-2 text-left">Reference</th>
                      <th className="border p-2 text-left">Description</th>
                      <th className="border p-2 text-left">Type</th>
                      <th className="border p-2 text-right">Amount</th>
                      <th className="border p-2 text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="border p-2">{transaction.nepaliDate}</td>
                        <td className="border p-2">{transaction.id}</td>
                        <td className="border p-2">{transaction.description}</td>
                        <td className="border p-2">{transaction.type}</td>
                        <td className="border p-2 text-right">
                          रू {formatCurrency(Math.abs(transaction.amount))}
                        </td>
                        <td className="border p-2 text-right">
                          रू {formatCurrency(Math.abs(transaction.balance))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="mt-8 text-right">
                  <p><strong>Closing Balance:</strong> रू {formatCurrency(Math.abs(customer.balance))} {customer.type}</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
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
              className={`hover:bg-muted/30 cursor-pointer ${
                transaction.isOpening ? 'bg-blue-50' : 
                transaction.isClosing ? 'bg-amber-50' : ''
              }`}
              onClick={() => onTransactionClick(transaction)}
            >
              <TableCell className="font-mono">{transaction.id}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{transaction.nepaliDate}</span>
                  <span className="text-xs text-muted-foreground">{transaction.date}</span>
                </div>
              </TableCell>
              <TableCell>
                {transaction.isOpening ? (
                  <div className="flex items-center">
                    <span className="font-medium">{transaction.description}</span>
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full">
                      Click to view previous year
                    </span>
                  </div>
                ) : transaction.isClosing ? (
                  <div className="flex items-center">
                    <span className="font-medium">{transaction.description}</span>
                    <span className="ml-2 text-xs bg-amber-100 text-amber-800 py-1 px-2 rounded-full">
                      End of Fiscal Year
                    </span>
                  </div>
                ) : (
                  transaction.description
                )}
              </TableCell>
              <TableCell>
                <span className={
                  transaction.type === 'Purchase' ? 'text-vyc-error' : 
                  transaction.type === 'Payment' ? 'text-vyc-success' :
                  transaction.type === 'Opening' ? 'text-vyc-primary' :
                  'text-vyc-error'
                }>
                  {transaction.type}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className={transaction.amount < 0 ? 'text-vyc-success' : 'text-vyc-error'}>
                  रू {formatCurrency(Math.abs(transaction.amount))}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className={transaction.balance < 0 ? 'text-vyc-error' : 'text-vyc-success'}>
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

export default CustomerDetail;

import React, { useState } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, ArrowUpRight, Calendar, RefreshCw, Filter, FileDown, Printer, ArrowDown, ArrowUp, Eye } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import InvoiceView from "@/components/transactions/InvoiceView";
import { toast } from "@/components/ui/toast-utils";
import { useNavigate } from "react-router-dom";
import { generateTransactionReport } from "@/utils/print-utils";

const getAllMockTransactions = () => {
  const transactions = [
    { id: "T001", entityId: "CN001", entityName: "John Doe", entityType: "customer", date: "2081-01-15", nepaliDate: "२०८१-०१-१५", type: "Sale", description: "Initial Purchase", amount: 5000, balance: 5000 },
    { id: "T002", entityId: "CN001", entityName: "John Doe", entityType: "customer", date: "2081-01-20", nepaliDate: "२०८१-०१-२०", type: "Payment", description: "Partial Payment", amount: -2000, balance: 3000 },
    { id: "T003", entityId: "CN001", entityName: "John Doe", entityType: "customer", date: "2081-02-05", nepaliDate: "२०८१-०२-०५", type: "Sale", description: "Additional Items", amount: 8000, balance: 11000 },
    { id: "ST001", entityId: "SP001", entityName: "Tech Solutions Ltd", entityType: "supplier", date: "2081-01-10", nepaliDate: "२०८१-०१-१०", type: "Purchase", description: "Computer Equipment", amount: 25000, balance: 25000 },
    { id: "ST002", entityId: "SP001", entityName: "Tech Solutions Ltd", entityType: "supplier", date: "2081-01-25", nepaliDate: "२०८१-०१-२५", type: "Payment", description: "Partial Payment", amount: -10000, balance: 15000 },
    { id: "T004", entityId: "CN001", entityName: "John Doe", entityType: "customer", date: "2081-02-15", nepaliDate: "२०८१-०२-१५", type: "Payment", description: "Monthly Payment", amount: -3000, balance: 8000 },
    { id: "T006", entityId: "CN002", entityName: "Sarah Smith", entityType: "customer", date: "2081-01-10", nepaliDate: "२०८१-०१-१०", type: "Sale", description: "Initial Purchase", amount: 3000, balance: 3000 },
    { id: "T007", entityId: "CN002", entityName: "Sarah Smith", entityType: "customer", date: "2081-01-30", nepaliDate: "२०८१-०१-३०", type: "Payment", description: "Partial Payment", amount: -2000, balance: 1000 },
    { id: "ST003", entityId: "SP001", entityName: "Tech Solutions Ltd", entityType: "supplier", date: "2081-02-15", nepaliDate: "२०८१-०२-१५", type: "Purchase", description: "Networking Equipment", amount: 20000, balance: 35000 },
    { id: "ST004", entityId: "SP002", entityName: "Office Supplies Co", entityType: "supplier", date: "2081-01-05", nepaliDate: "२०८१-०१-०५", type: "Purchase", description: "Office Supplies", amount: 12000, balance: 12000 },
  ];
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const Transactions = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false);
  
  const allTransactions = getAllMockTransactions();
  
  const filteredTransactions = allTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      typeFilter === "all" || 
      transaction.type.toLowerCase() === typeFilter.toLowerCase();
    
    let matchesDateFilter = true;
    if (dateFilter.from) {
      matchesDateFilter = matchesDateFilter && transaction.date >= dateFilter.from;
    }
    if (dateFilter.to) {
      matchesDateFilter = matchesDateFilter && transaction.date <= dateFilter.to;
    }
    
    return matchesSearch && matchesType && matchesDateFilter;
  });
  
  const handleTransactionClick = (transaction) => {
    setSelectedTransaction({
      ...transaction,
      customer: {
        id: transaction.entityId,
        name: transaction.entityName,
        address: "Address info would be here",
        phone: "Phone info would be here"
      }
    });
    setInvoiceDialogOpen(true);
  };
  
  const handleViewEntity = (entityId, entityType) => {
    navigate(`/${entityType}s/${entityId}`);
  };
  
  const handlePrint = () => {
    if (selectedTransaction) {
      generateTransactionReport({
        companyName: "Vyas Accounting",
        companyAddress: "Kathmandu, Nepal",
        companyPhone: "+977 1234567890",
        companyEmail: "info@vyasaccounting.com",
        transaction: selectedTransaction,
        entity: selectedTransaction.customer,
        reportTitle: `${selectedTransaction.type} Details`
      });
    } else {
      generateTransactionReport({
        companyName: "Vyas Accounting",
        companyAddress: "Kathmandu, Nepal",
        companyPhone: "+977 1234567890",
        companyEmail: "info@vyasaccounting.com",
        transaction: {
          id: "TRANSACTIONS",
          date: new Date().toISOString().split('T')[0],
          nepaliDate: "२०८१-०४-०१",
          type: "Transactions",
          description: "All Transactions",
          amount: 0,
          balance: 0
        },
        entity: {
          id: "ALL",
          name: "All Entities",
          address: "Various",
          phone: "Multiple"
        },
        dateRange: dateFilter.from && dateFilter.to ? {
          from: dateFilter.from,
          to: dateFilter.to
        } : undefined,
        transactions: filteredTransactions,
        showTransactions: true,
        reportTitle: "Transactions Report"
      });
    }
    
    toast.success("Printing initiated.");
  };
  
  const handleDownload = () => {
    handlePrint();
    toast.success("Download initiated.");
  };
  
  const handleNewTransaction = (type) => {
    navigate(`/${type}s/new`);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
            <p className="text-muted-foreground">
              View and manage all transactions.
            </p>
          </div>
          
          <div className="flex gap-2 items-center">
            <Button onClick={() => handleNewTransaction("sale")} className="bg-vyc-primary hover:bg-vyc-primary-dark">
              <Plus className="mr-2 h-4 w-4" /> New Sale
            </Button>
            <Button onClick={() => handleNewTransaction("purchase")} className="bg-vyc-primary hover:bg-vyc-primary-dark">
              <Plus className="mr-2 h-4 w-4" /> New Purchase
            </Button>
            <Button onClick={() => handleNewTransaction("payment")} className="bg-vyc-primary hover:bg-vyc-primary-dark">
              <Plus className="mr-2 h-4 w-4" /> New Payment
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex justify-between items-center">
              <span>All Transactions</span>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <FileDown className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button variant="outline" size="sm" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex items-center space-x-2">
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
                <select
                  className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="sale">Sales</option>
                  <option value="purchase">Purchases</option>
                  <option value="payment">Payments</option>
                </select>
                <Button variant="ghost" size="icon">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Entity</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow 
                        key={transaction.id} 
                        className="hover:bg-muted/30 cursor-pointer"
                        onClick={() => handleTransactionClick(transaction)}
                      >
                        <TableCell className="font-mono">{transaction.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{transaction.nepaliDate}</span>
                            <span className="text-xs text-muted-foreground">{transaction.date}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={
                            transaction.type === 'Payment' ? 'text-vyc-success' : 
                            transaction.type === 'Sale' ? 'text-vyc-accent' : 
                            'text-vyc-error'
                          }>
                            {transaction.type}
                          </span>
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span>{transaction.entityName}</span>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-6 w-6 ml-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewEntity(transaction.entityId, transaction.entityType);
                              }}
                            >
                              <ArrowUpRight className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={transaction.amount < 0 ? 'text-vyc-success' : 'text-vyc-error'}>
                            रू {formatCurrency(Math.abs(transaction.amount))}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {filteredTransactions.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground">
                Showing {filteredTransactions.length} of {allTransactions.length} transactions
              </div>
            )}
          </CardContent>
        </Card>
        
        <Dialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
            {selectedTransaction && (
              <InvoiceView 
                transaction={selectedTransaction} 
                customer={selectedTransaction.customer}
                onPrint={handlePrint}
                onDownload={handleDownload}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Transactions;

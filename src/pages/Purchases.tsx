import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Printer, FileDown, Mail } from "lucide-react";
import TransactionForm from "@/components/transactions/TransactionForm";
import InvoiceView from "@/components/transactions/InvoiceView";
import { emailReport } from "@/utils/print-utils";
import { toast } from "@/components/ui/toast-utils";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentFiscalYear } from "@/utils/nepali-fiscal-year";
import { formatNepaliDateNP } from "@/utils/nepali-date";

const Purchases = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [supplierData, setSupplierData] = useState<any>(null);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const supplierId = params.get("supplierId");
    
    if (supplierId) {
      const mockSupplierData = {
        "SP001": { 
          id: "SP001", 
          name: "Tech Solutions Ltd", 
          address: "Kathmandu, Nepal", 
          phone: "9801122334", 
          pan: "987654321", 
          balance: 35000, 
          type: "DR" 
        },
        "SP002": { 
          id: "SP002", 
          name: "Office Supplies Co", 
          address: "Lalitpur, Nepal", 
          phone: "9807766554", 
          pan: "123987456", 
          balance: 12000, 
          type: "DR" 
        }
      };
      
      if (mockSupplierData[supplierId]) {
        setSupplierData(mockSupplierData[supplierId]);
        setTransactionFormOpen(true);
        
        setCurrentTransaction({
          id: `PUR-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          nepaliDate: "२०८१-०३-१५",
          type: "Purchase",
          description: `Purchase from ${mockSupplierData[supplierId].name}`,
          amount: 0,
          balance: mockSupplierData[supplierId].balance,
          items: []
        });
      }
    }
  }, [location]);
  
  const handleNewPurchase = () => {
    navigate("/suppliers");
  };
  
  const handlePrint = () => {
    if (!supplierData || !currentTransaction) {
      toast.error("No transaction data available to print");
      return;
    }
    
    setShowPreview(true);
  };

  const handleExport = () => {
    if (!supplierData || !currentTransaction) {
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
    
    const mockItems = currentTransaction.items && currentTransaction.items.length > 0 
      ? currentTransaction.items 
      : [
          { id: "item1", name: "Product 1", quantity: 2, rate: 5000, amount: 10000 },
          { id: "item2", name: "Product 2", quantity: 1, rate: 7500, amount: 7500 }
        ];
      
    // Updated transaction with current data
    const updatedTransaction = {
      ...currentTransaction,
      currentDate,
      currentTime,
      currentNepaliDate,
      fiscalYear: fiscalYear.year,
      items: mockItems
    };
    
    // Use InvoiceView's download functionality
    window.print();
    toast.success("PDF export successful");
  };

  const handleEmailReport = () => {
    if (!supplierData || !currentTransaction) {
      toast.error("No transaction data available to email");
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
    
    const mockItems = currentTransaction.items && currentTransaction.items.length > 0 
      ? currentTransaction.items 
      : [
          { id: "item1", name: "Product 1", quantity: 2, rate: 5000, amount: 10000 },
          { id: "item2", name: "Product 2", quantity: 1, rate: 7500, amount: 7500 }
        ];
    
    emailReport({
      companyName: "Your Company",
      companyAddress: "Kathmandu, Nepal",
      companyPhone: "01-1234567",
      companyEmail: "info@yourcompany.com",
      companyPan: "123456789",
      transaction: {
        ...currentTransaction,
        currentDate,
        currentTime,
        currentNepaliDate,
        fiscalYear: fiscalYear.year,
        items: mockItems
      },
      entity: supplierData,
      showTransactions: false,
      reportTitle: "Purchase Invoice",
      recipient: supplierData.email
    });
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
            <p className="text-muted-foreground">Manage your purchase transactions.</p>
          </div>
          
          <div className="flex gap-2">
            {transactionFormOpen && supplierData && (
              <>
                <Button variant="outline" onClick={handleEmailReport} className="flex items-center gap-1 hover:bg-slate-100">
                  <Mail className="h-4 w-4" /> Email
                </Button>
                <Button variant="outline" onClick={handleExport} className="flex items-center gap-1 hover:bg-slate-100">
                  <FileDown className="h-4 w-4" /> Export
                </Button>
                <Button variant="outline" onClick={handlePrint} className="flex items-center gap-1 hover:bg-slate-100">
                  <Printer className="h-4 w-4" /> Print
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-1 hover:bg-slate-100">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          </div>
        </div>
        
        {!transactionFormOpen ? (
          <Card className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-4">New Purchase Transaction</h2>
                <p className="text-muted-foreground mb-6">
                  To create a new purchase, you need to select a supplier first.
                </p>
                <Button onClick={handleNewPurchase} className="bg-vyc-primary hover:bg-vyc-primary-dark transition-colors">
                  <Plus className="mr-2 h-4 w-4" /> Select Supplier
                </Button>
              </div>
              
              <div className="mt-8 border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Purchases</h3>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => navigate("/transactions?type=purchase")} 
                    variant="outline" 
                    className="border-slate-200 hover:bg-slate-50 transition-colors">
                    View All Purchases
                  </Button>
                  <Button onClick={() => navigate("/suppliers")} 
                    variant="outline"
                    className="border-slate-200 hover:bg-slate-50 transition-colors">
                    Go to Suppliers
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div>
            {supplierData && (
              <div className="mb-6">
                <TransactionForm
                  open={transactionFormOpen}
                  onOpenChange={setTransactionFormOpen}
                  type="purchase"
                  entity={supplierData}
                />
              </div>
            )}
            
            {showPreview && supplierData && currentTransaction && (
              <div className="mt-6">
                <Card className="mb-4">
                  <CardContent className="p-4 flex justify-between items-center bg-muted/30">
                    <h3 className="text-lg font-semibold">Print Preview</h3>
                    <Button variant="outline" onClick={() => setShowPreview(false)}>
                      Close Preview
                    </Button>
                  </CardContent>
                </Card>
                <InvoiceView 
                  transaction={{
                    ...currentTransaction,
                    items: currentTransaction.items && currentTransaction.items.length > 0 
                      ? currentTransaction.items 
                      : [
                          { id: "item1", name: "Product 1", quantity: 2, rate: 5000, amount: 10000 },
                          { id: "item2", name: "Product 2", quantity: 1, rate: 7500, amount: 7500 }
                        ]
                  }}
                  customer={supplierData}
                  onPrint={() => window.print()}
                  onDownload={handleExport}
                />
              </div>
            )}
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            #print-section, #print-section * {
              visibility: visible;
            }
            #print-section {
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

export default Purchases;

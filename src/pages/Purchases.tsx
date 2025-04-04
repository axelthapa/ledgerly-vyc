
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Printer, FileDown } from "lucide-react";
import TransactionForm from "@/components/transactions/TransactionForm";
import TransactionPrintTemplate from "@/components/print/TransactionPrintTemplate";
import { generateTransactionReport } from "@/utils/print-utils";
import { toast } from "@/components/ui/toast-utils";

const Purchases = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [supplierData, setSupplierData] = useState<any>(null);
  const [currentTransaction, setCurrentTransaction] = useState<any>(null);
  const [printVisible, setPrintVisible] = useState(false);
  
  // Parse query parameters to check if we have a supplierId
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const supplierId = params.get("supplierId");
    
    if (supplierId) {
      // Mock data lookup - in a real app, this would be a database call
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
        
        // Create a mock transaction for this supplier
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
    setPrintVisible(true);
    setTimeout(() => {
      window.print();
      setPrintVisible(false);
      toast.success("Printing initiated.");
    }, 100);
  };

  const handleExport = () => {
    if (!supplierData || !currentTransaction) {
      toast.error("No transaction data available to export");
      return;
    }
    
    generateTransactionReport({
      companyName: "Your Company",
      companyAddress: "Kathmandu, Nepal",
      companyPhone: "01-1234567",
      companyEmail: "info@yourcompany.com",
      companyPan: "123456789",
      transaction: currentTransaction,
      entity: supplierData,
      showTransactions: false,
      reportTitle: "Purchase Invoice"
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
                <Button variant="outline" onClick={handleExport}>
                  <FileDown className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button variant="outline" onClick={handlePrint}>
                  <Printer className="mr-2 h-4 w-4" /> Print
                </Button>
              </>
            )}
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
          </div>
        </div>
        
        {!transactionFormOpen ? (
          <div className="p-6 border rounded-md bg-muted/30">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">New Purchase Transaction</h2>
              <p className="text-muted-foreground mb-6">
                To create a new purchase, you need to select a supplier first.
              </p>
              <Button onClick={handleNewPurchase} className="bg-vyc-primary hover:bg-vyc-primary-dark">
                <Plus className="mr-2 h-4 w-4" /> Select Supplier
              </Button>
            </div>
            
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Recent Purchases</h3>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/transactions?type=purchase")} variant="outline">
                  View All Purchases
                </Button>
                <Button onClick={() => navigate("/suppliers")} variant="outline">
                  Go to Suppliers
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {supplierData && (
              <div className="mb-6">
                <TransactionForm
                  open={transactionFormOpen}
                  onOpenChange={setTransactionFormOpen}
                  type="purchase"
                  entity={supplierData}
                  onTransactionChange={setCurrentTransaction}
                />
              </div>
            )}
          </div>
        )}
        
        {/* Print Template (hidden by default) */}
        {supplierData && currentTransaction && (
          <div className={`print-only ${printVisible ? '' : 'hidden'}`}>
            <TransactionPrintTemplate
              companyName="Your Company"
              companyAddress="Kathmandu, Nepal"
              companyPhone="01-1234567"
              companyEmail="info@yourcompany.com"
              companyPan="123456789"
              transaction={currentTransaction}
              entity={supplierData}
              showTransactions={false}
            />
          </div>
        )}
      </div>
      
      {/* Print-specific styles */}
      <style jsx global>{`
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
      `}</style>
    </MainLayout>
  );
};

export default Purchases;

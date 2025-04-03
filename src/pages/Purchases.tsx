
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import TransactionForm from "@/components/transactions/TransactionForm";

const Purchases = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [supplierData, setSupplierData] = useState(null);
  
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
      }
    }
  }, [location]);
  
  const handleNewPurchase = () => {
    navigate("/suppliers");
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Purchases</h1>
            <p className="text-muted-foreground">Manage your purchase transactions.</p>
          </div>
          
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
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
                />
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Purchases;

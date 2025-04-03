
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import TransactionForm from "@/components/transactions/TransactionForm";

const Sales = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  
  // Parse query parameters to check if we have a customerId
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const customerId = params.get("customerId");
    
    if (customerId) {
      // Mock data lookup - in a real app, this would be a database call
      const mockCustomerData = {
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
        }
      };
      
      if (mockCustomerData[customerId]) {
        setCustomerData(mockCustomerData[customerId]);
        setTransactionFormOpen(true);
      }
    }
  }, [location]);
  
  const handleNewSale = () => {
    navigate("/customers");
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
            <p className="text-muted-foreground">Manage your sales transactions.</p>
          </div>
          
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        
        {!transactionFormOpen ? (
          <div className="p-6 border rounded-md bg-muted/30">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">New Sale Transaction</h2>
              <p className="text-muted-foreground mb-6">
                To create a new sale, you need to select a customer first.
              </p>
              <Button onClick={handleNewSale} className="bg-vyc-primary hover:bg-vyc-primary-dark">
                <Plus className="mr-2 h-4 w-4" /> Select Customer
              </Button>
            </div>
            
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/transactions?type=sale")} variant="outline">
                  View All Sales
                </Button>
                <Button onClick={() => navigate("/customers")} variant="outline">
                  Go to Customers
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {customerData && (
              <div className="mb-6">
                <TransactionForm
                  open={transactionFormOpen}
                  onOpenChange={setTransactionFormOpen}
                  type="sale"
                  entity={customerData}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Sales;

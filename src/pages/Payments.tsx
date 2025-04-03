
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import TransactionForm from "@/components/transactions/TransactionForm";

const Payments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [transactionFormOpen, setTransactionFormOpen] = useState(false);
  const [entityData, setEntityData] = useState(null);
  
  // Parse query parameters to check if we have an entity ID
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const customerId = params.get("customerId");
    const supplierId = params.get("supplierId");
    
    // Mock data lookup - in a real app, this would be a database call
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
      }
    };

    const mockSuppliersData = {
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
    
    if (customerId && mockCustomersData[customerId]) {
      setEntityData({...mockCustomersData[customerId], entityType: "customer"});
      setTransactionFormOpen(true);
    } else if (supplierId && mockSuppliersData[supplierId]) {
      setEntityData({...mockSuppliersData[supplierId], entityType: "supplier"});
      setTransactionFormOpen(true);
    }
  }, [location]);
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
            <p className="text-muted-foreground">Manage your payment transactions.</p>
          </div>
          
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
        </div>
        
        {!transactionFormOpen ? (
          <div className="p-6 border rounded-md bg-muted/30">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">New Payment Transaction</h2>
              <p className="text-muted-foreground mb-6">
                Please select an entity to make a payment to or from.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/customers")} className="bg-vyc-primary hover:bg-vyc-primary-dark">
                  <Plus className="mr-2 h-4 w-4" /> Select Customer
                </Button>
                <Button onClick={() => navigate("/suppliers")} className="bg-vyc-primary hover:bg-vyc-primary-dark">
                  <Plus className="mr-2 h-4 w-4" /> Select Supplier
                </Button>
              </div>
            </div>
            
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Recent Payments</h3>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/transactions?type=payment")} variant="outline">
                  View All Payments
                </Button>
                <Button onClick={() => navigate("/customers")} variant="outline">
                  Go to Customers
                </Button>
                <Button onClick={() => navigate("/suppliers")} variant="outline">
                  Go to Suppliers
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {entityData && (
              <div className="mb-6">
                <TransactionForm
                  open={transactionFormOpen}
                  onOpenChange={setTransactionFormOpen}
                  type="payment"
                  entity={entityData}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Payments;

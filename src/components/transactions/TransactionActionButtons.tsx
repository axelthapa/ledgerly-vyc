
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Receipt, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TransactionActionButtonsProps {
  entityType: "customer" | "supplier";
  entityId: string;
  onNewSale?: () => void;
  onNewPurchase?: () => void;
  onNewPayment?: () => void;
}

const TransactionActionButtons: React.FC<TransactionActionButtonsProps> = ({
  entityType,
  entityId,
  onNewSale,
  onNewPurchase,
  onNewPayment
}) => {
  const navigate = useNavigate();
  
  const isCustomer = entityType === "customer";
  
  const handleNewSale = () => {
    if (onNewSale) {
      onNewSale();
    } else {
      navigate(`/sales/new?customerId=${entityId}`);
    }
  };
  
  const handleNewPurchase = () => {
    if (onNewPurchase) {
      onNewPurchase();
    } else {
      navigate(`/purchases/new?supplierId=${entityId}`);
    }
  };
  
  const handleNewPayment = () => {
    if (onNewPayment) {
      onNewPayment();
    } else {
      navigate(`/payments/new?${entityType}Id=${entityId}`);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {isCustomer ? (
        <Button onClick={handleNewSale} className="bg-vyc-primary hover:bg-vyc-primary-dark">
          <Plus className="mr-2 h-4 w-4" /> New Sale
        </Button>
      ) : (
        <Button onClick={handleNewPurchase} className="bg-vyc-primary hover:bg-vyc-primary-dark">
          <Plus className="mr-2 h-4 w-4" /> New Purchase
        </Button>
      )}
      
      <Button onClick={handleNewPayment} variant="outline" className="border-vyc-primary text-vyc-primary hover:bg-vyc-primary/10">
        <CreditCard className="mr-2 h-4 w-4" /> New Payment
      </Button>
    </div>
  );
};

export default TransactionActionButtons;

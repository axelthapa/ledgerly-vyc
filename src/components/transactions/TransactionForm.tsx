
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast-utils";
import InvoiceView from "./InvoiceView";
import { useNavigate } from "react-router-dom";
import LineItemEntry, { LineItem } from "./LineItemEntry";
import { formatCurrency, convertToWords } from "@/utils/currency";

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "sale" | "purchase" | "payment";
  entity: {
    id: string;
    name: string;
    address: string;
    phone: string;
    pan?: string;
    balance: number;
    type: string;
    entityType?: string;
  };
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  open,
  onOpenChange,
  type,
  entity
}) => {
  const navigate = useNavigate();
  const isPayment = type === "payment";
  const isSale = type === "sale";
  const isPurchase = type === "purchase";
  
  const [formData, setFormData] = useState({
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "cash",
    amount: 0 // Added the amount field to fix the error
  });
  
  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      id: `item-${Date.now()}`,
      name: "",
      quantity: 1,
      rate: 0,
      amount: 0
    }
  ]);
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saveAndPayOpen, setSaveAndPayOpen] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + item.amount, 0);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For non-payment transactions, ensure we have line items
    if (!isPayment) {
      const hasValidItems = lineItems.some(item => item.name && item.quantity > 0 && item.rate > 0);
      if (!hasValidItems) {
        toast.error("Please add at least one item with name, quantity, and rate.");
        return;
      }
    }
    
    setConfirmOpen(true);
  };
  
  const handleConfirm = () => {
    console.log("Transaction data:", {
      type,
      entityId: entity.id,
      items: lineItems,
      total: calculateTotal(),
      ...formData
    });
    
    // Close confirmation dialog
    setConfirmOpen(false);
    
    // If it's a sale or purchase, ask if user wants to make payment
    if (isSale || isPurchase) {
      setSaveAndPayOpen(true);
    } else {
      // If it's a payment, just show success and close
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded successfully!`);
      onOpenChange(false);
      navigate("/transactions");
    }
  };
  
  const handlePreview = () => {
    setPreviewOpen(true);
  };
  
  const handleMakePayment = () => {
    setSaveAndPayOpen(false);
    
    // Here you'd go to the payment form with the right entity
    const entityType = isSale ? "customer" : "supplier";
    navigate(`/payments?${entityType}Id=${entity.id}`);
    
    // Show success message
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded successfully!`);
    onOpenChange(false);
  };
  
  const handleNoPayment = () => {
    setSaveAndPayOpen(false);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recorded successfully!`);
    onOpenChange(false);
    navigate("/transactions");
  };
  
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saveAndPayOpen, setSaveAndPayOpen] = useState(false);
  
  // Mock transaction data for preview
  const mockTransaction = {
    id: `T${Math.floor(Math.random() * 10000)}`,
    date: formData.date,
    nepaliDate: "२०८१-०४-०१", // This would normally be converted from date
    type: type.charAt(0).toUpperCase() + type.slice(1),
    description: formData.description || `New ${type}`,
    amount: isPayment ? parseFloat(formData.amount.toString()) : calculateTotal(),
    balance: entity.balance + (isSale ? calculateTotal() : -calculateTotal()),
    items: lineItems
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={`${!isPayment ? "sm:max-w-[800px]" : "sm:max-w-[500px]"} max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle>
              {isPurchase ? "New Purchase" : isSale ? "New Sale" : "New Payment"}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            {!isPayment && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="lineItems">Items</Label>
                  <LineItemEntry 
                    items={lineItems}
                    setItems={setLineItems}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount in Words</Label>
                    <div className="p-3 border rounded-md bg-muted/20 text-sm">
                      {convertToWords(calculateTotal())}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Total Amount</Label>
                    <div className="p-3 border rounded-md bg-muted/20 text-xl font-bold text-right">
                      {formatCurrency(calculateTotal())}
                    </div>
                  </div>
                </div>
              </>
            )}
            
            {isPayment && (
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleInputChange}
                  placeholder="Enter amount"
                  required
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder={`Enter ${type} description`}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {isPayment && (
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                >
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}
            
            <DialogFooter className="flex justify-between gap-2 pt-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handlePreview}
                >
                  Preview
                </Button>
              </div>
              <Button type="submit" className="bg-vyc-primary hover:bg-vyc-primary-dark">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to record this {type}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="bg-vyc-primary hover:bg-vyc-primary-dark">
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Preview</DialogTitle>
          </DialogHeader>
          <InvoiceView
            transaction={mockTransaction}
            customer={entity}
          />
        </DialogContent>
      </Dialog>
      
      {/* Save and Pay Dialog */}
      <AlertDialog open={saveAndPayOpen} onOpenChange={setSaveAndPayOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Record Payment?</AlertDialogTitle>
            <AlertDialogDescription>
              The {type} has been saved. Would you like to record a payment for this transaction now?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleNoPayment}>
              No, Later
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleMakePayment} className="bg-vyc-primary hover:bg-vyc-primary-dark">
              Yes, Make Payment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionForm;

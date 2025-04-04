
import React, { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, convertToWords } from "@/utils/currency";
import { Printer, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { generateTransactionReport } from "@/utils/print-utils";

interface LineItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceProps {
  transaction: {
    id: string;
    date: string;
    nepaliDate: string;
    type: string;
    description: string;
    amount: number;
    balance: number;
    paymentMethod?: string;
    items?: LineItem[];
  };
  customer: {
    id: string;
    name: string;
    address: string;
    phone: string;
    pan?: string;
    type?: string;
  };
  onPrint?: () => void;
  onDownload?: () => void;
}

const InvoiceView: React.FC<InvoiceProps> = ({ 
  transaction, 
  customer,
  onPrint,
  onDownload
}) => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const isPurchase = transaction.type === "Purchase";
  const isPayment = transaction.type === "Payment";
  const isSale = transaction.type === "Sale";
  
  // Generate mock items if not provided
  const items = transaction.items || generateMockItems();
  
  // Format amount in words
  const amountInWords = convertToWords(Math.abs(transaction.amount));
  
  function generateMockItems() {
    if (!isPurchase && !isSale) return [];
    
    // For demo purposes, generate some random items based on the transaction amount
    const totalAmount = Math.abs(transaction.amount);
    const itemCount = Math.max(1, Math.min(5, Math.floor(totalAmount / 1000)));
    const items = [];
    
    let remainingAmount = totalAmount;
    for (let i = 0; i < itemCount; i++) {
      const isLastItem = i === itemCount - 1;
      const itemAmount = isLastItem ? remainingAmount : Math.floor(remainingAmount / (itemCount - i) * 0.8);
      const quantity = Math.floor(Math.random() * 5) + 1;
      const rate = Math.round(itemAmount / quantity);
      
      items.push({
        id: `ITEM-${i + 1}`,
        name: `Product ${i + 1}`,
        quantity,
        rate,
        amount: quantity * rate
      });
      
      remainingAmount -= (quantity * rate);
    }
    
    return items;
  }
  
  const formattedDate = transaction.nepaliDate;
  
  // Format currency without the symbol since formatCurrency already adds it
  const formatAmountWithoutSymbol = (amount: number): string => {
    return new Intl.NumberFormat('ne-NP', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };
  
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
      return;
    }
    
    // Use our enhanced print function
    generateTransactionReport({
      companyName: "Vyas Accounting",
      companyAddress: "Kathmandu, Nepal",
      companyPhone: "+977 1234567890",
      companyEmail: "info@vyasaccounting.com",
      transaction: {
        ...transaction,
        items: items
      },
      entity: customer,
      reportTitle: isPurchase ? "Purchase Invoice" : isSale ? "Sales Invoice" : "Payment Receipt"
    });
  };
  
  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    
    // Use our enhanced PDF export function
    generateTransactionReport({
      companyName: "Vyas Accounting",
      companyAddress: "Kathmandu, Nepal",
      companyPhone: "+977 1234567890",
      companyEmail: "info@vyasaccounting.com",
      transaction: {
        ...transaction,
        items: items
      },
      entity: customer,
      reportTitle: isPurchase ? "Purchase Invoice" : isSale ? "Sales Invoice" : "Payment Receipt"
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={handlePrint}>
          <Printer className="mr-2 h-4 w-4" /> Print
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6" ref={invoiceRef}>
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold">
              {isPurchase ? "Purchase Invoice" : isSale ? "Sales Invoice" : "Payment Receipt"}
            </h2>
            <p className="text-muted-foreground">Transaction ID: {transaction.id}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="font-semibold">{isPurchase ? "Supplier" : "Customer"} Details</h3>
              <p>{customer.name}</p>
              <p className="text-muted-foreground">{customer.address}</p>
              <p className="text-muted-foreground">Phone: {customer.phone}</p>
              {customer.pan && <p className="text-muted-foreground">PAN: {customer.pan}</p>}
            </div>
            <div className="text-right">
              <h3 className="font-semibold">Invoice Details</h3>
              <p>Date: {formattedDate}</p>
              <p>Invoice #: {transaction.id}</p>
              <p>{isPurchase ? "Supplier" : "Customer"} ID: {customer.id}</p>
            </div>
          </div>
          
          <Separator className="my-4" />
          
          {(isPurchase || isSale) ? (
            <div className="mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="text-center">Quantity</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">रू {formatAmountWithoutSymbol(item.rate)}</TableCell>
                      <TableCell className="text-right">रू {formatAmountWithoutSymbol(item.amount)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} className="text-right font-semibold">Total</TableCell>
                    <TableCell className="text-right font-bold">रू {formatAmountWithoutSymbol(Math.abs(transaction.amount))}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              
              <div className="mt-4 p-3 border rounded-md bg-muted/10">
                <p><span className="font-semibold">In Words:</span> {amountInWords}</p>
              </div>
            </div>
          ) : (
            <div className="mb-6 border rounded-md p-4 bg-muted/30">
              <div className="flex justify-between">
                <h3 className="font-semibold">Payment Details</h3>
                <p className="font-bold text-vyc-success">रू {formatAmountWithoutSymbol(Math.abs(transaction.amount))}</p>
              </div>
              <p className="mt-2">Payment for: {transaction.description}</p>
              <p className="text-muted-foreground">Payment method: {transaction.paymentMethod || "Cash"}</p>
              <p className="mt-2"><span className="font-semibold">In Words:</span> {amountInWords}</p>
            </div>
          )}
          
          <div className="mt-8 border-t pt-4">
            <div className="flex justify-between">
              <div>
                <h3 className="font-semibold">Notes</h3>
                <p className="text-muted-foreground">{transaction.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Balance after transaction</p>
                <p className={`font-bold ${transaction.balance < 0 ? 'text-vyc-error' : 'text-vyc-success'}`}>
                  रू {formatAmountWithoutSymbol(Math.abs(transaction.balance))} {transaction.balance < 0 ? 'DR' : 'CR'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Thank you for your business!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceView;

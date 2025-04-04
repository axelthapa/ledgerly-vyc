
import React from "react";
import { formatCurrency, convertToWords } from "@/utils/currency";
import { getCurrentFiscalYear } from "@/utils/nepali-fiscal-year";

interface LineItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface TransactionPrintProps {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail?: string;
  companyPan?: string;
  transaction: {
    id: string;
    date: string;
    nepaliDate: string;
    type: string;
    description: string;
    amount: number;
    balance: number;
    items?: LineItem[];
  };
  entity: {
    id: string;
    name: string;
    address: string;
    phone: string;
    pan?: string;
  };
  dateRange?: {
    from: string;
    to: string;
  };
}

const TransactionPrintTemplate: React.FC<TransactionPrintProps> = ({
  companyName,
  companyAddress,
  companyPhone,
  companyEmail,
  companyPan,
  transaction,
  entity,
  dateRange
}) => {
  const fiscalYear = getCurrentFiscalYear();
  const isOpeningBalance = transaction.description?.toLowerCase().includes("opening balance");

  // Format amount in words
  const amountInWords = convertToWords(Math.abs(transaction.amount));
  const items = transaction.items || [];
  
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      {/* Company Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold uppercase">{companyName}</h1>
        <p>{companyAddress}</p>
        <p>Phone: {companyPhone} {companyEmail && `| Email: ${companyEmail}`}</p>
        {companyPan && <p>PAN: {companyPan}</p>}
        <div className="mt-4 border-t border-b py-2">
          <h2 className="text-xl font-semibold">
            {transaction.type === "Purchase" ? "PURCHASE INVOICE" : 
             transaction.type === "Sale" ? "SALES INVOICE" : 
             "PAYMENT RECEIPT"}
          </h2>
        </div>
      </div>

      {/* Document Info */}
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="font-semibold">{transaction.type === "Purchase" ? "Supplier" : "Customer"} Details</h3>
          <p><strong>{entity.name}</strong></p>
          <p>{entity.address}</p>
          <p>Phone: {entity.phone}</p>
          {entity.pan && <p>PAN: {entity.pan}</p>}
        </div>
        <div className="text-right">
          <p><strong>Invoice #:</strong> {transaction.id}</p>
          <p><strong>Date:</strong> {transaction.nepaliDate}</p>
          <p><strong>Fiscal Year:</strong> {fiscalYear.year}</p>
          {dateRange && (
            <p><strong>Report Period:</strong> {dateRange.from} - {dateRange.to}</p>
          )}
        </div>
      </div>

      {/* Opening Balance Note */}
      {isOpeningBalance && (
        <div className="bg-gray-100 p-4 mb-6 rounded">
          <p className="font-semibold">Opening Balance for Fiscal Year {fiscalYear.year}</p>
          <p className="text-sm">Click for transactions from previous fiscal year</p>
        </div>
      )}

      {/* Line Items Table */}
      {items.length > 0 && (
        <div className="mb-6">
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Item</th>
                <th className="border p-2 text-center">Quantity</th>
                <th className="border p-2 text-right">Rate</th>
                <th className="border p-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-right">रू {formatCurrency(item.rate)}</td>
                  <td className="border p-2 text-right">रू {formatCurrency(item.amount)}</td>
                </tr>
              ))}
              <tr className="font-bold">
                <td className="border p-2" colSpan={3}>Total</td>
                <td className="border p-2 text-right">रू {formatCurrency(Math.abs(transaction.amount))}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Payment Details (if it's a payment) */}
      {transaction.type === "Payment" && (
        <div className="mb-6 border rounded p-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">Payment Details</h3>
            <p className="font-bold">रू {formatCurrency(Math.abs(transaction.amount))}</p>
          </div>
          <p className="mt-2">Payment for: {transaction.description}</p>
          <p>Payment method: Cash</p>
        </div>
      )}

      {/* Amount in Words */}
      <div className="mb-6 p-3 border rounded">
        <p><strong>Amount in words:</strong> {amountInWords}</p>
      </div>

      {/* Notes */}
      <div className="mb-10">
        <h3 className="font-semibold">Notes</h3>
        <p>{transaction.description}</p>
      </div>

      {/* Footer */}
      <div className="flex justify-between pt-8 mt-8 border-t">
        <div>
          <p className="font-semibold">Customer Signature</p>
          <div className="mt-10 border-t border-dashed w-40"></div>
        </div>
        <div className="text-right">
          <p className="font-semibold">For {companyName}</p>
          <div className="mt-10 border-t border-dashed w-40 ml-auto"></div>
          <p className="text-sm">Authorized Signature</p>
        </div>
      </div>

      {/* Thank You Message */}
      <div className="text-center mt-8 pt-4 border-t text-gray-600">
        <p>Thank you for your business!</p>
      </div>
    </div>
  );
};

export default TransactionPrintTemplate;

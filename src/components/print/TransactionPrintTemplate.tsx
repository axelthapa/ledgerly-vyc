
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
    paymentMethod?: string;
    items?: LineItem[];
  };
  entity: {
    id: string;
    name: string;
    address: string;
    phone: string;
    pan?: string;
    type?: string;
  };
  dateRange?: {
    from: string;
    to: string;
  };
  transactions?: any[];
  showTransactions?: boolean;
}

const TransactionPrintTemplate: React.FC<TransactionPrintProps> = ({
  companyName,
  companyAddress,
  companyPhone,
  companyEmail,
  companyPan,
  transaction,
  entity,
  dateRange,
  transactions = [],
  showTransactions = false
}) => {
  const fiscalYear = getCurrentFiscalYear();
  const isOpeningBalance = transaction.description?.toLowerCase().includes("opening balance");
  const isPurchase = transaction.type === "Purchase";
  const isSale = transaction.type === "Sale";
  const isPayment = transaction.type === "Payment";

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
            {isPurchase ? "PURCHASE INVOICE" : 
             isSale ? "SALES INVOICE" : 
             isPayment ? "PAYMENT RECEIPT" :
             "TRANSACTION REPORT"}
          </h2>
        </div>
      </div>

      {/* Document Info */}
      <div className="flex justify-between mb-6">
        <div>
          <h3 className="font-semibold">
            {(isPurchase || isSale || isPayment) ? 
              (isPurchase ? "Supplier" : "Customer") + " Details" : 
              "Entity Details"}
          </h3>
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
      {isPayment && (
        <div className="mb-6 border rounded p-4">
          <div className="flex justify-between">
            <h3 className="font-semibold">Payment Details</h3>
            <p className="font-bold">रू {formatCurrency(Math.abs(transaction.amount))}</p>
          </div>
          <p className="mt-2">Payment for: {transaction.description}</p>
          <p>Payment method: {transaction.paymentMethod || "Cash"}</p>
        </div>
      )}

      {/* Transaction History (if showing transactions) */}
      {showTransactions && transactions && transactions.length > 0 && (
        <div className="mb-6">
          <h3 className="font-bold mb-2">Transaction History</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left">Date</th>
                <th className="border p-2 text-left">Reference</th>
                <th className="border p-2 text-left">Description</th>
                <th className="border p-2 text-left">Type</th>
                <th className="border p-2 text-right">Amount</th>
                <th className="border p-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx, index) => (
                <tr key={`${trx.id}-${index}`}>
                  <td className="border p-2">{trx.nepaliDate}</td>
                  <td className="border p-2">{trx.id}</td>
                  <td className="border p-2">{trx.description}</td>
                  <td className="border p-2">{trx.type}</td>
                  <td className="border p-2 text-right">
                    रू {formatCurrency(Math.abs(trx.amount))}
                  </td>
                  <td className="border p-2 text-right">
                    रू {formatCurrency(Math.abs(trx.balance))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {/* Current Balance Summary */}
      {entity && entity.type && (
        <div className="mb-6 text-right">
          <p><strong>Closing Balance:</strong> रू {formatCurrency(Math.abs(transaction.balance))} {
            transaction.balance < 0 ? 'DR' : 'CR'
          }</p>
        </div>
      )}

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


import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, FileDown, FileCog } from "lucide-react";
import { formatNepaliDate } from "@/utils/nepali-date";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency";

interface Transaction {
  id: string;
  type: "sale" | "expense" | "cash" | "bank";
  description: string;
  amount: number;
  isCredit: boolean;
  timestamp: Date;
}

const TransactionLog: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  
  // Mock transaction data
  const transactions: Transaction[] = [
    {
      id: "TRX001",
      type: "sale",
      description: "Daily sale - Electronics",
      amount: 15000,
      isCredit: true,
      timestamp: new Date(),
    },
    {
      id: "TRX002",
      type: "expense",
      description: "Utility bill payment",
      amount: 2500,
      isCredit: false,
      timestamp: new Date(),
    },
    {
      id: "TRX003",
      type: "cash",
      description: "Cash deposit to petty cash",
      amount: 5000,
      isCredit: true,
      timestamp: new Date(),
    },
    {
      id: "TRX004",
      type: "bank",
      description: "Bank transfer to supplier",
      amount: 25000,
      isCredit: false,
      timestamp: new Date(),
    },
    {
      id: "TRX005",
      type: "sale",
      description: "Daily sale - Furniture",
      amount: 35000,
      isCredit: true,
      timestamp: new Date(),
    },
  ];
  
  const handleExport = () => {
    // Mock function to export transaction log
    console.log("Exporting transaction log");
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case "sale":
        return "bg-green-100 text-green-800 border-green-200";
      case "expense":
        return "bg-red-100 text-red-800 border-red-200";
      case "cash":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "bank":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };
  
  // Calculate summary
  const totalIncome = transactions
    .filter(tx => tx.isCredit)
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const totalExpense = transactions
    .filter(tx => !tx.isCredit)
    .reduce((sum, tx) => sum + tx.amount, 0);
    
  const netBalance = totalIncome - totalExpense;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Daily Transaction Log</CardTitle>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <CalendarIcon className="h-4 w-4" />
                {formatNepaliDate(date)}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <Button variant="outline" className="flex gap-2" onClick={handleExport}>
            <FileDown className="h-4 w-4" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 rounded-md bg-green-50 border border-green-200">
            <div className="text-sm text-green-600 font-medium">Total Income</div>
            <div className="text-xl font-bold text-green-700">{formatCurrency(totalIncome)}</div>
          </div>
          
          <div className="p-4 rounded-md bg-red-50 border border-red-200">
            <div className="text-sm text-red-600 font-medium">Total Expense</div>
            <div className="text-xl font-bold text-red-700">{formatCurrency(totalExpense)}</div>
          </div>
          
          <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
            <div className="text-sm text-blue-600 font-medium">Net Balance</div>
            <div className="text-xl font-bold text-blue-700">{formatCurrency(netBalance)}</div>
          </div>
        </div>
        
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/20 p-2 rounded cursor-pointer transition-colors"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getTypeColor(transaction.type)}
                  >
                    {transaction.type}
                  </Badge>
                  <span className="font-medium">{transaction.description}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {transaction.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <div className="text-right">
                <div className={cn(
                  "font-medium",
                  transaction.isCredit ? "text-green-600" : "text-red-600"
                )}>
                  {transaction.isCredit ? "+" : "-"} {formatCurrency(transaction.amount)}
                </div>
                <div className="text-xs mt-1">
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                    <FileCog className="h-3 w-3 mr-1" /> Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionLog;

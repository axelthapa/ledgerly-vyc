
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { formatNepaliDate } from "@/utils/nepali-date";
import { cn } from "@/lib/utils";

const CashBalances: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="transaction-type">Transaction Type</Label>
              <Select>
                <SelectTrigger id="transaction-type">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="opening">Opening Balance</SelectItem>
                  <SelectItem value="closing">Closing Balance</SelectItem>
                  <SelectItem value="deposit">Cash Deposit</SelectItem>
                  <SelectItem value="withdrawal">Cash Withdrawal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-48">
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? formatNepaliDate(date) : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input id="amount" type="number" placeholder="Enter amount" min={0} />
          </div>
          
          <div>
            <Label htmlFor="reference">Reference Number (Optional)</Label>
            <Input id="reference" placeholder="Enter reference number if available" />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Add any additional notes" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-md bg-green-50 border border-green-200">
              <div className="text-sm text-green-600 font-medium">Current Cash Balance</div>
              <div className="text-xl font-bold text-green-700">Rs 45,000.00</div>
              <div className="text-xs text-green-600 mt-1">As of today</div>
            </div>
            
            <div className="p-4 rounded-md bg-blue-50 border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Expected Balance After Transaction</div>
              <div className="text-xl font-bold text-blue-700">Rs 45,000.00</div>
              <div className="text-xs text-blue-600 mt-1">Will be updated as you enter amount</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashBalances;

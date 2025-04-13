
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ActivitySquare } from "lucide-react";
import DailySales from "./DailySales";
import DailyExpenses from "./DailyExpenses";
import CashBalances from "./CashBalances";
import BankTransfers from "./BankTransfers";
import { toast } from "@/components/ui/toast-utils";

const DailyTransactionDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  const handleSave = () => {
    toast.success("Daily transaction activity saved successfully");
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-vyc-primary/10 text-vyc-primary hover:bg-vyc-primary/20 hover:text-vyc-primary"
        >
          <ActivitySquare className="h-5 w-5" />
          <span>Daily Transaction Activity</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[850px]">
        <DialogHeader>
          <DialogTitle>Daily Transaction Activity</DialogTitle>
          <DialogDescription>
            Record your daily sales, expenses, cash balances, and bank transfers.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="sales" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">Daily Sales</TabsTrigger>
            <TabsTrigger value="expenses">Daily Expenses</TabsTrigger>
            <TabsTrigger value="cash">Cash Balances</TabsTrigger>
            <TabsTrigger value="bank">Bank Transfers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="mt-4">
            <DailySales />
          </TabsContent>
          
          <TabsContent value="expenses" className="mt-4">
            <DailyExpenses />
          </TabsContent>
          
          <TabsContent value="cash" className="mt-4">
            <CashBalances />
          </TabsContent>
          
          <TabsContent value="bank" className="mt-4">
            <BankTransfers />
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DailyTransactionDialog;

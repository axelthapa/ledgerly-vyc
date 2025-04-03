
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Sales = () => {
  const navigate = useNavigate();
  
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
        
        <div className="p-6 border rounded-md bg-muted/30 text-center">
          <p className="text-lg">This page is under construction.</p>
          <p className="text-muted-foreground mt-2">
            Sales functionality is available through the Customer details page or Transactions page.
          </p>
          <div className="mt-4 flex gap-4 justify-center">
            <Button onClick={() => navigate("/customers")}>Go to Customers</Button>
            <Button onClick={() => navigate("/transactions")}>Go to Transactions</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Sales;

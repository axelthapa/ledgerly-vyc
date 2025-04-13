
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import { formatNepaliDate } from "@/utils/nepali-date";
import { cn } from "@/lib/utils";

const DailyExpenses: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, rate: 0, amount: 0 }
  ]);
  
  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0
    };
    setItems([...items, newItem]);
  };
  
  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };
  
  const updateItem = (id: number, field: string, value: string | number) => {
    const updatedItems = items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Update amount if quantity or rate changes
        if (field === 'quantity' || field === 'rate') {
          const quantity = field === 'quantity' ? Number(value) : item.quantity;
          const rate = field === 'rate' ? Number(value) : item.rate;
          updatedItem.amount = quantity * rate;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    setItems(updatedItems);
  };
  
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="supplier">Supplier (Optional)</Label>
              <Select>
                <SelectTrigger id="supplier">
                  <SelectValue placeholder="Select supplier or leave blank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Non-registered Supplier</SelectItem>
                  <SelectItem value="supplier1">Supplier 1</SelectItem>
                  <SelectItem value="supplier2">Supplier 2</SelectItem>
                  <SelectItem value="supplier3">Supplier 3</SelectItem>
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
            <Label htmlFor="expense-type">Expense Type</Label>
            <Select>
              <SelectTrigger id="expense-type">
                <SelectValue placeholder="Select expense type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inventory">Inventory Purchase</SelectItem>
                <SelectItem value="utility">Utility Bill</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
                <SelectItem value="salary">Salary</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="invoice">Invoice/Bill Number (Optional)</Label>
            <Input id="invoice" placeholder="Enter invoice or bill number if available" />
          </div>
          
          <div className="border rounded-md p-4">
            <div className="font-medium mb-2">Items</div>
            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                  <div className="col-span-12 sm:col-span-6">
                    <Input 
                      placeholder="Item description" 
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <Input 
                      type="number" 
                      placeholder="Qty" 
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', Number(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <Input 
                      type="number" 
                      placeholder="Rate" 
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', Number(e.target.value))}
                      min={0}
                    />
                  </div>
                  <div className="col-span-3 sm:col-span-1 text-right">
                    {item.amount}
                  </div>
                  <div className="col-span-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={addItem}
              >
                <Plus className="h-4 w-4 mr-1" /> Add Item
              </Button>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea id="notes" placeholder="Add any additional notes" />
          </div>
          
          <div className="flex justify-end">
            <div className="bg-muted p-4 rounded-md">
              <div className="text-sm">Total Amount</div>
              <div className="text-2xl font-bold">Rs {totalAmount}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyExpenses;

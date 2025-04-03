
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/currency";

export interface LineItem {
  id: string;
  name: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface LineItemEntryProps {
  items: LineItem[];
  setItems: React.Dispatch<React.SetStateAction<LineItem[]>>;
}

const LineItemEntry: React.FC<LineItemEntryProps> = ({ items, setItems }) => {
  const addNewItem = () => {
    const newItem: LineItem = {
      id: `item-${Date.now()}`,
      name: "",
      quantity: 1,
      rate: 0,
      amount: 0
    };
    
    setItems([...items, newItem]);
  };
  
  const updateItem = (id: string, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate amount if quantity or rate changes
        if (field === "quantity" || field === "rate") {
          updatedItem.quantity = field === "quantity" ? Number(value) : item.quantity;
          updatedItem.rate = field === "rate" ? Number(value) : item.rate;
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        
        return updatedItem;
      }
      return item;
    }));
  };
  
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };
  
  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Item Description</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right">Rate</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Input
                    value={item.name}
                    onChange={(e) => updateItem(item.id, "name", e.target.value)}
                    placeholder="Product name"
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                    className="w-20 mx-auto text-center"
                  />
                </TableCell>
                <TableCell className="text-right">
                  <Input
                    type="number"
                    min={0}
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, "rate", e.target.value)}
                    className="w-32 ml-auto text-right"
                  />
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(item.amount)}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} className="text-right font-semibold">Total:</TableCell>
              <TableCell className="text-right font-bold">{formatCurrency(calculateTotal())}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      
      <div className="flex justify-start">
        <Button
          type="button"
          variant="outline"
          onClick={addNewItem}
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>
    </div>
  );
};

export default LineItemEntry;

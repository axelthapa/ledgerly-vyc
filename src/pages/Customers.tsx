import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { toast } from "@/components/ui/toast-utils";
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

const mockCustomers = [
  { id: "CN001", name: "John Doe", address: "Kathmandu, Nepal", phone: "9801234567", pan: "123456789", balance: 15000, type: "CR" },
  { id: "CN002", name: "Sarah Smith", address: "Pokhara, Nepal", phone: "9807654321", pan: "987654321", balance: -5000, type: "DR" },
  { id: "CN003", name: "Rajesh Kumar", address: "Lalitpur, Nepal", phone: "9812345678", pan: "234567891", balance: 25000, type: "CR" },
  { id: "CN004", name: "Anita Sharma", address: "Bhaktapur, Nepal", phone: "9854321098", pan: "345678912", balance: 0, type: "CR" },
  { id: "CN005", name: "Bikash Thapa", address: "Chitwan, Nepal", phone: "9867890123", pan: "456789123", balance: -12000, type: "DR" },
];

interface CustomerFormData {
  name: string;
  address: string;
  phone: string;
  pan: string;
  openingBalance: number;
  balanceType: "CR" | "DR";
}

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [formData, setFormData] = useState<CustomerFormData>({
    name: "",
    address: "",
    phone: "",
    pan: "",
    openingBalance: 0,
    balanceType: "CR",
  });
  
  const filteredCustomers = mockCustomers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "balanceType") {
      setFormData({ 
        ...formData, 
        [name]: value === "CR" || value === "DR" ? value : "CR" 
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmDialogOpen(true);
  };
  
  const confirmSave = () => {
    console.log("Customer data to save:", formData);
    
    toast.success("Customer added successfully!");
    
    setFormData({
      name: "",
      address: "",
      phone: "",
      pan: "",
      openingBalance: 0,
      balanceType: "CR",
    });
    setConfirmDialogOpen(false);
    setDialogOpen(false);
  };
  
  const handleEdit = (customerId: string) => {
    const customer = mockCustomers.find(c => c.id === customerId);
    if (customer) {
      const balanceType: "CR" | "DR" = customer.type === "CR" || customer.type === "DR" 
        ? customer.type 
        : "CR";
        
      setFormData({
        name: customer.name,
        address: customer.address,
        phone: customer.phone,
        pan: customer.pan,
        openingBalance: Math.abs(customer.balance),
        balanceType: balanceType,
      });
      setDialogOpen(true);
    }
  };
  
  const handleDeleteClick = (customerId: string) => {
    setSelectedCustomer(customerId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    console.log("Deleting customer:", selectedCustomer);
    
    toast.success("Customer deleted successfully!");
    
    setDeleteDialogOpen(false);
    setSelectedCustomer(null);
  };
  
  const getTotalBalance = () => {
    const total = mockCustomers.reduce((sum, customer) => {
      const adjustedBalance = customer.type === "DR" ? -customer.balance : customer.balance;
      return sum + adjustedBalance;
    }, 0);
    
    return {
      amount: Math.abs(total),
      type: total >= 0 ? "CR" : "DR",
    };
  };
  
  const totalBalance = getTotalBalance();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
            <p className="text-muted-foreground">
              Manage your customers and their balances.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Button className="bg-vyc-primary hover:bg-vyc-primary-dark" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Customer Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter customer name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">Address</label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter address"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="pan" className="text-sm font-medium">PAN Number</label>
                    <Input
                      id="pan"
                      name="pan"
                      value={formData.pan}
                      onChange={handleInputChange}
                      placeholder="Enter PAN number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="openingBalance" className="text-sm font-medium">Opening Balance</label>
                    <Input
                      id="openingBalance"
                      name="openingBalance"
                      type="number"
                      value={formData.openingBalance}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="balanceType" className="text-sm font-medium">Balance Type</label>
                    <select
                      id="balanceType"
                      name="balanceType"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={formData.balanceType}
                      onChange={handleInputChange}
                    >
                      <option value="CR">CR (Credit)</option>
                      <option value="DR">DR (Debit)</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-vyc-primary hover:bg-vyc-primary-dark">
                    Save Customer
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          
          <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Save</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to save this customer information?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmSave} className="bg-vyc-primary hover:bg-vyc-primary-dark">
                  Yes, Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this customer? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                  Yes, Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        
        <div className="flex items-center py-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>PAN</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="cursor-pointer hover:bg-gray-50" onDoubleClick={() => handleEdit(customer.id)}>
                    <TableCell>{customer.id}</TableCell>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.address}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.pan}</TableCell>
                    <TableCell className="text-right">
                      <span className={customer.type === "DR" ? "text-vyc-error" : "text-vyc-success"}>
                        {formatCurrency(customer.balance)} {customer.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(customer.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-vyc-error" onClick={() => handleDeleteClick(customer.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="bg-muted/30 p-4 rounded-md">
          <div className="flex justify-between">
            <div>
              <h3 className="font-medium">Summary</h3>
              <p className="text-sm text-muted-foreground">Total Customers: {mockCustomers.length}</p>
            </div>
            <div className="text-right">
              <div className="text-sm">Total Balance</div>
              <div className="text-lg font-bold">
                <span className={totalBalance.type === "DR" ? "text-vyc-error" : "text-vyc-success"}>
                  {formatCurrency(totalBalance.amount)} {totalBalance.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Customers;

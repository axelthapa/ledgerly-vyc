
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
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

// Mock suppliers data
const mockSuppliers = [
  { id: "SP001", name: "Tech Solutions Ltd", address: "Kathmandu, Nepal", phone: "9801234111", pan: "987650001", balance: 35000, type: "DR" },
  { id: "SP002", name: "Office Supplies Co", address: "Lalitpur, Nepal", phone: "9807654222", pan: "987650002", balance: -8000, type: "CR" },
  { id: "SP003", name: "Nepal Electronics", address: "Bhaktapur, Nepal", phone: "9812345333", pan: "987650003", balance: 12000, type: "DR" },
  { id: "SP004", name: "Green Grocers", address: "Patan, Nepal", phone: "9854321444", pan: "987650004", balance: 0, type: "CR" },
  { id: "SP005", name: "Modern Furniture", address: "Pokhara, Nepal", phone: "9867890555", pan: "987650005", balance: 18000, type: "DR" },
];

interface SupplierFormData {
  name: string;
  address: string;
  phone: string;
  pan: string;
  openingBalance: number;
  balanceType: "CR" | "DR";
}

const Suppliers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [formData, setFormData] = useState<SupplierFormData>({
    name: "",
    address: "",
    phone: "",
    pan: "",
    openingBalance: 0,
    balanceType: "DR",
  });
  
  const filteredSuppliers = mockSuppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm)
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === "balanceType") {
      setFormData({ 
        ...formData, 
        [name]: value === "CR" || value === "DR" ? (value as "CR" | "DR") : "DR" 
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
    console.log("Supplier data to save:", formData);
    
    toast.success("Supplier added successfully!");
    
    setFormData({
      name: "",
      address: "",
      phone: "",
      pan: "",
      openingBalance: 0,
      balanceType: "DR",
    });
    setConfirmDialogOpen(false);
    setDialogOpen(false);
  };
  
  const handleEdit = (supplierId: string) => {
    const supplier = mockSuppliers.find(s => s.id === supplierId);
    if (supplier) {
      const balanceType: "CR" | "DR" = supplier.type === "CR" || supplier.type === "DR" 
        ? supplier.type 
        : "DR";
        
      setFormData({
        name: supplier.name,
        address: supplier.address,
        phone: supplier.phone,
        pan: supplier.pan,
        openingBalance: Math.abs(supplier.balance),
        balanceType: balanceType,
      });
      setDialogOpen(true);
    }
  };
  
  const handleDeleteClick = (supplierId: string) => {
    setSelectedSupplier(supplierId);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    console.log("Deleting supplier:", selectedSupplier);
    
    toast.success("Supplier deleted successfully!");
    
    setDeleteDialogOpen(false);
    setSelectedSupplier(null);
  };
  
  const handleViewSupplier = (supplierId: string) => {
    navigate(`/suppliers/${supplierId}`);
  };
  
  const getTotalBalance = () => {
    const total = mockSuppliers.reduce((sum, supplier) => {
      const adjustedBalance = supplier.type === "DR" ? supplier.balance : -supplier.balance;
      return sum + adjustedBalance;
    }, 0);
    
    return {
      amount: Math.abs(total),
      type: total >= 0 ? "DR" : "CR",
    };
  };
  
  const totalBalance = getTotalBalance();
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Suppliers</h1>
            <p className="text-muted-foreground">
              Manage your suppliers and their balances.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <Button className="bg-vyc-primary hover:bg-vyc-primary-dark" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Supplier
            </Button>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">Supplier Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter supplier name"
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
                      <option value="DR">DR (Debit)</option>
                      <option value="CR">CR (Credit)</option>
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
                    Save Supplier
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
                  Are you sure you want to save this supplier information?
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
                  Are you sure you want to delete this supplier? This action cannot be undone.
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
              placeholder="Search suppliers..."
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
                <TableHead>Supplier ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>PAN</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6">
                    No suppliers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id} className="cursor-pointer hover:bg-gray-50" onDoubleClick={() => handleViewSupplier(supplier.id)}>
                    <TableCell>{supplier.id}</TableCell>
                    <TableCell className="font-medium">{supplier.name}</TableCell>
                    <TableCell>{supplier.address}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.pan}</TableCell>
                    <TableCell className="text-right">
                      <span className={supplier.type === "DR" ? "text-vyc-error" : "text-vyc-success"}>
                        रू {formatCurrency(supplier.balance)} {supplier.type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewSupplier(supplier.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(supplier.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-vyc-error" onClick={() => handleDeleteClick(supplier.id)}>
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
              <p className="text-sm text-muted-foreground">Total Suppliers: {mockSuppliers.length}</p>
            </div>
            <div className="text-right">
              <div className="text-sm">Total Balance</div>
              <div className="text-lg font-bold">
                <span className={totalBalance.type === "DR" ? "text-vyc-error" : "text-vyc-success"}>
                  रू {formatCurrency(totalBalance.amount)} {totalBalance.type}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Suppliers;

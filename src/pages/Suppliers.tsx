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
import { Plus, Search, Edit, Trash2, Eye, Printer, FileDown, Mail } from "lucide-react";
import { formatCurrency } from "@/utils/currency";
import { toast } from "@/components/ui/toast-utils";
import TransactionPrintTemplate from "@/components/print/TransactionPrintTemplate";
import { generateTransactionReport, emailReport } from "@/utils/print-utils";
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
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentFiscalYear } from "@/utils/nepali-fiscal-year";
import { formatNepaliDateNP } from "@/utils/nepali-date";

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
  const [printVisible, setPrintVisible] = useState(false);
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
  
  const handlePrint = () => {
    generateTransactionReport({
      companyName: "Your Company",
      companyAddress: "Kathmandu, Nepal",
      companyPhone: "01-1234567",
      companyEmail: "info@yourcompany.com",
      companyPan: "123456789",
      transaction: {
        id: `SUP-LIST-${Date.now()}`,
        date: new Date().toLocaleDateString(),
        nepaliDate: formatNepaliDateNP(new Date()),
        type: "Report",
        description: "Suppliers List Report",
        amount: getTotalBalance().amount,
        balance: getTotalBalance().amount,
        currentDate: new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        currentTime: new Date().toLocaleTimeString('en-US'),
        currentNepaliDate: formatNepaliDateNP(new Date()),
        fiscalYear: getCurrentFiscalYear().year,
      },
      entity: {
        id: "SUPPLIERS",
        name: "Suppliers List",
        address: "All Suppliers",
        phone: "",
        type: "Report"
      },
      transactions: mockSuppliers.map(supplier => ({
        id: supplier.id,
        date: new Date().toLocaleDateString(),
        nepaliDate: "२०८१-०३-१५",
        type: "Supplier",
        description: supplier.name,
        amount: supplier.balance,
        balance: supplier.balance,
      })),
      showTransactions: true,
      reportTitle: "Suppliers List",
      previewOnly: true
    });

    toast.success("Print preview opened in new window");
  };

  const handleExport = () => {
    // Get current date and time
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const currentTime = now.toLocaleTimeString('en-US');
    const currentNepaliDate = formatNepaliDateNP(now);
    const fiscalYear = getCurrentFiscalYear();
    
    // Mock transaction data for supplier list report
    const mockTransaction = {
      id: `SUP-LIST-${Date.now()}`,
      date: currentDate,
      nepaliDate: currentNepaliDate,
      type: "Report",
      description: "Suppliers List Report",
      amount: getTotalBalance().amount,
      balance: getTotalBalance().amount,
      currentDate,
      currentTime,
      currentNepaliDate,
      fiscalYear: fiscalYear.year,
    };

    // Generate report
    generateTransactionReport({
      companyName: "Your Company",
      companyAddress: "Kathmandu, Nepal",
      companyPhone: "01-1234567",
      companyEmail: "info@yourcompany.com",
      companyPan: "123456789",
      transaction: mockTransaction,
      entity: {
        id: "SUPPLIERS",
        name: "Suppliers List",
        address: "All Suppliers",
        phone: "",
        type: "Report"
      },
      transactions: mockSuppliers.map(supplier => ({
        id: supplier.id,
        date: new Date().toLocaleDateString(),
        nepaliDate: "२०८१-०३-१५",
        type: "Supplier",
        description: supplier.name,
        amount: supplier.balance,
        balance: supplier.balance,
      })),
      showTransactions: true,
      reportTitle: "Suppliers List"
    });

    toast.success("Report exported successfully!");
  };
  
  const handleEmailReport = () => {
    // Get current date and time
    const now = new Date();
    const currentDate = now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const currentTime = now.toLocaleTimeString('en-US');
    const currentNepaliDate = formatNepaliDateNP(now);
    const fiscalYear = getCurrentFiscalYear();
    
    // Mock transaction data for supplier list report
    const mockTransaction = {
      id: `SUP-LIST-${Date.now()}`,
      date: currentDate,
      nepaliDate: currentNepaliDate,
      type: "Report",
      description: "Suppliers List Report",
      amount: getTotalBalance().amount,
      balance: getTotalBalance().amount,
      currentDate,
      currentTime,
      currentNepaliDate,
      fiscalYear: fiscalYear.year,
    };

    // First export the PDF, then open email client
    emailReport({
      companyName: "Your Company",
      companyAddress: "Kathmandu, Nepal",
      companyPhone: "01-1234567",
      companyEmail: "info@yourcompany.com",
      companyPan: "123456789",
      transaction: mockTransaction,
      entity: {
        id: "SUPPLIERS",
        name: "Suppliers List",
        address: "All Suppliers",
        phone: "",
        type: "Report"
      },
      transactions: mockSuppliers.map(supplier => ({
        id: supplier.id,
        date: new Date().toLocaleDateString(),
        nepaliDate: "२०८१-०३-१५",
        type: "Supplier",
        description: supplier.name,
        amount: supplier.balance,
        balance: supplier.balance,
      })),
      showTransactions: true,
      reportTitle: "Suppliers List"
    });
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
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleEmailReport}
              className="flex items-center gap-1 hover:bg-slate-100 transition-colors"
            >
              <Mail className="h-4 w-4" /> Email
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExport}
              className="flex items-center gap-1 hover:bg-slate-100 transition-colors"
            >
              <FileDown className="h-4 w-4" /> Export
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrint}
              className="flex items-center gap-1 hover:bg-slate-100 transition-colors"
            >
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <Button 
                className="bg-vyc-primary hover:bg-vyc-primary-dark transition-colors"
                onClick={() => setDialogOpen(true)}
              >
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
          </div>
          
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
        
        <div className="rounded-md border border-slate-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
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
                  <TableRow key={supplier.id} className="cursor-pointer hover:bg-slate-50 transition-colors" onDoubleClick={() => handleViewSupplier(supplier.id)}>
                    <TableCell className="font-mono">{supplier.id}</TableCell>
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
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                          <Eye className="h-4 w-4" onClick={() => handleViewSupplier(supplier.id)} />
                        </Button>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                          <Edit className="h-4 w-4" onClick={() => handleEdit(supplier.id)} />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-vyc-error rounded-full hover:bg-red-50">
                          <Trash2 className="h-4 w-4" onClick={() => handleDeleteClick(supplier.id)} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-4">
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
          </CardContent>
        </Card>

        <div className={`print-only ${printVisible ? '' : 'hidden'}`}>
          <TransactionPrintTemplate
            companyName="Your Company"
            companyAddress="Kathmandu, Nepal"
            companyPhone="01-1234567"
            companyEmail="info@yourcompany.com" 
            companyPan="123456789"
            transaction={{
              id: "SUP-LIST",
              date: new Date().toLocaleDateString(),
              nepaliDate: "२०८१-०३-१५",
              type: "Report",
              description: "Suppliers List",
              amount: totalBalance.amount,
              balance: totalBalance.amount,
              currentDate: new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }),
              currentTime: new Date().toLocaleTimeString('en-US'),
              currentNepaliDate: formatNepaliDateNP(new Date()),
              fiscalYear: getCurrentFiscalYear().year
            }}
            entity={{
              id: "SUPPLIERS",
              name: "Suppliers List",
              address: "All Active Suppliers",
              phone: "",
              type: "Report"
            }}
            transactions={mockSuppliers.map(supplier => ({
              id: supplier.id,
              date: new Date().toLocaleDateString(),
              nepaliDate: "२०८१-०३-१५",
              type: "Supplier",
              description: supplier.name,
              amount: supplier.balance,
              balance: supplier.balance
            }))}
            showTransactions={true}
          />
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            body * {
              visibility: hidden;
            }
            .print-only, .print-only * {
              visibility: visible;
            }
            .print-only {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
            @page {
              size: A4;
              margin: 10mm;
            }
          }
        `
      }} />
    </MainLayout>
  );
};

export default Suppliers;


import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/toast-utils";
import { getCurrentFiscalYear } from "@/utils/nepali-fiscal-year";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  Download, 
  Upload, 
  Calendar,
  FileText, 
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  Database,
  RefreshCw,
  Lock
} from "lucide-react";

const Backup = () => {
  const [backupProgress, setBackupProgress] = useState(0);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [confirmRestoreOpen, setConfirmRestoreOpen] = useState(false);
  const [backupHistory] = useState([
    { date: "2081-03-15", size: "2.3 MB", type: "Manual", status: "Complete" },
    { date: "2081-03-01", size: "2.2 MB", type: "Automatic", status: "Complete" },
    { date: "2081-02-15", size: "2.1 MB", type: "Manual", status: "Complete" },
    { date: "2081-02-01", size: "2.0 MB", type: "Automatic", status: "Complete" },
    { date: "2081-01-15", size: "1.9 MB", type: "Manual", status: "Complete" }
  ]);

  const fiscalYear = getCurrentFiscalYear();
  
  const handleBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    // Simulate backup process
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          generateBackupFile();
          toast.success("Backup completed successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const generateBackupFile = () => {
    // Create mock data for the backup
    const mockData = {
      version: "1.0.0",
      date: new Date().toISOString(),
      fiscalYear: fiscalYear.year,
      data: {
        customers: Array(50).fill(0).map((_, i) => ({
          id: `CN00${i+1}`,
          name: `Customer ${i+1}`,
          address: "Sample Address",
          phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
          balance: Math.floor(Math.random() * 50000)
        })),
        suppliers: Array(20).fill(0).map((_, i) => ({
          id: `SP00${i+1}`,
          name: `Supplier ${i+1}`,
          address: "Sample Address",
          phone: `98${Math.floor(10000000 + Math.random() * 90000000)}`,
          balance: Math.floor(Math.random() * 50000)
        })),
        transactions: Array(100).fill(0).map((_, i) => ({
          id: `T00${i+1}`,
          date: new Date().toISOString(),
          type: ["Sale", "Purchase", "Payment"][Math.floor(Math.random() * 3)],
          amount: Math.floor(1000 + Math.random() * 50000),
          entityId: i % 2 === 0 ? `CN00${Math.floor(Math.random() * 50) + 1}` : `SP00${Math.floor(Math.random() * 20) + 1}`
        }))
      }
    };
    
    // Create a blob and download it
    const dataStr = JSON.stringify(mockData);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.download = `vyas_accounting_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleRestoreConfirm = () => {
    setConfirmRestoreOpen(false);
    if (!selectedFile) return;
    
    setIsRestoring(true);
    setRestoreProgress(0);
    
    // Simulate restore process
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRestoring(false);
          toast.success("Data restored successfully!");
          setSelectedFile(null);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Backup & Restore</h1>
            <p className="text-muted-foreground">
              Manage your accounting data backups and restores
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Backup Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="mr-2 h-5 w-5" /> Backup Data
              </CardTitle>
              <CardDescription>
                Create a backup of all your accounting data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted/50 p-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/20 p-2">
                    <Database className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Current Data Size</h3>
                    <p className="text-sm text-muted-foreground">
                      Approximately 2.5 MB of data will be backed up
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="rounded-md bg-muted/50 p-4">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/20 p-2">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Fiscal Year</h3>
                    <p className="text-sm text-muted-foreground">
                      Current fiscal year: {fiscalYear.year}
                    </p>
                  </div>
                </div>
              </div>
              
              {isBackingUp && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Backup in progress...</span>
                    <span>{backupProgress}%</span>
                  </div>
                  <Progress value={backupProgress} />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleBackup} 
                disabled={isBackingUp}
                className="w-full"
              >
                {isBackingUp ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Backing up...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Backup Now
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Restore Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" /> Restore Data
              </CardTitle>
              <CardDescription>
                Restore your data from a previous backup file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-amber-50 border border-amber-200 p-4 text-amber-800">
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="h-6 w-6 flex-shrink-0 text-amber-600" />
                  <div>
                    <h3 className="font-medium text-amber-900">Warning</h3>
                    <p className="text-sm">
                      Restoring data will replace your current data. This action cannot be undone.
                      Make sure to backup your current data before proceeding.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-center border-2 border-dashed rounded-md p-6">
                {selectedFile ? (
                  <div className="text-center">
                    <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => setSelectedFile(null)}
                    >
                      Change File
                    </Button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">Click to select backup file</p>
                    <p className="text-xs text-muted-foreground">or drag and drop</p>
                    <Input 
                      type="file" 
                      accept=".json" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
              
              {isRestoring && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Restore in progress...</span>
                    <span>{restoreProgress}%</span>
                  </div>
                  <Progress value={restoreProgress} />
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => setConfirmRestoreOpen(true)} 
                disabled={!selectedFile || isRestoring}
                className="w-full"
                variant="outline"
              >
                {isRestoring ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Restoring...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Restore from Backup
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Backup History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardDrive className="mr-2 h-5 w-5" /> Backup History
            </CardTitle>
            <CardDescription>
              View your previous backup records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="py-3 px-4 text-left">Date</th>
                    <th className="py-3 px-4 text-left">Size</th>
                    <th className="py-3 px-4 text-left">Type</th>
                    <th className="py-3 px-4 text-left">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {backupHistory.map((backup, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-3 px-4">{backup.date}</td>
                      <td className="py-3 px-4">{backup.size}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          backup.type === "Automatic" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                        }`}>
                          {backup.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          {backup.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Auto Backup Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lock className="mr-2 h-5 w-5" /> Backup Settings
            </CardTitle>
            <CardDescription>
              Configure automatic backup settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Auto Backup</h3>
                <p className="text-sm text-muted-foreground">
                  Enable automatic backups on a schedule
                </p>
              </div>
              <div>
                <input type="checkbox" id="autoBackup" className="sr-only peer" defaultChecked />
                <label 
                  htmlFor="autoBackup" 
                  className="relative inline-flex items-center h-6 rounded-full w-11 bg-gray-300 cursor-pointer transition-colors duration-300 ease-in-out peer-checked:bg-primary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-primary"
                >
                  <span className="inline-block w-4 h-4 transform transition duration-300 ease-in-out bg-white rounded-full translate-x-1 peer-checked:translate-x-6"></span>
                </label>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Backup Frequency</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Retention Period</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                  <option>1 Week</option>
                  <option>2 Weeks</option>
                  <option>1 Month</option>
                  <option>3 Months</option>
                  <option>6 Months</option>
                </select>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-4">
            <Button variant="outline">Cancel</Button>
            <Button onClick={() => toast.success("Backup settings saved!")}>Save Settings</Button>
          </CardFooter>
        </Card>
        
        {/* Restore Confirmation Dialog */}
        <Dialog open={confirmRestoreOpen} onOpenChange={setConfirmRestoreOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Data Restore</DialogTitle>
              <DialogDescription>
                This action will replace all your current data with the backup.
                This operation cannot be undone. Are you sure you want to proceed?
              </DialogDescription>
            </DialogHeader>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600" />
                <p className="text-sm">
                  All current data including customers, suppliers, transactions, 
                  and settings will be replaced by the data in the backup file.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmRestoreOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleRestoreConfirm}
              >
                Yes, Restore Data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Backup;

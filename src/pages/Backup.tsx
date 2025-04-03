
import React, { useState, useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FileDown, Upload, HardDrive, RefreshCw, Check, X, AlertCircle, Clock, Download } from "lucide-react";
import { toast } from "@/components/ui/toast-utils";
import { formatNepaliDate } from "@/utils/nepali-date";
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

const Backup = () => {
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreProgress, setRestoreProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [restoreConfirmOpen, setRestoreConfirmOpen] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const mockBackups = [
    { id: 1, name: "Full Backup", date: new Date("2024-07-25"), size: "15.2 MB", status: "completed" },
    { id: 2, name: "Auto Backup", date: new Date("2024-07-18"), size: "14.8 MB", status: "completed" },
    { id: 3, name: "Scheduled Backup", date: new Date("2024-07-11"), size: "13.5 MB", status: "completed" },
    { id: 4, name: "Manual Backup", date: new Date("2024-07-04"), size: "12.9 MB", status: "failed" },
    { id: 5, name: "Initial Backup", date: new Date("2024-06-28"), size: "10.2 MB", status: "completed" },
  ];
  
  const handleBackup = () => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          toast.success("Backup completed successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  const handleRestore = (backupId: number) => {
    setIsRestoring(true);
    setRestoreProgress(0);
    
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRestoring(false);
          toast.success("Backup restored successfully!");
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  const handleDownload = (backupId: number) => {
    // Create a mock backup data - in a real app, this would be fetched from the server
    const mockBackupData = JSON.stringify({
      version: "1.0",
      timestamp: new Date().toISOString(),
      data: {
        customers: [],
        suppliers: [],
        transactions: [],
        settings: {}
      }
    }, null, 2);
    
    // Create a blob from the data
    const blob = new Blob([mockBackupData], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-${backupId}-${new Date().toISOString().split('T')[0]}.json`;
    
    // Append the anchor to the document, click it, and remove it
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
    
    toast.success("Backup file is being downloaded.");
  };
  
  const handleUploadBackup = () => {
    setUploadDialogOpen(true);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };
  
  const handleUploadSubmit = () => {
    if (!selectedFile) {
      toast.error("Please select a backup file first.");
      return;
    }
    
    setUploadDialogOpen(false);
    setRestoreConfirmOpen(true);
  };
  
  const confirmRestore = () => {
    setRestoreConfirmOpen(false);
    
    // Simulate file reading and restore process
    setIsRestoring(true);
    setRestoreProgress(0);
    
    const interval = setInterval(() => {
      setRestoreProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRestoring(false);
          setSelectedFile(null);
          toast.success("Backup file successfully restored!");
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check className="h-5 w-5 text-green-500" />;
      case "failed":
        return <X className="h-5 w-5 text-red-500" />;
      case "pending":
        return <Clock className="h-5 w-5 text-amber-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Backup & Restore</h1>
            <p className="text-muted-foreground">
              Manage your data backups and restore operations.
            </p>
          </div>
          
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="mr-2 h-4 w-4" /> Refresh
          </Button>
        </div>
        
        {isRestoring && (
          <Card className="border-amber-500">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Restoring backup...</span>
                  <span>{restoreProgress}%</span>
                </div>
                <Progress value={restoreProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Create Backup Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HardDrive className="mr-2 h-5 w-5 text-vyc-primary" />
                Create Backup
              </CardTitle>
              <CardDescription>
                Create a full backup of your accounting data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Last backup: {formatNepaliDate(new Date())}</span>
                  <span>Database size: 15.2 MB</span>
                </div>
                
                {isBackingUp && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Creating backup...</span>
                      <span>{backupProgress}%</span>
                    </div>
                    <Progress value={backupProgress} />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                onClick={handleUploadBackup}
                disabled={isBackingUp || isRestoring}
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Backup
              </Button>
              <Button 
                className="bg-vyc-primary hover:bg-vyc-primary-dark"
                onClick={handleBackup}
                disabled={isBackingUp || isRestoring}
              >
                {isBackingUp ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Backing Up...
                  </>
                ) : (
                  <>
                    <HardDrive className="mr-2 h-4 w-4" /> Create Backup
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
          
          {/* Restore Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileDown className="mr-2 h-5 w-5 text-vyc-primary" />
                Backup History
              </CardTitle>
              <CardDescription>
                View and restore previous backups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b">
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Date</th>
                        <th className="p-3 text-left">Size</th>
                        <th className="p-3 text-center">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockBackups.map((backup) => (
                        <tr key={backup.id} className="border-b hover:bg-muted/30">
                          <td className="p-3">{backup.name}</td>
                          <td className="p-3">{formatNepaliDate(backup.date)}</td>
                          <td className="p-3">{backup.size}</td>
                          <td className="p-3 flex justify-center">
                            {getStatusIcon(backup.status)}
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDownload(backup.id)}
                                disabled={isBackingUp || isRestoring || backup.status !== "completed"}
                                title="Download backup"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRestore(backup.id)}
                                disabled={isBackingUp || isRestoring || backup.status !== "completed"}
                              >
                                {isRestoring ? (
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                ) : (
                                  "Restore"
                                )}
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground">
              Note: Restoring a backup will replace all current data. Always create a new backup before restoring.
            </CardFooter>
          </Card>
        </div>
        
        {/* Backup Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Backup Settings</CardTitle>
            <CardDescription>Configure automated backup schedule and storage options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Automated Backups</h3>
                
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="enable-auto" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                  <label htmlFor="enable-auto">Enable automated backups</label>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Backup frequency</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="daily">Daily</option>
                    <option value="weekly" selected>Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Time of day</label>
                  <input 
                    type="time" 
                    value="01:00"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Backup Retention</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Keep backups for</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30" selected>30 days</option>
                    <option value="90">90 days</option>
                    <option value="365">1 year</option>
                    <option value="0">Forever</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maximum number of backups</label>
                  <input 
                    type="number" 
                    value="10" 
                    min="1" 
                    max="100"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" 
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button className="bg-vyc-primary hover:bg-vyc-primary-dark">
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Upload Backup Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Backup</DialogTitle>
            <DialogDescription>
              Upload a backup file to restore your data. This will replace your current data.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
              <Upload className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-center text-gray-500 mb-2">
                Click to select a backup file or drag and drop
              </p>
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden" 
                accept=".json,.bak"
                onChange={handleFileChange}
              />
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                Select File
              </Button>
              {selectedFile && (
                <p className="mt-2 text-sm text-green-600">
                  Selected: {selectedFile.name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-vyc-primary hover:bg-vyc-primary-dark" 
              onClick={handleUploadSubmit}
              disabled={!selectedFile}
            >
              Upload & Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Restore Dialog */}
      <AlertDialog open={restoreConfirmOpen} onOpenChange={setRestoreConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Restore</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore from this backup? This will replace all current data and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRestore} className="bg-vyc-primary hover:bg-vyc-primary-dark">
              Yes, Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Backup;

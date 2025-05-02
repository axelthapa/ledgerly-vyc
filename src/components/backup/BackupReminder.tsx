
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { backupDatabase } from "@/utils/electron-utils";

const BackupReminder: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Listen for backup reminder events from the main process
  useEffect(() => {
    const handleBackupReminder = () => {
      setOpen(true);
    };
    
    if (window.electron) {
      window.electron.onShowBackupReminder(handleBackupReminder);
    }
    
    return () => {
      if (window.electron) {
        window.electron.removeShowBackupReminder(handleBackupReminder);
      }
    };
  }, []);
  
  const handleBackupNow = async () => {
    try {
      const result = await backupDatabase();
      
      if (result.success) {
        toast({
          title: t('Backup Successful'),
          description: t('Database backed up to') + ` ${result.filePath}`,
          variant: 'default',
        });
        setOpen(false);
      } else {
        toast({
          title: t('Backup Failed'),
          description: result.error || t('Failed to backup the database'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        title: t('Backup Failed'),
        description: t('An unexpected error occurred'),
        variant: 'destructive',
      });
    }
  };
  
  const handleGoToBackupPage = () => {
    setOpen(false);
    navigate('/backup');
  };
  
  const handleLater = () => {
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('Database Backup Reminder')}</DialogTitle>
          <DialogDescription>
            {t('It has been a while since your last database backup. Would you like to back up your data now?')}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleLater}>
            {t('Later')}
          </Button>
          <Button variant="secondary" onClick={handleGoToBackupPage}>
            {t('Go to Backup Page')}
          </Button>
          <Button onClick={handleBackupNow}>
            {t('Backup Now')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BackupReminder;

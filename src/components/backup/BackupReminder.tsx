
import React, { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { isElectron } from '@/utils/electron-utils';
import { useLanguage } from '@/contexts/LanguageContext';

const BackupReminder: React.FC = () => {
  const [showReminder, setShowReminder] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    if (isElectron()) {
      // Listen for backup reminder
      const handleBackupReminder = () => {
        setShowReminder(true);
      };

      // Add event listener
      window.electron?.onShowBackupReminder?.(handleBackupReminder);

      // Remove event listener on cleanup
      return () => {
        window.electron?.removeShowBackupReminder?.(handleBackupReminder);
      };
    }
  }, []);

  const handleBackupNow = async () => {
    try {
      if (isElectron()) {
        const result = await window.electron?.db?.backup();
        
        if (result?.success) {
          toast({
            title: t('Backup Successful'),
            description: t('Your database has been backed up successfully'),
            variant: 'default',
          });
        } else {
          toast({
            title: t('Backup Failed'),
            description: result?.error || t('Failed to backup database'),
            variant: 'destructive',
          });
        }
      }
    } catch (error) {
      console.error('Backup error:', error);
      toast({
        title: t('Backup Error'),
        description: t('An unexpected error occurred during backup'),
        variant: 'destructive',
      });
    }
    
    setShowReminder(false);
  };

  return (
    <AlertDialog open={showReminder} onOpenChange={setShowReminder}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('Backup Reminder')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('It\'s been a while since your last backup')}. {t('Backup your database now to prevent data loss')}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('Remind Me Later')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleBackupNow}>{t('Backup Now')}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BackupReminder;


import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { getServiceById } from "@/utils/service-utils";
import { useToast } from "@/hooks/use-toast";
import { formatNepaliDate, formatDate } from "@/utils/nepali-date";
import { getCompanyDetails } from "@/utils/company-utils";
import { printToPDF } from "@/utils/electron-utils";

interface ServiceLabelPrintProps {
  serviceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ServiceLabelPrint: React.FC<ServiceLabelPrintProps> = ({ serviceId, open, onOpenChange }) => {
  const { t, isNepali } = useLanguage();
  const { toast } = useToast();
  const [service, setService] = useState<any | null>(null);
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const printRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const loadData = async () => {
      if (!serviceId || !open) return;
      
      setLoading(true);
      try {
        const [serviceResult, companyResult] = await Promise.all([
          getServiceById(serviceId),
          getCompanyDetails()
        ]);
        
        if (serviceResult.success && serviceResult.data) {
          setService(serviceResult.data);
        } else {
          toast({
            title: t('Error'),
            description: serviceResult.error || t('Failed to load service details'),
            variant: 'destructive',
          });
          onOpenChange(false);
        }
        
        setCompany(companyResult);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: t('Error'),
          description: t('An unexpected error occurred'),
          variant: 'destructive',
        });
        onOpenChange(false);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [serviceId, open]);
  
  const handlePrint = async () => {
    try {
      const result = await printToPDF({
        marginsType: 1, // Narrow margins
        printBackground: true,
        pageSize: { width: 62000, height: 29000 }, // ~ 62mm x 29mm (typical shipping label)
        landscape: true,
      });
      
      if (result.success) {
        toast({
          title: t('Print Successful'),
          description: t('Label has been sent to the printer'),
          variant: 'default',
        });
        onOpenChange(false);
      } else {
        toast({
          title: t('Print Error'),
          description: result.error || t('Failed to print the label'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Print error:', error);
      toast({
        title: t('Print Error'),
        description: t('An unexpected error occurred during printing'),
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('Print Service Label')}</DialogTitle>
          <DialogDescription>
            {t('Preview the service label before printing')}
          </DialogDescription>
        </DialogHeader>
        
        {loading ? (
          <div className="py-8 text-center">{t('Loading...')}</div>
        ) : service ? (
          <div className="border rounded-md p-4" ref={printRef}>
            <div className="text-center font-bold text-lg mb-2">
              {company?.name || 'VYC Demo'}
            </div>
            
            <div className="text-center text-sm mb-4">
              {company?.address || 'Kathmandu, Nepal'}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="font-semibold">{t('Service ID')}:</div>
              <div>{service.id}</div>
              
              <div className="font-semibold">{t('Customer')}:</div>
              <div>{service.customer_name}</div>
              
              <div className="font-semibold">{t('Device')}:</div>
              <div>{service.device_type}: {service.device_model}</div>
              
              {service.device_serial && (
                <>
                  <div className="font-semibold">{t('Serial')}:</div>
                  <div>{service.device_serial}</div>
                </>
              )}
              
              <div className="font-semibold">{t('Date')}:</div>
              <div>
                {isNepali 
                  ? formatNepaliDate(new Date(service.service_date))
                  : formatDate(new Date(service.service_date))
                }
              </div>
              
              <div className="font-semibold">{t('Problem')}:</div>
              <div className="truncate">{service.problem_description.substring(0, 30)}</div>
            </div>
            
            <div className="mt-4 text-xs text-center">
              {service.is_warranty ? t('Under Warranty') : t('No Warranty')}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-red-500">{t('Service not found')}</div>
        )}
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            {t('Cancel')}
          </Button>
          <Button type="button" onClick={handlePrint}>
            {t('Print')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceLabelPrint;

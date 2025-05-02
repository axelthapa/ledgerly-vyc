
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatNepaliDate, formatDate } from "@/utils/nepali-date";
import { getCompanyDetails } from "@/utils/company-utils";

interface ServiceViewProps {
  service: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ServiceView: React.FC<ServiceViewProps> = ({ service, open, onOpenChange }) => {
  const { t, isNepali } = useLanguage();
  const { toast } = useToast();
  
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getFormattedDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNepali ? formatNepaliDate(date) : formatDate(date);
    } catch (e) {
      return dateString;
    }
  };
  
  const handlePrintServiceLabel = async () => {
    try {
      // Get company details for the label
      const companyDetails = await getCompanyDetails();
      
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast({
          title: t('Error'),
          description: t('Failed to open print window. Please check your popup settings.'),
          variant: 'destructive',
        });
        return;
      }
      
      // Create the label content
      const labelHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Service Label - ${service.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 10px; }
            .label { width: 300px; border: 1px solid #ccc; padding: 10px; box-sizing: border-box; }
            .company-name { font-weight: bold; font-size: 14px; margin-bottom: 5px; text-align: center; }
            .service-id { font-size: 16px; font-weight: bold; margin-top: 5px; margin-bottom: 10px; text-align: center; }
            .customer-info { margin-bottom: 10px; }
            .device-info { margin-bottom: 10px; }
            .field-label { font-weight: bold; font-size: 10px; }
            .field-value { font-size: 12px; }
            .date { font-size: 10px; text-align: right; font-style: italic; margin-top: 5px; }
            @media print {
              body { margin: 0; padding: 0; }
              .label { border: none; width: 100%; }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="company-name">${companyDetails.name || 'VYC Accounting'}</div>
            <div class="service-id">${service.id}</div>
            
            <div class="customer-info">
              <div class="field-label">${t('Customer Name')}</div>
              <div class="field-value">${service.customer_name}</div>
            </div>
            
            <div class="device-info">
              <div class="field-label">${t('Device')}</div>
              <div class="field-value">${service.device_type} ${service.device_model}</div>
              
              <div class="field-label">${t('Serial Number')}</div>
              <div class="field-value">${service.device_serial || 'N/A'}</div>
              
              <div class="field-label">${t('Problem')}</div>
              <div class="field-value">${service.problem_description}</div>
            </div>
            
            <div class="date">${getFormattedDate(service.service_date)}</div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
        </html>
      `;
      
      // Write the content to the window and print
      printWindow.document.write(labelHTML);
      printWindow.document.close();
      
      toast({
        title: t('Print Label'),
        description: t('Service label sent to printer'),
        variant: 'default',
      });
      
    } catch (error) {
      console.error('Error printing service label:', error);
      toast({
        title: t('Error'),
        description: t('An error occurred while printing the service label'),
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('Service Details')}</DialogTitle>
          <DialogDescription>
            {service.id} - {getFormattedDate(service.service_date)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Badge className={getStatusBadgeColor(service.status)}>
              {t(service.status)}
            </Badge>
            <Badge variant={service.is_warranty ? "default" : "outline"}>
              {service.is_warranty ? t('Under Warranty') : t('No Warranty')}
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">{t('Customer Name')}</h4>
              <p className="text-sm">{service.customer_name}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">{t('Technician')}</h4>
              <p className="text-sm">{service.technician || '-'}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">{t('Device Type')}</h4>
              <p className="text-sm">{service.device_type}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">{t('Device Model')}</h4>
              <p className="text-sm">{service.device_model || '-'}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">{t('Serial Number')}</h4>
            <p className="text-sm">{service.device_serial || '-'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-1">{t('Problem Description')}</h4>
            <p className="text-sm whitespace-pre-wrap">{service.problem_description}</p>
          </div>
          
          {service.diagnosis && (
            <div>
              <h4 className="text-sm font-medium mb-1">{t('Diagnosis')}</h4>
              <p className="text-sm whitespace-pre-wrap">{service.diagnosis}</p>
            </div>
          )}
          
          {service.repair_notes && (
            <div>
              <h4 className="text-sm font-medium mb-1">{t('Repair Notes')}</h4>
              <p className="text-sm whitespace-pre-wrap">{service.repair_notes}</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">{t('Estimated Cost')}</h4>
              <p className="text-sm">{service.estimated_cost}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">{t('Final Cost')}</h4>
              <p className="text-sm">{service.final_cost || '-'}</p>
            </div>
          </div>
          
          {service.notes && (
            <div>
              <h4 className="text-sm font-medium mb-1">{t('Notes')}</h4>
              <p className="text-sm whitespace-pre-wrap">{service.notes}</p>
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={handlePrintServiceLabel}
            >
              <Printer className="h-4 w-4 mr-2" />
              {t('Print Label')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceView;

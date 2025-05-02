
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatNepaliDate, formatDate } from "@/utils/nepali-date";
import { getServiceById } from "@/utils/service-utils";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/currency";
import { Printer } from "lucide-react";
import ServiceLabelPrint from "./ServiceLabelPrint";

interface ServiceViewProps {
  serviceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ServiceView: React.FC<ServiceViewProps> = ({ serviceId, open, onOpenChange }) => {
  const { t, isNepali } = useLanguage();
  const { toast } = useToast();
  const [service, setService] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  
  useEffect(() => {
    const loadService = async () => {
      if (!serviceId || !open) return;
      
      setLoading(true);
      try {
        const result = await getServiceById(serviceId);
        
        if (result.success && result.data) {
          setService(result.data);
        } else {
          toast({
            title: t('Error'),
            description: result.error || t('Failed to load service details'),
            variant: 'destructive',
          });
          onOpenChange(false);
        }
      } catch (error) {
        console.error('Error loading service:', error);
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
    
    loadService();
  }, [serviceId, open]);
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">{t('Pending')}</Badge>;
      case 'in_progress':
        return <Badge variant="secondary">{t('In Progress')}</Badge>;
      case 'completed':
        return <Badge variant="success">{t('Completed')}</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">{t('Cancelled')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              <span>{t('Service Details')}</span>
              {service && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setPrintDialogOpen(true)}
                >
                  <Printer className="h-4 w-4 mr-2" /> 
                  {t('Print Label')}
                </Button>
              )}
            </DialogTitle>
            <DialogDescription>
              {service && service.id}
            </DialogDescription>
          </DialogHeader>
          
          {loading ? (
            <div className="py-8 text-center">{t('Loading...')}</div>
          ) : service ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('Customer')}</h4>
                  <p>{service.customer_name}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('Service Date')}</h4>
                  <p>
                    {isNepali 
                      ? formatNepaliDate(new Date(service.service_date))
                      : formatDate(new Date(service.service_date))
                    }
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('Device')}</h4>
                  <p>{service.device_type}: {service.device_model}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('Serial Number')}</h4>
                  <p>{service.device_serial || t('Not specified')}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('Status')}</h4>
                  <p>{getStatusBadge(service.status)}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('Warranty')}</h4>
                  <p>
                    {service.is_warranty 
                      ? t('Under Warranty') 
                      : t('Not Under Warranty')}
                  </p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('Technician')}</h4>
                  <p>{service.technician || t('Not assigned')}</p>
                </div>
                
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('Estimated Cost')}</h4>
                  <p>{formatCurrency(service.estimated_cost || 0)}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold mb-1">{t('Problem Description')}</h4>
                <p className="text-sm text-gray-600">{service.problem_description}</p>
              </div>
              
              {service.diagnosis && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('Diagnosis')}</h4>
                  <p className="text-sm text-gray-600">{service.diagnosis}</p>
                </div>
              )}
              
              {service.repair_notes && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('Repair Notes')}</h4>
                  <p className="text-sm text-gray-600">{service.repair_notes}</p>
                </div>
              )}
              
              {service.parts_used && service.parts_used.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('Parts Used')}</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {service.parts_used.map((part: any, index: number) => (
                      <li key={index}>{part.name} - {formatCurrency(part.price || 0)}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {service.notes && (
                <div>
                  <h4 className="text-sm font-semibold mb-1">{t('Notes')}</h4>
                  <p className="text-sm text-gray-600">{service.notes}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-red-500">{t('Service not found')}</div>
          )}
        </DialogContent>
      </Dialog>
      
      {service && (
        <ServiceLabelPrint 
          serviceId={serviceId} 
          open={printDialogOpen} 
          onOpenChange={setPrintDialogOpen} 
        />
      )}
    </>
  );
};

export default ServiceView;

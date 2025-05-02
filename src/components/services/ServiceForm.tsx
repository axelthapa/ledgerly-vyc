
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { createService } from "@/utils/service-utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { formatNepaliDate, formatDate, getTodayBSString } from "@/utils/nepali-date";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ServiceFormProps {
  serviceId?: string;
  onSuccess?: () => void;
}

const ServiceForm: React.FC<ServiceFormProps> = ({ serviceId, onSuccess }) => {
  const { t, isNepali } = useLanguage();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_id: "",
    customer_name: "",
    device_type: "",
    device_serial: "",
    device_model: "",
    problem_description: "",
    service_date: new Date(),
    is_warranty: false,
    technician: "",
    status: "pending" as "pending" | "in_progress" | "completed" | "cancelled",
    estimated_cost: 0,
    notes: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === 'status') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value as "pending" | "in_progress" | "completed" | "cancelled"
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({ ...prev, service_date: date }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await createService(formData);
      
      if (result.success) {
        toast({
          title: t('Service Created'),
          description: t('Service has been created successfully'),
          variant: 'default',
        });
        
        setOpen(false);
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: t('Error'),
          description: result.error || t('Failed to create service'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error creating service:', error);
      toast({
        title: t('Error'),
        description: t('An unexpected error occurred'),
        variant: 'destructive',
      });
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">{t('New Service')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('Add New Service')}</DialogTitle>
          <DialogDescription>
            {t('Enter the details of the service to be performed.')}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer_name">{t('Customer Name')}</Label>
              <Input
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="service_date">{t('Service Date')}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.service_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.service_date ? (
                      isNepali ? formatNepaliDate(formData.service_date) : format(formData.service_date, "PPP")
                    ) : (
                      <span>{t('Select date')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.service_date}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="device_type">{t('Device Type')}</Label>
              <Select
                value={formData.device_type}
                onValueChange={(value) => handleSelectChange('device_type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Select device type')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">Mobile Phone</SelectItem>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="printer">Printer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="device_model">{t('Device Model')}</Label>
              <Input
                id="device_model"
                name="device_model"
                value={formData.device_model}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="device_serial">{t('Serial Number')}</Label>
            <Input
              id="device_serial"
              name="device_serial"
              value={formData.device_serial}
              onChange={handleInputChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="problem_description">{t('Problem Description')}</Label>
            <Textarea
              id="problem_description"
              name="problem_description"
              rows={3}
              value={formData.problem_description}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="technician">{t('Technician')}</Label>
              <Input
                id="technician"
                name="technician"
                value={formData.technician}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">{t('Status')}</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('Select status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated_cost">{t('Estimated Cost')}</Label>
              <Input
                id="estimated_cost"
                name="estimated_cost"
                type="number"
                min="0"
                value={formData.estimated_cost}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="flex items-center space-x-2 h-full pt-8">
              <Switch
                id="is_warranty"
                checked={formData.is_warranty}
                onCheckedChange={(checked) => handleSwitchChange('is_warranty', checked)}
              />
              <Label htmlFor="is_warranty">{t('Under Warranty')}</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">{t('Notes')}</Label>
            <Textarea
              id="notes"
              name="notes"
              rows={2}
              value={formData.notes}
              onChange={handleInputChange}
            />
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button type="submit">{t('Save')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceForm;


import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Search, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getServices, deleteService } from "@/utils/service-utils";
import { formatNepaliDate, formatDate } from "@/utils/nepali-date";
import ServiceView from "./ServiceView";
import ServiceEditForm from "./ServiceEditForm";
import Pagination from "../ui/pagination";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ServicesListProps {
  status: 'active' | 'completed' | 'all';
}

const ServicesList: React.FC<ServicesListProps> = ({ status }) => {
  const { t, isNepali } = useLanguage();
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  
  const fetchServices = async () => {
    setLoading(true);
    try {
      const result = await getServices(status, searchQuery, currentPage, 10);
      
      if (result.success && result.data) {
        setServices(result.data.services);
        setTotalPages(result.data.totalPages);
      } else {
        toast({
          title: t('Error'),
          description: result.error || t('Failed to load services'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching services:', error);
      toast({
        title: t('Error'),
        description: t('An unexpected error occurred'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchServices();
  }, [status, currentPage]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchServices();
  };
  
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleViewService = (service: any) => {
    setSelectedService(service);
    setIsViewDialogOpen(true);
  };
  
  const handleEditService = (service: any) => {
    setSelectedService(service);
    setIsEditDialogOpen(true);
  };
  
  const confirmDeleteService = (serviceId: string) => {
    setServiceToDelete(serviceId);
  };
  
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    
    try {
      const result = await deleteService(serviceToDelete);
      
      if (result.success) {
        toast({
          title: t('Service deleted successfully'),
          variant: 'default',
        });
        fetchServices();
      } else {
        toast({
          title: t('Error'),
          description: result.error || t('Failed to delete service'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast({
        title: t('Error'),
        description: t('An unexpected error occurred'),
        variant: 'destructive',
      });
    } finally {
      setServiceToDelete(null);
    }
  };
  
  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    fetchServices();
  };
  
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
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <Input
          placeholder={t('Search by customer name, device or service ID')}
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="flex-1"
        />
        <Button type="submit" variant="outline" size="icon">
          <Search className="h-4 w-4" />
        </Button>
      </form>
      
      {loading ? (
        <div className="text-center py-8">
          <p>{t('Loading services...')}</p>
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-8 flex flex-col items-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">{t('No services found')}</p>
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('Service ID')}</TableHead>
                  <TableHead>{t('Customer Name')}</TableHead>
                  <TableHead>{t('Device Type')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('Service Date')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('Status')}</TableHead>
                  <TableHead className="text-right">{t('Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewService(service)}>
                    <TableCell className="font-medium">{service.id}</TableCell>
                    <TableCell>{service.customer_name}</TableCell>
                    <TableCell>{service.device_type}</TableCell>
                    <TableCell className="hidden md:table-cell">{getFormattedDate(service.service_date)}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className={getStatusBadgeColor(service.status)}>{t(service.status)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditService(service);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{t('Edit')}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmDeleteService(service.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">{t('Delete')}</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          
          {/* View Dialog */}
          {selectedService && (
            <ServiceView
              service={selectedService}
              open={isViewDialogOpen}
              onOpenChange={setIsViewDialogOpen}
            />
          )}
          
          {/* Edit Dialog */}
          {selectedService && (
            <ServiceEditForm
              serviceId={selectedService.id}
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              onSuccess={handleEditSuccess}
            />
          )}
          
          {/* Delete Confirmation Dialog */}
          <AlertDialog open={Boolean(serviceToDelete)} onOpenChange={() => setServiceToDelete(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('Delete Service')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('Are you sure you want to delete this service?')} {t('This action cannot be undone.')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('Cancel')}</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteService}>{t('Delete')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default ServicesList;

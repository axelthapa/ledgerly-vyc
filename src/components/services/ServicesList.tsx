
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Printer, Edit, Eye, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import { getServices, deleteService } from "@/utils/service-utils";
import { useToast } from "@/hooks/use-toast";
import { formatNepaliDate, formatDate } from "@/utils/nepali-date";
import ServiceForm from "./ServiceForm";
import ServiceView from "./ServiceView";
import ServiceLabelPrint from "./ServiceLabelPrint";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  
  const fetchServices = async () => {
    setLoading(true);
    try {
      const result = await getServices(status, searchQuery, currentPage);
      
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
      console.error('Error loading services:', error);
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
  }, [status, searchQuery, currentPage]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const handleViewService = (id: string) => {
    setSelectedService(id);
    setViewDialogOpen(true);
  };
  
  const handleEditService = (id: string) => {
    setSelectedService(id);
    setEditDialogOpen(true);
  };
  
  const handlePrintLabel = (id: string) => {
    setSelectedService(id);
    setPrintDialogOpen(true);
  };
  
  const confirmDelete = (id: string) => {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDeleteService = async () => {
    if (!serviceToDelete) return;
    
    try {
      const result = await deleteService(serviceToDelete);
      
      if (result.success) {
        toast({
          title: t('Service Deleted'),
          description: t('Service has been deleted successfully'),
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
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };
  
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
    <div className="space-y-4">
      <div className="flex justify-between">
        <Input
          placeholder={t('Search services...')}
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('Service ID')}</TableHead>
              <TableHead>{t('Customer')}</TableHead>
              <TableHead>{t('Device')}</TableHead>
              <TableHead>{t('Date')}</TableHead>
              <TableHead>{t('Status')}</TableHead>
              <TableHead className="text-right">{t('Actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {t('Loading services...')}
                </TableCell>
              </TableRow>
            ) : services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {t('No services found')}
                </TableCell>
              </TableRow>
            ) : (
              services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.id}</TableCell>
                  <TableCell>{service.customer_name}</TableCell>
                  <TableCell>
                    {service.device_type}: {service.device_model}
                  </TableCell>
                  <TableCell>
                    {isNepali 
                      ? formatNepaliDate(new Date(service.service_date))
                      : formatDate(new Date(service.service_date))
                    }
                  </TableCell>
                  <TableCell>{getStatusBadge(service.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewService(service.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditService(service.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePrintLabel(service.id)}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => confirmDelete(service.id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
      
      {/* View Service Dialog */}
      {selectedService && (
        <ServiceView
          serviceId={selectedService}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
        />
      )}
      
      {/* Edit Service Dialog */}
      {selectedService && (
        <ServiceForm
          serviceId={selectedService}
          onSuccess={fetchServices}
        />
      )}
      
      {/* Print Label Dialog */}
      {selectedService && (
        <ServiceLabelPrint
          serviceId={selectedService}
          open={printDialogOpen}
          onOpenChange={setPrintDialogOpen}
        />
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('Confirm Deletion')}</DialogTitle>
            <DialogDescription>
              {t('Are you sure you want to delete this service? This action cannot be undone.')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              {t('Cancel')}
            </Button>
            <Button variant="destructive" onClick={handleDeleteService}>
              {t('Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServicesList;


import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Calendar, CreditCard, AlertTriangle, CheckCircle2, BadgeAlert } from 'lucide-react';
import { toast } from '@/components/ui/toast-utils';
import { formatCurrency } from '@/utils/currency';
import { formatDate, getRelativeTimeFromDates } from '@/utils/nepali-date';
import { getAllPaymentAlerts } from '@/utils/transaction-utils';
import { useNavigate } from 'react-router-dom';

interface PaymentAlert {
  id: string;
  date: string;
  reference: string;
  total_amount: number;
  payment_date: string;
  due_date: string;
  party_id: string;
  party_name: string;
  party_type: 'customer' | 'supplier';
  alert_type: 'receivable' | 'payable';
}

const PaymentAlerts = () => {
  const [alerts, setAlerts] = useState<PaymentAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('receivable');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const result = await getAllPaymentAlerts();
        
        if (result.success && result.data) {
          setAlerts(result.data);
        } else {
          console.error('Failed to fetch payment alerts:', result.error);
          toast.error(result.error || 'Failed to fetch payment alerts');
        }
      } catch (error) {
        console.error('Error in fetchAlerts:', error);
        toast.error('An error occurred while fetching payment alerts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAlerts();
  }, []);
  
  const receivables = alerts.filter(alert => alert.alert_type === 'receivable');
  const payables = alerts.filter(alert => alert.alert_type === 'payable');
  
  // Navigate to transaction details
  const handleAlertClick = (alert: PaymentAlert) => {
    if (alert.party_type === 'customer') {
      navigate(`/customers/${alert.party_id}`);
    } else {
      navigate(`/suppliers/${alert.party_id}`);
    }
  };
  
  // Get urgency level based on due date
  const getUrgencyLevel = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 2) return 'urgent';
    if (diffDays <= 5) return 'soon';
    return 'upcoming';
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-vyc-primary" />
            <CardTitle>Payment Alerts</CardTitle>
          </div>
          <Badge variant="outline" className="bg-vyc-primary/10 text-vyc-primary">
            {alerts.length} alerts
          </Badge>
        </div>
        <CardDescription>
          Upcoming payments due within 7 days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="receivable" className="relative">
              Receivables
              {receivables.length > 0 && (
                <Badge className="ml-2 bg-vyc-primary">{receivables.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="payable" className="relative">
              Payables
              {payables.length > 0 && (
                <Badge className="ml-2 bg-vyc-primary">{payables.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="receivable" className="mt-4 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))
            ) : receivables.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                <h3 className="text-lg font-medium">No upcoming receivables</h3>
                <p className="text-sm text-muted-foreground">
                  All customer payments are up to date
                </p>
              </div>
            ) : (
              receivables.map(alert => {
                const urgency = getUrgencyLevel(alert.due_date);
                return (
                  <div 
                    key={alert.id}
                    className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0 cursor-pointer hover:bg-muted/20 p-2 rounded transition-colors"
                    onClick={() => handleAlertClick(alert)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        urgency === 'overdue' ? 'bg-red-100 text-red-600' :
                        urgency === 'urgent' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {urgency === 'overdue' ? (
                          <AlertTriangle className="h-5 w-5" />
                        ) : urgency === 'urgent' ? (
                          <BadgeAlert className="h-5 w-5" />
                        ) : (
                          <Calendar className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{alert.party_name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {alert.reference} - Due: {formatDate(new Date(alert.due_date))}
                        </p>
                        <div className="mt-1">
                          {urgency === 'overdue' ? (
                            <Badge variant="destructive" className="text-xs">
                              {getRelativeTimeFromDates(new Date(), new Date(alert.due_date))} overdue
                            </Badge>
                          ) : (
                            <Badge className={`text-xs ${
                              urgency === 'urgent' ? 'bg-amber-500' : 'bg-blue-500'
                            }`}>
                              Due {getRelativeTimeFromDates(new Date(), new Date(alert.due_date))}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">रू {formatCurrency(alert.total_amount)}</p>
                    </div>
                  </div>
                );
              })
            )}
            
            {receivables.length > 0 && (
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate('/reports?tab=receivables')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                View All Receivables
              </Button>
            )}
          </TabsContent>
          
          <TabsContent value="payable" className="mt-4 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))
            ) : payables.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
                <h3 className="text-lg font-medium">No upcoming payables</h3>
                <p className="text-sm text-muted-foreground">
                  All supplier payments are up to date
                </p>
              </div>
            ) : (
              payables.map(alert => {
                const urgency = getUrgencyLevel(alert.due_date);
                return (
                  <div 
                    key={alert.id}
                    className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0 cursor-pointer hover:bg-muted/20 p-2 rounded transition-colors"
                    onClick={() => handleAlertClick(alert)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        urgency === 'overdue' ? 'bg-red-100 text-red-600' :
                        urgency === 'urgent' ? 'bg-amber-100 text-amber-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {urgency === 'overdue' ? (
                          <AlertTriangle className="h-5 w-5" />
                        ) : urgency === 'urgent' ? (
                          <BadgeAlert className="h-5 w-5" />
                        ) : (
                          <Calendar className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium">{alert.party_name}</h4>
                        <p className="text-xs text-muted-foreground">
                          {alert.reference} - Due: {formatDate(new Date(alert.due_date))}
                        </p>
                        <div className="mt-1">
                          {urgency === 'overdue' ? (
                            <Badge variant="destructive" className="text-xs">
                              {getRelativeTimeFromDates(new Date(), new Date(alert.due_date))} overdue
                            </Badge>
                          ) : (
                            <Badge className={`text-xs ${
                              urgency === 'urgent' ? 'bg-amber-500' : 'bg-blue-500'
                            }`}>
                              Due {getRelativeTimeFromDates(new Date(), new Date(alert.due_date))}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">रू {formatCurrency(alert.total_amount)}</p>
                    </div>
                  </div>
                );
              })
            )}
            
            {payables.length > 0 && (
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => navigate('/reports?tab=payables')}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                View All Payables
              </Button>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentAlerts;

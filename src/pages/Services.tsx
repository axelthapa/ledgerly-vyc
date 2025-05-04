
import React, { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServicesList from "@/components/services/ServicesList";
import ServiceForm from "@/components/services/ServiceForm";
import { getCurrentFiscalYearNP, getTodayNepaliDate } from "@/utils/nepali-date";

const Services: React.FC = () => {
  const { t, isNepali } = useLanguage();
  const [selectedTab, setSelectedTab] = useState("active");
  
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('Service Management')}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isNepali ? (
                <span>{getTodayNepaliDate()} | {t('Fiscal Year')}: {getCurrentFiscalYearNP()}</span>
              ) : (
                <span>{new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}</span>
              )}
            </p>
          </div>
          <ServiceForm />
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <Tabs defaultValue="active" onValueChange={setSelectedTab}>
            <TabsList className="border-b w-full rounded-t-lg">
              <TabsTrigger value="active">{t('Active Services')}</TabsTrigger>
              <TabsTrigger value="completed">{t('Completed Services')}</TabsTrigger>
              <TabsTrigger value="all">{t('All Services')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="p-4">
              <ServicesList status="active" />
            </TabsContent>
            
            <TabsContent value="completed" className="p-4">
              <ServicesList status="completed" />
            </TabsContent>
            
            <TabsContent value="all" className="p-4">
              <ServicesList status="all" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default Services;

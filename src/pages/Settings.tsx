
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Save, 
  Settings as SettingsIcon, 
  User, 
  Building, 
  Shield, 
  Bell, 
  FileText,
  PanelRight,
  Check
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { getSetting, updateSetting } from "@/utils/db-operations";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [companyInfo, setCompanyInfo] = useState({
    name: "VYC",
    address: "Kathmandu, Nepal",
    phone: "+977 1234567890",
    email: "info@vyc.com",
    website: "www.vyc.com",
    pan: "123456789",
    currency: "NPR",
    logo: ""
  });
  
  const [taxSettings, setTaxSettings] = useState({
    vatPercent: 13,
    enableVat: true,
    panRequired: true,
    includeVatInPrice: false
  });
  
  const [userInfo, setUserInfo] = useState({
    name: "Admin User",
    email: "admin@vyc.com",
    phone: "+977 9876543210"
  });

  const [creditSettings, setCreditSettings] = useState({
    defaultCreditDays: 15,
    enableCreditAlerts: true
  });

  const [themeSettings, setThemeSettings] = useState({
    theme: 'system',
    fontSize: 'medium',
    accentColor: 'blue'
  });
  
  useEffect(() => {
    // Load settings from database
    const loadSettings = async () => {
      try {
        // Company info
        const companyNameResult = await getSetting('company_name');
        const companyAddressResult = await getSetting('company_address');
        const companyPhoneResult = await getSetting('company_phone');
        const companyEmailResult = await getSetting('company_email');
        const companyWebsiteResult = await getSetting('company_website');
        const companyPanResult = await getSetting('company_pan');
        const companyLogoResult = await getSetting('company_logo');
        
        // Credit settings
        const creditDaysResult = await getSetting('default_credit_days');
        const enableCreditAlertsResult = await getSetting('enable_credit_alerts');
        
        // Tax settings
        const vatPercentResult = await getSetting('vat_percent');
        const enableVatResult = await getSetting('enable_vat');
        const panRequiredResult = await getSetting('pan_required');
        const includeVatResult = await getSetting('include_vat_in_price');
        
        // Update state with loaded settings
        setCompanyInfo(prev => ({
          ...prev,
          name: companyNameResult.success && companyNameResult.data ? companyNameResult.data : prev.name,
          address: companyAddressResult.success && companyAddressResult.data ? companyAddressResult.data : prev.address,
          phone: companyPhoneResult.success && companyPhoneResult.data ? companyPhoneResult.data : prev.phone,
          email: companyEmailResult.success && companyEmailResult.data ? companyEmailResult.data : prev.email,
          website: companyWebsiteResult.success && companyWebsiteResult.data ? companyWebsiteResult.data : prev.website,
          pan: companyPanResult.success && companyPanResult.data ? companyPanResult.data : prev.pan,
          logo: companyLogoResult.success && companyLogoResult.data ? companyLogoResult.data : prev.logo
        }));
        
        setCreditSettings(prev => ({
          ...prev,
          defaultCreditDays: creditDaysResult.success && creditDaysResult.data ? parseInt(creditDaysResult.data) : prev.defaultCreditDays,
          enableCreditAlerts: enableCreditAlertsResult.success && enableCreditAlertsResult.data ? enableCreditAlertsResult.data === 'true' : prev.enableCreditAlerts
        }));
        
        setTaxSettings(prev => ({
          ...prev,
          vatPercent: vatPercentResult.success && vatPercentResult.data ? parseInt(vatPercentResult.data) : prev.vatPercent,
          enableVat: enableVatResult.success && enableVatResult.data ? enableVatResult.data === 'true' : prev.enableVat,
          panRequired: panRequiredResult.success && panRequiredResult.data ? panRequiredResult.data === 'true' : prev.panRequired,
          includeVatInPrice: includeVatResult.success && includeVatResult.data ? includeVatResult.data === 'true' : prev.includeVatInPrice
        }));
        
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCompanyInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTaxSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setTaxSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleCreditSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setCreditSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === 'defaultCreditDays' ? parseInt(value) : value
    }));
  };

  const handleCreditSwitchChange = (checked: boolean) => {
    setCreditSettings(prev => ({
      ...prev,
      enableCreditAlerts: checked
    }));
  };

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveCompanyInfo = async () => {
    try {
      await updateSetting('company_name', companyInfo.name);
      await updateSetting('company_address', companyInfo.address);
      await updateSetting('company_phone', companyInfo.phone);
      await updateSetting('company_email', companyInfo.email);
      await updateSetting('company_website', companyInfo.website);
      await updateSetting('company_pan', companyInfo.pan);
      
      toast({
        title: t('Company Info Saved'),
        description: t('Company information has been saved successfully'),
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving company info:', error);
      toast({
        title: t('Error'),
        description: t('Failed to save company information'),
        variant: 'destructive',
      });
    }
  };
  
  const handleSaveTaxSettings = async () => {
    try {
      await updateSetting('vat_percent', taxSettings.vatPercent.toString());
      await updateSetting('enable_vat', taxSettings.enableVat.toString());
      await updateSetting('pan_required', taxSettings.panRequired.toString());
      await updateSetting('include_vat_in_price', taxSettings.includeVatInPrice.toString());
      
      toast({
        title: t('Tax Settings Saved'),
        description: t('Tax settings have been saved successfully'),
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving tax settings:', error);
      toast({
        title: t('Error'),
        description: t('Failed to save tax settings'),
        variant: 'destructive',
      });
    }
  };
  
  const handleSaveCreditSettings = async () => {
    try {
      await updateSetting('default_credit_days', creditSettings.defaultCreditDays.toString());
      await updateSetting('enable_credit_alerts', creditSettings.enableCreditAlerts.toString());
      
      toast({
        title: t('Credit Settings Saved'),
        description: t('Credit settings have been saved successfully'),
        variant: 'default',
      });
    } catch (error) {
      console.error('Error saving credit settings:', error);
      toast({
        title: t('Error'),
        description: t('Failed to save credit settings'),
        variant: 'destructive',
      });
    }
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setCompanyInfo(prev => ({ ...prev, logo: base64 }));
        
        try {
          await updateSetting('company_logo', base64);
          toast({
            title: t('Logo Uploaded'),
            description: t('Company logo has been uploaded successfully'),
            variant: 'default',
          });
        } catch (error) {
          console.error('Error saving logo:', error);
          toast({
            title: t('Error'),
            description: t('Failed to save company logo'),
            variant: 'destructive',
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleThemeChange = (theme: string) => {
    setThemeSettings(prev => ({ ...prev, theme }));
  };

  const handleFontSizeChange = (fontSize: string) => {
    setThemeSettings(prev => ({ ...prev, fontSize }));
  };

  const handleColorChange = (accentColor: string) => {
    setThemeSettings(prev => ({ ...prev, accentColor }));
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('Settings')}</h1>
            <p className="text-muted-foreground">
              {t('Manage your application preferences and company information')}
            </p>
          </div>
        </div>

        <Tabs defaultValue="company">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 h-auto">
            <TabsTrigger value="company" className="py-2">
              <Building className="w-4 h-4 mr-2" />
              <span>{t('Company')}</span>
            </TabsTrigger>
            <TabsTrigger value="credit" className="py-2">
              <FileText className="w-4 h-4 mr-2" />
              <span>{t('Credit')}</span>
            </TabsTrigger>
            <TabsTrigger value="user" className="py-2">
              <User className="w-4 h-4 mr-2" />
              <span>{t('User Profile')}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="py-2">
              <Shield className="w-4 h-4 mr-2" />
              <span>{t('Security')}</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="py-2">
              <PanelRight className="w-4 h-4 mr-2" />
              <span>{t('Appearance')}</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Company Information Tab */}
          <TabsContent value="company" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  {t('Company Information')}
                </CardTitle>
                <CardDescription>
                  {t('Update your company details that will appear on reports and invoices')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">{t('Company Name')}</Label>
                    <Input 
                      id="companyName"
                      name="name"
                      value={companyInfo.name}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">{t('Address')}</Label>
                    <Input 
                      id="companyAddress"
                      name="address"
                      value={companyInfo.address}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyPhone">{t('Phone')}</Label>
                    <Input 
                      id="companyPhone"
                      name="phone"
                      value={companyInfo.phone}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">{t('Email')}</Label>
                    <Input 
                      id="companyEmail"
                      name="email"
                      value={companyInfo.email}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyWebsite">{t('Website')}</Label>
                    <Input 
                      id="companyWebsite"
                      name="website"
                      value={companyInfo.website}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPan">{t('PAN/VAT Number')}</Label>
                    <Input 
                      id="companyPan"
                      name="pan"
                      value={companyInfo.pan}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyLogo">{t('Company Logo')}</Label>
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 bg-gray-100 rounded flex items-center justify-center">
                      {companyInfo.logo ? (
                        <img src={companyInfo.logo} alt="Company logo" className="max-h-full max-w-full" />
                      ) : (
                        <Building className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <Input 
                      id="companyLogo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveCompanyInfo}
                  className="bg-vyc-primary hover:bg-vyc-primary-dark"
                >
                  <Save className="mr-2 h-4 w-4" /> {t('Save Company Info')}
                </Button>
              </CardFooter>
            </Card>
            
            {/* Tax Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  {t('Tax Settings')}
                </CardTitle>
                <CardDescription>
                  {t('Configure tax rates and related preferences')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vatPercent">{t('VAT Percentage')}</Label>
                    <Input 
                      id="vatPercent"
                      name="vatPercent"
                      type="number"
                      min="0"
                      max="100"
                      value={taxSettings.vatPercent}
                      onChange={handleTaxSettingsChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="block mb-4">{t('Tax Options')}</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="enableVat" 
                          name="enableVat"
                          checked={taxSettings.enableVat}
                          onChange={handleTaxSettingsChange}
                          className="h-4 w-4 rounded border-gray-300" 
                        />
                        <label htmlFor="enableVat">{t('Enable VAT calculation')}</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="panRequired" 
                          name="panRequired"
                          checked={taxSettings.panRequired}
                          onChange={handleTaxSettingsChange}
                          className="h-4 w-4 rounded border-gray-300" 
                        />
                        <label htmlFor="panRequired">{t('Require PAN for customers')}</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id="includeVatInPrice" 
                          name="includeVatInPrice"
                          checked={taxSettings.includeVatInPrice}
                          onChange={handleTaxSettingsChange}
                          className="h-4 w-4 rounded border-gray-300" 
                        />
                        <label htmlFor="includeVatInPrice">{t('Prices include VAT')}</label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveTaxSettings}
                  className="bg-vyc-primary hover:bg-vyc-primary-dark"
                >
                  <Save className="mr-2 h-4 w-4" /> {t('Save Tax Settings')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Credit Settings Tab */}
          <TabsContent value="credit" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  {t('Credit Settings')}
                </CardTitle>
                <CardDescription>
                  {t('Configure credit limits and payment alerts')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCreditDays">{t('Default Credit Limit Days')}</Label>
                    <Input 
                      id="defaultCreditDays"
                      name="defaultCreditDays"
                      type="number"
                      min="0"
                      value={creditSettings.defaultCreditDays}
                      onChange={handleCreditSettingsChange}
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {t('Default number of days for credit period after which payment is considered overdue')}
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="enableCreditAlerts"
                        checked={creditSettings.enableCreditAlerts}
                        onCheckedChange={handleCreditSwitchChange}
                      />
                      <Label htmlFor="enableCreditAlerts">{t('Enable Credit Alerts')}</Label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 ml-6">
                      {t('Show alerts in dashboard for overdue payments based on credit days')}
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveCreditSettings}
                  className="bg-vyc-primary hover:bg-vyc-primary-dark"
                >
                  <Save className="mr-2 h-4 w-4" /> {t('Save Credit Settings')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* User Profile Tab */}
          <TabsContent value="user" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {t('User Profile')}
                </CardTitle>
                <CardDescription>
                  {t('Update your personal information and preferences')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="userName">{t('Name')}</Label>
                    <Input 
                      id="userName"
                      name="name"
                      value={userInfo.name}
                      onChange={handleUserInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">{t('Email')}</Label>
                    <Input 
                      id="userEmail"
                      name="email"
                      type="email"
                      value={userInfo.email}
                      onChange={handleUserInfoChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="userPhone">{t('Phone')}</Label>
                  <Input 
                    id="userPhone"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleUserInfoChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={() => toast({
                    title: t('User Profile Saved'),
                    variant: 'default'
                  })}
                  className="bg-vyc-primary hover:bg-vyc-primary-dark"
                >
                  <Save className="mr-2 h-4 w-4" /> {t('Save User Profile')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  {t('Security Settings')}
                </CardTitle>
                <CardDescription>
                  {t('Manage your account security and authentication preferences')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t('Current Password')}</Label>
                    <Input 
                      id="currentPassword"
                      type="password"
                      placeholder={t('Enter current password')}
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t('New Password')}</Label>
                      <Input 
                        id="newPassword"
                        type="password"
                        placeholder={t('Enter new password')}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t('Confirm New Password')}</Label>
                      <Input 
                        id="confirmPassword"
                        type="password"
                        placeholder={t('Confirm new password')}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={() => toast({
                    title: t('Password Updated'),
                    variant: 'default'
                  })}
                  className="bg-vyc-primary hover:bg-vyc-primary-dark"
                >
                  <Save className="mr-2 h-4 w-4" /> {t('Update Password')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PanelRight className="mr-2 h-4 w-4" />
                  {t('Appearance Settings')}
                </CardTitle>
                <CardDescription>
                  {t('Customize how the application looks')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="block mb-2">{t('Theme Preference')}</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div 
                        className={`border rounded-md p-3 flex flex-col items-center cursor-pointer ${themeSettings.theme === 'light' ? 'border-vyc-primary' : ''}`}
                        onClick={() => handleThemeChange('light')}
                      >
                        <div className="h-20 w-full bg-white border rounded-md mb-2"></div>
                        <span className="text-sm">{t('Light')}</span>
                      </div>
                      <div 
                        className={`border rounded-md p-3 flex flex-col items-center cursor-pointer ${themeSettings.theme === 'system' ? 'border-vyc-primary' : ''}`}
                        onClick={() => handleThemeChange('system')}
                      >
                        <div className="h-20 w-full bg-gray-100 border rounded-md mb-2"></div>
                        <span className="text-sm">{t('System')}</span>
                      </div>
                      <div 
                        className={`border rounded-md p-3 flex flex-col items-center cursor-pointer ${themeSettings.theme === 'dark' ? 'border-vyc-primary' : ''}`}
                        onClick={() => handleThemeChange('dark')}
                      >
                        <div className="h-20 w-full bg-gray-800 border rounded-md mb-2"></div>
                        <span className="text-sm">{t('Dark')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <Label className="block mb-2">{t('Font Size')}</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div 
                        className={`border rounded-md p-3 flex flex-col items-center cursor-pointer ${themeSettings.fontSize === 'small' ? 'border-vyc-primary' : ''}`}
                        onClick={() => handleFontSizeChange('small')}
                      >
                        <div className="h-10 w-full flex items-center justify-center">
                          <span className="text-xs">Aa</span>
                        </div>
                        <span className="text-sm">{t('Small')}</span>
                      </div>
                      <div 
                        className={`border rounded-md p-3 flex flex-col items-center cursor-pointer ${themeSettings.fontSize === 'medium' ? 'border-vyc-primary' : ''}`}
                        onClick={() => handleFontSizeChange('medium')}
                      >
                        <div className="h-10 w-full flex items-center justify-center">
                          <span className="text-sm">Aa</span>
                        </div>
                        <span className="text-sm">{t('Medium')}</span>
                      </div>
                      <div 
                        className={`border rounded-md p-3 flex flex-col items-center cursor-pointer ${themeSettings.fontSize === 'large' ? 'border-vyc-primary' : ''}`}
                        onClick={() => handleFontSizeChange('large')}
                      >
                        <div className="h-10 w-full flex items-center justify-center">
                          <span className="text-base">Aa</span>
                        </div>
                        <span className="text-sm">{t('Large')}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <Label className="block mb-2">{t('Color Accent')}</Label>
                    <div className="grid grid-cols-5 gap-4">
                      <div 
                        className={`h-8 w-8 rounded-full bg-blue-500 cursor-pointer ${themeSettings.accentColor === 'blue' ? 'border-2 border-black' : 'border-2 border-white'}`}
                        onClick={() => handleColorChange('blue')}
                      ></div>
                      <div 
                        className={`h-8 w-8 rounded-full bg-green-500 cursor-pointer ${themeSettings.accentColor === 'green' ? 'border-2 border-black' : 'border-2 border-white'}`}
                        onClick={() => handleColorChange('green')}
                      ></div>
                      <div 
                        className={`h-8 w-8 rounded-full bg-purple-500 cursor-pointer ${themeSettings.accentColor === 'purple' ? 'border-2 border-black' : 'border-2 border-white'}`}
                        onClick={() => handleColorChange('purple')}
                      ></div>
                      <div 
                        className={`h-8 w-8 rounded-full bg-red-500 cursor-pointer ${themeSettings.accentColor === 'red' ? 'border-2 border-black' : 'border-2 border-white'}`}
                        onClick={() => handleColorChange('red')}
                      ></div>
                      <div 
                        className={`h-8 w-8 rounded-full bg-amber-500 cursor-pointer ${themeSettings.accentColor === 'amber' ? 'border-2 border-black' : 'border-2 border-white'}`}
                        onClick={() => handleColorChange('amber')}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={() => toast({
                    title: t('Appearance Settings Saved'),
                    variant: 'default'
                  })}
                  className="bg-vyc-primary hover:bg-vyc-primary-dark"
                >
                  <Save className="mr-2 h-4 w-4" /> {t('Save Appearance Settings')}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Settings;

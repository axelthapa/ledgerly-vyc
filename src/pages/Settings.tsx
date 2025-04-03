
import React, { useState } from "react";
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
  CreditCard, 
  Shield, 
  Bell, 
  FileText,
  PanelRight,
  Check
} from "lucide-react";
import { toast } from "@/components/ui/toast-utils";

const Settings = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: "YourCompany Pvt. Ltd.",
    address: "Kathmandu, Nepal",
    phone: "+977 1234567890",
    email: "info@yourcompany.com",
    website: "www.yourcompany.com",
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
    email: "admin@yourcompany.com",
    phone: "+977 9876543210"
  });

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

  const handleUserInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSaveSettings = () => {
    toast.success("Settings saved successfully!");
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // In a real app, you'd upload this file to a server
      toast.success("Logo uploaded successfully.");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your application preferences and company information
            </p>
          </div>
        </div>

        <Tabs defaultValue="company">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 h-auto">
            <TabsTrigger value="company" className="py-2">
              <Building className="w-4 h-4 mr-2" />
              <span>Company</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="py-2">
              <CreditCard className="w-4 h-4 mr-2" />
              <span>Billing</span>
            </TabsTrigger>
            <TabsTrigger value="user" className="py-2">
              <User className="w-4 h-4 mr-2" />
              <span>User Profile</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="py-2">
              <Shield className="w-4 h-4 mr-2" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="py-2">
              <Bell className="w-4 h-4 mr-2" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="py-2">
              <PanelRight className="w-4 h-4 mr-2" />
              <span>Appearance</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Company Information Tab */}
          <TabsContent value="company" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  Company Information
                </CardTitle>
                <CardDescription>
                  Update your company details that will appear on reports and invoices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input 
                      id="companyName"
                      name="name"
                      value={companyInfo.name}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyAddress">Address</Label>
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
                    <Label htmlFor="companyPhone">Phone</Label>
                    <Input 
                      id="companyPhone"
                      name="phone"
                      value={companyInfo.phone}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyEmail">Email</Label>
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
                    <Label htmlFor="companyWebsite">Website</Label>
                    <Input 
                      id="companyWebsite"
                      name="website"
                      value={companyInfo.website}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="companyPan">PAN/VAT Number</Label>
                    <Input 
                      id="companyPan"
                      name="pan"
                      value={companyInfo.pan}
                      onChange={handleCompanyInfoChange}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="companyLogo">Company Logo</Label>
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
                  onClick={handleSaveSettings}
                  className="bg-vyc-primary hover:bg-vyc-primary-dark"
                >
                  <Save className="mr-2 h-4 w-4" /> Save Company Info
                </Button>
              </CardFooter>
            </Card>
            
            {/* Tax Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Tax Settings
                </CardTitle>
                <CardDescription>
                  Configure tax rates and related preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="vatPercent">VAT Percentage</Label>
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
                    <Label className="block mb-4">Tax Options</Label>
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
                        <label htmlFor="enableVat">Enable VAT calculation</label>
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
                        <label htmlFor="panRequired">Require PAN for customers</label>
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
                        <label htmlFor="includeVatInPrice">Prices include VAT</label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-vyc-primary hover:bg-vyc-primary-dark"
                >
                  <Save className="mr-2 h-4 w-4" /> Save Tax Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing Settings
                </CardTitle>
                <CardDescription>
                  Manage your subscription and payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-100 rounded-md p-4 flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <div>
                      <h3 className="font-medium">Current Plan: Business</h3>
                      <p className="text-sm text-muted-foreground">Your subscription renews on August 25, 2024</p>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Payment Methods</h3>
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        <span>•••• •••• •••• 4242</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Expires 08/25</span>
                    </div>
                    <div className="mt-2">
                      <Button variant="outline" size="sm" className="text-xs">
                        + Add Payment Method
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Billing History</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left pb-2">Date</th>
                          <th className="text-left pb-2">Amount</th>
                          <th className="text-left pb-2">Status</th>
                          <th className="text-right pb-2">Invoice</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Jul 25, 2024</td>
                          <td className="py-2">$29.99</td>
                          <td className="py-2"><span className="text-green-500">Paid</span></td>
                          <td className="py-2 text-right"><a href="#" className="text-blue-600">View</a></td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Jun 25, 2024</td>
                          <td className="py-2">$29.99</td>
                          <td className="py-2"><span className="text-green-500">Paid</span></td>
                          <td className="py-2 text-right"><a href="#" className="text-blue-600">View</a></td>
                        </tr>
                        <tr>
                          <td className="py-2">May 25, 2024</td>
                          <td className="py-2">$29.99</td>
                          <td className="py-2"><span className="text-green-500">Paid</span></td>
                          <td className="py-2 text-right"><a href="#" className="text-blue-600">View</a></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Profile Tab */}
          <TabsContent value="user" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  User Profile
                </CardTitle>
                <CardDescription>
                  Update your personal information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="userName">Name</Label>
                    <Input 
                      id="userName"
                      name="name"
                      value={userInfo.name}
                      onChange={handleUserInfoChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">Email</Label>
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
                  <Label htmlFor="userPhone">Phone</Label>
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
                  onClick={handleSaveSettings}
                  className="bg-vyc-primary hover:bg-vyc-primary-dark"
                >
                  <Save className="mr-2 h-4 w-4" /> Save User Profile
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
                  Security Settings
                </CardTitle>
                <CardDescription>
                  Manage your account security and authentication preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input 
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input 
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <h3 className="text-sm font-medium mb-2">Two-Factor Authentication</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <input 
                        type="checkbox" 
                        id="enable2fa" 
                        className="h-4 w-4 rounded border-gray-300" 
                      />
                      <label htmlFor="enable2fa">Enable two-factor authentication</label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Enabling two-factor authentication adds an extra layer of security to your account.
                    </p>
                  </div>
                  
                  <div className="pt-2 border-t">
                    <h3 className="text-sm font-medium mb-2">Session Management</h3>
                    <Button variant="outline" size="sm">Sign Out From All Devices</Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      This will log you out from all devices except this one.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-vyc-primary hover:bg-vyc-primary-dark"
                >
                  <Save className="mr-2 h-4 w-4" /> Update Security Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Control which notifications you receive and how
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium mb-2">Email Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Transaction alerts</span>
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Payment reminders</span>
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Low inventory alerts</span>
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Account activity</span>
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Marketing updates</span>
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <h3 className="text-sm font-medium mb-2">In-App Notifications</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span>Transaction alerts</span>
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Due payments</span>
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>System updates</span>
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-vyc-primary hover:bg-vyc-primary-dark"
                >
                  <Save className="mr-2 h-4 w-4" /> Save Notification Settings
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
                  Appearance Settings
                </CardTitle>
                <CardDescription>
                  Customize how the application looks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="block mb-2">Theme Preference</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="border rounded-md p-3 flex flex-col items-center cursor-pointer bg-white">
                        <div className="h-20 w-full bg-white border rounded-md mb-2"></div>
                        <span className="text-sm">Light</span>
                      </div>
                      <div className="border rounded-md p-3 flex flex-col items-center cursor-pointer border-vyc-primary">
                        <div className="h-20 w-full bg-gray-100 border rounded-md mb-2"></div>
                        <span className="text-sm">System</span>
                      </div>
                      <div className="border rounded-md p-3 flex flex-col items-center cursor-pointer">
                        <div className="h-20 w-full bg-gray-800 border rounded-md mb-2"></div>
                        <span className="text-sm">Dark</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <Label className="block mb-2">Font Size</Label>
                    <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option value="small">Small</option>
                      <option value="medium" selected>Medium</option>
                      <option value="large">Large</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <Label className="block mb-2">Color Accent</Label>
                    <div className="grid grid-cols-5 gap-4">
                      <div className="h-8 w-8 rounded-full bg-blue-500 cursor-pointer border-2 border-white"></div>
                      <div className="h-8 w-8 rounded-full bg-green-500 cursor-pointer border-2 border-white"></div>
                      <div className="h-8 w-8 rounded-full bg-purple-500 cursor-pointer border-2 border-white"></div>
                      <div className="h-8 w-8 rounded-full bg-red-500 cursor-pointer border-2 border-white"></div>
                      <div className="h-8 w-8 rounded-full bg-amber-500 cursor-pointer border-2 border-white"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-vyc-primary hover:bg-vyc-primary-dark"
                >
                  <Save className="mr-2 h-4 w-4" /> Save Appearance Settings
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

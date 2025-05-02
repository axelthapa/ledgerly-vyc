
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getSetting, updateSetting } from '@/utils/db-operations';

// Define the available languages
export type Language = 'en' | 'ne';

// Define the context shape
interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isNepali: boolean;
}

// Create the context
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// English translations
const translations = {
  en: {
    // Dashboard
    'Dashboard': 'Dashboard',
    'Sales': 'Sales',
    'Purchases': 'Purchases',
    'Expenses': 'Expenses',
    'Payments': 'Payments',
    'Transactions': 'Transactions',
    'Customers': 'Customers',
    'Suppliers': 'Suppliers',
    'Reports': 'Reports',
    'Settings': 'Settings',
    'Analytics': 'Analytics',
    'Backup': 'Backup',
    'Logout': 'Logout',
    'Today': 'Today',
    'This Week': 'This Week',
    'This Month': 'This Month',
    'This Year': 'This Year',
    'Total Sales': 'Total Sales',
    'Total Purchases': 'Total Purchases',
    'Total Expenses': 'Total Expenses',
    'Net Profit': 'Net Profit',
    
    // Common actions
    'Add': 'Add',
    'Edit': 'Edit',
    'Delete': 'Delete',
    'Save': 'Save',
    'Cancel': 'Cancel',
    'Search': 'Search',
    'Filter': 'Filter',
    'Export': 'Export',
    'Print': 'Print',
    'Back': 'Back',
    'Next': 'Next',
    'Previous': 'Previous',
    'Submit': 'Submit',
    
    // Form labels
    'Name': 'Name',
    'Email': 'Email',
    'Phone': 'Phone',
    'Address': 'Address',
    'Date': 'Date',
    'Amount': 'Amount',
    'Description': 'Description',
    'Status': 'Status',
    'Type': 'Type',
    'Category': 'Category',
    'Payment Method': 'Payment Method',
    'Reference': 'Reference',
    'Notes': 'Notes',
    
    // Customers & Suppliers
    'Customer Details': 'Customer Details',
    'Supplier Details': 'Supplier Details',
    'Add Customer': 'Add Customer',
    'Add Supplier': 'Add Supplier',
    'Edit Customer': 'Edit Customer',
    'Edit Supplier': 'Edit Supplier',
    'Customer ID': 'Customer ID',
    'Supplier ID': 'Supplier ID',
    'Balance': 'Balance',
    'PAN': 'PAN',
    'Credit Days': 'Credit Days',
    'Opening Balance': 'Opening Balance',
    
    // Transactions
    'Invoice Number': 'Invoice Number',
    'Transaction ID': 'Transaction ID',
    'Transaction Date': 'Transaction Date',
    'Due Date': 'Due Date',
    'Total Amount': 'Total Amount',
    'Paid Amount': 'Paid Amount',
    'Due Amount': 'Due Amount',
    'Tax': 'Tax',
    'Discount': 'Discount',
    'Subtotal': 'Subtotal',
    'Grand Total': 'Grand Total',
    'Add Item': 'Add Item',
    
    // Reports
    'Sales Report': 'Sales Report',
    'Purchase Report': 'Purchase Report',
    'Stock Report': 'Stock Report',
    'Tax Report': 'Tax Report',
    'Profit & Loss': 'Profit & Loss',
    'Customer Statement': 'Customer Statement',
    'Supplier Statement': 'Supplier Statement',
    
    // Settings
    'Company Information': 'Company Information',
    'Company Name': 'Company Name',
    'Company Address': 'Company Address',
    'Company Phone': 'Company Phone',
    'Company Email': 'Company Email',
    'Company Website': 'Company Website',
    'Tax Settings': 'Tax Settings',
    'User Settings': 'User Settings',
    'Backup Settings': 'Backup Settings',
    'Language Settings': 'Language Settings',
    
    // Backup & Restore
    'Backup Now': 'Backup Now',
    'Restore Backup': 'Restore Backup',
    'Last Backup': 'Last Backup',
    'Backup Reminder': 'Backup Reminder',
    'Backup Database': 'Backup Database',
    'It\'s been a while since your last backup': 'It\'s been a while since your last backup',
    'Backup your database now to prevent data loss': 'Backup your database now to prevent data loss',
    
    // Language
    'Switch Language': 'Switch Language',
    'Language Changed': 'Language Changed',
    
    // Service Management
    'Service Management': 'Service Management',
    'New Service': 'New Service',
    'Add New Service': 'Add New Service',
    'Enter the details of the service to be performed.': 'Enter the details of the service to be performed.',
    'Customer Name': 'Customer Name',
    'Service Date': 'Service Date',
    'Device Type': 'Device Type',
    'Device Model': 'Device Model',
    'Serial Number': 'Serial Number',
    'Problem Description': 'Problem Description',
    'Technician': 'Technician',
    'Status': 'Status',
    'Estimated Cost': 'Estimated Cost',
    'Under Warranty': 'Under Warranty',
    'Notes': 'Notes',
    'Active Services': 'Active Services',
    'Completed Services': 'Completed Services',
    'All Services': 'All Services',
    'Service Created': 'Service Created',
    'Service has been created successfully': 'Service has been created successfully',
    'Error': 'Error',
    'Failed to create service': 'Failed to create service',
    'An unexpected error occurred': 'An unexpected error occurred',
    'Select date': 'Select date',
    'Select device type': 'Select device type',
    'Select status': 'Select status',
    'Final Cost': 'Final Cost',
    'Service Details': 'Service Details',
    'Update Service': 'Update Service',
    'Service updated successfully': 'Service updated successfully',
    'Failed to update service': 'Failed to update service',
    'Delete Service': 'Delete Service',
    'Are you sure you want to delete this service?': 'Are you sure you want to delete this service?',
    'This action cannot be undone.': 'This action cannot be undone.',
    'Service deleted successfully': 'Service deleted successfully',
    'Failed to delete service': 'Failed to delete service',
    'Service ID': 'Service ID',
    'Created Date': 'Created Date',
    'Updated Date': 'Updated Date',
    'Device Serial': 'Device Serial',
    'Problem': 'Problem',
    'Warranty': 'Warranty',
    'Credit Limit Days': 'Credit Limit Days',
    
    // Quotes
    'Quote of the Day': 'Quote of the Day',
    'Services': 'Services'
  },
  
  // Nepali translations
  ne: {
    // Dashboard
    'Dashboard': 'ड्यासबोर्ड',
    'Sales': 'बिक्री',
    'Purchases': 'खरिद',
    'Expenses': 'खर्चहरू',
    'Payments': 'भुक्तानीहरू',
    'Transactions': 'लेनदेनहरू',
    'Customers': 'ग्राहकहरू',
    'Suppliers': 'आपूर्तिकर्ताहरू',
    'Reports': 'प्रतिवेदनहरू',
    'Settings': 'सेटिङहरू',
    'Analytics': 'विश्लेषणहरू',
    'Backup': 'ब्याकअप',
    'Logout': 'लगआउट',
    'Today': 'आज',
    'This Week': 'यो हप्ता',
    'This Month': 'यो महिना',
    'This Year': 'यो वर्ष',
    'Total Sales': 'कुल बिक्री',
    'Total Purchases': 'कुल खरिद',
    'Total Expenses': 'कुल खर्च',
    'Net Profit': 'खुद नाफा',
    
    // Common actions
    'Add': 'थप्नुहोस्',
    'Edit': 'सम्पादन',
    'Delete': 'मेटाउनुहोस्',
    'Save': 'सुरक्षित गर्नुहोस्',
    'Cancel': 'रद्द गर्नुहोस्',
    'Search': 'खोज्नुहोस्',
    'Filter': 'फिल्टर गर्नुहोस्',
    'Export': 'निर्यात गर्नुहोस्',
    'Print': 'प्रिन्ट गर्नुहोस्',
    'Back': 'पछाडि',
    'Next': 'अर्को',
    'Previous': 'अघिल्लो',
    'Submit': 'पेश गर्नुहोस्',
    
    // Form labels
    'Name': 'नाम',
    'Email': 'इमेल',
    'Phone': 'फोन',
    'Address': 'ठेगाना',
    'Date': 'मिति',
    'Amount': 'रकम',
    'Description': 'विवरण',
    'Status': 'स्थिति',
    'Type': 'प्रकार',
    'Category': 'श्रेणी',
    'Payment Method': 'भुक्तानी विधि',
    'Reference': 'सन्दर्भ',
    'Notes': 'टिप्पणीहरू',
    
    // Customers & Suppliers
    'Customer Details': 'ग्राहक विवरण',
    'Supplier Details': 'आपूर्तिकर्ता विवरण',
    'Add Customer': 'ग्राहक थप्नुहोस्',
    'Add Supplier': 'आपूर्तिकर्ता थप्नुहोस्',
    'Edit Customer': 'ग्राहक सम्पादन गर्नुहोस्',
    'Edit Supplier': 'आपूर्तिकर्ता सम्पादन गर्नुहोस्',
    'Customer ID': 'ग्राहक आईडी',
    'Supplier ID': 'आपूर्तिकर्ता आईडी',
    'Balance': 'शेष',
    'PAN': 'प्यान',
    'Credit Days': 'क्रेडिट दिनहरू',
    'Opening Balance': 'प्रारम्भिक शेष',
    
    // Transactions
    'Invoice Number': 'बिल नम्बर',
    'Transaction ID': 'लेनदेन आईडी',
    'Transaction Date': 'लेनदेन मिति',
    'Due Date': 'भुक्तानी मिति',
    'Total Amount': 'कुल रकम',
    'Paid Amount': 'भुक्तानी गरिएको',
    'Due Amount': 'बाँकी रकम',
    'Tax': 'कर',
    'Discount': 'छुट',
    'Subtotal': 'उप-कुल',
    'Grand Total': 'कुल जम्मा',
    'Add Item': 'वस्तु थप्नुहोस्',
    
    // Reports
    'Sales Report': 'बिक्री प्रतिवेदन',
    'Purchase Report': 'खरिद प्रतिवेदन',
    'Stock Report': 'स्टक प्रतिवेदन',
    'Tax Report': 'कर प्रतिवेदन',
    'Profit & Loss': 'नाफा र नोक्सान',
    'Customer Statement': 'ग्राहक विवरण',
    'Supplier Statement': 'आपूर्तिकर्ता विवरण',
    
    // Settings
    'Company Information': 'कम्पनी जानकारी',
    'Company Name': 'कम्पनीको नाम',
    'Company Address': 'कम्पनीको ठेगाना',
    'Company Phone': 'कम्पनीको फोन',
    'Company Email': 'कम्पनीको इमेल',
    'Company Website': 'कम्पनीको वेबसाइट',
    'Tax Settings': 'कर सेटिङहरू',
    'User Settings': 'प्रयोगकर्ता सेटिङहरू',
    'Backup Settings': 'ब्याकअप सेटिङहरू',
    'Language Settings': 'भाषा सेटिङहरू',
    
    // Backup & Restore
    'Backup Now': 'अहिले ब्याकअप गर्नुहोस्',
    'Restore Backup': 'ब्याकअप पुनर्स्थापना गर्नुहोस्',
    'Last Backup': 'अन्तिम ब्याकअप',
    'Backup Reminder': 'ब्याकअप रिमाइन्डर',
    'Backup Database': 'डाटाबेस ब्याकअप गर्नुहोस्',
    'It\'s been a while since your last backup': 'तपाईंको अन्तिम ब्याकअप देखि धेरै समय भइसकेको छ',
    'Backup your database now to prevent data loss': 'डाटा गुम्नबाट बचाउन अहिले आफ्नो डाटाबेस ब्याकअप गर्नुहोस्',
    
    // Language
    'Switch Language': 'भाषा परिवर्तन गर्नुहोस्',
    'Language Changed': 'भाषा परिवर्तन भयो',
    
    // Service Management
    'Service Management': 'सेवा व्यवस्थापन',
    'New Service': 'नयाँ सेवा',
    'Add New Service': 'नयाँ सेवा थप्नुहोस्',
    'Enter the details of the service to be performed.': 'सम्पादन गरिने सेवाको विवरण प्रविष्ट गर्नुहोस्।',
    'Customer Name': 'ग्राहकको नाम',
    'Service Date': 'सेवा मिति',
    'Device Type': 'उपकरण प्रकार',
    'Device Model': 'उपकरण मोडेल',
    'Serial Number': 'सिरियल नम्बर',
    'Problem Description': 'समस्याको विवरण',
    'Technician': 'प्राविधिक',
    'Status': 'स्थिति',
    'Estimated Cost': 'अनुमानित लागत',
    'Under Warranty': 'वारेन्टी अन्तर्गत',
    'Notes': 'टिप्पणीहरू',
    'Active Services': 'सक्रिय सेवाहरू',
    'Completed Services': 'पूरा भएका सेवाहरू',
    'All Services': 'सबै सेवाहरू',
    'Service Created': 'सेवा सिर्जना गरियो',
    'Service has been created successfully': 'सेवा सफलतापूर्वक सिर्जना गरिएको छ',
    'Error': 'त्रुटि',
    'Failed to create service': 'सेवा सिर्जना गर्न असफल',
    'An unexpected error occurred': 'अनपेक्षित त्रुटि देखा पर्‍यो',
    'Select date': 'मिति चयन गर्नुहोस्',
    'Select device type': 'उपकरण प्रकार चयन गर्नुहोस्',
    'Select status': 'स्थिति चयन गर्नुहोस्',
    'Final Cost': 'अन्तिम लागत',
    'Service Details': 'सेवा विवरणहरू',
    'Update Service': 'सेवा अपडेट गर्नुहोस्',
    'Service updated successfully': 'सेवा सफलतापूर्वक अपडेट गरियो',
    'Failed to update service': 'सेवा अपडेट गर्न असफल',
    'Delete Service': 'सेवा मेटाउनुहोस्',
    'Are you sure you want to delete this service?': 'के तपाईं निश्चित रूपमा यो सेवा मेटाउन चाहनुहुन्छ?',
    'This action cannot be undone.': 'यो कार्य पूर्ववत् गर्न सकिँदैन।',
    'Service deleted successfully': 'सेवा सफलतापूर्वक मेटाइयो',
    'Failed to delete service': 'सेवा मेटाउन असफल',
    'Service ID': 'सेवा आईडी',
    'Created Date': 'सिर्जना मिति',
    'Updated Date': 'अद्यावधिक मिति',
    'Device Serial': 'उपकरण सिरियल',
    'Problem': 'समस्या',
    'Warranty': 'वारेन्टी',
    'Credit Limit Days': 'क्रेडिट सीमा दिनहरू',
    
    // Quotes
    'Quote of the Day': 'आजको उद्धरण',
    'Services': 'सेवाहरू'
  }
};

// Provider component
interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');
  
  // Load language setting on mount
  useEffect(() => {
    const loadLanguageSetting = async () => {
      try {
        const result = await getSetting('display_language');
        if (result.success && result.data) {
          setLanguageState(result.data as Language);
        }
      } catch (error) {
        console.error('Error loading language setting:', error);
      }
    };
    
    loadLanguageSetting();
  }, []);
  
  // Function to set language and save to database
  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    try {
      await updateSetting('display_language', newLanguage);
    } catch (error) {
      console.error('Error saving language setting:', error);
    }
  };
  
  // Translation function
  const t = (key: string): string => {
    const currentTranslations = translations[language];
    return currentTranslations[key as keyof typeof currentTranslations] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      t,
      isNepali: language === 'ne'
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use the language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

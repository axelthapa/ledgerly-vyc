
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getSetting, updateSetting } from '@/utils/db-operations';

type Language = 'en' | 'ne';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isNepali: boolean;
}

const defaultLanguage: Language = 'en';

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
  t: (key: string) => key,
  isNepali: false
});

export const useLanguage = () => useContext(LanguageContext);

// Translation dictionary 
const translations: Record<string, Record<string, string>> = {
  en: {
    // Dashboard
    'Good Morning': 'Good Morning',
    'Good Afternoon': 'Good Afternoon',
    'Good Evening': 'Good Evening',
    'Here\'s what\'s happening with your business today.': 'Here\'s what\'s happening with your business today.',
    'Total Sales': 'Total Sales',
    'Total Purchases': 'Total Purchases',
    'Total Receivable': 'Total Receivable',
    'Total Payable': 'Total Payable',
    'This Month': 'This Month',
    'Outstanding': 'Outstanding',
    'from last month': 'from last month',
    'Recent Customers': 'Recent Customers',
    'Recent Suppliers': 'Recent Suppliers',
    'Last transaction': 'Last transaction',
    'days ago': 'days ago',
    'Recent Activity': 'Recent Activity',
    'Payment Alerts': 'Payment Alerts',
    'Upcoming payments due within 7 days': 'Upcoming payments due within 7 days',
    'Receivables': 'Receivables',
    'Payables': 'Payables',
    'No upcoming receivables': 'No upcoming receivables',
    'All customer payments are up to date': 'All customer payments are up to date',
    'No upcoming payables': 'No upcoming payables',
    'All supplier payments are up to date': 'All supplier payments are up to date',
    'View All Receivables': 'View All Receivables',
    'View All Payables': 'View All Payables',
    'Due': 'Due',
    'overdue': 'overdue',
    
    // Navigation
    'Dashboard': 'Dashboard',
    'Sales': 'Sales',
    'Purchases': 'Purchases',
    'Customers': 'Customers',
    'Suppliers': 'Suppliers',
    'Reports': 'Reports',
    'Settings': 'Settings',
    'Services': 'Services',
    'Inventory': 'Inventory',
    'Analytics': 'Analytics',
    'Logout': 'Logout',
    'Backup': 'Backup',
    
    // General
    'Save': 'Save',
    'Cancel': 'Cancel',
    'Delete': 'Delete',
    'Edit': 'Edit',
    'Add': 'Add',
    'Search': 'Search',
    'Filter': 'Filter',
    'Status': 'Status',
    'Actions': 'Actions',
    'Name': 'Name',
    'Address': 'Address',
    'Phone': 'Phone',
    'Email': 'Email',
    'Date': 'Date',
    'Amount': 'Amount',
    'Total': 'Total',
    'Print': 'Print',
    'Export': 'Export',
    'Import': 'Import',
    
    // Settings
    'Company Settings': 'Company Settings',
    'Company Name': 'Company Name',
    'Company Address': 'Company Address',
    'Company Phone': 'Company Phone',
    'Company Email': 'Company Email',
    'Company Logo': 'Company Logo',
    'Change Logo': 'Change Logo',
    'General Settings': 'General Settings',
    'Language': 'Language',
    'Currency': 'Currency',
    'Credit Days': 'Credit Days',
    'Default Credit Period': 'Default Credit Period',
    'Fiscal Year': 'Fiscal Year',
    'Display Settings': 'Display Settings',
    'Date Format': 'Date Format',
    'User Settings': 'User Settings',
    'Change Username': 'Change Username',
    'Change Password': 'Change Password',
    'Database Backup': 'Database Backup',
    'Backup Now': 'Backup Now',
    'Restore Backup': 'Restore Backup',
    'Last Backup': 'Last Backup',
    'Backup Schedule': 'Backup Schedule',
    
    // Services
    'Service Management': 'Service Management',
    'New Service': 'New Service',
    'Service Details': 'Service Details',
    'Service ID': 'Service ID',
    'Customer': 'Customer',
    'Device': 'Device',
    'Problem': 'Problem',
    'Service Date': 'Service Date',
    'Status': 'Status',
    'Technician': 'Technician',
    'Warranty': 'Warranty',
    'Under Warranty': 'Under Warranty',
    'Not Under Warranty': 'Not Under Warranty',
    'Previous Service': 'Previous Service',
    'Service Cost': 'Service Cost',
    'Parts Used': 'Parts Used',
    'Labor': 'Labor',
    'Total Cost': 'Total Cost',
    'Print Label': 'Print Label',
    'Service History': 'Service History',
    'Last Service Date': 'Last Service Date',
    'Service Status': 'Service Status',
    'Pending': 'Pending',
    'In Progress': 'In Progress',
    'Completed': 'Completed',
    'Returned': 'Returned',
    'Cancelled': 'Cancelled',
    'Notes': 'Notes',
  },
  
  ne: {
    // Dashboard
    'Good Morning': 'शुभ प्रभात',
    'Good Afternoon': 'शुभ मध्यान्ह',
    'Good Evening': 'शुभ सन्ध्या',
    'Here\'s what\'s happening with your business today.': 'आज तपाईंको व्यापारमा के भइरहेको छ।',
    'Total Sales': 'कुल बिक्री',
    'Total Purchases': 'कुल खरिद',
    'Total Receivable': 'कुल प्राप्य',
    'Total Payable': 'कुल भुक्तानी',
    'This Month': 'यस महिना',
    'Outstanding': 'बाँकी',
    'from last month': 'गत महिनाबाट',
    'Recent Customers': 'हालसालै ग्राहकहरू',
    'Recent Suppliers': 'हालसालै विक्रेताहरू',
    'Last transaction': 'अन्तिम कारोबार',
    'days ago': 'दिन अघि',
    'Recent Activity': 'हालका गतिविधिहरू',
    'Payment Alerts': 'भुक्तानी सूचनाहरू',
    'Upcoming payments due within 7 days': '७ दिनभित्र आउने भुक्तानीहरू',
    'Receivables': 'प्राप्य',
    'Payables': 'भुक्तानी',
    'No upcoming receivables': 'कुनै आउने प्राप्य छैन',
    'All customer payments are up to date': 'सबै ग्राहक भुक्तानीहरू अद्यावधिक छन्',
    'No upcoming payables': 'कुनै आउने भुक्तानी छैन',
    'All supplier payments are up to date': 'सबै विक्रेता भुक्तानीहरू अद्यावधिक छन्',
    'View All Receivables': 'सबै प्राप्यहरू हेर्नुहोस्',
    'View All Payables': 'सबै भुक्तानी हेर्नुहोस्',
    'Due': 'भुक्तानी मिति',
    'overdue': 'समय नाघेको',
    
    // Navigation
    'Dashboard': 'ड्यासबोर्ड',
    'Sales': 'बिक्री',
    'Purchases': 'खरिद',
    'Customers': 'ग्राहकहरू',
    'Suppliers': 'विक्रेताहरू',
    'Reports': 'रिपोर्टहरू',
    'Settings': 'सेटिङ्स',
    'Services': 'सेवाहरू',
    'Inventory': 'वस्तुसूची',
    'Analytics': 'विश्लेषण',
    'Logout': 'लगआउट',
    'Backup': 'ब्याकअप',
    
    // General
    'Save': 'सुरक्षित गर्नुहोस्',
    'Cancel': 'रद्द गर्नुहोस्',
    'Delete': 'मेटाउनुहोस्',
    'Edit': 'सम्पादन गर्नुहोस्',
    'Add': 'थप्नुहोस्',
    'Search': 'खोज्नुहोस्',
    'Filter': 'फिल्टर',
    'Status': 'स्थिति',
    'Actions': 'कार्यहरू',
    'Name': 'नाम',
    'Address': 'ठेगाना',
    'Phone': 'फोन',
    'Email': 'इमेल',
    'Date': 'मिति',
    'Amount': 'रकम',
    'Total': 'जम्मा',
    'Print': 'प्रिन्ट',
    'Export': 'निर्यात',
    'Import': 'आयात',
    
    // Settings
    'Company Settings': 'कम्पनी सेटिङ्स',
    'Company Name': 'कम्पनी नाम',
    'Company Address': 'कम्पनी ठेगाना',
    'Company Phone': 'कम्पनी फोन',
    'Company Email': 'कम्पनी इमेल',
    'Company Logo': 'कम्पनी लोगो',
    'Change Logo': 'लोगो परिवर्तन गर्नुहोस्',
    'General Settings': 'सामान्य सेटिङ्स',
    'Language': 'भाषा',
    'Currency': 'मुद्रा',
    'Credit Days': 'क्रेडिट दिनहरू',
    'Default Credit Period': 'डिफल्ट क्रेडिट अवधि',
    'Fiscal Year': 'आर्थिक वर्ष',
    'Display Settings': 'प्रदर्शन सेटिङ्स',
    'Date Format': 'मिति ढाँचा',
    'User Settings': 'प्रयोगकर्ता सेटिङ्स',
    'Change Username': 'प्रयोगकर्ता नाम परिवर्तन गर्नुहोस्',
    'Change Password': 'पासवर्ड परिवर्तन गर्नुहोस्',
    'Database Backup': 'डाटाबेस ब्याकअप',
    'Backup Now': 'अहिले ब्याकअप गर्नुहोस्',
    'Restore Backup': 'ब्याकअप पुनर्स्थापना गर्नुहोस्',
    'Last Backup': 'अन्तिम ब्याकअप',
    'Backup Schedule': 'ब्याकअप तालिका',
    
    // Services
    'Service Management': 'सेवा व्यवस्थापन',
    'New Service': 'नयाँ सेवा',
    'Service Details': 'सेवा विवरण',
    'Service ID': 'सेवा आईडी',
    'Customer': 'ग्राहक',
    'Device': 'उपकरण',
    'Problem': 'समस्या',
    'Service Date': 'सेवा मिति',
    'Status': 'स्थिति',
    'Technician': 'प्राविधिक',
    'Warranty': 'वारेन्टी',
    'Under Warranty': 'वारेन्टी अन्तर्गत',
    'Not Under Warranty': 'वारेन्टी अन्तर्गत छैन',
    'Previous Service': 'अघिल्लो सेवा',
    'Service Cost': 'सेवा लागत',
    'Parts Used': 'प्रयोग गरिएका सामग्री',
    'Labor': 'श्रम',
    'Total Cost': 'कुल लागत',
    'Print Label': 'लेबल प्रिन्ट गर्नुहोस्',
    'Service History': 'सेवा इतिहास',
    'Last Service Date': 'अन्तिम सेवा मिति',
    'Service Status': 'सेवा स्थिति',
    'Pending': 'प्रक्रियामा',
    'In Progress': 'प्रगतिमा',
    'Completed': 'पूरा भएको',
    'Returned': 'फिर्ता गरिएको',
    'Cancelled': 'रद्द गरिएको',
    'Notes': 'नोटहरू',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);
  const isNepali = language === 'ne';

  // Load language from database on first render
  useEffect(() => {
    const loadLanguageSetting = async () => {
      try {
        const result = await getSetting('display_language');
        if (result.success && result.data) {
          setLanguageState(result.data as Language);
        }
      } catch (error) {
        console.error('Failed to load language setting:', error);
      }
    };
    
    loadLanguageSetting();
  }, []);

  // Set language and save to database
  const setLanguage = async (lang: Language) => {
    try {
      setLanguageState(lang);
      await updateSetting('display_language', lang);
    } catch (error) {
      console.error('Failed to save language setting:', error);
    }
  };

  // Translation function
  const t = (key: string): string => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isNepali }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;

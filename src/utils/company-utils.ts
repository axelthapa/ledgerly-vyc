
import { getSetting } from './db-operations';

/**
 * Get abbreviated company name from the full company name
 * (e.g. "Complete Computer Sewa" becomes "CCS")
 */
export async function getCompanyAbbreviation(): Promise<string> {
  try {
    const result = await getSetting('company_name');
    
    if (!result.success || !result.data) {
      return 'VYC'; // Default value
    }
    
    const companyName = result.data;
    
    // Generate abbreviation from the company name
    const words = companyName.split(' ');
    let abbreviation = '';
    
    // Take first letter of each word
    for (const word of words) {
      if (word.length > 0) {
        abbreviation += word[0].toUpperCase();
      }
    }
    
    // If abbreviation is too short, use the first 3 letters of the company name
    if (abbreviation.length <= 1) {
      abbreviation = companyName.substring(0, 3).toUpperCase();
    }
    
    return abbreviation;
  } catch (error) {
    console.error('Error getting company abbreviation:', error);
    return 'VYC'; // Default value
  }
}

/**
 * Get full company details
 */
export async function getCompanyDetails(): Promise<{ 
  name: string; 
  abbreviation: string;
  address: string; 
  phone: string; 
  email: string;
  logo?: string;
}> {
  try {
    const [nameResult, addressResult, phoneResult, emailResult, logoResult] = await Promise.all([
      getSetting('company_name'),
      getSetting('company_address'),
      getSetting('company_phone'),
      getSetting('company_email'),
      getSetting('company_logo')
    ]);
    
    const name = nameResult.success ? nameResult.data || 'VYC Accounting' : 'VYC Accounting';
    const address = addressResult.success ? addressResult.data || 'Kathmandu, Nepal' : 'Kathmandu, Nepal';
    const phone = phoneResult.success ? phoneResult.data || '+977 1234567890' : '+977 1234567890';
    const email = emailResult.success ? emailResult.data || 'info@vyc.com' : 'info@vyc.com';
    const logo = logoResult.success ? logoResult.data : undefined;
    
    // Generate abbreviation
    const words = name.split(' ');
    let abbreviation = '';
    for (const word of words) {
      if (word.length > 0) {
        abbreviation += word[0].toUpperCase();
      }
    }
    
    // If abbreviation is too short, use the first 3 letters
    if (abbreviation.length <= 1) {
      abbreviation = name.substring(0, 3).toUpperCase();
    }
    
    return { name, abbreviation, address, phone, email, logo };
  } catch (error) {
    console.error('Error getting company details:', error);
    return {
      name: 'VYC Accounting',
      abbreviation: 'VYC',
      address: 'Kathmandu, Nepal',
      phone: '+977 1234567890',
      email: 'info@vyc.com'
    };
  }
}

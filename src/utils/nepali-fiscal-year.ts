/**
 * Nepali Fiscal Year Utility
 * 
 * The Nepali fiscal year runs from 1 Shrawan to 31 Ashar (mid-July to mid-July)
 */

// Convert Gregorian date to approximate Nepali date (simplified)
export const getApproximateNepaliMonth = (date: Date): number => {
  // This is a simplified version that roughly approximates Nepali months
  // In a real app, this would use a proper Nepali calendar library
  const month = date.getMonth();
  // Adjust for Nepali calendar (roughly 3.5 months ahead)
  // Month 0 (January) -> roughly Poush (9)
  return (month + 9) % 12;
};

export const isStartOfFiscalYear = (date: Date): boolean => {
  // Shrawan typically starts in mid-July
  const nepaliMonth = getApproximateNepaliMonth(date);
  return nepaliMonth === 3; // 3 represents Shrawan (roughly)
};

export const isEndOfFiscalYear = (date: Date): boolean => {
  // Ashar ends in mid-July
  const nepaliMonth = getApproximateNepaliMonth(date);
  return nepaliMonth === 2; // 2 represents Ashar (roughly)
};

export const getCurrentFiscalYear = (): { start: string; end: string; year: string } => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const nepaliMonth = getApproximateNepaliMonth(now);
  
  // If we're after Ashar (month 2) but before end of year, fiscal year starts in current year
  // Otherwise, it started in the previous year
  const fiscalYearStart = nepaliMonth > 2 ? currentYear : currentYear - 1;
  const fiscalYearEnd = fiscalYearStart + 1;
  
  // Format in both BS and AD (approximation)
  // In a real app, this would use a proper Nepali calendar conversion
  const nepaliYear = fiscalYearStart + 57; // Rough approximation of BS year
  
  return {
    start: `${fiscalYearStart}-07-16`, // July 16 is approximate start of Shrawan
    end: `${fiscalYearEnd}-07-15`, // July 15 is approximate end of Ashar
    year: `${nepaliYear}/${nepaliYear + 1}` // Nepali fiscal year format
  };
};

export const isFiscalYearBoundary = (date1: Date, date2: Date): boolean => {
  const month1 = getApproximateNepaliMonth(date1);
  const month2 = getApproximateNepaliMonth(date2);
  
  // Check if one date is in Ashar (month 2) and the other is in Shrawan (month 3)
  return (month1 === 2 && month2 === 3) || (month1 === 3 && month2 === 2);
};

export const formatFiscalYear = (date: Date): string => {
  const currentYear = date.getFullYear();
  const nepaliMonth = getApproximateNepaliMonth(date);
  
  // If we're after Ashar (month 2) but before end of year, fiscal year starts in current year
  // Otherwise, it started in the previous year
  const fiscalYearStart = nepaliMonth > 2 ? currentYear : currentYear - 1;
  const fiscalYearEnd = fiscalYearStart + 1;
  
  // Approximate Nepali year (BS)
  const nepaliYear = fiscalYearStart + 57; // Rough approximation
  
  return `${nepaliYear}/${nepaliYear + 1}`;
};

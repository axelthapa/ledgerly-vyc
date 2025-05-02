
/**
 * Utility functions for Nepali date handling
 * Improved conversion between Gregorian (AD) and Bikram Sambat (BS) calendars
 */

// Nepali months
const NEPALI_MONTHS = [
  'बैशाख', 'जेष्ठ', 'असार', 'श्रावण', 
  'भाद्र', 'असोज', 'कार्तिक', 'मंसिर', 
  'पुष', 'माघ', 'फाल्गुन', 'चैत्र'
];

// English month names
const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 
  'May', 'June', 'July', 'August', 
  'September', 'October', 'November', 'December'
];

// Nepali digits
const NEPALI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

// Conversion map for years 2000-2089 BS (1944-2033 AD)
// Each array contains: [total days in year, [days in each month]]
const BS_CALENDAR_DATA: Record<number, [number, number[]]> = {
  2000: [365, [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]],
  2001: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2002: [365, [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2003: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2004: [365, [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]],
  2005: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2006: [366, [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2007: [365, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2008: [366, [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31]],
  2009: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2010: [365, [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2011: [365, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2012: [366, [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30]],
  2013: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2014: [365, [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2015: [365, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2016: [366, [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30]],
  2017: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2018: [365, [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2019: [365, [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]],
  2020: [366, [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30]],
  2021: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2022: [365, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30]],
  2023: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]],
  2024: [365, [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30]],
  2025: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2026: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2027: [365, [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]],
  2028: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2029: [365, [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2030: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2031: [366, [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]],
  2032: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2033: [365, [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2034: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2035: [366, [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30]],
  2036: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2037: [366, [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2038: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2039: [366, [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30]],
  2040: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2041: [366, [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2042: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2043: [366, [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30]],
  2044: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2045: [366, [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2046: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2047: [365, [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30]],
  2048: [366, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2049: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30]],
  2050: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]],
  2051: [366, [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30]],
  2052: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2053: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30]],
  2054: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]],
  2055: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2056: [366, [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30]],
  2057: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2058: [365, [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]],
  2059: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2060: [366, [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2061: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2062: [365, [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31]],
  2063: [366, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2064: [366, [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2065: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2066: [366, [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31]],
  2067: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2068: [366, [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2069: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2070: [366, [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30]],
  2071: [366, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2072: [366, [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2073: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2074: [366, [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30]],
  2075: [366, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2076: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30]],
  2077: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]],
  2078: [366, [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30]],
  2079: [366, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2080: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2081: [366, [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30]],
  2082: [366, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2083: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2084: [366, [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]],
  2085: [365, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
  2086: [366, [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30]],
  2087: [366, [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]],
  2088: [366, [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31]],
  2089: [366, [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30]],
};

// Base date for conversion (1943/4/14 AD = 2000/1/1 BS)
const BS_START_DATE = new Date(1943, 3, 14); // JavaScript months are 0-indexed

/**
 * Convert AD date to BS date
 */
export function convertADToBS(date: Date): { year: number; month: number; day: number } {
  // Days since BS start date
  const timeDiff = date.getTime() - BS_START_DATE.getTime();
  let daysSince = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  
  // Find BS year
  let bsYear = 2000;
  while (daysSince >= BS_CALENDAR_DATA[bsYear][0]) {
    daysSince -= BS_CALENDAR_DATA[bsYear][0];
    bsYear++;
    
    if (!BS_CALENDAR_DATA[bsYear]) {
      // Outside of our data range
      return { year: 0, month: 0, day: 0 };
    }
  }
  
  // Find BS month and day
  let bsMonth = 0;
  const daysInMonth = BS_CALENDAR_DATA[bsYear][1];
  while (daysSince >= daysInMonth[bsMonth]) {
    daysSince -= daysInMonth[bsMonth];
    bsMonth++;
  }
  
  // BS months are 1-indexed
  return { 
    year: bsYear, 
    month: bsMonth + 1, 
    day: daysSince + 1 
  };
}

/**
 * Convert BS date to AD date
 */
export function convertBSToAD(bsYear: number, bsMonth: number, bsDay: number): Date {
  // Check if date is within our data range
  if (!BS_CALENDAR_DATA[bsYear] || bsMonth < 1 || bsMonth > 12 || bsDay < 1 || 
      bsDay > BS_CALENDAR_DATA[bsYear][1][bsMonth - 1]) {
    return new Date(); // Invalid date, return current date
  }
  
  // Calculate days since BS start date
  let daysSince = 0;
  
  // Add days from years
  for (let year = 2000; year < bsYear; year++) {
    if (BS_CALENDAR_DATA[year]) {
      daysSince += BS_CALENDAR_DATA[year][0];
    }
  }
  
  // Add days from months of current year
  for (let month = 0; month < bsMonth - 1; month++) {
    daysSince += BS_CALENDAR_DATA[bsYear][1][month];
  }
  
  // Add days of current month
  daysSince += bsDay - 1;
  
  // Calculate AD date
  const adDate = new Date(BS_START_DATE);
  adDate.setDate(BS_START_DATE.getDate() + daysSince);
  
  return adDate;
}

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Parse Nepali date string (YYYY-MM-DD format)
export function parseNepaliDate(dateStr: string): Date {
  const [yearStr, monthStr, dayStr] = dateStr.split('-');
  const bsYear = parseInt(yearStr);
  const bsMonth = parseInt(monthStr);
  const bsDay = parseInt(dayStr);
  
  return convertBSToAD(bsYear, bsMonth, bsDay);
}

// Convert number to Nepali numerals
export function toNepaliNumeral(num: number): string {
  return num.toString().split('').map(digit => NEPALI_DIGITS[parseInt(digit)]).join('');
}

// Get greeting based on time of day
export function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) {
    return 'Good Morning';
  } else if (hour < 17) {
    return 'Good Afternoon';
  } else {
    return 'Good Evening';
  }
}

// Format date to be more human-readable
export function formatReadableDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format Nepali date - returns English format with BS year
export function formatNepaliDate(date: Date): string {
  const bsDate = convertADToBS(date);
  
  if (bsDate.year === 0) {
    return formatReadableDate(date);
  }
  
  const engDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `${engDate} (BS ${bsDate.year})`;
}

// Format Nepali date in Nepali format
export function formatNepaliDateNP(date: Date): string {
  const bsDate = convertADToBS(date);
  
  if (bsDate.year === 0) {
    return formatReadableDate(date);
  }
  
  // Get Nepali month name
  const nepaliMonth = NEPALI_MONTHS[bsDate.month - 1];
  
  return `${nepaliMonth} ${toNepaliNumeral(bsDate.day)}, ${toNepaliNumeral(bsDate.year)}`;
}

// Get today's date in BS format
export function getTodayBS(): { year: number; month: number; day: number } {
  return convertADToBS(new Date());
}

// Get today's date in BS as a string (YYYY-MM-DD)
export function getTodayBSString(): string {
  const bs = getTodayBS();
  return `${bs.year}-${bs.month.toString().padStart(2, '0')}-${bs.day.toString().padStart(2, '0')}`;
}

// Format Nepali date in standard format
export function formatStandardNepaliDate(date: Date): string {
  const bs = convertADToBS(date);
  return `${bs.year}-${bs.month.toString().padStart(2, '0')}-${bs.day.toString().padStart(2, '0')}`;
}

// Get current Nepali fiscal year
export function getCurrentNepaliYear(): number {
  return getTodayBS().year;
}

// Get formatted Nepali fiscal year (e.g. "2081/2082")
export function getCurrentFiscalYearNP(): string {
  const today = getTodayBS();
  const year = today.year;
  const month = today.month;
  
  // Nepali fiscal year starts from Shrawan (month 4)
  if (month >= 4) {
    return `${year}/${year + 1}`;
  } else {
    return `${year - 1}/${year}`;
  }
}

// Calculate relative time between two dates
export function getRelativeTimeFromDates(current: Date, target: Date): string {
  // Calculate the difference in milliseconds
  const diffInMilliseconds = target.getTime() - current.getTime();
  
  // Convert to days, hours, minutes, etc.
  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  
  // Check for past or future
  const isPast = diffInMilliseconds < 0;
  
  // Format the relative time string
  if (Math.abs(diffInDays) > 30) {
    // If it's more than a month, just show the formatted date
    return formatReadableDate(target);
  } else if (Math.abs(diffInDays) >= 7) {
    // If it's more than a week
    const weeks = Math.floor(Math.abs(diffInDays) / 7);
    return isPast 
      ? `${weeks} week${weeks !== 1 ? 's' : ''} ago` 
      : `in ${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else if (Math.abs(diffInDays) > 0) {
    // If it's days
    return isPast 
      ? `${Math.abs(diffInDays)} day${Math.abs(diffInDays) !== 1 ? 's' : ''} ago` 
      : `in ${Math.abs(diffInDays)} day${Math.abs(diffInDays) !== 1 ? 's' : ''}`;
  } else if (Math.abs(diffInHours) > 0) {
    // If it's hours
    return isPast 
      ? `${Math.abs(diffInHours)} hour${Math.abs(diffInHours) !== 1 ? 's' : ''} ago` 
      : `in ${Math.abs(diffInHours)} hour${Math.abs(diffInHours) !== 1 ? 's' : ''}`;
  } else if (Math.abs(diffInMinutes) > 0) {
    // If it's minutes
    return isPast 
      ? `${Math.abs(diffInMinutes)} minute${Math.abs(diffInMinutes) !== 1 ? 's' : ''} ago` 
      : `in ${Math.abs(diffInMinutes)} minute${Math.abs(diffInMinutes) !== 1 ? 's' : ''}`;
  } else {
    // If it's just now (less than a minute)
    return isPast ? 'just now' : 'in less than a minute';
  }
}

// Calculate due date based on transaction date and credit days
export function calculateDueDate(transactionDate: Date, creditDays: number): Date {
  const dueDate = new Date(transactionDate);
  dueDate.setDate(dueDate.getDate() + creditDays);
  return dueDate;
}

// Check if a date is past due
export function isPastDue(dueDate: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  return dueDate < today;
}

// Get number of days between two dates
export function getDaysBetweenDates(date1: Date, date2: Date): number {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Get formatted date range (for reports)
export function getDateRangeString(startDate: Date, endDate: Date): string {
  return `${formatReadableDate(startDate)} - ${formatReadableDate(endDate)}`;
}

// Get Nepali date range string (for reports)
export function getNepaliDateRangeString(startDate: Date, endDate: Date): string {
  const bsStartDate = convertADToBS(startDate);
  const bsEndDate = convertADToBS(endDate);
  
  return `${bsStartDate.year}-${bsStartDate.month}-${bsStartDate.day} to ${bsEndDate.year}-${bsEndDate.month}-${bsEndDate.day}`;
}

// Get today's date in Nepali (BS) format
export function getTodayNepaliDate(): string {
  const bs = convertADToBS(new Date());
  return `${NEPALI_MONTHS[bs.month - 1]} ${bs.day}, ${bs.year}`;
}

// Get today's date in Nepali (BS) format with Nepali digits
export function getTodayNepaliDateNP(): string {
  const bs = convertADToBS(new Date());
  return `${NEPALI_MONTHS[bs.month - 1]} ${toNepaliNumeral(bs.day)}, ${toNepaliNumeral(bs.year)}`;
}

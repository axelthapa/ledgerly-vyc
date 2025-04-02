
// Nepali Date Converter
// This is a simplified version for demonstration
// In a real application, you would use a proper Nepali date library

type NepaliMonth = {
  en: string;
  np: string;
};

const nepaliMonths: NepaliMonth[] = [
  { en: "Baishakh", np: "बैशाख" },
  { en: "Jestha", np: "जेष्ठ" },
  { en: "Ashadh", np: "आषाढ" },
  { en: "Shrawan", np: "श्रावण" },
  { en: "Bhadra", np: "भाद्र" },
  { en: "Ashwin", np: "आश्विन" },
  { en: "Kartik", np: "कार्तिक" },
  { en: "Mangsir", np: "मंसिर" },
  { en: "Poush", np: "पौष" },
  { en: "Magh", np: "माघ" },
  { en: "Falgun", np: "फाल्गुन" },
  { en: "Chaitra", np: "चैत्र" },
];

// Mock function to convert Gregorian date to Nepali date
// In a real app, you'd use a proper library with accurate conversion algorithms
export function convertToNepaliDate(date: Date): {
  year: number;
  month: number;
  day: number;
  monthName: NepaliMonth;
} {
  // This is just a placeholder implementation
  // In reality, the calculation is much more complex
  // For demo purposes, we'll just add an offset
  
  // Using a fixed offset for demonstration
  // In reality, you would need a proper conversion algorithm
  const npYear = date.getFullYear() + 56; // Approximate offset
  
  // For demo, we'll use a simple mapping that's not accurate
  // In reality, you need to consider the varying days in Nepali months
  const npMonth = date.getMonth();
  const npDay = date.getDate();
  
  return {
    year: npYear,
    month: npMonth + 1,
    day: npDay,
    monthName: nepaliMonths[npMonth],
  };
}

export function formatNepaliDate(date: Date): string {
  const npDate = convertToNepaliDate(date);
  return `${npDate.day} ${npDate.monthName.en} ${npDate.year}`;
}

export function formatNepaliDateNP(date: Date): string {
  const npDate = convertToNepaliDate(date);
  return `${npDate.day} ${npDate.monthName.np} ${npDate.year}`;
}

export function getCurrentFiscalYear(): { start: Date; end: Date } {
  const today = new Date();
  const currentYear = today.getFullYear();
  
  // Nepali fiscal year runs from Shrawan 1 (mid-July) to Ashadh 31 (mid-July next year)
  // This is an approximation for demonstration
  let fiscalYearStart = new Date(currentYear, 6, 15); // July 15th as approx for Shrawan 1
  
  // If today is before Shrawan 1, then we're in the previous fiscal year
  if (today < fiscalYearStart) {
    fiscalYearStart = new Date(currentYear - 1, 6, 15);
  }
  
  const fiscalYearEnd = new Date(fiscalYearStart.getFullYear() + 1, 6, 14); // July 14th next year
  
  return {
    start: fiscalYearStart,
    end: fiscalYearEnd
  };
}

// Function to determine greeting based on time of day
export function getGreeting(): string {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
}

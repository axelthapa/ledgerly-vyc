
/**
 * Utility functions for Nepali date handling
 */

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Parse Nepali date string
export function parseNepaliDate(dateStr: string): Date {
  // Simple implementation for demo purposes
  // In a real app, you might use a Nepali date conversion library
  return new Date(dateStr);
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

// Format date to be more human-readable
export function formatReadableDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
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

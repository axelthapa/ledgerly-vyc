
// Formats a number as Nepali Rupees (NPR)
export function formatCurrency(amount: number): string {
  // Format with commas for thousands and 2 decimal places
  const formattedAmount = new Intl.NumberFormat('ne-NP', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
  
  return `रू ${formattedAmount}`; // Use Nepali Rupee symbol
}

// Converts numbers to words in Nepali currency format
// This is a simplified implementation
export function convertToWords(amount: number): string {
  // This would be a complex implementation for real use
  // For demo purposes, we'll use a basic English conversion
  
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convertLessThanOneThousand = (num: number): string => {
    let result = '';
    
    if (num === 0) {
      return '';
    }
    
    if (num < 10) {
      result = units[num];
    } else if (num < 20) {
      result = teens[num - 10];
    } else if (num < 100) {
      result = tens[Math.floor(num / 10)] + (num % 10 !== 0 ? ' ' + units[num % 10] : '');
    } else {
      result = units[Math.floor(num / 100)] + ' Hundred' + (num % 100 !== 0 ? ' ' + convertLessThanOneThousand(num % 100) : '');
    }
    
    return result;
  };
  
  if (amount === 0) {
    return 'Zero Rupees Only';
  }
  
  const wholePart = Math.floor(amount);
  const decimal = Math.round((amount - wholePart) * 100);
  
  let result = '';
  
  if (wholePart > 0) {
    if (wholePart < 1000) {
      result = convertLessThanOneThousand(wholePart);
    } else if (wholePart < 100000) {
      result = convertLessThanOneThousand(Math.floor(wholePart / 1000)) + ' Thousand' + 
        (wholePart % 1000 !== 0 ? ' ' + convertLessThanOneThousand(wholePart % 1000) : '');
    } else if (wholePart < 10000000) {
      result = convertLessThanOneThousand(Math.floor(wholePart / 100000)) + ' Lakh' + 
        (wholePart % 100000 !== 0 ? ' ' + convertToWords(wholePart % 100000) : '');
    } else {
      result = convertLessThanOneThousand(Math.floor(wholePart / 10000000)) + ' Crore' + 
        (wholePart % 10000000 !== 0 ? ' ' + convertToWords(wholePart % 10000000) : '');
    }
  }
  
  result += ' Rupees';
  
  if (decimal > 0) {
    result += ' and ' + convertLessThanOneThousand(decimal) + ' Paisa';
  }
  
  return result + ' Only';
}

// Determine if a balance is Credit (CR) or Debit (DR)
export function getBalanceType(amount: number): 'CR' | 'DR' {
  return amount >= 0 ? 'CR' : 'DR';
}

// Format a balance with the CR/DR indicator
export function formatBalanceWithType(amount: number): string {
  const type = getBalanceType(amount);
  return `${formatCurrency(Math.abs(amount))} ${type}`;
}


import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "@/components/ui/toast-utils";

// Function to create a printable version of a component
export const printComponent = (componentId: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow && document.getElementById(componentId)) {
    const componentContent = document.getElementById(componentId)?.innerHTML;
    
    printWindow.document.write('<html><head><title>Print</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; padding: 20px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      table, th, td { border: 1px solid #ddd; }
      th, td { padding: 8px; text-align: left; }
      th { background-color: #f2f2f2; }
      .text-right { text-align: right; }
      .text-center { text-align: center; }
      .font-bold { font-weight: bold; }
      @media print {
        body { margin: 0; padding: 0; }
        button { display: none; }
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(componentContent || '');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    
    // Add a small delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
      // Don't close automatically so user can cancel if needed
    }, 500);
  } else {
    toast.error("Failed to open print window");
  }
};

// Function to export component as PDF
export const exportToPdf = async (componentId: string, filename = "export.pdf") => {
  try {
    const element = document.getElementById(componentId);
    if (!element) {
      toast.error("Element not found");
      return;
    }

    toast.info("Preparing PDF, please wait...");

    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    // Calculate PDF dimensions to maintain aspect ratio
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // If the content is longer than a single page, split it across multiple pages
    let heightLeft = imgHeight;
    let position = 0;
    let pageCount = 1;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      pageCount++;
    }
    
    pdf.save(filename);
    toast.success(`PDF exported successfully with ${pageCount} pages`);
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    toast.error("Failed to export PDF");
  }
};

// Handle fiscal year transition for transaction records
export const handleFiscalYearTransition = (transactions: any[], currentFiscalYear: string) => {
  // Group transactions by fiscal year
  const fiscalYearGroups: Record<string, any[]> = {};
  
  transactions.forEach(transaction => {
    const fiscalYear = transaction.fiscalYear || currentFiscalYear;
    if (!fiscalYearGroups[fiscalYear]) {
      fiscalYearGroups[fiscalYear] = [];
    }
    fiscalYearGroups[fiscalYear].push(transaction);
  });
  
  // Calculate closing balances for each fiscal year
  Object.keys(fiscalYearGroups).forEach(year => {
    const yearTransactions = fiscalYearGroups[year];
    if (yearTransactions.length > 0) {
      // Sort by date
      yearTransactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      
      // Calculate final balance
      const closingBalance = yearTransactions[yearTransactions.length - 1].balance;
      
      // Add closing entry if it's not the current fiscal year
      if (year !== currentFiscalYear) {
        fiscalYearGroups[year].push({
          id: `CLOSING-${year}`,
          date: "End of Fiscal Year",
          nepaliDate: "३१ आषाढ",
          type: "Closing",
          description: "Closing Balance",
          amount: 0,
          balance: closingBalance,
          isClosing: true
        });
        
        // Add opening balance to next fiscal year
        const nextYearKey = (parseInt(year.split('/')[0]) + 1) + '/' + (parseInt(year.split('/')[1]) + 1);
        if (!fiscalYearGroups[nextYearKey]) {
          fiscalYearGroups[nextYearKey] = [];
        }
        
        fiscalYearGroups[nextYearKey].unshift({
          id: `OPENING-${nextYearKey}`,
          date: "Start of Fiscal Year",
          nepaliDate: "०१ श्रावण",
          type: "Opening",
          description: "Opening Balance",
          amount: 0,
          balance: closingBalance,
          isOpening: true,
          previousFiscalYear: year
        });
      }
    }
  });
  
  // Flatten the grouped transactions
  const currentYearTransactions = fiscalYearGroups[currentFiscalYear] || [];
  const previousYearTransactions = Object.keys(fiscalYearGroups)
    .filter(year => year !== currentFiscalYear)
    .flatMap(year => fiscalYearGroups[year]);
  
  return {
    current: currentYearTransactions,
    previous: previousYearTransactions,
    all: [...currentYearTransactions, ...previousYearTransactions]
  };
};

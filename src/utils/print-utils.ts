
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { toast } from "@/components/ui/toast-utils";
import { getCurrentFiscalYear } from "./nepali-fiscal-year";

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
      h1, h2, h3 { margin-top: 0; }
      .company-header { text-align: center; margin-bottom: 20px; }
      .transaction-details { margin: 20px 0; }
      .signature-area { display: flex; justify-content: space-between; margin-top: 50px; }
      .signature-line { border-top: 1px dashed #000; width: 200px; }
      .thank-you { text-align: center; margin-top: 30px; color: #555; }
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

// Function to generate a transaction report PDF
export const generateTransactionReport = async ({
  companyName,
  companyAddress,
  companyPhone,
  companyEmail,
  companyPan,
  transaction,
  entity,
  dateRange,
  transactions,
  reportTitle = "Transaction Report"
}: {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail?: string;
  companyPan?: string;
  transaction?: any;
  entity?: any;
  dateRange?: { from: string; to: string };
  transactions?: any[];
  reportTitle?: string;
}) => {
  // Create a container for the report
  const reportContainer = document.createElement('div');
  reportContainer.id = 'transaction-report-container';
  reportContainer.style.position = 'fixed';
  reportContainer.style.top = '-9999px'; // Hide it off-screen
  reportContainer.style.left = '-9999px';
  reportContainer.style.width = '800px'; // Set a fixed width for PDF generation
  document.body.appendChild(reportContainer);
  
  // Current fiscal year
  const fiscalYear = getCurrentFiscalYear();
  
  // HTML content for the report
  reportContainer.innerHTML = `
    <div class="report-container" style="font-family: Arial, sans-serif; padding: 20px; max-width: 800px;">
      <div class="company-header" style="text-align: center; margin-bottom: 20px;">
        <h1 style="margin-bottom: 5px; font-size: 24px;">${companyName}</h1>
        <p style="margin: 5px 0;">${companyAddress}</p>
        <p style="margin: 5px 0;">Phone: ${companyPhone}${companyEmail ? ` | Email: ${companyEmail}` : ''}</p>
        ${companyPan ? `<p style="margin: 5px 0;">PAN: ${companyPan}</p>` : ''}
        <div style="margin-top: 15px; padding: 8px 0; border-top: 1px solid #ddd; border-bottom: 1px solid #ddd;">
          <h2 style="margin: 0; font-size: 18px;">${reportTitle}</h2>
        </div>
      </div>
      
      ${entity ? `
      <div class="entity-details" style="display: flex; justify-content: space-between; margin-bottom: 20px;">
        <div>
          <h3 style="margin-bottom: 5px;">${transaction?.type === "Purchase" ? "Supplier" : "Customer"} Details</h3>
          <p style="margin: 3px 0;"><strong>${entity.name}</strong></p>
          <p style="margin: 3px 0;">${entity.address}</p>
          <p style="margin: 3px 0;">Phone: ${entity.phone}</p>
          ${entity.pan ? `<p style="margin: 3px 0;">PAN: ${entity.pan}</p>` : ''}
        </div>
        <div style="text-align: right;">
          ${transaction ? `<p style="margin: 3px 0;"><strong>Invoice #:</strong> ${transaction.id}</p>` : ''}
          <p style="margin: 3px 0;"><strong>Date:</strong> ${transaction?.nepaliDate || new Date().toLocaleDateString()}</p>
          <p style="margin: 3px 0;"><strong>Fiscal Year:</strong> ${fiscalYear.year}</p>
          ${dateRange ? `
          <p style="margin: 3px 0;"><strong>Report Period:</strong> ${dateRange.from} - ${dateRange.to}</p>
          ` : ''}
        </div>
      </div>
      ` : ''}
      
      ${transaction?.items && transaction.items.length > 0 ? `
      <div class="line-items" style="margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Item</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Quantity</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Rate</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${transaction.items.map(item => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">रू ${formatNumber(item.rate)}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">रू ${formatNumber(item.amount)}</td>
            </tr>
            `).join('')}
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">Total</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">
                रू ${formatNumber(Math.abs(transaction.amount))}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      ` : ''}
      
      ${transactions && transactions.length > 0 ? `
      <div class="transactions-list" style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 10px;">Transaction History</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Reference</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Description</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Type</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Amount</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Balance</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map(trx => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${trx.nepaliDate}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${trx.id}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${trx.description}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${trx.type}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">
                रू ${formatNumber(Math.abs(trx.amount))}
              </td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">
                रू ${formatNumber(Math.abs(trx.balance))}
              </td>
            </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}
      
      ${transaction ? `
      <div class="payment-summary" style="margin-bottom: 15px; padding: 12px; border: 1px solid #ddd; border-radius: 4px;">
        <p style="margin: 5px 0;"><strong>Amount in words:</strong> ${amountInWords(Math.abs(transaction.amount))}</p>
        ${transaction.type === "Payment" ? `
        <p style="margin: 5px 0;">Payment method: ${transaction.paymentMethod || "Cash"}</p>
        ` : ''}
      </div>
      
      <div class="notes-section" style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 5px;">Notes</h3>
        <p style="margin: 0;">${transaction.description}</p>
      </div>
      ` : ''}
      
      ${entity && entity.balance ? `
      <div class="balance-summary" style="margin-top: 20px; text-align: right;">
        <p style="margin: 5px 0;"><strong>Closing Balance:</strong> रू ${formatNumber(Math.abs(entity.balance))} ${entity.type}</p>
      </div>
      ` : ''}
      
      <div class="signatures" style="display: flex; justify-content: space-between; margin-top: 50px;">
        <div>
          <p style="margin-bottom: 30px;"><strong>${entity ? "Customer" : "Prepared by"} Signature</strong></p>
          <div style="border-top: 1px dashed #000; width: 200px;"></div>
        </div>
        <div style="text-align: right;">
          <p style="margin-bottom: 30px;"><strong>For ${companyName}</strong></p>
          <div style="border-top: 1px dashed #000; width: 200px; margin-left: auto;"></div>
          <p style="font-size: 12px; margin-top: 5px;">Authorized Signature</p>
        </div>
      </div>
      
      <div class="thank-you" style="text-align: center; margin-top: 30px; color: #555;">
        <p>Thank you for your business!</p>
      </div>
    </div>
  `;
  
  try {
    // Generate file name based on report type
    let filename;
    if (transaction) {
      filename = `${transaction.type}_${transaction.id}.pdf`;
    } else if (entity) {
      filename = `${entity.id}_Statement.pdf`;
    } else {
      filename = `Transactions_Report.pdf`;
    }
    
    // Export to PDF
    await exportToPdf('transaction-report-container', filename);
  } catch (error) {
    console.error("Error generating report:", error);
    toast.error("Failed to generate PDF report");
  } finally {
    // Clean up by removing the temporary element
    if (document.body.contains(reportContainer)) {
      document.body.removeChild(reportContainer);
    }
  }
};

// Helper functions for formatting
function formatNumber(num: number): string {
  return new Intl.NumberFormat('ne-NP', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
}

function amountInWords(amount: number): string {
  // This is a simplified version, in a real app you would use a library or more complex function
  // For now, we're assuming the convertToWords function is available from currency.ts
  try {
    // Import dynamically to avoid circular dependencies
    const { convertToWords } = require("./currency");
    return convertToWords(amount);
  } catch (e) {
    return "Amount in words not available";
  }
}

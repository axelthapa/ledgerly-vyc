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
      .print-controls { padding: 20px; display: flex; gap: 10px; justify-content: center; background: #f9f9f9; border-bottom: 1px solid #ddd; position: sticky; top: 0; z-index: 100; }
      .btn { padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: 500; display: inline-flex; align-items: center; gap: 5px; }
      .btn-primary { background-color: #2563eb; color: white; border: none; }
      .btn-secondary { background-color: #e5e7eb; color: #374151; border: none; }
      .btn-danger { background-color: #ef4444; color: white; border: none; }
      .btn:hover { opacity: 0.9; }
    `);
    printWindow.document.write('</style></head><body>');
    
    // Add control buttons at the top
    printWindow.document.write(`
      <div class="print-controls">
        <button class="btn btn-primary" id="print-btn" onclick="window.print()">Print Document</button>
        <button class="btn btn-secondary" id="close-btn" onclick="window.close()">Close Preview</button>
      </div>
    `);
    
    printWindow.document.write(componentContent || '');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
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
    return pdf; // Return the PDF object for potential further use
  } catch (error) {
    console.error("Error exporting to PDF:", error);
    toast.error("Failed to export PDF");
    return null;
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
  showTransactions = false,
  reportTitle = "Transaction Report",
  previewOnly = false,
  returnPdfObject = false
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
  showTransactions?: boolean;
  reportTitle?: string;
  previewOnly?: boolean;
  returnPdfObject?: boolean;
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
  const currentDate = new Date();
  const englishDate = currentDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const currentTime = currentDate.toLocaleTimeString('en-US');
  
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
          <p style="margin: 3px 0;"><strong>Date (BS):</strong> ${transaction?.nepaliDate || new Date().toLocaleDateString()}</p>
          <p style="margin: 3px 0;"><strong>Date (AD):</strong> ${transaction?.date || englishDate}</p>
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
      
      ${transactions && transactions.length > 0 && showTransactions ? `
      <div class="transactions-list" style="margin-bottom: 20px;">
        <h3 style="margin-bottom: 10px;">Transaction History</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date (BS)</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Date (AD)</th>
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
              <td style="border: 1px solid #ddd; padding: 8px;">${trx.date}</td>
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
        <p style="margin: 5px 0;"><strong>Amount in figures:</strong> रू ${formatNumber(Math.abs(transaction.amount))}</p>
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
        <p style="margin: 5px 0;"><strong>Closing Balance:</strong> रू ${formatNumber(Math.abs(entity.balance))} ${
          entity.balance < 0 ? 'DR' : 'CR'
        }</p>
      </div>
      ` : ''}
      
      <div class="report-generation" style="margin-top: 15px; font-size: 12px; color: #666; text-align: right;">
        <p>Report generated on: ${englishDate} at ${currentTime}</p>
      </div>
      
      <div class="signatures" style="display: flex; justify-content: space-between; margin-top: 50px;">
        <div>
          <p style="margin-bottom: 30px;"><strong>${entity ? "Customer" : "Prepared by"} Signature</strong></p>
          <div style="border-top: 1px dashed #000; width: 200px;"></div>
          <p style="font-size: 12px; margin-top: 5px;">Date: ________________</p>
        </div>
        <div style="text-align: right;">
          <p style="margin-bottom: 30px;"><strong>For ${companyName}</strong></p>
          <div style="border-top: 1px dashed #000; width: 200px; margin-left: auto;"></div>
          <p style="font-size: 12px; margin-top: 5px;">Authorized Signature</p>
          <p style="font-size: 12px; margin-top: 5px;">Date: ________________</p>
        </div>
      </div>
      
      <div class="thank-you" style="text-align: center; margin-top: 30px; color: #555;">
        <p>Thank you for your business!</p>
        <p style="font-size: 12px; margin-top: 5px;">© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
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
    
    if (previewOnly) {
      // Open the report in a new window for preview
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write('<html><head><title>Print Preview</title>');
        printWindow.document.write('<style>');
        printWindow.document.write(`
          body { font-family: Arial, sans-serif; padding: 15px; margin: 0; }
          .print-controls { padding: 15px; background: #f8f9fa; border-bottom: 1px solid #ddd; position: sticky; top: 0; z-index: 100; display: flex; justify-content: center; gap: 10px; }
          .btn { padding: 8px 15px; border-radius: 4px; cursor: pointer; font-weight: 500; display: inline-flex; align-items: center; gap: 5px; }
          .btn-primary { background-color: #2563eb; color: white; border: none; }
          .btn-secondary { background-color: #e5e7eb; color: #374151; border: none; }
          .btn-success { background-color: #10b981; color: white; border: none; }
          .btn-danger { background-color: #ef4444; color: white; border: none; }
          .btn:hover { opacity: 0.9; }
          .container { padding: 20px; }
          @media print {
            .print-controls { display: none; }
            body { padding: 0; }
          }
        `);
        printWindow.document.write('</style></head><body>');
        
        // Add control buttons at the top
        printWindow.document.write(`
          <div class="print-controls">
            <button class="btn btn-primary" onclick="window.print()">Print Document</button>
            <button class="btn btn-success" onclick="window.opener.generateTransactionReport(${JSON.stringify({
              companyName, companyAddress, companyPhone, companyEmail, companyPan,
              transaction, entity, dateRange, transactions, showTransactions, reportTitle
            })})">Export as PDF</button>
            <button class="btn btn-secondary" onclick="window.close()">Close Preview</button>
          </div>
        `);
        
        printWindow.document.write('<div class="container">');
        printWindow.document.write(reportContainer.innerHTML);
        printWindow.document.write('</div></body></html>');
        printWindow.document.close();
        printWindow.focus();
      } else {
        toast.error("Failed to open preview window");
      }
    } else {
      // Export to PDF
      const pdf = await exportToPdf('transaction-report-container', filename);
      
      if (returnPdfObject) {
        return pdf;
      }
    }
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

// Function to email a report as PDF attachment
export const emailReport = async (options: {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail?: string;
  companyPan?: string;
  transaction?: any;
  entity?: any;
  dateRange?: { from: string; to: string };
  transactions?: any[];
  showTransactions?: boolean;
  reportTitle?: string;
  recipient?: string;
}) => {
  try {
    const { 
      companyName, 
      companyAddress, 
      companyPhone, 
      companyEmail, 
      companyPan,
      transaction, 
      entity, 
      dateRange, 
      transactions,
      showTransactions,
      reportTitle,
      recipient
    } = options;

    // Generate a descriptive subject line
    let subject = "";
    let body = "";
    
    if (transaction) {
      subject = `${reportTitle || transaction.type} - ${transaction.id} - ${companyName}`;
      body = `Dear ${entity?.name || 'Sir/Madam'},\n\nPlease find attached the ${
        transaction.type === "Purchase" ? "Purchase Invoice" : 
        transaction.type === "Sale" ? "Sales Invoice" : 
        transaction.type === "Payment" ? "Payment Receipt" : 
        "Transaction Report"
      } (${transaction.id}) from ${companyName}.\n\nAmount: रू ${formatNumber(Math.abs(transaction.amount))}\nDate: ${transaction.date}\n\nThank you for your business.\n\nRegards,\n${companyName}\n${companyPhone}`;
    } else if (entity) {
      subject = `${reportTitle || "Statement"} - ${entity.name} - ${companyName}`;
      body = `Dear ${entity.name},\n\nPlease find attached the ${reportTitle || "Statement"} from ${companyName}.\n\n${
        dateRange ? `Report Period: ${dateRange.from} - ${dateRange.to}\n\n` : ''
      }Thank you for your business.\n\nRegards,\n${companyName}\n${companyPhone}`;
    } else {
      subject = `${reportTitle || "Transaction Report"} - ${companyName}`;
      body = `Dear Sir/Madam,\n\nPlease find attached the ${reportTitle || "Transaction Report"} from ${companyName}.\n\n${
        dateRange ? `Report Period: ${dateRange.from} - ${dateRange.to}\n\n` : ''
      }Thank you for your business.\n\nRegards,\n${companyName}\n${companyPhone}`;
    }

    // Generate a unique temporary filename for the PDF
    const timestamp = new Date().getTime();
    let filename = "";
    
    if (transaction) {
      filename = `${transaction.type}_${transaction.id}_${timestamp}.pdf`;
    } else if (entity) {
      filename = `${entity.name.replace(/\s+/g, '_')}_Statement_${timestamp}.pdf`;
    } else {
      filename = `Transactions_Report_${timestamp}.pdf`;
    }

    // First generate the PDF but get it returned rather than saved
    await generateTransactionReport({
      companyName,
      companyAddress,
      companyPhone,
      companyEmail,
      companyPan,
      transaction,
      entity,
      dateRange,
      transactions,
      showTransactions,
      reportTitle,
      returnPdfObject: true
    });

    // Set up mailto link with subject and body
    const mailtoLink = `mailto:${recipient || ''}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    toast.success("Email client opened. Please manually attach the PDF file you just exported.");
    
    return true;
  } catch (error) {
    console.error("Error emailing report:", error);
    toast.error("Failed to prepare email. Please try again.");
    return false;
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

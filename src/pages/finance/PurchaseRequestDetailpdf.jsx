import { jsPDF } from "jspdf";
import 'jspdf-autotable';

export const generatePDF = (purchaseRequest , approvalLogs) => {
    const doc = new jsPDF({
        orientation: "landscape",
    });

    // Load the logo and other images
    const loadImageAndGeneratePDF = (imagePath, onImageLoad) => {
        const image = new Image();
        image.src = imagePath;
        image.onload = () => {
            onImageLoad(image);
        };
        image.onerror = () => {
            console.error('Failed to load image.');
        };
    };

    loadImageAndGeneratePDF('/logo.png', (loadedLogo) => {
        // Constants for the logo and title box
        const logoPosX = 10;
        const logoPosY = 10;
        const logoAreaWidth = 40;
        const logoAreaHeight = 40;

        // Constants for the header fill color
        const headerBoxFillColor = [211, 211, 211]; // light gray

        // Draw header box
        const headerBoxWidth = doc.internal.pageSize.width - 120; // Full width minus margins
        doc.setFillColor(...headerBoxFillColor);
        doc.rect(logoPosX, logoPosY, headerBoxWidth, logoAreaHeight, 'F');

        // Place the logo inside the header box
        doc.addImage(loadedLogo, 'PNG', logoPosX + 5, logoPosY + 5, logoAreaWidth - 10, logoAreaHeight - 10);

        // Title text settings
        const titleTextPosX = logoPosX + logoAreaWidth + 10; // Start after the logo
        const titleTextPosY = logoPosY + (logoAreaHeight / 2) + 3; // Vertically centered

        // Add title text to the header box
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.text('PURCHASE REQUEST FORM', titleTextPosX, titleTextPosY);

        // Headers under the logo
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
  // Header Details - Positioned under the logo
  const headers = [
    { title: 'Programme:', detail: purchaseRequest.programme },
    { title: 'Document Reference:', detail: purchaseRequest.document_reference },
    { title: 'Purchase Request Date:', detail: purchaseRequest.purchase_request_date },
    { title: 'Location Required:', detail: purchaseRequest.location_required },
    { title: 'Date Required:', detail: purchaseRequest.date_required },
    { title: 'Total Cost:', detail: purchaseRequest.total_cost },
];

// Background color for header labels
const headerFillColor = [211, 211, 211]; // light gray

// Calculate the maximum width of the header titles to set the background
let maxTitleWidth = 0;
headers.forEach(header => {
    const titleWidth = doc.getTextWidth(header.title);
    if (titleWidth > maxTitleWidth) {
        maxTitleWidth = titleWidth;
    }
});

// Draw header details, background boxes for titles, and border around all headers
const headerStartY = 60;
const headerHeight = 10;
const rightPadding = 5; // Smaller box from the right
headers.forEach((header, index) => {
    const yOffset = headerStartY + (index * headerHeight);
    // Draw a filled rectangle for the header label background
    doc.setFillColor(...headerFillColor);
    doc.rect(10, yOffset, maxTitleWidth + 2, headerHeight, 'F');
    // Draw the header labels and details
    doc.setTextColor(0); // Black text
    doc.text(header.title, 12, yOffset + 7);
    doc.text(header.detail, maxTitleWidth + 14, yOffset + 7);
    // Draw a line between headers
    if (index < headers.length - 1) { // Do not draw line after the last header
        doc.line(10, yOffset + headerHeight, doc.internal.pageSize.width - rightPadding -200, yOffset + headerHeight);
    }
});

// Draw a border around all headers
doc.setDrawColor(0); // Black border
const headerWidth = doc.internal.pageSize.width - 200 - rightPadding; // Adjust for smaller width
doc.rect(10, headerStartY, headerWidth, headers.length * headerHeight);

        // Items table below headers
        const tableStartY = 55 + (headers.length + 1) * 10;
        doc.autoTable({
            startY: tableStartY,
            head: [['Item No.', 'Description of Item', 'Unit', 'Unit Cost', 'Quantity', 'Currency', 'Total Cost (Estimated)', 'Donor', 'Budget Line', 'Comments']],
            body: purchaseRequest.items.map((item, index) => [
                index + 1,
                item.description,
                item.unit,
                `$${item.unit_cost}`,
                item.quantity,
                item.currency,
                `$${(item.unit_cost * item.quantity).toFixed(2)}`,
                item.donor || 'N/A',
                item.budget_line || 'N/A',
                item.comments || 'N/A'
            ]),
            margin: { left: 10, right: 10 },
            styles: { fontSize: 8, cellPadding: 2 },
            headStyles: { fillColor: [211, 211, 211], textColor: 0, halign: 'center' },
            bodyStyles: { halign: 'center' },
        });

        // Additional comments section
        doc.text('Additional comments / instructions:', 10, doc.lastAutoTable.finalY + 10);
        doc.text(purchaseRequest.comments || 'N/A', 10, doc.lastAutoTable.finalY + 20);
        
        const signatures = [
            // Removed 'type' from 'Requested By' since we'll use direct fields
            { label: 'Requested By', x: 10 },
            { label: 'Budget Holder Approval', x: 70, type: 'approved_budget_holder' },
            { label: 'Budget Checked by Finance', x: 130, type: 'approved_finance_checker' },
            { label: 'Programme Manager (if applicable)', x: 190, type: 'approved' },
        ];
        
        signatures.forEach((signature, index) => {
            let approvalText = '';
            const y = doc.internal.pageSize.height - 50; 
            doc.setFillColor(...headerFillColor);
            doc.text(signature.label, signature.x, y);
        
            if (signature.label === 'Requested By') {
                approvalText = `${purchaseRequest.created_by} on ${new Date(purchaseRequest.purchase_request_date).toLocaleDateString()}`;
            } else {
                // For other signatures, find the approval log by type
                const approval = approvalLogs.find(log => log.approval_status === signature.type);
                if (approval) {
                    approvalText = `${approval.approved_by} on ${new Date(approval.approved_on).toLocaleDateString()}`;
                }
            }
        
            if (approvalText) {
                doc.text(approvalText, signature.x, y + 6); // Position the text just below the label
            }
        
           
            doc.line(signature.x, y + 3, signature.x + 40, y + 3); 
            doc.rect(signature.x, y - 8, 60, 20); 
        });
        // Save the PDF
        doc.save('purchase_request.pdf');
    });
};

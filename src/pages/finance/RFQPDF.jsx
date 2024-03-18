import { jsPDF } from "jspdf";
import 'jspdf-autotable';

export function generateQuotationPDF(quotationRequest) {
    const doc = new jsPDF();

    // Set the font for the entire document
    doc.setFont('helvetica');

    // Title 'REQUEST FOR QUOTATION FORM'
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('REQUEST FOR QUOTATION FORM', 105, 20, null, null, 'center');

    // Main Details
    const mainDetailsYStart = 30;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const mainDetails = [
        { title: 'Programme:', detail: quotationRequest.programme || '' },
        { title: 'Date:', detail: quotationRequest.submission_date || '' },
        { title: 'Reference:', detail: quotationRequest.reference || '' },
        { title: 'Quotation Required by:', detail: quotationRequest.quotation_required_by || '' },
    ];

    mainDetails.forEach((item, index) => {
        doc.text(item.title, 14, mainDetailsYStart + index * 10);
        doc.text(item.detail, 60, mainDetailsYStart + index * 10);
    });

    // Supplier Information
    const supplierInfoYStart = mainDetailsYStart;
    const supplierDetails = [
        { title: 'Supplier Name:', detail: quotationRequest.supplier.name || '' },
        { title: 'Address:', detail: quotationRequest.supplier.address || '' },
        { title: 'Contact Person:', detail: quotationRequest.supplier.contact_person || '' },
        { title: 'Email Address:', detail: quotationRequest.supplier.email || '' },
        { title: 'Tel:', detail: quotationRequest.supplier.telephone || '' },
    ];

    supplierDetails.forEach((item, index) => {
        doc.text(item.title, 108, supplierInfoYStart + index * 10);
        doc.text(item.detail, 148, supplierInfoYStart + index * 10);
    });

    // Items Table
    const items = quotationRequest.items.map((item, index) => [
        index + 1,
        item.description,
        item.unit,
        item.unitRate,
        item.quantity,
        (item.quantity * item.unitRate).toFixed(2), // Calculate total cost
        item.leadTime,
        item.comments
    ]);

    doc.autoTable({
        startY: 80,
        head: [['#', 'ITEM DESCRIPTION', 'UNIT', 'UNIT RATE', 'QUANTITY', 'TOTAL COST', 'LEAD TIME', 'COMMENTS']],
        body: items,
        theme: 'plain',
        styles: { cellPadding: 2, fontSize: 8 },
        headStyles: { fillColor: [211, 211, 211], textColor: [0, 0, 0], fontSize: 8 }
    });

    // Terms and Conditions
    const termsYStart = doc.lastAutoTable.finalY + 10;
    const termsDetails = [
        { title: 'Payment Terms:', detail: quotationRequest.terms.payment_terms || '' },
        { title: 'Delivery or Collection:', detail: quotationRequest.terms.delivery_or_collection || '' },
        { title: 'Delivery Costs (if applicable):', detail: quotationRequest.terms.delivery_costs || '' },
        { title: 'Warranty Information:', detail: quotationRequest.terms.warranty_information || '' },
        { title: 'Quotation Validity:', detail: quotationRequest.terms.validity || '' },
    ];

    termsDetails.forEach((item, index) => {
        doc.text(item.title, 14, termsYStart + index * 10);
        doc.text(item.detail, 60, termsYStart + index * 10);
    });

    // Save the PDF
    doc.save('quotation_request.pdf');
}

import jsPDF from 'jspdf';
import type { Job, PdfTemplate, PdfGenerationResult, PdfField } from '../types';
import { format } from 'date-fns';

export const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

export const mapJobDataToPdfTemplate = (job: Job, template: PdfTemplate): PdfGenerationResult => {
  const doc = new jsPDF();
  const fieldsPopulated: string[] = [];
  const missingFields: string[] = [];
  const warnings: string[] = [];

  // Title
  doc.setFontSize(18);
  doc.text(template.name, 20, 20);
  
  doc.setFontSize(10);
  doc.text(`Job ID: ${job.id}`, 20, 30);
  doc.text(`Generated: ${format(new Date(), 'MM/dd/yyyy HH:mm')}`, 20, 36);

  let yPosition = 50;

  template.fields.forEach((field: PdfField) => {
    const value = getNestedValue(job, field.dataPath);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`${field.label}:`, 20, yPosition);
    
    doc.setFont('helvetica', 'normal');
    
    if (value !== undefined && value !== null && value !== '') {
      let displayValue = value;
      
      if (field.type === 'date' && value instanceof Date) {
        displayValue = format(value, field.format || 'MM/dd/yyyy');
      } else if (field.type === 'checkbox') {
        displayValue = value ? '☑ Yes' : '☐ No';
      } else if (Array.isArray(value)) {
        displayValue = value.join(', ');
      }
      
      doc.text(String(displayValue), 80, yPosition);
      fieldsPopulated.push(field.id);
    } else {
      doc.setTextColor(200, 0, 0);
      doc.text('[NOT PROVIDED]', 80, yPosition);
      doc.setTextColor(0, 0, 0);
      
      if (field.required) {
        missingFields.push(field.label);
      } else {
        warnings.push(`Optional field '${field.label}' is empty`);
      }
    }
    
    yPosition += 8;
    
    if (yPosition > 270) {
      doc.addPage();
      yPosition = 20;
    }
  });

  const pdfBlob = doc.output('blob');
  const pdfUrl = URL.createObjectURL(pdfBlob);

  return {
    templateId: template.id,
    templateName: template.name,
    pdfUrl,
    fieldsPopulated: fieldsPopulated.length,
    totalFields: template.fields.length,
    missingFields,
    warnings,
    generatedAt: new Date(),
  };
};

export const downloadPdf = (pdfUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = pdfUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
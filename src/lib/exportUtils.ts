declare const XLSX: any;
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { TeacherDutyResult } from './types';

// Extend jsPDF type for autotable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => jsPDF;
  }
}

function buildRows(results: TeacherDutyResult[]) {
  return results.map(r => {
    const duties = r.assignments.map(a => `${a.date}(${a.session})`);
    return {
      'Sl No': r.slNo,
      'Name': r.name,
      'Department': r.department,
      'Duty Type': r.dutyType,
      'Total Duties': r.assignments.length,
      'Assigned Duties': duties.join('  '),
    };
  });
}

export function exportToExcel(results: TeacherDutyResult[], filename = 'duty_allocation.xlsx') {
  const rows = buildRows(results);
  const ws = XLSX.utils.json_to_sheet(rows);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 6 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 60 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Duty Allocation');
  XLSX.writeFile(wb, filename);
}

export function exportToPDF(results: TeacherDutyResult[], filename = 'duty_allocation.pdf') {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  doc.setFontSize(16);
  doc.text('Examination Duty Allocation', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

  const body = results.map(r => [
    r.slNo,
    r.name,
    r.department,
    r.dutyType,
    r.assignments.length,
    r.assignments.map(a => `${a.date}(${a.session})`).join('  '),
  ]);

  doc.autoTable({
    startY: 28,
    head: [['Sl No', 'Name', 'Dept', 'Duty Type', 'Total', 'Assigned Duties']],
    body,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 98, 180], textColor: [255, 255, 255] },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 30 },
      2: { cellWidth: 25 },
      3: { cellWidth: 22 },
      4: { cellWidth: 12 },
      5: { cellWidth: 'auto' },
    },
  });

  doc.save(filename);
}

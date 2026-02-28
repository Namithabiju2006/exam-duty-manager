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

function buildDateWiseRows(results: TeacherDutyResult[]) {
  const entries: { Date: string; Session: string; 'Duty Type': string; 'Teacher Name': string; Department: string }[] = [];
  for (const r of results) {
    for (const a of r.assignments) {
      entries.push({
        'Date': a.date,
        'Session': a.session,
        'Duty Type': r.dutyType,
        'Teacher Name': r.name,
        'Department': r.department,
      });
    }
  }
  entries.sort((a, b) => {
    const dc = a.Date.localeCompare(b.Date);
    if (dc !== 0) return dc;
    if (a.Session !== b.Session) return a.Session === 'FN' ? -1 : 1;
    if (a['Duty Type'] !== b['Duty Type']) return a['Duty Type'] === 'Invigilator' ? -1 : 1;
    return a['Teacher Name'].localeCompare(b['Teacher Name']);
  });
  return entries;
}

export function exportToExcel(results: TeacherDutyResult[], filename = 'duty_allocation.xlsx') {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Teacher-Wise
  const ws1 = XLSX.utils.json_to_sheet(buildRows(results));
  ws1['!cols'] = [
    { wch: 6 }, { wch: 20 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 60 },
  ];
  XLSX.utils.book_append_sheet(wb, ws1, 'Teacher-Wise');

  // Sheet 2: Date & Session-Wise
  const ws2 = XLSX.utils.json_to_sheet(buildDateWiseRows(results));
  ws2['!cols'] = [
    { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 20 }, { wch: 15 },
  ];
  XLSX.utils.book_append_sheet(wb, ws2, 'Date-Session-Wise');

  XLSX.writeFile(wb, filename);
}

export function exportToPDF(results: TeacherDutyResult[], filename = 'duty_allocation.pdf') {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

  // Page 1: Teacher-Wise
  doc.setFontSize(16);
  doc.text('Teacher-Wise Duty Allocation', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

  const body1 = results.map(r => [
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
    body: body1,
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

  // Page 2: Date & Session-Wise
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Date & Session-Wise Duty Allocation', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

  const dateWiseRows = buildDateWiseRows(results);
  const body2 = dateWiseRows.map(r => [r.Date, r.Session, r['Duty Type'], r['Teacher Name'], r.Department]);

  doc.autoTable({
    startY: 28,
    head: [['Date', 'Session', 'Duty Type', 'Teacher Name', 'Department']],
    body: body2,
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [41, 98, 180], textColor: [255, 255, 255] },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 15 },
      2: { cellWidth: 22 },
      3: { cellWidth: 35 },
      4: { cellWidth: 25 },
    },
  });

  doc.save(filename);
}

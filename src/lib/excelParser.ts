import { Teacher, ExamRequirement } from './types';

declare const XLSX: any;

function formatDate(value: unknown): string {
  if (value instanceof Date) {
    const d = value.getDate().toString().padStart(2, '0');
    const m = (value.getMonth() + 1).toString().padStart(2, '0');
    const y = value.getFullYear();
    return `${d}-${m}-${y}`;
  }
  if (typeof value === 'number') {
    // Excel serial date
    const date = XLSX.SSF.parse_date_code(value);
    const d = date.d.toString().padStart(2, '0');
    const m = date.m.toString().padStart(2, '0');
    return `${d}-${m}-${date.y}`;
  }
  return String(value || '');
}

export function parseTeachers(file: File): Promise<Teacher[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: 'array', cellDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws);

        const teachers: Teacher[] = rows.map((row, idx) => {
          const keys = Object.keys(row);
          const slNo = Number(row[keys[0]]) || idx + 1;
          const name = String(row[keys[1]] || '').trim();
          const department = String(row[keys[2]] || '').trim();
          const dutyTypeRaw = String(row[keys[3]] || '').trim().toLowerCase();
          const dutyType: 'Squad' | 'Invigilator' = dutyTypeRaw === 'squad' ? 'Squad' : 'Invigilator';

          return { slNo, name, department, dutyType };
        }).filter(t => t.name.length > 0);

        if (teachers.length === 0) {
          reject(new Error('No valid teacher data found. Ensure columns: Sl No, Name, Department, Duty Type'));
          return;
        }

        resolve(teachers);
      } catch (err) {
        reject(new Error('Failed to parse teacher file. Please check the format.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

export function parseRequirements(file: File): Promise<ExamRequirement[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target?.result, { type: 'array', cellDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(ws);

        const reqs: ExamRequirement[] = rows.map((row) => {
          const keys = Object.keys(row);
          const date = formatDate(row[keys[0]]);
          const sessionRaw = String(row[keys[1]] || '').trim().toUpperCase();
          const session: 'FN' | 'AN' = sessionRaw === 'AN' ? 'AN' : 'FN';
          const invigilatorsRequired = Number(row[keys[2]]) || 0;
          const squadRequired = Number(row[keys[3]]) || 0;

          return { date, session, invigilatorsRequired, squadRequired };
        }).filter(r => r.date.length > 0 && (r.invigilatorsRequired > 0 || r.squadRequired > 0));

        if (reqs.length === 0) {
          reject(new Error('No valid exam requirements found. Ensure columns: Date, Session, Invigilators Required, Squad Required'));
          return;
        }

        resolve(reqs);
      } catch (err) {
        reject(new Error('Failed to parse requirements file. Please check the format.'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

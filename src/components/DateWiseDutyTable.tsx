import React from 'react';
import { TeacherDutyResult } from '@/lib/types';

interface DateWiseEntry {
  date: string;
  session: 'FN' | 'AN';
  dutyType: 'Squad' | 'Invigilator';
  name: string;
  department: string;
}

interface DateWiseDutyTableProps {
  results: TeacherDutyResult[];
}

const DateWiseDutyTable: React.FC<DateWiseDutyTableProps> = ({ results }) => {
  // Flatten results into date/session-wise entries
  const entries: DateWiseEntry[] = [];
  for (const r of results) {
    for (const a of r.assignments) {
      entries.push({
        date: a.date,
        session: a.session,
        dutyType: r.dutyType,
        name: r.name,
        department: r.department,
      });
    }
  }

  // Sort by date, then session (FN before AN), then duty type, then name
  entries.sort((a, b) => {
    const dc = a.date.localeCompare(b.date);
    if (dc !== 0) return dc;
    if (a.session !== b.session) return a.session === 'FN' ? -1 : 1;
    if (a.dutyType !== b.dutyType) return a.dutyType === 'Invigilator' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  // Group by date+session for visual separation
  let lastGroup = '';

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="gradient-primary text-primary-foreground">
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Date</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Session</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Duty Type</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Teacher Name</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Department</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, idx) => {
              const group = `${e.date}-${e.session}`;
              const isNewGroup = group !== lastGroup;
              lastGroup = group;

              return (
                <tr
                  key={idx}
                  className={`border-b border-border/50 transition-colors hover:bg-muted/50 ${
                    isNewGroup ? 'border-t-2 border-t-primary/20' : ''
                  } ${idx % 2 === 0 ? 'bg-card' : 'bg-muted/20'}`}
                >
                  <td className="px-4 py-3 font-mono text-foreground font-medium">
                    {isNewGroup ? e.date : ''}
                  </td>
                  <td className="px-4 py-3">
                    {isNewGroup ? (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          e.session === 'FN'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-accent/10 text-accent'
                        }`}
                      >
                        {e.session}
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        e.dutyType === 'Squad'
                          ? 'bg-accent/15 text-accent'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {e.dutyType}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium text-foreground">{e.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.department}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DateWiseDutyTable;

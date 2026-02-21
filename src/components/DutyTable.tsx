import React from 'react';
import { TeacherDutyResult } from '@/lib/types';

interface DutyTableProps {
  results: TeacherDutyResult[];
}

const DutyTable: React.FC<DutyTableProps> = ({ results }) => {
  const maxDuties = Math.max(...results.map(r => r.assignments.length), 1);

  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="gradient-primary text-primary-foreground">
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Sl No</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Name</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Department</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Duty Type</th>
              <th className="px-4 py-3 text-center font-semibold whitespace-nowrap">Total</th>
              <th className="px-4 py-3 text-left font-semibold whitespace-nowrap">Assigned Duties</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, idx) => (
              <tr
                key={r.slNo}
                className={`border-b border-border/50 transition-colors hover:bg-muted/50 ${
                  idx % 2 === 0 ? 'bg-card' : 'bg-muted/20'
                }`}
              >
                <td className="px-4 py-3 font-mono text-muted-foreground">{r.slNo}</td>
                <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.department}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      r.dutyType === 'Squad'
                        ? 'bg-accent/15 text-accent'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {r.dutyType}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-secondary text-secondary-foreground text-xs font-bold">
                    {r.assignments.length}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {r.assignments.map((a, i) => (
                      <span
                        key={i}
                        className={`inline-block rounded px-2 py-0.5 text-xs font-mono ${
                          a.session === 'FN'
                            ? 'bg-primary/10 text-primary'
                            : 'bg-accent/10 text-accent'
                        }`}
                      >
                        {a.date}({a.session})
                      </span>
                    ))}
                    {r.assignments.length === 0 && (
                      <span className="text-xs text-muted-foreground italic">No duties assigned</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DutyTable;

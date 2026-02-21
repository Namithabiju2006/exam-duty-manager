import React from 'react';
import { Users, CalendarDays, ClipboardCheck, AlertTriangle } from 'lucide-react';
import { Teacher, ExamRequirement, TeacherDutyResult } from '@/lib/types';

interface DashboardSummaryProps {
  teachers: Teacher[];
  requirements: ExamRequirement[];
  results: TeacherDutyResult[] | null;
}

const DashboardSummary: React.FC<DashboardSummaryProps> = ({ teachers, requirements, results }) => {
  const totalTeachers = teachers.length;
  const invigilators = teachers.filter(t => t.dutyType === 'Invigilator').length;
  const squad = teachers.filter(t => t.dutyType === 'Squad').length;
  const totalSessions = requirements.length;
  const totalDutiesNeeded = requirements.reduce((s, r) => s + r.invigilatorsRequired + r.squadRequired, 0);
  const totalAssigned = results ? results.reduce((s, r) => s + r.assignments.length, 0) : 0;

  const stats = [
    {
      label: 'Total Teachers',
      value: totalTeachers,
      sub: `${invigilators} Invigilators · ${squad} Squad`,
      icon: <Users className="h-5 w-5" />,
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      label: 'Exam Sessions',
      value: totalSessions,
      sub: `${new Set(requirements.map(r => r.date)).size} unique dates`,
      icon: <CalendarDays className="h-5 w-5" />,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Duties Assigned',
      value: totalAssigned,
      sub: `of ${totalDutiesNeeded} required`,
      icon: <ClipboardCheck className="h-5 w-5" />,
      color: 'text-success',
      bg: 'bg-success/10',
    },
    {
      label: 'Unassigned',
      value: Math.max(0, totalDutiesNeeded - totalAssigned),
      sub: totalDutiesNeeded - totalAssigned <= 0 ? 'All positions filled' : 'Positions remaining',
      icon: <AlertTriangle className="h-5 w-5" />,
      color: totalDutiesNeeded - totalAssigned > 0 ? 'text-warning' : 'text-success',
      bg: totalDutiesNeeded - totalAssigned > 0 ? 'bg-warning/10' : 'bg-success/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(s => (
        <div key={s.label} className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className={`${s.bg} ${s.color} rounded-lg p-2`}>{s.icon}</div>
          </div>
          <p className="text-2xl font-bold text-foreground">{s.value}</p>
          <p className="text-sm font-medium text-foreground/80">{s.label}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
        </div>
      ))}
    </div>
  );
};

export default DashboardSummary;

import { Teacher, ExamRequirement, TeacherDutyResult, DutyAssignment } from './types';

export function allocateDuties(
  teachers: Teacher[],
  requirements: ExamRequirement[]
): TeacherDutyResult[] {
  const invigilators = teachers.filter(t => t.dutyType === 'Invigilator');
  const squadMembers = teachers.filter(t => t.dutyType === 'Squad');

  // Track assignments per teacher: teacherIndex -> assignments[]
  const invigilatorAssignments: Map<number, DutyAssignment[]> = new Map();
  const squadAssignments: Map<number, DutyAssignment[]> = new Map();

  invigilators.forEach((_, i) => invigilatorAssignments.set(i, []));
  squadMembers.forEach((_, i) => squadAssignments.set(i, []));

  // Track which teachers are busy on which date
  const invigilatorDayUsed: Map<number, Set<string>> = new Map();
  const squadDayUsed: Map<number, Set<string>> = new Map();

  invigilators.forEach((_, i) => invigilatorDayUsed.set(i, new Set()));
  squadMembers.forEach((_, i) => squadDayUsed.set(i, new Set()));

  // Sort requirements by date then session for consistent processing
  const sorted = [...requirements].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.session === 'FN' ? -1 : 1;
  });

  for (const req of sorted) {
    // Assign invigilators
    assignGroup(
      invigilators,
      invigilatorAssignments,
      invigilatorDayUsed,
      req.date,
      req.session,
      req.invigilatorsRequired
    );

    // Assign squad
    assignGroup(
      squadMembers,
      squadAssignments,
      squadDayUsed,
      req.date,
      req.session,
      req.squadRequired
    );
  }

  // Build results in original serial number order
  const results: TeacherDutyResult[] = teachers.map(t => ({
    slNo: t.slNo,
    name: t.name,
    department: t.department,
    dutyType: t.dutyType,
    assignments: [],
  }));

  // Map back assignments
  invigilators.forEach((teacher, idx) => {
    const result = results.find(r => r.slNo === teacher.slNo);
    if (result) {
      result.assignments = invigilatorAssignments.get(idx) || [];
    }
  });

  squadMembers.forEach((teacher, idx) => {
    const result = results.find(r => r.slNo === teacher.slNo);
    if (result) {
      result.assignments = squadAssignments.get(idx) || [];
    }
  });

  // Sort assignments by date
  results.forEach(r => {
    r.assignments.sort((a, b) => {
      const dc = a.date.localeCompare(b.date);
      if (dc !== 0) return dc;
      return a.session === 'FN' ? -1 : 1;
    });
  });

  return results.sort((a, b) => a.slNo - b.slNo);
}

function assignGroup(
  members: Teacher[],
  assignments: Map<number, DutyAssignment[]>,
  dayUsed: Map<number, Set<string>>,
  date: string,
  session: 'FN' | 'AN',
  count: number
) {
  if (members.length === 0 || count === 0) return;

  // Get eligible members (not already assigned on this date)
  const eligible = members
    .map((_, idx) => idx)
    .filter(idx => !dayUsed.get(idx)!.has(date));

  // Sort eligible by: fewest assignments first, then try different departments
  eligible.sort((a, b) => {
    const countA = assignments.get(a)!.length;
    const countB = assignments.get(b)!.length;
    return countA - countB;
  });

  // Try to diversify departments: among those with same duty count, prefer different departments
  const selected: number[] = [];
  const selectedDepts = new Set<string>();

  // First pass: pick from different departments, fewest duties first
  for (const idx of eligible) {
    if (selected.length >= count) break;
    const dept = members[idx].department;
    if (!selectedDepts.has(dept)) {
      selected.push(idx);
      selectedDepts.add(dept);
    }
  }

  // Second pass: fill remaining from eligible (allow same dept)
  if (selected.length < count) {
    for (const idx of eligible) {
      if (selected.length >= count) break;
      if (!selected.includes(idx)) {
        selected.push(idx);
      }
    }
  }

  // If still not enough (all busy that day), allow double-booking as last resort
  if (selected.length < count) {
    const remaining = members
      .map((_, idx) => idx)
      .filter(idx => !selected.includes(idx))
      .sort((a, b) => assignments.get(a)!.length - assignments.get(b)!.length);
    
    for (const idx of remaining) {
      if (selected.length >= count) break;
      selected.push(idx);
    }
  }

  // Assign duties
  for (const idx of selected) {
    assignments.get(idx)!.push({ date, session });
    dayUsed.get(idx)!.add(date);
  }
}

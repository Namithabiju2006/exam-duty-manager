import { describe, it, expect } from 'vitest';
import { allocateDuties } from '../lib/dutyAllocator';
import { Teacher, ExamRequirement } from '../lib/types';

function makeTeachers(count: number, dutyType: 'Invigilator' | 'Squad'): Teacher[] {
  return Array.from({ length: count }, (_, i) => ({
    slNo: i + 1,
    name: `Teacher${i + 1}`,
    department: `Dept${(i % 3) + 1}`,
    dutyType,
  }));
}

function makeRequirements(dates: string[], perSlot: number): ExamRequirement[] {
  return dates.flatMap(date => [
    { date, session: 'FN' as const, invigilatorsRequired: perSlot, squadRequired: 0 },
    { date, session: 'AN' as const, invigilatorsRequired: perSlot, squadRequired: 0 },
  ]);
}

describe('allocateDuties - fair distribution', () => {
  it('duty counts differ by at most 1 across all teachers', () => {
    const teachers = makeTeachers(10, 'Invigilator');
    // 5 dates × 2 sessions × 3 per slot = 30 total assignments across 10 teachers → 3 each
    const reqs = makeRequirements(['01-03', '02-03', '03-03', '04-03', '05-03'], 3);
    const results = allocateDuties(teachers, reqs);

    const counts = results.map(r => r.assignments.length);
    const max = Math.max(...counts);
    const min = Math.min(...counts);
    expect(max - min).toBeLessThanOrEqual(1);
  });

  it('duty counts differ by at most 1 when not evenly divisible', () => {
    const teachers = makeTeachers(7, 'Invigilator');
    // 4 dates × 2 sessions × 2 per slot = 16 assignments across 7 teachers → 2 or 3 each
    const reqs = makeRequirements(['01-03', '02-03', '03-03', '04-03'], 2);
    const results = allocateDuties(teachers, reqs);

    const counts = results.map(r => r.assignments.length);
    const max = Math.max(...counts);
    const min = Math.min(...counts);
    expect(max - min).toBeLessThanOrEqual(1);
  });

  it('tiebreaks by serial number order', () => {
    const teachers = makeTeachers(5, 'Invigilator');
    // 1 date × 1 session × 2 per slot = 2 assignments → teachers 1 and 2 should get them
    const reqs: ExamRequirement[] = [
      { date: '01-03', session: 'FN', invigilatorsRequired: 2, squadRequired: 0 },
    ];
    const results = allocateDuties(teachers, reqs);
    const assigned = results.filter(r => r.assignments.length > 0);
    expect(assigned.map(r => r.slNo)).toEqual([1, 2]);
  });

  it('handles squad and invigilator separately', () => {
    const invigilators = makeTeachers(4, 'Invigilator');
    const squad = makeTeachers(3, 'Squad').map((t, i) => ({ ...t, slNo: i + 5, name: `Squad${i + 1}` }));
    const teachers = [...invigilators, ...squad];

    const reqs: ExamRequirement[] = [
      { date: '01-03', session: 'FN', invigilatorsRequired: 2, squadRequired: 1 },
      { date: '02-03', session: 'FN', invigilatorsRequired: 2, squadRequired: 1 },
      { date: '03-03', session: 'FN', invigilatorsRequired: 2, squadRequired: 1 },
    ];
    const results = allocateDuties(teachers, reqs);

    const invCounts = results.filter(r => r.dutyType === 'Invigilator').map(r => r.assignments.length);
    const sqCounts = results.filter(r => r.dutyType === 'Squad').map(r => r.assignments.length);

    expect(Math.max(...invCounts) - Math.min(...invCounts)).toBeLessThanOrEqual(1);
    expect(Math.max(...sqCounts) - Math.min(...sqCounts)).toBeLessThanOrEqual(1);
  });

  it('no teacher gets duplicate duty for same date+session', () => {
    const teachers = makeTeachers(6, 'Invigilator');
    const reqs = makeRequirements(['01-03', '02-03', '03-03'], 2);
    const results = allocateDuties(teachers, reqs);

    for (const r of results) {
      const slots = r.assignments.map(a => `${a.date}_${a.session}`);
      const uniqueSlots = new Set(slots);
      expect(uniqueSlots.size).toBe(slots.length);
    }
  });
});

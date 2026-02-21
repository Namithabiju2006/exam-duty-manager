export interface Teacher {
  slNo: number;
  name: string;
  department: string;
  dutyType: 'Squad' | 'Invigilator';
}

export interface ExamRequirement {
  date: string; // formatted date string
  session: 'FN' | 'AN';
  invigilatorsRequired: number;
  squadRequired: number;
}

export interface DutyAssignment {
  date: string;
  session: 'FN' | 'AN';
}

export interface TeacherDutyResult {
  slNo: number;
  name: string;
  department: string;
  dutyType: 'Squad' | 'Invigilator';
  assignments: DutyAssignment[];
}

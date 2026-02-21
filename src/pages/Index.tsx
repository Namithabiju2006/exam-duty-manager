import React, { useState } from 'react';
import { Users, FileSpreadsheet, Zap, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileUpload from '@/components/FileUpload';
import DashboardSummary from '@/components/DashboardSummary';
import DutyTable from '@/components/DutyTable';
import { Teacher, ExamRequirement, TeacherDutyResult } from '@/lib/types';
import { parseTeachers, parseRequirements } from '@/lib/excelParser';
import { allocateDuties } from '@/lib/dutyAllocator';
import { exportToExcel, exportToPDF } from '@/lib/exportUtils';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [teacherFile, setTeacherFile] = useState<File | null>(null);
  const [requirementFile, setRequirementFile] = useState<File | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [requirements, setRequirements] = useState<ExamRequirement[]>([]);
  const [results, setResults] = useState<TeacherDutyResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleTeacherFile = async (file: File) => {
    setTeacherFile(file);
    try {
      const parsed = await parseTeachers(file);
      setTeachers(parsed);
      toast({ title: 'Teachers loaded', description: `${parsed.length} teachers found.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      setTeacherFile(null);
    }
  };

  const handleRequirementFile = async (file: File) => {
    setRequirementFile(file);
    try {
      const parsed = await parseRequirements(file);
      setRequirements(parsed);
      toast({ title: 'Requirements loaded', description: `${parsed.length} exam sessions found.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
      setRequirementFile(null);
    }
  };

  const handleGenerate = () => {
    if (teachers.length === 0 || requirements.length === 0) {
      toast({ title: 'Missing data', description: 'Please upload both files first.', variant: 'destructive' });
      return;
    }
    setLoading(true);
    // Small delay for UX
    setTimeout(() => {
      const allocated = allocateDuties(teachers, requirements);
      setResults(allocated);
      setLoading(false);
      toast({ title: 'Duties allocated!', description: 'Duty assignments generated successfully.' });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="gradient-primary rounded-lg p-2">
              <ClipboardIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Duty Allocator</h1>
              <p className="text-xs text-muted-foreground">Exam Invigilation & Squad Duty Manager</p>
            </div>
          </div>
          {results && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToExcel(results)}
                className="gap-1.5"
              >
                <Download className="h-4 w-4" />
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToPDF(results)}
                className="gap-1.5"
              >
                <FileText className="h-4 w-4" />
                PDF
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero section */}
        {!results && (
          <div className="text-center space-y-2 py-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold">
              <span className="gradient-text">Automatic Duty Allocation</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Upload your teacher list and exam schedule to generate a fair, balanced, and conflict-free duty assignment.
            </p>
          </div>
        )}

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <FileUpload
            label="Teacher Details"
            description="Excel with Sl No, Name, Department, Duty Type"
            onFileSelect={handleTeacherFile}
            acceptedFile={teacherFile}
            icon={<Users className="h-8 w-8 text-primary" />}
          />
          <FileUpload
            label="Exam Requirements"
            description="Excel with Date, Session, Invigilators Needed, Squad Needed"
            onFileSelect={handleRequirementFile}
            acceptedFile={requirementFile}
            icon={<FileSpreadsheet className="h-8 w-8 text-accent" />}
          />
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!teacherFile || !requirementFile || loading}
            className="gradient-primary text-primary-foreground font-semibold px-8 py-3 text-base gap-2 shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Zap className="h-5 w-5" />
            {loading ? 'Generating...' : 'Generate Duty Allocation'}
          </Button>
        </div>

        {/* Dashboard */}
        {(teachers.length > 0 || requirements.length > 0) && (
          <DashboardSummary teachers={teachers} requirements={requirements} results={results} />
        )}

        {/* Results Table */}
        {results && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Teacher-wise Duty List</h3>
              <p className="text-sm text-muted-foreground">
                {results.length} teachers · {results.reduce((s, r) => s + r.assignments.length, 0)} duties assigned
              </p>
            </div>
            <DutyTable results={results} />
          </div>
        )}
      </main>
    </div>
  );
};

// Simple clipboard icon component
const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="m9 14 2 2 4-4" />
  </svg>
);

export default Index;

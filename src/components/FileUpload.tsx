import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  label: string;
  description: string;
  onFileSelect: (file: File) => void;
  acceptedFile: File | null;
  icon?: React.ReactNode;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, description, onFileSelect, acceptedFile, icon }) => {
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`relative rounded-lg border-2 border-dashed p-6 text-center transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5 ${
        acceptedFile ? 'border-success bg-success/5' : 'border-border'
      }`}
    >
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-2">
        {icon || <Upload className="h-8 w-8 text-muted-foreground" />}
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
        {acceptedFile && (
          <div className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-success/10 px-3 py-1 text-xs font-medium text-success">
            ✓ {acceptedFile.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

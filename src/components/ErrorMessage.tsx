// File: src/components/ErrorMessage.tsx
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ error }: { error?: string }) => {
  if (!error) return null;
  return (
    <div className="flex items-center gap-1 text-red-300 text-xs mt-1">
      <AlertCircle size={12} />
      <span>{error}</span>
    </div>
  );
};

export default ErrorMessage;
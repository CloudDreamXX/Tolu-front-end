interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => (
  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-5 h-5 bg-red-500 rounded-full">
        <span className="text-xs text-white">!</span>
      </div>
      <span className="text-sm font-medium text-red-700">Error</span>
    </div>
    <p className="mt-2 text-sm text-red-600">{error}</p>
  </div>
);

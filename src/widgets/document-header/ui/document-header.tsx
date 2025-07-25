import React from "react";

interface DocumentHeaderProps {
  documentTitle: string;
  query?: string;
  isCreatingDocument: boolean;
  isSendingMessage: boolean;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  isCreatingDocument,
  isSendingMessage,
}) => {
  return (
    <div className="flex items-center gap-2 mb-4 ml-[56px]">
      {(isCreatingDocument || isSendingMessage) && (
        <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
          {isCreatingDocument ? "Creating..." : "Generating..."}
        </span>
      )}
    </div>
  );
};

import { Share } from "entities/coach";
import { IDocument } from "entities/document";
import { ClientsInfo, FilesInfo, InstructionInfo } from "entities/folder";
import React from "react";

interface DocumentInfoHeaderProps {
  document: IDocument | null;
  sharedClients: Share[] | null;
  documentId?: string;
  refreshSharedClients: () => Promise<void>;
}

export const DocumentInfoHeader: React.FC<DocumentInfoHeaderProps> = ({
  document,
  sharedClients,
  documentId,
  refreshSharedClients,
}) => {
  return (
    <div className="flex w-full flex-col md:flex-row md:flex-wrap gap-[2px] md:gap-x-4 md:gap-y-2 py-4 md:items-center sticky -top-[10px] z-30 bg-[#F2F4F6]">
      {document ? (
        <FilesInfo files={document.originalFiles} />
      ) : (
        <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
      )}
      {document ? (
        <InstructionInfo instructions={document.originalInstructions} />
      ) : (
        <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
      )}
      {sharedClients ? (
        <ClientsInfo
          clients={sharedClients}
          documentId={documentId}
          refreshSharedClients={refreshSharedClients}
        />
      ) : (
        <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
      )}
    </div>
  );
};

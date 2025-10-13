import {
  useEditFolderMutation,
  Share,
  UpdateFolderRequest,
} from "entities/coach";
import { IDocument } from "entities/document";
import { ClientsInfo, FilesInfo, InstructionInfo } from "entities/folder";
import { HashtagsInfo } from "entities/folder/ui/hashtags-info/ui";
import React from "react";
import { toast } from "shared/lib";

interface DocumentInfoHeaderProps {
  document: IDocument | null;
  sharedClients: Share[] | null;
  documentId?: string;
  folderInstructions?: string | null;
  refreshSharedClients: () => Promise<void>;
}

export const DocumentInfoHeader: React.FC<DocumentInfoHeaderProps> = ({
  document,
  sharedClients,
  documentId,
  folderInstructions,
  refreshSharedClients,
}) => {
  const [editFolder] = useEditFolderMutation();

  const handleInstructionsSave = async (instruction: string) => {
    try {
      if (document) {
        const payload: UpdateFolderRequest = {
          folder_id: document?.originalFolderId,
          instructions: instruction,
        };
        await editFolder({ payload }).unwrap();
        toast({
          title: "Folder's instruction saved successfully",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Failed to save folder's instruction",
      });
    }
  };

  return (
    <div className="flex w-full flex-col md:flex-row md:flex-wrap gap-[2px] md:gap-x-4 md:gap-y-2 py-4 md:items-center sticky -top-[10px] z-30 xl:z-10 bg-[#F2F4F6]">
      {document ? (
        <FilesInfo files={document.originalFiles} />
      ) : (
        <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
      )}
      {document ? (
        <InstructionInfo
          instructions={document.originalInstructions}
          folderInstructions={folderInstructions}
          setInstruction={handleInstructionsSave}
        />
      ) : (
        <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
      )}
      {sharedClients ? (
        <ClientsInfo
          clients={sharedClients}
          documentId={documentId}
          documentTitle={document?.aiTitle}
          refreshSharedClients={refreshSharedClients}
        />
      ) : (
        <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
      )}
      {document ? (
        <HashtagsInfo contentId={document.id} />
      ) : (
        <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse"></div>
      )}
    </div>
  );
};

import React from "react";

interface DocumentHeaderProps {
  documentTitle: string;
  query?: string;
  isCreatingDocument: boolean;
  isSendingMessage: boolean;
}

export const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  documentTitle,
  query,
  isCreatingDocument,
  isSendingMessage,
}) => {
  return (
    <>
      <div className="ml-auto p-[24px] bg-[#F6F6F6] border border-[#EAEAEA] rounded-[16px] max-w-[calc(100%-56px)] flex flex-col gap-[8px] mb-[40px]">
        <p className="text-[16px] md:text-[24px] font-[600] text-[#1D1D1F]">
          {documentTitle}
        </p>
        {query && (
          <p className="text-[16px] md:text-[18px] font-[500] text-[#1D1D1F]">
            {query}
          </p>
        )}
      </div>
      <div className="flex items-center gap-2 mb-4 ml-[56px]">
        <h1 className="text-[20px] md:text-3xl font-bold">{documentTitle}</h1>
        {(isCreatingDocument || isSendingMessage) && (
          <span className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded">
            {isCreatingDocument ? "Creating..." : "Generating..."}
          </span>
        )}
      </div>
    </>
  );
};

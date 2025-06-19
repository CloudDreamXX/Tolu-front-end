import { ChangeEvent, useRef, useState } from "react";
import { DropArea, Input, ScrollArea } from "shared/ui";
import { FileItem } from "widgets/file-item";
import { templates } from "./mock";

interface TemplatesTabrops {
  chatId?: string;
}

export const TemplatesTab: React.FC<TemplatesTabrops> = ({ chatId }) => {
  const [dragActive, setDragActive] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const processFiles = (files: File[]) => {
    const validFiles = files.filter((file) => {
      const extension = file.name
        .toLowerCase()
        .slice(file.name.lastIndexOf("."));
      return [
        ".pdf",
        ".doc",
        ".docx",
        ".png",
        ".jpg",
        ".jpeg",
        ".gif",
      ].includes(extension);
    });

    const updatedFiles = [...attachedFiles, ...validFiles];
    setAttachedFiles(updatedFiles);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    const filesArray = Array.from(selectedFiles);
    processFiles(filesArray);
    e.target.value = "";
  };

  return (
    <ScrollArea className="h-[calc(100vh-238px)]">
      <div className="flex flex-col items-start w-full gap-2 pr-3">
        <DropArea
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          dragActive={dragActive}
          onBrowseClick={handleBrowseClick}
        />

        <Input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
          onChange={handleFileChange}
        />

        {templates.map((tm) => (
          <FileItem key={tm.id} file={tm.file} />
        ))}
      </div>
    </ScrollArea>
  );
};

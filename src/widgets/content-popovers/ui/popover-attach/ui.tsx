import { FileIcon, Trash2 } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import Attach from "shared/assets/icons/attach";
import {
  Badge,
  Button,
  DropArea,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/ui";

interface AttachedFile {
  name: string;
  size: string;
  type: string;
  file: File;
}

interface PopoverAttachProps {
  setFiles?: (files: File[]) => void;
  customTrigger?: React.ReactNode;
  isAttached?: boolean;
  title?: string;
  description?: string;
  existingFiles?: string[];
  disabled?: boolean;
}

export const PopoverAttach: React.FC<PopoverAttachProps> = ({
  setFiles,
  customTrigger,
  isAttached,
  title,
  description,
  existingFiles = [],
  disabled = false,
}) => {
  console.log("PopoverAttach rendered with existingFiles:", existingFiles);
  const [dragActive, setDragActive] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

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

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    const filesArray = Array.from(selectedFiles);
    processFiles(filesArray);
    e.target.value = "";
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

    const newAttachedFiles: AttachedFile[] = validFiles.map((file) => ({
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
      file: file,
    }));

    const updatedFiles = [...attachedFiles, ...newAttachedFiles];
    setAttachedFiles(updatedFiles);
    updateParentFiles(updatedFiles);
  };

  const updateParentFiles = (files: AttachedFile[]) => {
    setFiles?.(files.map((file) => file.file));
  };

  const removeFile = (index: number) => {
    const updatedFiles = attachedFiles.filter((_, i) => i !== index);
    setAttachedFiles(updatedFiles);
    updateParentFiles(updatedFiles);
  };

  const handleSave = () => {
    setIsOpen(false);
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild disabled={disabled}>
        {customTrigger ?? (
          <Button
            variant={"outline"}
            className="relative flex flex-col w-full gap-3 py-[8px] px-[16px] md:p-[16px] xl:px-[32px] xl:py-[16px] rounded-[18px] h-fit"
          >
            <h4 className="flex flex-row items-center gap-2 text-[16px] md:text-[18px] xl:text-[20px] font-bold">
              <Attach />
              Attach files to folder
            </h4>
            <p className="text-[12px] xl:text-[14px] text-[#5F5F65]">
              Add credible references to support information integrity
            </p>
            {attachedFiles.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center px-1 rounded-full text-[10px] font-bold"
              >
                {attachedFiles.length}
              </Badge>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[358px] md::w-[720px] xl:w-[742px] p-6 flex flex-col gap-3 rounded-2xl bg-[#F9FAFB]">
        <h4 className="flex flex-row items-center gap-2 text-[16px] md:text-[18px] xl:text-[20px] font-bold">
          <Attach />
          {attachedFiles.length > 0
            ? "Attached files"
            : (title ?? "Attach files to folder")}
        </h4>
        <p className="text-[12px] xl:text-[14px] text-[#5F5F65]">
          {description ??
            "Add credible references to support information integrity"}
        </p>
        {existingFiles.length > 0 && (
          <div className="flex flex-col gap-2">
            {existingFiles.map((file, index) => (
              <div
                key={`${file}-${index}`}
                className="flex flex-row items-center justify-between w-full px-3 py-2 bg-white border border-green-300 rounded-lg"
              >
                <div className="flex flex-row items-center flex-1 gap-2">
                  <FileIcon color="#008FF6" size={20} />
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {file}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {attachedFiles.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {attachedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex flex-row items-center justify-between w-full px-3 py-2 bg-white border rounded-lg"
              >
                <div className="flex flex-row items-center flex-1 gap-2">
                  <FileIcon color="#008FF6" size={20} />
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {file.name}
                    </span>
                    <span className="text-xs text-[#5F5F65]">{file.size}</span>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 rounded hover:bg-red-50"
                >
                  <Trash2 color="#FF1F0F" size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

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

        <div className="flex flex-row justify-between">
          <Button
            variant={"light-blue"}
            className="w-[128px]"
            onClick={handleSave}
          >
            Cancel
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

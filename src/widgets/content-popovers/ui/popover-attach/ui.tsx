import { FileIcon, Plus, Trash2, Eye } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Attach from "shared/assets/icons/attach";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  DropArea,
  Badge,
  Input,
} from "shared/ui";
import { IFileNames } from "entities/folder/model";

interface AttachedFile {
  name: string;
  size: string;
  type: string;
  file: File;
  isNew: true;
}

interface ExistingFile {
  name: string;
  path: string;
  contentType: string;
  isNew: false;
}

type DisplayFile = AttachedFile | ExistingFile;

interface PopoverAttachProps {
  setFiles?: (files: File[]) => void;
  customTrigger?: React.ReactNode;
  isAttached?: boolean;
  title?: string;
  description?: string;
  existingFiles?: IFileNames[];
}

export const PopoverAttach: React.FC<PopoverAttachProps> = ({
  setFiles,
  customTrigger,
  isAttached,
  title,
  description,
  existingFiles = [],
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [newFiles, setNewFiles] = useState<AttachedFile[]>([]);
  const [displayFiles, setDisplayFiles] = useState<DisplayFile[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  useEffect(() => {
    const existingDisplayFiles: ExistingFile[] = existingFiles.map((file) => ({
      name: file.filename,
      path: file.path,
      contentType: file.contentType,
      isNew: false,
    }));

    setDisplayFiles([...existingDisplayFiles, ...newFiles]);
  }, [existingFiles, newFiles]);

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
      isNew: true,
    }));

    const updatedNewFiles = [...newFiles, ...newAttachedFiles];
    setNewFiles(updatedNewFiles);
    updateParentFiles(updatedNewFiles);
  };

  const updateParentFiles = (files: AttachedFile[]) => {
    setFiles?.(files.map((file) => file.file));
  };

  const removeFile = (index: number) => {
    const fileToRemove = displayFiles[index];

    if (fileToRemove.isNew) {
      const newFileIndex = newFiles.findIndex(
        (f) => f.name === fileToRemove.name
      );
      if (newFileIndex !== -1) {
        const updatedNewFiles = newFiles.filter((_, i) => i !== newFileIndex);
        setNewFiles(updatedNewFiles);
        updateParentFiles(updatedNewFiles);
      }
    }
  };

  const handleSave = () => {
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleAddMoreFiles = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (file: DisplayFile) => {
    if (file.isNew) {
      return <FileIcon color="#008FF6" size={20} />;
    } else {
      return <FileIcon color="#10B981" size={20} />;
    }
  };

  const getFileSize = (file: DisplayFile) => {
    if (file.isNew) {
      return file.size;
    } else {
      return "Existing file";
    }
  };

  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        handleSave();
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
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
            {displayFiles.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center px-1 rounded-full text-[10px] font-bold"
              >
                {displayFiles.length}
              </Badge>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-full xl:w-[742px] p-6 flex flex-col gap-3 rounded-2xl bg-[#F9FAFB]">
        <h4 className="flex flex-row items-center gap-2 text-[16px] md:text-[18px] xl:text-[20px] font-bold">
          <Attach />
          {displayFiles.length > 0
            ? "Attached files"
            : (title ?? "Attach files to folder")}
        </h4>
        <p className="text-[12px] xl:text-[14px] text-[#5F5F65]">
          {description ??
            "Add credible references to support information integrity"}
        </p>

        {displayFiles.length > 0 && (
          <div className="flex flex-col gap-2 mb-4">
            {displayFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className={`flex flex-row items-center justify-between w-full px-3 py-2 border rounded-lg ${
                  file.isNew ? "bg-white" : "bg-green-50 border-green-200"
                }`}
              >
                <div className="flex flex-row items-center flex-1 gap-2">
                  {getFileIcon(file)}
                  <div className="flex flex-col flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800 truncate">
                        {file.name}
                      </span>
                      {!file.isNew && (
                        <Badge
                          variant="secondary"
                          className="text-xs text-green-800 bg-green-100"
                        >
                          Existing
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-[#5F5F65]">
                      {getFileSize(file)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {!file.isNew && (
                    <button
                      className="p-1 rounded hover:bg-green-100"
                      title="View file"
                    >
                      <Eye color="#10B981" size={16} />
                    </button>
                  )}
                  {file.isNew && (
                    <button
                      onClick={() => removeFile(index)}
                      className="p-1 rounded hover:bg-red-50"
                      title="Remove file"
                    >
                      <Trash2 color="#FF1F0F" size={16} />
                    </button>
                  )}
                </div>
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

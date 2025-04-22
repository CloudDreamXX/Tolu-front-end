import { File, Plus, Trash2 } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Attach from "shared/assets/icons/attach";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  DropArea,
  Badge,
} from "shared/ui";

interface PopoverAttachProps {
  customTrigger?: React.ReactNode;
  isAttached?: boolean;
  title?: string;
  description?: string;
}

export const PopoverAttach: React.FC<PopoverAttachProps> = ({
  customTrigger,
  isAttached,
  title,
  description,
}) => {
  const [dragActive, setDragActive] = useState(false);
  // TODO: create file type
  const [attachedFiles, setAttachedFiles] = useState<Array<any>>(() =>
    isAttached
      ? [
          {
            name: "file-name.pdf",
            size: "200 KB",
            type: "application/pdf",
          },
          {
            name: "file-name.pdf",
            size: "200 KB",
            type: "application/pdf",
          },
          {
            name: "file-name.pdf",
            size: "200 KB",
            type: "application/pdf",
          },
          {
            name: "file-name.pdf",
            size: "200 KB",
            type: "application/pdf",
          },
          {
            name: "file-name.pdf",
            size: "200 KB",
            type: "application/pdf",
          },
          {
            name: "file-name.pdf",
            size: "200 KB",
            type: "application/pdf",
          },
        ]
      : []
  );
  const [isAttachedState, setIsAttachedState] = useState(isAttached ?? false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsAttachedState(isAttached ?? false);
  }, [isAttached]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) =>
      [".pdf", ".doc", ".docx"].includes(file.name.slice(-4))
    );
    setAttachedFiles((prev) => [...prev, ...validFiles]);
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    const filesArray = Array.from(selectedFiles);
    const validFiles = filesArray.filter((file) =>
      [".pdf", ".doc", ".docx"].includes(file.name.slice(-4))
    );
    setAttachedFiles((prev) => [...prev, ...validFiles]);
    e.target.value = "";
    console.log(selectedFiles);
  };

  return (
    <Popover onOpenChange={() => setIsAttachedState(false)}>
      <PopoverTrigger asChild>
        {customTrigger ?? (
          <Button
            variant={"outline"}
            className="relative flex flex-col w-full gap-3 py-4 rounded-3xl h-fit"
          >
            <h4 className="flex flex-row gap-2 text-xl font-bold">
              <Attach />
              Attach files to folder
            </h4>
            <p className="text-sm text-[#5F5F65]">
              Enhance content quality by providing credible references
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
      <PopoverContent className="w-[742px] p-6 flex flex-col gap-3 rounded-2xl bg-[#F9FAFB]">
        {isAttachedState ? (
          <>
            <h4 className="flex flex-row gap-2 text-xl font-bold">
              <Attach />
              Attached files
            </h4>
            <p className="text-sm text-[#5F5F65]">
              Enhance content quality by providing credible references
            </p>
            <div className="flex flex-col gap-1">
              {attachedFiles.map((file, index) => (
                <div
                  key={file.name}
                  className="flex flex-row items-center justify-between w-full px-3 py-2 bg-white rounded-lg"
                >
                  <div className="flex flex-row items-center w-full gap-2">
                    <File color="#008FF6" />
                    <div className="flex flex-col w-full gap-1">
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-xs text-[#5F5F65]">
                        {file.size}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setAttachedFiles((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <Trash2 color="#FF1F0F" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-row justify-between">
              <Button
                variant={"light-blue"}
                className="w-[128px]"
                onClick={() => {}}
              >
                Cancel
              </Button>
              <div className="flex flex-row gap-2">
                <Button
                  className="bg-white text-[#008FF6]"
                  onClick={() => setIsAttachedState(false)}
                >
                  <Plus />
                  Attach files
                </Button>
                <Button
                  variant={"blue"}
                  className="w-[128px]"
                  onClick={() => {}}
                >
                  Save
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h4 className="flex flex-row gap-2 text-xl font-bold">
              <Attach />
              {title ?? "Attach files to folder"}
            </h4>
            <p className="text-sm text-[#5F5F65]">
              {description ??
                "Enhance content quality by providing credible references"}
            </p>
            <DropArea
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              dragActive={dragActive}
              onBrowseClick={handleBrowseClick}
            />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
            <div className="flex flex-row justify-between">
              <Button
                variant={"light-blue"}
                className="w-[128px]"
                onClick={() => setIsAttachedState(true)}
              >
                Cancel
              </Button>
              <Button
                variant={"blue"}
                className="w-[128px]"
                onClick={() => setIsAttachedState(true)}
              >
                Attach
              </Button>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

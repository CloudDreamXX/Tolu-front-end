import { X } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import Attach from "shared/assets/icons/attach";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  DropArea,
  Badge,
} from "shared/ui";

export const PopoverAttach: React.FC = () => {
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
    <Popover>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>
      <PopoverContent className="w-[742px] p-6 flex flex-col gap-6 bg-[#F9FAFB]">
        <h4 className="flex flex-row gap-2 text-xl font-bold">
          <Attach />
          Attach files to folder
        </h4>
        <p className="text-sm text-[#5F5F65]">
          Enhance content quality by providing credible references
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
        {attachedFiles.length > 0 && (
          <div className="flex flex-col gap-2">
            {attachedFiles.map((file, index) => (
              <div
                key={file.name}
                className="flex flex-row items-center justify-between w-full px-4 py-2 bg-white rounded-lg shadow-md"
              >
                <span className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() =>
                    setAttachedFiles(
                      attachedFiles.filter((_, i) => i !== index)
                    )
                  }
                >
                  <X />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex flex-row justify-between">
          <Button
            variant={"light-blue"}
            className="w-[128px]"
            onClick={() => {}}
          >
            Cancel
          </Button>
          <Button variant={"blue"} className="w-[128px]" onClick={() => {}}>
            Attach
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

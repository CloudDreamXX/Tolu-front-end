import { ScrollArea } from "shared/ui";
import { templates } from "./mock";
import { FileItem } from "widgets/file-item";
import { UploadCloud } from "lucide-react";
import { cn } from "shared/lib";
import { useRef, useState } from "react";

interface TemplatesTabrops {
  chatId?: string;
}

export const TemplatesTab: React.FC<TemplatesTabrops> = ({ chatId }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files) {
      const validFiles = Array.from(files).filter(isValidFile);
      //todo something
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const isValidFile = (file: File) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(isValidFile);
      //todo something
    }
  };

  return (
    <ScrollArea className="h-[calc(100vh-238px)]">
      <div className="flex flex-col items-start w-full gap-2">
        <div
          className={cn(
            "flex py-[16px] w-full md:w-full px-[24px] gap-[4px] flex-col items-center justify-center rounded-[12px] border-[1px] border-dashed",
            "bg-white cursor-pointer transition",
            dragOver ? "border-[#0057C2]" : "border-[#1C63DB]"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileSelect}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex gap-[12px] items-center flex-col">
            <div className="flex p-[8px] items-center gap-[10px] rounded-[8px] border-[1px] border-[#F3F6FB] bg-white">
              <UploadCloud />
            </div>

            <div className="flex flex-col items-center gap-[4px]">
              <p className="text-[#1C63DB] font-[Nunito] text-[14px] font-semibold">
                Click to upload
              </p>
              <p className="text-[#5F5F65] font-[Nunito] text-[14px] font-normal">
                or drag and drop
              </p>
              <p className="text-[#5F5F65] font-[Nunito] text-[14px] font-normal">
                PDF, JPG or PNG
              </p>
            </div>
          </div>
        </div>

        {templates.map((tm) => (
          <FileItem key={tm.id} file={tm.file} />
        ))}
      </div>
    </ScrollArea>
  );
};

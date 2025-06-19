import { cn } from "shared/lib";
import { File, Trash2 } from "lucide-react";
import { Button } from "shared/ui";

interface FileItemProps {
  file: File;
  classname?: string;
  onDeleteClick?: () => void;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  onDeleteClick,
  classname,
}) => {
  return (
    <div
      className={cn(
        "h-[55px] w-full bg-white px-3 py-2 rounded-md flex justify-between items-center",
        classname
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <File width={18} height={22} color="#1C63DB" />
        <div className="flex flex-col ">
          <span className="text-sm font-medium text-[#1D1D1F]">
            {file.name}
          </span>
          <span className="text-xs font-medium text-[#5F5F65]">
            {file.size} KB
          </span>
        </div>
      </div>
      <Button variant={"ghost"} onClick={onDeleteClick} className="p-1">
        <Trash2 width={19} height={19} color="#FF1F0F" />
      </Button>
    </div>
  );
};

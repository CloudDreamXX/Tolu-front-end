import { ChatService } from "entities/chat";
import { File, Loader2Icon } from "lucide-react";
import { useState } from "react";
import DownloadIcon from "shared/assets/icons/upload-cloud";
import { cn } from "shared/lib";
import { Button } from "shared/ui";

interface FileItemProps {
  fileName: string | null;
  fileSize: number | null;
  fileUrl: string | null;
  fileType: string | null;
  className?: string;
}

export const FileItem: React.FC<FileItemProps> = ({
  fileName,
  fileSize,
  fileUrl,
  fileType,
  className,
}) => {
  const [loading, setLoading] = useState(false);

  const onDownloadClick = async () => {
    setLoading(true);
    if (fileUrl && fileName && fileType) {
      try {
        const response = await ChatService.getUploadedChatFiles(
          fileUrl.split("/")[fileUrl.split("/").length - 1]
        );
        const arrayBuffer = await response.arrayBuffer();
        const byteArray = new Uint8Array(arrayBuffer);
        const blob = new Blob([byteArray], { type: fileType });

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        URL.revokeObjectURL(link.href);
      } catch (error) {
        console.error("Error downloading file:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className={cn(
        "h-[55px] w-fit bg-white px-3 py-2 rounded-md flex justify-between gap-4 items-center",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <File width={32} height={32} color="#1C63DB" />
        <div className="flex flex-col ">
          <span className="text-sm font-medium text-[#1D1D1F] max-w-[250px] truncate">
            {fileName}
          </span>
          <span className="text-xs font-medium text-[#5F5F65]">
            {Math.round(fileSize ? fileSize / 1024 : 0)} KB
          </span>
        </div>
      </div>
      {loading ? (
        <Loader2Icon className="w-8 h-10 text-blue-500 animate-spin" />
      ) : (
        <Button variant={"ghost"} onClick={onDownloadClick} className="p-1">
          <DownloadIcon />
        </Button>
      )}
    </div>
  );
};

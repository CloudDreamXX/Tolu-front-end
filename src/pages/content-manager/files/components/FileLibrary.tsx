import {
  clearDownloadProgress,
  setDownloadProgress,
} from "entities/chat/downloadSlice";
import { FileLibraryResponse } from "entities/files-library";
import { useDownloadFileLibraryMutation } from "entities/files-library/filesLibraryApi";
import { RootState } from "entities/store";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, formatFileSize, toast } from "shared/lib";
import { Button } from "shared/ui";

interface FileLibraryProps {
  fileLibrary: FileLibraryResponse;
  onDelete?: (fileId: string) => void;
  className?: string;
}

export const FileLibrary: React.FC<FileLibraryProps> = ({
  fileLibrary,
  onDelete,
  className,
}) => {
  const dispatch = useDispatch();
  const dlPct = useSelector(
    (state: RootState) => state.downloads.byKey[fileLibrary.id]
  );

  const [downloadFile, { isLoading: downloading }] =
    useDownloadFileLibraryMutation();

  const handleProgress = (percent: number) => {
    dispatch(setDownloadProgress({ key: fileLibrary.id, pct: percent }));
  };
  const onDownloadClick = async () => {
    if (downloading) return;
    dispatch(clearDownloadProgress(fileLibrary.id));

    try {
      const { data: blob } = await downloadFile({
        fileId: fileLibrary.id,
        onProgress: handleProgress,
      });

      if (blob) {
        const objUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = objUrl;
        a.download = fileLibrary.filename;
        a.click();
        URL.revokeObjectURL(objUrl);
      } else {
        toast({
          title: "Download failed",
          description: "No file data received.",
          variant: "destructive",
        });
      }

      dispatch(clearDownloadProgress(fileLibrary.id));
    } catch {
      toast({
        title: "Download failed",
        description: "There was an error downloading the file.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={cn(
        "h-[55px] w-full md:w-[49%] bg-white px-3 py-2 rounded-md flex justify-between gap-4 items-center",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <MaterialIcon iconName="draft" fill={1} className="text-blue-600" />
        <div className="flex flex-col ">
          <span className="text-sm font-medium text-[#1D1D1F] max-w-[150px] md:max-w-[250px] truncate">
            {fileLibrary.filename}
          </span>
          <span className="text-xs font-medium text-[#5F5F65]">
            {formatFileSize(fileLibrary.size)}
          </span>
        </div>
      </div>
      <div>
        <Button variant={"ghost"} onClick={onDownloadClick} className="p-1">
          {downloading ? (
            (() => {
              if (dlPct) {
                return <span className="text-sm">{dlPct}%</span>;
              } else {
                return (
                  <MaterialIcon
                    iconName="progress_activity"
                    className="text-blue-600 animate-spin"
                  />
                );
              }
            })()
          ) : (
            <MaterialIcon iconName="download" className="text-[#5F5F65]" />
          )}
        </Button>

        <Button
          variant={"ghost"}
          onClick={() => onDelete?.(fileLibrary.id)}
          className="p-1"
        >
          <MaterialIcon iconName="delete" fill={1} className="text-red-500" />
        </Button>
      </div>
    </div>
  );
};

import {
  clearDownloadProgress,
  setDownloadProgress,
} from "entities/chat/downloadSlice";
import { FileLibraryFile } from "entities/files-library";
import { useLazyDownloadFileLibraryQuery } from "entities/files-library/api";
import { RootState } from "entities/store";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, formatFileSize, toast } from "shared/lib";
import { Button } from "shared/ui";

interface FileLibraryProps {
  fileLibrary: FileLibraryFile;
  onDelete?: (fileId: string) => void;
  className?: string;
  onFileSelect: (fileId: string) => void;
  onDragStart: (e: React.DragEvent<Element>, fileId: string) => void;
  isSelected?: boolean;
}

export const FileLibrary: React.FC<FileLibraryProps> = ({
  fileLibrary,
  onDelete,
  className,
  onFileSelect,
  isSelected = false,
  onDragStart,
}) => {
  const dispatch = useDispatch();
  const dlPct = useSelector(
    (state: RootState) => state.downloads.byKey[fileLibrary.id]
  );

  const [triggerDownload, { isFetching: downloading }] =
    useLazyDownloadFileLibraryQuery();

  const onDownloadClick = async () => {
    if (downloading) return;
    dispatch(clearDownloadProgress(fileLibrary.id));

    try {
      const result = await triggerDownload({ fileId: fileLibrary.id });

      if ("data" in result && result.data) {
        const blob = result.data;
        const objUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = objUrl;
        a.download = fileLibrary.name;
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
        "h-[55px] w-full md:w-[49%] bg-white px-3 py-2 rounded-md flex justify-between gap-4 items-center cursor-pointer",
        className,
        { "border-2 border-blue-500": isSelected }
      )}
      onClick={() => onFileSelect(fileLibrary.id)}
      draggable={true}
      onDragStart={(e) => onDragStart(e, fileLibrary.id)}
    >
      <div className="flex items-center justify-between gap-2">
        <MaterialIcon iconName="draft" fill={1} className="text-blue-600" />
        <div className="flex flex-col ">
          <span className="text-sm font-medium text-[#1D1D1F] max-w-[150px] md:max-w-[200px] xl:max-w-[250px] truncate">
            {fileLibrary.name}
          </span>
          <span className="text-xs font-medium text-[#5F5F65]">
            {formatFileSize(fileLibrary.size)}
          </span>
        </div>
      </div>
      <div>
        <Button
          variant={"ghost"}
          onClick={(e) => {
            e.stopPropagation();
            onDownloadClick();
          }}
          className="p-1"
        >
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
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.(fileLibrary.id);
          }}
          className="p-1"
        >
          <MaterialIcon iconName="delete" fill={1} className="text-red-500" />
        </Button>
      </div>
    </div>
  );
};

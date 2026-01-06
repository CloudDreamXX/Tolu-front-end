import { clearDownloadProgress } from "entities/chat/downloadSlice";
import { FileLibraryFile } from "entities/files-library";
import { useLazyDownloadFileLibraryQuery } from "entities/files-library/api";
import { RootState } from "entities/store";
import { useState } from "react";
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
  const [preview, setPreview] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

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

  const openPreview = async () => {
    setPreview(true);
    setPreviewLoading(true);

    try {
      const result = await triggerDownload({ fileId: fileLibrary.id });

      if ("data" in result && result.data) {
        const blob = result.data;
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);
      }
    } catch {
      toast({
        title: "Preview failed",
        variant: "destructive",
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  const closePreview = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setPreview(false);
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
          className="p-1"
          onClick={(e) => {
            e.stopPropagation();
            openPreview();
          }}
        >
          <MaterialIcon iconName="visibility" fill={1} className="text-[#5F5F65] hover:text-blue-600" />
        </Button>
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

      {preview && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50"
          onClick={closePreview}
        >
          <div
            className="bg-white w-full h-full rounded-[16px] shadow-xl overflow-hidden flex flex-col max-w-[70vh] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-[18px] font-bold">
                Preview{" "}
                <span className="text-[#1D1D1F]">
                  “{fileLibrary.name}”
                </span>
              </h2>
              <Button
                variant="unstyled"
                size="unstyled"
                className="p-1 rounded hover:bg-black/5"
                onClick={closePreview}
              >
                <MaterialIcon iconName="close" fill={1} />
              </Button>
            </div>

            <div className="relative flex-1 bg-[#F7F7F8] rounded-[8px] mx-[5px] md:mx-[40px] mb-[24px] px-[5px] md:px-6 py-6 overflow-auto">
              <div className="mx-auto w-full bg-white rounded-[12px] shadow p-6 space-y-5">
                {previewLoading && (
                  <div className="flex justify-center py-10">
                    <MaterialIcon
                      iconName="progress_activity"
                      className="animate-spin text-blue-600"
                    />
                  </div>
                )}

                {!previewLoading && previewUrl && (
                  <>
                    {fileLibrary.mime_type.startsWith("image/") && (
                      <img
                        src={previewUrl}
                        className="max-h-[70vh] mx-auto object-contain rounded"
                      />
                    )}

                    {fileLibrary.mime_type === "video/mp4" && (
                      <video
                        src={previewUrl}
                        controls
                        className="w-full max-h-[70vh] rounded"
                      />
                    )}

                    {fileLibrary.mime_type === "application/pdf" && (
                      <iframe
                        src={previewUrl}
                        className="w-full h-[70vh] rounded border"
                      />
                    )}

                    {fileLibrary.mime_type ===
                      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" && (
                        <iframe
                          src={`https://docs.google.com/gview?url=${encodeURIComponent(
                            previewUrl
                          )}&embedded=true`}
                          className="w-full h-[70vh] rounded border"
                        />
                      )}
                  </>
                )}

                {!previewLoading && !previewUrl && (
                  <p className="text-center text-sm text-gray-500">
                    Preview not available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

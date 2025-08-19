import { ChatService } from "entities/chat";
import { useGetUploadedChatFileUrlQuery } from "entities/chat/chatApi";
import {
  clearDownloadProgress,
  setDownloadProgress,
} from "entities/chat/downloadSlice";
import { fileKeyFromUrl } from "entities/chat/helpers";
import { RootState } from "entities/store";
import { CloudDownload, File, Loader2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInViewport } from "./useInViewport";
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
  const dispatch = useDispatch();
  const isImage = !!fileType && fileType.startsWith("image/");
  const normalized = useMemo(() => fileKeyFromUrl(fileUrl ?? ""), [fileUrl]);
  const dlPct = useSelector(
    (state: RootState) => state.downloads.byKey[normalized]
  );
  const dlwPct = useSelector(
    (state: RootState) => state.downloads.byKey[`dw${normalized}`]
  );

  const { ref, inView } = useInViewport<HTMLDivElement>({
    rootMargin: "600px 0px 600px 0px",
    threshold: 0.01,
  });

  const { data: previewUrl, isFetching: previewLoading } =
    useGetUploadedChatFileUrlQuery(
      { fileUrl: normalized },
      { skip: !isImage || !inView || !normalized }
    );

  const [downloading, setDownloading] = useState(false);

  const onDownloadClick = async () => {
    if (!normalized || !fileName || !fileType) return;
    setDownloading(true);
    try {
      const blob = await ChatService.getUploadedChatFiles(normalized, (pct) => {
        dispatch(setDownloadProgress({ key: `dw${normalized}`, pct }));
      });
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(objUrl);
      dispatch(clearDownloadProgress(`dw${normalized}`));
    } finally {
      setDownloading(false);
    }
  };

  const sizeKb = Math.max(0, Math.round((fileSize ?? 0) / 1024));

  if (isImage) {
    return (
      <div
        ref={ref}
        className={cn(
          "h-[55px] w-fit bg-white px-3 py-2 rounded-md flex justify-between gap-4 items-center",
          className
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center justify-center w-10 h-10 overflow-hidden rounded">
            {(() => {
              if (previewUrl) {
                return (
                  <img
                    src={previewUrl}
                    alt={fileName || "File preview"}
                    className="object-cover w-10 h-10"
                    loading="lazy"
                    decoding="async"
                  />
                );
              } else if (dlPct) {
                return <span className="text-sm">{dlPct}%</span>;
              } else {
                return (
                  <Loader2Icon
                    className="w-4 h-4 text-gray-400 animate-spin"
                    style={{
                      visibility: previewLoading ? "visible" : "hidden",
                    }}
                  />
                );
              }
            })()}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-[#1D1D1F] max-w-[250px] truncate">
              {fileName}
            </span>
            <span className="text-xs font-medium text-[#5F5F65]">
              {sizeKb} KB
            </span>
          </div>
        </div>
        {downloading ? (
          (() => {
            if (dlwPct) {
              return <span className="text-sm">{dlwPct}%</span>;
            } else {
              return (
                <Loader2Icon className="w-8 h-10 text-blue-500 animate-spin" />
              );
            }
          })()
        ) : (
          <Button variant={"ghost"} onClick={onDownloadClick} className="p-1">
            <CloudDownload />
          </Button>
        )}
      </div>
    );
  }

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
            {sizeKb} KB
          </span>
        </div>
      </div>
      {downloading ? (
        (() => {
          if (dlwPct) {
            return <span className="text-sm">{dlPct}%</span>;
          } else {
            return (
              <Loader2Icon className="w-8 h-10 text-blue-500 animate-spin" />
            );
          }
        })()
      ) : (
        <Button variant={"ghost"} onClick={onDownloadClick} className="p-1">
          <CloudDownload />
        </Button>
      )}
    </div>
  );
};

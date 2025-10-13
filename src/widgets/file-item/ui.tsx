import { useGetUploadedChatFileUrlQuery } from "entities/chat/api";
import {
  clearDownloadProgress,
  setDownloadProgress,
} from "entities/chat/downloadSlice";
import { fileKeyFromUrl } from "entities/chat/helpers";
import { RootState } from "entities/store";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInViewport } from "./useInViewport";
import { cn } from "shared/lib";
import { Button } from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

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
    if (!normalized || !fileName || !previewUrl) return;
    setDownloading(true);

    try {
      dispatch(setDownloadProgress({ key: `dw${normalized}`, pct: 100 }));
      const a = document.createElement("a");
      a.href = previewUrl;
      a.download = fileName;
      a.click();

      setTimeout(() => {
        dispatch(clearDownloadProgress(`dw${normalized}`));
      }, 300);
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
                  <MaterialIcon
                    iconName="progress_activity"
                    className={cn("text-gray-400 animate-spin", {
                      visible: previewLoading,
                      hidden: !previewLoading,
                    })}
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
                <MaterialIcon
                  iconName="progress_activity"
                  className="text-blue-600 animate-spin"
                />
              );
            }
          })()
        ) : (
          <Button variant={"ghost"} onClick={onDownloadClick} className="p-1">
            <MaterialIcon iconName="download" />
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
        <MaterialIcon iconName="draft" fill={1} className="text-blue-600" />
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
              <MaterialIcon
                iconName="progress_activity"
                className="text-blue-600 animate-spin"
              />
            );
          }
        })()
      ) : (
        <Button variant={"ghost"} onClick={onDownloadClick} className="p-1">
          <MaterialIcon iconName="download" />
        </Button>
      )}
    </div>
  );
};

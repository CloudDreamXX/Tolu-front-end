import { useLazyGetUploadedChatFileQuery } from "entities/chat/api";
import {
  clearDownloadProgress,
  setDownloadProgress,
} from "entities/chat/downloadSlice";
import { fileKeyFromUrl } from "entities/chat/helpers";
import { RootState } from "entities/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useInViewport } from "./useInViewport";
import { cn, toast } from "shared/lib";
import { Button } from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import mammoth from "mammoth";

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

  const [previewOpen, setPreviewOpen] = useState(false);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const [triggerPreview] = useLazyGetUploadedChatFileQuery();

  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!isImage || !inView || !normalized || previewUrl) return;

    let cancelled = false;

    const loadPreview = async () => {
      setPreviewLoading(true);
      try {
        const result = await triggerPreview({ fileKey: normalized });
        if ("data" in result && result.data && !cancelled) {
          const url = URL.createObjectURL(result.data);
          setPreviewUrl(url);
        }
      } finally {
        if (!cancelled) setPreviewLoading(false);
      }
    };

    loadPreview();

    return () => {
      cancelled = true;
    };
  }, [isImage, inView, normalized]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const openPreview = async () => {
    if (!normalized) return;

    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewUrl(null);
    setDocxHtml(null);

    try {
      const result = await triggerPreview({ fileKey: normalized });

      if ("data" in result && result.data) {
        const blob = result.data;

        if (
          fileType ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const buffer = await blob.arrayBuffer();
          const { value } = await mammoth.convertToHtml({
            arrayBuffer: buffer,
          });
          setDocxHtml(value);
          return;
        }

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
    setPreviewOpen(false);
  };

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
      <>
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
                    <div className="flex items-center justify-center w-10 h-10 overflow-hidden rounded">
                      {previewLoading && (
                        <MaterialIcon
                          iconName="progress_activity"
                          className="text-gray-400 animate-spin"
                        />
                      )}

                      {!previewLoading && previewUrl && (
                        <img
                          src={previewUrl}
                          alt={fileName || "File preview"}
                          className="object-cover w-10 h-10"
                          loading="lazy"
                          decoding="async"
                        />
                      )}
                    </div>
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
            <div className="flex gap-[4px]">
              <Button variant="ghost" className="p-1" onClick={openPreview}>
                <MaterialIcon iconName="visibility" />
              </Button>
              <Button
                variant={"ghost"}
                onClick={onDownloadClick}
                className="p-1"
              >
                <MaterialIcon iconName="download" />
              </Button>
            </div>
          )}
        </div>
        {previewOpen && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50"
            onClick={closePreview}
          >
            <div
              className="bg-white w-full h-full rounded-[16px] shadow-xl overflow-hidden flex flex-col max-w-[70vw] max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-[18px] font-bold">
                  Preview <span>“{fileName}”</span>
                </h2>
                <Button variant="ghost" className="p-1" onClick={closePreview}>
                  <MaterialIcon iconName="close" />
                </Button>
              </div>

              <div className="relative flex-1 bg-[#F7F7F8] mx-5 mb-5 p-6 overflow-auto">
                <div className="m-auto h-full w-full bg-white rounded-[12px] shadow p-6">
                  {previewLoading && (
                    <div className="flex justify-center py-10">
                      <MaterialIcon
                        iconName="progress_activity"
                        className="animate-spin text-blue-600"
                      />
                    </div>
                  )}

                  {/* DOCX */}
                  {!previewLoading && docxHtml && (
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: docxHtml }}
                    />
                  )}

                  {/* Image */}
                  {!previewLoading &&
                    previewUrl &&
                    fileType?.startsWith("image/") && (
                      <img
                        src={previewUrl}
                        className="max-h-[70vh] mx-auto object-contain rounded"
                      />
                    )}

                  {/* Video */}
                  {!previewLoading &&
                    previewUrl &&
                    fileType === "video/mp4" && (
                      <video
                        src={previewUrl}
                        controls
                        className="w-full max-h-[70vh] rounded"
                      />
                    )}

                  {/* PDF */}
                  {!previewLoading &&
                    previewUrl &&
                    fileType === "application/pdf" && (
                      <iframe
                        src={previewUrl}
                        className="w-full h-[70vh] rounded border"
                      />
                    )}

                  {!previewLoading && !previewUrl && !docxHtml && (
                    <p className="text-center text-sm text-gray-500">
                      Preview not available
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
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
          <div className="flex gap-[4px]">
            <Button variant="ghost" className="p-1" onClick={openPreview}>
              <MaterialIcon iconName="visibility" />
            </Button>
            <Button variant={"ghost"} onClick={onDownloadClick} className="p-1">
              <MaterialIcon iconName="download" />
            </Button>
          </div>
        )}
      </div>
      {previewOpen && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50"
          onClick={closePreview}
        >
          <div
            className="bg-white w-full h-full rounded-[16px] shadow-xl overflow-hidden flex flex-col max-w-[70vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-[18px] font-bold">
                Preview <span>“{fileName}”</span>
              </h2>
              <Button variant="ghost" className="p-1" onClick={closePreview}>
                <MaterialIcon iconName="close" />
              </Button>
            </div>

            <div className="relative flex-1 bg-[#F7F7F8] mx-5 mb-5 p-6 overflow-auto">
              <div className="m-auto h-full w-full bg-white rounded-[12px] shadow p-6">
                {previewLoading && (
                  <div className="flex justify-center py-10">
                    <MaterialIcon
                      iconName="progress_activity"
                      className="animate-spin text-blue-600"
                    />
                  </div>
                )}

                {/* DOCX */}
                {!previewLoading && docxHtml && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: docxHtml }}
                  />
                )}

                {/* Image */}
                {!previewLoading &&
                  previewUrl &&
                  fileType?.startsWith("image/") && (
                    <img
                      src={previewUrl}
                      className="max-h-[70vh] mx-auto object-contain rounded"
                    />
                  )}

                {/* Video */}
                {!previewLoading && previewUrl && fileType === "video/mp4" && (
                  <video
                    src={previewUrl}
                    controls
                    className="w-full max-h-[70vh] rounded"
                  />
                )}

                {/* PDF */}
                {!previewLoading &&
                  previewUrl &&
                  fileType === "application/pdf" && (
                    <iframe
                      src={previewUrl}
                      className="w-full h-[70vh] rounded border"
                    />
                  )}

                {!previewLoading && !previewUrl && !docxHtml && (
                  <p className="text-center text-sm text-gray-500">
                    Preview not available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

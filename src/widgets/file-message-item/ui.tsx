import { FileMessage, useLazyGetUploadedChatFileQuery } from "entities/chat";
import { useGetUploadedChatFileUrlQuery } from "entities/chat/api";
import {
  clearDownloadProgress,
  setDownloadProgress,
} from "entities/chat/downloadSlice";
import { fileKeyFromUrl } from "entities/chat/helpers";
import { RootState } from "entities/store";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { toast } from "shared/lib";
import { Avatar, AvatarFallback, AvatarImage, Button } from "shared/ui";
interface FileMessageProps {
  message: FileMessage;
  avatar?: string;
}

export const FileMessageItem: React.FC<FileMessageProps> = ({
  message,
  avatar,
}) => {
  const [preview, setPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const dispatch = useDispatch();
  const profile = useSelector((state: RootState) => state.user?.user);
  const normalized = useMemo(
    () => fileKeyFromUrl(message.file_url ?? ""),
    [message.file_url]
  );
  const dlPct = useSelector(
    (state: RootState) => state.downloads.byKey[normalized]
  );

  const [loading, setLoading] = useState(false);

  const { data: fileObjectUrl } = useGetUploadedChatFileUrlQuery(
    { fileUrl: normalized },
    { skip: !normalized }
  );

  const [triggerPreview] = useLazyGetUploadedChatFileQuery();

  const onDownloadClick = async () => {
    if (!normalized || !message.file_name || !fileObjectUrl) return;
    setLoading(true);

    try {
      dispatch(setDownloadProgress({ key: normalized, pct: 100 }));

      const a = document.createElement("a");
      a.href = fileObjectUrl;
      a.download = message.file_name;
      a.click();

      setTimeout(() => {
        dispatch(clearDownloadProgress(normalized));
      }, 400);
    } finally {
      setLoading(false);
    }
  };

  const openPreview = async () => {
    if (!normalized) return;

    setPreview(true);
    setPreviewLoading(true);

    try {
      const result = await triggerPreview({ fileKey: normalized });

      if ("data" in result && result.data) {
        const url = URL.createObjectURL(result.data);
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

  const initials = (() => {
    const sender = message?.sender;
    if (!sender) return "UN";

    if (sender.first_name && sender.last_name) {
      return (
        `${sender.first_name?.[0] ?? ""}${sender.last_name?.[0] ?? ""}`.toUpperCase() ||
        "UN"
      );
    }

    if (sender.first_name) {
      return (sender.first_name.slice(0, 2) || "UN").toUpperCase();
    }

    if (sender.name) {
      const parts = sender.name.trim().split(" ").filter(Boolean);
      if (parts.length > 1) {
        return (
          parts
            .map((p) => p[0]?.toUpperCase() ?? "")
            .slice(0, 2)
            .join("") || "UN"
        );
      }
      return (parts[0]?.slice(0, 2) || "UN").toUpperCase();
    }

    return "UN";
  })();

  return (
    <div className="flex flex-col gap-2 bg-white border border-gray-200 py-2 px-3 rounded-lg w-full lg:w-[373px]">
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center justify-between gap-2">
          <MaterialIcon iconName="draft" fill={1} className="text-blue-600" />
          <div className="flex flex-col ">
            <span className="text-sm font-medium text-[#1D1D1F] lg:max-w-[250px] max-w-[150px] truncate">
              {message.file_name}
            </span>
            <span className="text-xs font-medium text-[#5F5F65]">
              {Math.round(message.file_size ? message.file_size / 1024 : 0)} KB
            </span>
          </div>
        </div>
        {loading ? (
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
          <div className="flex gap-[4px]">
            <Button
              variant="ghost"
              className="p-1"
              onClick={openPreview}
            >
              <MaterialIcon iconName="visibility" />
            </Button>
            <Button variant={"ghost"} onClick={onDownloadClick} className="p-1">
              <MaterialIcon iconName="download" />
            </Button>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-xs font-normal text-[#5F5F65]">Author</p>
        <div className="flex items-center gap-2">
          {profile?.email !== message.sender.email && (
            <Avatar className="w-5 h-5 ">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-xs bg-slate-300">
                {initials}
              </AvatarFallback>
            </Avatar>
          )}
          <p className="text-xs font-semibold text-[#1D1D1F]">
            {profile?.email === message.sender.email
              ? "You"
              : message.sender.name}
          </p>
        </div>
      </div>

      {preview && (
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
                Preview <span>“{message.file_name}”</span>
              </h2>
              <Button variant="unstyled" onClick={closePreview}>
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

                {!previewLoading && previewUrl && (
                  <>
                    {message.file_type.startsWith("image/") && (
                      <img
                        src={previewUrl}
                        className="max-h-[70vh] m-auto object-contain rounded"
                      />
                    )}

                    {message.file_type === "video/mp4" && (
                      <video
                        src={previewUrl}
                        controls
                        className="w-full max-h-[70vh] rounded"
                      />
                    )}

                    {message.file_type === "application/pdf" && (
                      <iframe
                        src={previewUrl}
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

import { FileMessage } from "entities/chat";
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
import { Avatar, AvatarFallback, AvatarImage, Button } from "shared/ui";
interface FileMessageProps {
  message: FileMessage;
  avatar?: string;
}

export const FileMessageItem: React.FC<FileMessageProps> = ({
  message,
  avatar,
}) => {
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
    <div className="flex flex-col gap-2 bg-[#F3F6FB] py-2 lg:px-3 rounded-lg w-full lg:w-[373px]">
      <div className="flex items-center justify-between gap-4">
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
          <Button variant={"ghost"} onClick={onDownloadClick} className="p-1">
            <MaterialIcon iconName="download" />
          </Button>
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
    </div>
  );
};

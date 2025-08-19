import { ChatService, FileMessage } from "entities/chat";
import {
  clearDownloadProgress,
  setDownloadProgress,
} from "entities/chat/downloadSlice";
import { fileKeyFromUrl } from "entities/chat/helpers";
import { RootState } from "entities/store";
import { CloudDownload, File, Loader2Icon } from "lucide-react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const onDownloadClick = async () => {
    if (!normalized || !message.file_name || !message.file_type) return;

    setLoading(true);
    try {
      const blob = await ChatService.getUploadedChatFiles(normalized, (pct) => {
        dispatch(setDownloadProgress({ key: normalized, pct }));
      });
      const objUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objUrl;
      a.download = message.file_name;
      a.click();
      URL.revokeObjectURL(objUrl);
      dispatch(clearDownloadProgress(normalized));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 bg-[#F3F6FB] py-2 lg:px-3 rounded-lg w-full lg:w-[373px]">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-between gap-2">
          <File width={22} height={22} color="#1C63DB" />
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
      <div className="flex flex-col gap-1">
        <p className="text-xs font-normal text-[#5F5F65]">Author</p>
        <div className="flex items-center gap-2">
          {profile?.email !== message.sender.email && (
            <Avatar className="w-5 h-5 ">
              <AvatarImage src={avatar} />
              <AvatarFallback className="text-xs bg-slate-300">
                {message.sender.name.slice(0, 2).toLowerCase() || "un"}
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

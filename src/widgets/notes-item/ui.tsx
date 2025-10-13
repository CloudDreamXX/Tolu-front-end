import { ChatNoteResponse } from "entities/chat";
import { useGetUploadedChatFileUrlQuery } from "entities/chat/api";
import {
  clearDownloadProgress,
  setDownloadProgress,
} from "entities/chat/downloadSlice";
import { fileKeyFromUrl } from "entities/chat/helpers";
import { RootState } from "entities/store";
import { memo, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";
import { toUserTZ } from "widgets/message-tabs/helpers";

const formatBytes = (bytes?: number) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

const FileBadge = ({
  fi,
}: {
  fi: NonNullable<ChatNoteResponse["file_info"]>;
}) => {
  const dispatch = useDispatch();
  const normalized = useMemo(
    () =>
      fileKeyFromUrl(fi.file_url ?? "")
        .split(".")
        .shift(),
    [fi.file_url]
  );

  const [loading, setLoading] = useState(false);

  const isImage = fi.file_type?.startsWith("image/");
  const dlwPct = useSelector(
    (state: RootState) => state.downloads.byKey[`dw${normalized}`]
  );

  const { data: fileObjectUrl } = useGetUploadedChatFileUrlQuery(
    { fileUrl: normalized ?? "" },
    { skip: !normalized }
  );

  const onDownloadClick = async () => {
    if (!fileObjectUrl || !normalized) return;

    setLoading(true);
    try {
      dispatch(setDownloadProgress({ key: `dw${normalized}`, pct: 100 }));

      const a = document.createElement("a");
      a.href = fileObjectUrl;
      a.download = fi.file_name;
      a.click();

      setTimeout(() => {
        dispatch(clearDownloadProgress(`dw${normalized}`));
      }, 400);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={loading}
      value="ghost"
      className="inline-flex items-center gap-2 px-2 py-1 transition bg-gray-100 rounded-lg group hover:bg-gray-200"
      title={fi.file_name}
      onClick={onDownloadClick}
    >
      <MaterialIcon
        iconName={isImage ? "docs" : "folder"}
        className="w-4 h-4 text-black"
      />
      <span className="text-sm text-gray-800 truncate max-w-[220px]">
        {fi.file_name}
      </span>
      <span className="text-xs text-gray-500">{formatBytes(fi.file_size)}</span>
      {loading && dlwPct ? (
        <span className="text-sm text-black">{dlwPct}%</span>
      ) : (
        <MaterialIcon
          iconName="download"
          className="w-4 h-4 text-black opacity-70 group-hover:opacity-100"
        />
      )}
    </Button>
  );
};

export const NoteItem = memo(function NoteItem({
  note,
  onEdit,
  onDelete,
}: {
  note: ChatNoteResponse;
  onEdit: (id: string, content: string, title: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex justify-between gap-3 p-3 mb-5 bg-white border border-gray-200 shadow-sm rounded-xl">
      <div className="min-w-0">
        {note.title && (
          <h4 className="mb-1 text-sm font-semibold text-gray-900 truncate">
            {note.title}
          </h4>
        )}
        {note.content && (
          <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">
            {note.content}
          </p>
        )}
        {!!note.file_info?.file_url && (
          <div className="mt-2">
            <FileBadge fi={note.file_info} />
          </div>
        )}
        <p className="mt-2 text-xs text-gray-500">
          • Created: {toUserTZ(note.created_at).toLocaleString()}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          • Updated: {toUserTZ(note.updated_at).toLocaleString()}
        </p>
      </div>

      <div className="flex items-start flex-shrink-0 gap-1">
        <Button
          value="ghost"
          aria-label="Edit"
          onClick={() => onEdit(note.id, note.content, note.title)}
        >
          <MaterialIcon iconName="edit" className="w-4 h-4 p-0 text-black" />
        </Button>
        <Button
          value="ghost"
          aria-label="Delete"
          onClick={() => onDelete(note.id)}
        >
          <MaterialIcon
            iconName="delete"
            fill={1}
            className="w-4 h-4 p-0 text-red-500"
          />
        </Button>
      </div>
    </div>
  );
});

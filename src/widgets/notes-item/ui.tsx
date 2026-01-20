import { ChatNoteResponse } from "entities/chat";
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
import { useLazyGetUploadedNoteFileQuery } from "entities/chat/api";
import mammoth from "mammoth";
import { toast } from "shared/lib";

const formatBytes = (bytes?: number) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

export const FileBadge = ({
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

  const isImage = fi.file_type?.startsWith("image/");
  const dlwPct = useSelector(
    (state: RootState) => state.downloads.byKey[`dw${normalized}`]
  );

  const [loading, setLoading] = useState(false);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [docxHtml, setDocxHtml] = useState<string | null>(null);

  const [triggerPreview] = useLazyGetUploadedNoteFileQuery();
  const user = useSelector((state: RootState) => state.user.user);
  console.log(user)

  const openPreview = async () => {
    if (!normalized || !user?.id) return;

    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewUrl(null);
    setDocxHtml(null);

    try {
      const result = await triggerPreview({
        userId: user?.id,
        fileKey: normalized,
      });

      if ("data" in result && result.data) {
        const blob = result.data;

        if (
          fi.file_type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
          const buffer = await blob.arrayBuffer();
          const { value } = await mammoth.convertToHtml({
            arrayBuffer: buffer,
          });
          setDocxHtml(value);
          return;
        }

        setPreviewUrl(URL.createObjectURL(blob));
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
    if (!previewUrl || !normalized) return;

    setLoading(true);
    try {
      dispatch(setDownloadProgress({ key: `dw${normalized}`, pct: 100 }));

      const a = document.createElement("a");
      a.href = previewUrl;
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
    <>
      <Button
        disabled={loading}
        value="ghost"
        className="inline-flex items-center justify-center gap-2 px-2 py-1 transition bg-gray-100 rounded-lg group hover:bg-gray-200"
        title={fi.file_name}
      >
        <MaterialIcon
          iconName={isImage ? "docs" : "folder"}
          className="text-black"
        />

        <span className="text-sm text-gray-800 truncate max-w-[220px]">
          {fi.file_name}
        </span>

        <span className="text-xs text-gray-500">
          {formatBytes(fi.file_size)}
        </span>

        {loading && dlwPct ? (
          <span className="text-sm text-black">{dlwPct}%</span>
        ) : (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              className="p-1 text-gray-800 h-fit"
              onClick={openPreview}
            >
              <MaterialIcon iconName="visibility" />
            </Button>

            <Button
              variant="ghost"
              className="p-1 text-gray-800 h-fit"
              onClick={onDownloadClick}
            >
              <MaterialIcon iconName="download" />
            </Button>
          </div>
        )}
      </Button>

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
                Preview <span>“{fi.file_name}”</span>
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

                {!previewLoading && docxHtml && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: docxHtml }}
                  />
                )}

                {!previewLoading &&
                  previewUrl &&
                  fi.file_type?.startsWith("image/") && (
                    <img
                      src={previewUrl}
                      className="max-h-[70vh] mx-auto object-contain rounded"
                    />
                  )}

                {!previewLoading &&
                  previewUrl &&
                  fi.file_type === "video/mp4" && (
                    <video
                      src={previewUrl}
                      controls
                      className="w-full max-h-[70vh] rounded"
                    />
                  )}

                {!previewLoading &&
                  previewUrl &&
                  fi.file_type === "application/pdf" && (
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
          onClick={() => onEdit(note.id, note.title, note.content)}
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

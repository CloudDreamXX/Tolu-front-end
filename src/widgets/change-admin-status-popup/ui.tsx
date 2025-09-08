import { useMemo, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

type Props = {
  action: "approve" | "reject" | "unpublish" | "Waiting";
  onClose: () => void;
  onSave: (comment?: string, reason?: string) => void;
};

export const ChangeAdminStatusPopup: React.FC<Props> = ({
  action,
  onClose,
  onSave,
}) => {
  const [comment, setComment] = useState("");
  const [unpublishReason, setUnpublishReason] = useState("");

  const title = useMemo(
    () =>
      action === "approve"
        ? "Approve Content"
        : action === "reject"
          ? "Reject Content"
          : action === "unpublish"
            ? "Unpublish Content"
            : "Request an approval",
    [action]
  );

  const canSubmit =
    (action === "unpublish" && unpublishReason.trim().length > 0) || true;

  return (
    <dialog
      className="fixed inset-0 z-[999] flex items-center w-full h-full justify-center bg-black/30 backdrop-blur-sm"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-[#F9FAFB] rounded-[18px] w-[742px] px-[24px] py-[24px] flex flex-col gap-[24px] relative mx-[16px]">
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px]"
          aria-label="Close modal"
        >
          <MaterialIcon iconName="close" />
        </button>

        <h3
          id="modal-title"
          className="text-[20px] font-semibold text-[#1D1D1F] flex items-center gap-[16px]"
        >
          {title}
        </h3>
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Comment (optional)
          </span>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-300 p-2 outline-none resize-none"
            placeholder="Add a note for the creator…"
          />
        </label>

        {action === "unpublish" && (
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Unpublish reason <span className="text-red-600">*</span>
            </span>
            <textarea
              value={unpublishReason}
              onChange={(e) => setUnpublishReason(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 p-2 outline-none resize-none"
              placeholder="Why are you unpublishing this content?"
              required
            />
          </label>
        )}

        <div className="flex items-center justify-between gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-[16px] py-[11px] rounded-[1000px] bg-[#DDEBF6] text-[#1C63DB] w-full md:w-[128px] text-[16px] font-[600] leading-[22px] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-[16px] py-[11px] rounded-[1000px] w-full md:w-[128px] text-[16px] font-[600] leading-[22px] bg-[#1C63DB] text-white disabled:opacity-50 flex items-center justify-center"
            onClick={() =>
              onSave(
                comment,
                unpublishReason !== "" ? unpublishReason : undefined
              )
            }
          >
            Save
          </button>
        </div>
      </div>
    </dialog>
  );
};

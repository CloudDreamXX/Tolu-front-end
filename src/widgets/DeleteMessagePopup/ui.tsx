import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

type Props = {
  contentId: string;
  onCancel: () => void;
  onDelete: (contentId: string) => Promise<void>;
  title?: string;
  text?: string;
};

export const DeleteMessagePopup: React.FC<Props> = ({
  contentId,
  onCancel,
  onDelete,
  title,
  text,
}) => {
  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#F9FAFB] rounded-[12px] p-[24px] md:max-w-[500px] lg:max-w-[742px] w-full shadow-lg mx-[16px] relative">
        <button
          className="absolute top-[16px] right-[16px]"
          aria-label="Close modal"
          onClick={onCancel}
        >
          <MaterialIcon iconName="close" />
        </button>
        <h2 className="text-[20px] font-[700] text-[#FF1F0F] flex md:items-center gap-[10px] md:gap-[8px] mb-[12px]">
          <MaterialIcon iconName="delete" className="text-[#FF1F0F]" />
          {title ? title : "Delete folder?"}
        </h2>
        <p className="text-[16px] text-[#5F5F65] font-[500] mb-[24px]">
          {text
            ? text
            : "Are you sure you want to delete this folder? This action cannot be undone."}
        </p>
        <div className="flex justify-between gap-[8px]">
          <button
            className="p-[16px] py-[10px] w-[128px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-[16px] py-[10px] w-[128px] rounded-[1000px] bg-[#FF1F0F] text-white text-[16px] font-semibold"
            onClick={() => onDelete(contentId)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

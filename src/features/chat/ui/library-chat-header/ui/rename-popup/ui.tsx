import Close from "shared/assets/icons/close";
import { Input } from "shared/ui";

export const RenamePopup = ({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: () => void;
}) => (
  <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-50">
    <div className="mt-auto md:mt-0 bg-[#FFF] rounded-t-[18px] md:rounded-[12px] p-[24px] md:max-w-[500px] lg:max-w-[742px] w-full shadow-lg md:mx-[16px] relative">
      <button
        className="absolute top-[16px] right-[16px]"
        aria-label="Close modal"
        onClick={onCancel}
      >
        <Close />
      </button>
      <h2 className="text-[20px] font-semibold text-[#1D1D1F] mb-[24px]">
        Rename this chat
      </h2>
      <p className="text-[16px] font-[500] text-[#1D1D1F] mb-[10px]">
        Chat name change to
      </p>
      <Input className="text-[16px] font-[500]" />
      <div className="flex justify-between gap-[8px] mt-[24px]">
        <button
          className="p-[16px] py-[10px] w-[128px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-[16px] py-[10px] w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
          onClick={onSave}
        >
          Save
        </button>
      </div>
    </div>
  </div>
);

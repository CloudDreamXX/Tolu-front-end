export const ConfirmDiscardModal = ({
  onCancel,
  onDiscard,
}: {
  onCancel: () => void;
  onDiscard: () => void;
}) => (
  <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-[9999]">
    <div className="bg-[#F9FAFB] rounded-[12px] p-[24px] md:max-w-[500px] lg:max-w-[742px] w-full shadow-lg mx-[16px]">
      <h2 className="text-[20px] font-semibold text-[#1D1D1F] mb-[12px]">
        Discard changes?
      </h2>
      <p className="text-[14px] text-[#5F5F65] font-[500] mb-[24px]">
        You’re about to cancel the changes made to this user’s information.
        Unsaved data will be lost.
      </p>
      <div className="flex justify-between gap-[8px] md:gap-[16px]">
        <button
          className="p-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className="px-[16px] py-[10px] w-full md:w-[128px] rounded-[1000px] bg-[#FF1F0F] text-white text-[16px] font-semibold"
          onClick={onDiscard}
        >
          Discard
        </button>
      </div>
    </div>
  </div>
);

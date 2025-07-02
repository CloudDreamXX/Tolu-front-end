import Close from "shared/assets/icons/close";
import { Button } from "shared/ui";

export const ConfirmCancel = ({
  onCancel,
  onDiscard,
}: {
  onCancel: () => void;
  onDiscard: () => void;
}) => (
  <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#F9FAFB] rounded-[12px] p-[24px] md:max-w-[500px] lg:max-w-[742px] w-full shadow-lg mx-[16px] relative">
      <button className="absolute top-[16px] right-[16px]" onClick={onCancel}>
        <Close />
      </button>
      <h2 className="text-[24px] font-semibold text-[#1D1D1F] mb-[12px]">
        Are you sure you want to leave personalization?
      </h2>
      <p className="text-[16px] text-[#5F5F65] font-[500] mb-[24px]">
        Sad to see you go! We’ve saved your progress so you can come back and
        finish anytime that works for you.
      </p>
      <div className="flex justify-between gap-[16px]">
        <Button variant="light-blue" onClick={onCancel}>
          Back to personalization
        </Button>
        <Button variant="brightblue" onClick={onDiscard}>
          Leave anyway
        </Button>
      </div>
    </div>
  </div>
);

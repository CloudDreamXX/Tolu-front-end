import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";

export const ConfirmCancelModal = ({
  title,
  description,
  backTitle,
  continueTitle,
  onCancel,
  onDiscard,
  onClose,
}: {
  title: string;
  description: string;
  backTitle: string;
  continueTitle: string;
  onCancel: () => void;
  onClose?: () => void;
  onDiscard: () => void;
}) => (
  <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#F9FAFB] rounded-[12px] p-[24px] lg:max-w-[742px] w-full shadow-lg mx-[24px] relative">
      <button
        className="absolute top-[16px] right-[16px]"
        onClick={onClose ? onClose : onCancel}
      >
        <MaterialIcon iconName="close" />
      </button>
      <h2 className="text-[24px] font-semibold text-[#1D1D1F] mb-[12px]">
        {title}
      </h2>
      <p className="text-[16px] text-[#5F5F65] font-[500] mb-[24px]">
        {description}
      </p>
      <div className="flex justify-between gap-[16px]">
        <Button variant="light-blue" onClick={onCancel}>
          {backTitle}
        </Button>
        <Button variant="brightblue" onClick={onDiscard}>
          {continueTitle}
        </Button>
      </div>
    </div>
  </div>
);

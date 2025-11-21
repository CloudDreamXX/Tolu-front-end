import { useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button, Input } from "shared/ui";

export const RenamePopup = ({
  onCancel,
  onSave,
}: {
  onCancel: () => void;
  onSave: (title: string) => void;
}) => {
  const [title, setTitle] = useState<string>("");

  const onTitleChange = (value: string) => {
    setTitle(value);
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] backdrop-blur-sm flex items-center justify-center z-50">
      <div className="mt-auto md:mt-0 bg-[#FFF] rounded-t-[18px] md:rounded-[12px] p-[24px] md:max-w-[500px] lg:max-w-[742px] w-full shadow-lg md:mx-[16px] relative">
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          className="absolute top-[16px] right-[16px]"
          aria-label="Close modal"
          onClick={onCancel}
        >
          <MaterialIcon iconName="close" />
        </Button>
        <h2 className="text-[20px] font-semibold text-[#1D1D1F] mb-[24px]">
          Rename this chat
        </h2>
        <p className="text-[16px] font-[500] text-[#1D1D1F] mb-[10px]">
          Chat name change to
        </p>
        <Input
          className="text-[16px] font-[500]"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <div className="flex justify-between gap-[8px] mt-[24px]">
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="p-[16px] py-[10px] w-[128px] rounded-[1000px] bg-[#D6ECFD] text-[#1C63DB] text-[16px] font-semibold"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            className="px-[16px] py-[10px] w-[128px] rounded-[1000px] bg-[#1C63DB] text-white text-[16px] font-semibold"
            onClick={() => onSave(title)}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

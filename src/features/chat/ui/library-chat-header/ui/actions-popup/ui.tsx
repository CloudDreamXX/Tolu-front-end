import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export const ActionsPopup: React.FC<Props> = ({ onEdit, onDelete }) => {
  return (
    <div
      className={`absolute z-50 w-[238px] p-[16px_14px] flex flex-col items-start gap-[16px]
             bg-white rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] top-[160px] md:top-[70px] right-[16px]`}
    >
      <MenuItem
        icon={<MaterialIcon iconName="edit" fill={1} />}
        label="Rename this chat"
        onClick={onEdit}
      />

      <MenuItem
        icon={<MaterialIcon iconName="delete" fill={1} />}
        label="Delete this chat"
        className="text-[#FF1F0F]"
        onClick={onDelete}
      />
    </div>
  );
};

const MenuItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  className?: string;
  onClick?: () => void;
}> = ({ icon, label, className = "", onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 w-full text-left text-[16px] font-[500] ${className}`}
  >
    <span className="w-[24px] h-[24px]">{icon}</span>
    {label}
  </button>
);

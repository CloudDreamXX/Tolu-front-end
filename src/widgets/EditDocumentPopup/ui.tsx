import { Archive } from "lucide-react";
import Edit from "shared/assets/icons/edit";
import { Eye } from "shared/assets/icons/eye";
import Save from "shared/assets/icons/save";
import Dublicate from "shared/assets/icons/dublicate";
import ArrowRight from "shared/assets/icons/arrow-right";
import Trash from "shared/assets/icons/trash-icon";

type Props = {
  onEdit: () => void;
  onMove: () => void;
  onDublicate: () => void;
  onMarkAs: () => void;
  onArchive: () => void;
  onDelete: () => void;
  position: { top: number; left: number };
  type?: "folder" | "subfolder" | "video" | "voice" | "content";
};

export const EditDocumentPopup: React.FC<Props> = ({
  onEdit,
  onMove,
  onDublicate,
  onMarkAs,
  onArchive,
  onDelete,
  position,
  type,
}) => {
  return (
    <div
      className="absolute z-50 w-[238px] p-[16px_14px] flex flex-col items-start gap-[16px]
             bg-white rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
      style={{
        top:
          type === "subfolder"
            ? position.top - 200 + window.scrollY
            : position.top - 280 + window.scrollY,
        left: position.left - 210,
      }}
    >
      <MenuItem icon={<Edit />} label="Edit" onClick={onEdit} />
      {type !== "subfolder" && (
        <MenuItem icon={<ArrowRight />} label="Move" onClick={onMove} />
      )}
      <MenuItem icon={<Dublicate />} label="Duplicate" onClick={onDublicate} />
      {type !== "subfolder" && (
        <MenuItem
          icon={<Eye width={24} height={24} />}
          label="Mark as"
          onClick={onMarkAs}
        />
      )}
      <div className="h-[1px] w-full bg-[#E3E3E3]" />
      <MenuItem
        icon={<Archive size={24} />}
        label="Archive"
        onClick={onArchive}
      />
      <MenuItem
        icon={<Trash />}
        label="Delete"
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

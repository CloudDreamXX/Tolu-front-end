import { ChevronDown } from "lucide-react";
import { formatDateToSlash } from "shared/lib";
import Dots from "shared/assets/icons/dots";
import { TableRow } from "../../models";
import { getIcon } from "../../lib/lib";
import DocumentIcon from "shared/assets/icons/document";
import { useNavigate } from "react-router-dom";

interface LibraryItemCardProps {
  item: TableRow;
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
  level: number;
  onClick?: (e: any) => void;
}

export const LibraryItemCard: React.FC<LibraryItemCardProps> = ({
  item,
  expandedFolders,
  toggleFolder,
  level,
  onClick
}) => {
  const hasChildren =
    (item.subfolders && item.subfolders.length > 0) ||
    (item.content && item.content.length > 0)
  const isExpanded = expandedFolders.has(item.id) || (item.messages && item.messages.length > 0);

  const truncateTitle = (title: string) => {
    const words = title.trim().split(/\s+/);
    return words.length > 3 ? `${words.slice(0, 3).join(' ')}...` : title;
  };

  const nav = useNavigate();

  return (
    <div className="border border-[#AAC6EC] rounded-[8px] p-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#AAC6EC1A] p-[8px] rounded-[4px]" onClick={onClick}>
        <div className="flex items-center gap-[8px]">
          {hasChildren && (
            <ChevronDown
              className={`cursor-pointer w-[20px] h-[20px] transition-transform duration-200 ${isExpanded ? "rotate-180" : ""
                }`}
              onClick={() => toggleFolder(item.id)}
            />
          )}
          <div className="flex items-center gap-2">
            {getIcon(item.type)}
            <span className="text-lg font-semibold">{truncateTitle(item.title)}</span>
          </div>
        </div>
        <button>
          <Dots color="#1D1D1F" />
        </button>
      </div>

      <div className="mt-[8px]">
        <DetailRow label="Q-ty" value={`${item.filesCount ?? 0} Items`} />
        <DetailRow
          label="Created"
          value={formatDateToSlash(new Date(item.createdAt))}
        />
        <DetailRow label="Reviewers" value={item.reviewers} />
        <DetailRow label="Price" value={item.price} />
        <DetailRow label="Status" value={item.status} isLast />
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {/* Subfolders */}
          {item.subfolders?.map((sub) => (
            <LibraryItemCard
              key={sub.id}
              item={sub}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              level={level + 1}
            />
          ))}

          {/* Content */}
          {item.content?.map((contentItem) => (
            <LibraryItemCard
              key={contentItem.id}
              item={contentItem}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              level={level + 1}
              onClick={(e) => {
                e.stopPropagation();
                nav(`/content-manager/library/folder/${item.id}/document/${contentItem.id}`);
              }}
            />
          ))}

          {/* Messages */}
          {item.messages?.map((msg) => (
            <div
              key={msg.id}
              className="border border-[#AAC6EC] rounded-[6px] p-3"
              onClick={(e) => {
                e.stopPropagation();
                nav(`/content-manager/library/folder/${item.id}/document/${msg.id}`);
              }}
            >
              <div className="flex items-center justify-between bg-[#AAC6EC1A] p-[8px] rounded-[4px]">
                <div className="flex items-center gap-[8px]">
                  <DocumentIcon className="text-[#4B5E6F]" />
                  <span className="text-md font-medium">{truncateTitle(msg.title)}</span>
                </div>
                <button>
                  <Dots color="#1D1D1F" />
                </button>
              </div>
              <div className="mt-2 space-y-[4px]">
                <DetailRow
                  label="Created"
                  value={formatDateToSlash(new Date(msg.createdAt))}
                />
                <DetailRow label="Reviewers" value={msg.reviewers ?? "-"} />
                <DetailRow label="Price" value={msg.price ?? "-"} />
                <DetailRow label="Status" value={msg.status ?? "-"} isLast />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: string | null;
  isLast?: boolean;
}

const DetailRow: React.FC<DetailRowProps> = ({
  label,
  value,
  isLast = false,
}) => {
  return (
    <div
      className={`py-[8px] flex items-center ${!isLast ? "border-b border-[#F3F6FB]" : ""
        }`}
    >
      <span className="text-[14px] text-[#5F5F65] w-full">{label}</span>
      <span className="text-[16px] text-[#000000] w-full">{value ?? "-"}</span>
    </div>
  );
};

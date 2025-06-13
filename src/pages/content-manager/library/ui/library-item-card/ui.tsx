import { ChevronDown } from "lucide-react";
import { formatDateToSlash } from "shared/lib";
import Dots from "shared/assets/icons/dots";
import { TableRow } from "../../models";
import { getIcon } from "../../lib/lib";

interface LibraryItemCardProps {
  item: TableRow;
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
  level: number;
}

export const LibraryItemCard: React.FC<LibraryItemCardProps> = ({
  item,
  expandedFolders,
  toggleFolder,
  level,
}) => {
  const hasChildren = item.subfolders?.length ?? item.content?.length;
  const isExpanded = expandedFolders.has(item.id);

  return (
    <div className="border border-[#AAC6EC] rounded-[8px] p-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between bg-[#AAC6EC1A] p-[8px] rounded-[4px]">
        <div className="flex items-center gap-[8px]">
          {hasChildren && (
            <ChevronDown
              className={`cursor-pointer w-[20px] h-[20px] transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
              onClick={() => toggleFolder(item.id)}
            />
          )}
          <div className="flex items-center gap-2">
            {getIcon(item.type)}
            <span className="text-lg font-semibold">{item.title}</span>
          </div>
        </div>
        <button>
          <Dots color="#1D1D1F" />
        </button>
      </div>

      {/* Details */}
      <div className="mt-[8px]">
        <DetailRow label="Q-ty" value={`${item.filesCount} Items`} />
        <DetailRow
          label="Created"
          value={formatDateToSlash(new Date(item.createdAt))}
        />
        <DetailRow label="Reviewers" value={item.reviewers} />
        <DetailRow label="Price" value={item.price} />
        <DetailRow label="Status" value={item.status} isLast />
      </div>

      {/* Children */}
      {isExpanded && (
        <div className="mt-4 space-y-4">
          {item.subfolders?.map((sub) => (
            <LibraryItemCard
              key={sub.id}
              item={sub}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              level={level + 1}
            />
          ))}
          {item.content?.map((content) => (
            <LibraryItemCard
              key={content.id}
              item={content}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              level={level + 1}
            />
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
      className={`py-[8px] flex items-center ${!isLast ? "border-b border-[#F3F6FB]" : ""}`}
    >
      <span className="text-[14px] text-[#5F5F65] w-full">{label}</span>
      <span className="text-[16px] text-[#000000] w-full">{value ?? "-"}</span>
    </div>
  );
};

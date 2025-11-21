import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { formatDateToSlash } from "shared/lib";
import { getIcon } from "../../lib/lib";
import { TableRow } from "../../models";
import { Button } from "shared/ui";

interface LibraryItemCardProps {
  item: TableRow;
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
  level: number;
  onClick?: (e: any) => void;
  onDotsClick: (row: TableRow, e: React.MouseEvent) => void;
}

export const LibraryItemCard: React.FC<LibraryItemCardProps> = ({
  item,
  expandedFolders,
  toggleFolder,
  level,
  onClick,
  onDotsClick,
}) => {
  const [popupRow, setPopupRow] = useState<TableRow | null>(null);
  const fileRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setPopupRow(null);
      }
    };

    if (popupRow) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popupRow]);

  const hasChildren =
    (item.subfolders && item.subfolders.length > 0) ||
    (item.content && item.content.length > 0);
  const isExpanded =
    expandedFolders.has(item.id) || (item.messages && item.messages.length > 0);

  const truncateTitle = (title: string) => {
    const words = title.trim().split(/\s+/);
    return words.length > 3 ? `${words.slice(0, 3).join(" ")}...` : title;
  };

  const nav = useNavigate();

  return (
    <div className="border border-[#AAC6EC] rounded-[8px] p-4 bg-white">
      {/* Header */}
      <Button
        variant={"unstyled"}
        size={"unstyled"}
        className="flex items-center justify-between bg-[#AAC6EC1A] p-[8px] rounded-[4px]"
        onClick={onClick}
      >
        <div className="flex items-center gap-[8px]">
          {hasChildren && (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              onClick={() => toggleFolder(item.id)}
            >
              <MaterialIcon
                iconName="keyboard_arrow_down"
                size={16}
                className={`cursor-pointer w-[20px] h-[20px] transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </Button>
          )}
          <div className="flex items-center gap-2">
            {getIcon(item.type)}
            <span className="text-lg font-semibold">
              {truncateTitle(item.title)}
            </span>
          </div>
        </div>
        <Button
          variant={"unstyled"}
          size={"unstyled"}
          onClick={(e) => {
            e.stopPropagation();
            onDotsClick?.(item, e);
          }}
        >
          <MaterialIcon iconName="more_vert" />
        </Button>
      </Button>

      <div className="mt-[8px]">
        <DetailRow
          label="Files"
          value={`${item.filesCount ?? 0} Files`}
          isClickable
          onClick={(e) => {
            e.stopPropagation();
            setPopupRow(item);
          }}
          ref={fileRef}
        />
        <DetailRow
          label="Created"
          value={formatDateToSlash(new Date(item.createdAt))}
        />
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
              onDotsClick={onDotsClick}
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
                nav(
                  `/content-manager/library/folder/${item.id}/document/${contentItem.id}`
                );
              }}
              onDotsClick={onDotsClick}
            />
          ))}

          {/* Messages */}
          {item.messages?.map((msg) => (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              key={msg.id}
              className="border border-[#AAC6EC] rounded-[6px] p-3"
              onClick={(e) => {
                e.stopPropagation();
                nav(
                  `/content-manager/library/folder/${item.id}/document/${msg.id}`
                );
              }}
            >
              <div className="flex items-center justify-between bg-[#AAC6EC1A] p-[8px] rounded-[4px]">
                <div className="flex items-center gap-[8px]">
                  <MaterialIcon iconName="docs" />
                  <span className="font-medium text-md">
                    {truncateTitle(msg.title)}
                  </span>
                </div>
                <Button
                  variant={"unstyled"}
                  size={"unstyled"}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDotsClick?.(item, e);
                  }}
                >
                  <MaterialIcon iconName="more_vert" />
                </Button>
              </div>
              <div className="mt-2 space-y-[4px]">
                <DetailRow
                  label="Created"
                  value={formatDateToSlash(new Date(msg.createdAt))}
                />
                <DetailRow label="Status" value={msg.status ?? "-"} isLast />
              </div>
            </Button>
          ))}
        </div>
      )}

      {popupRow && (
        <div
          ref={popupRef}
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm"
        >
          <div className="relative flex flex-col bg-white shadow-md border border-[#C7D7F9] rounded-[20px] p-[16px] w-full mx-4">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-[20px] font-[700] text-[#1D1D1F]">
                Files in "{popupRow.title}"
              </h2>
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                onClick={() => setPopupRow(null)}
              >
                <MaterialIcon iconName="close" />
              </Button>
            </div>

            <div className="overflow-y-auto" style={{ height: "179px" }}>
              <ul className="space-y-[10px]">
                {popupRow.fileNames?.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-[16px] text-[14px] text-[#1D1D1F] font-[500] "
                  >
                    <MaterialIcon iconName="docs" />
                    {item.filename}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DetailRowProps {
  label: string;
  value: string | null;
  isLast?: boolean;
  isClickable?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const DetailRow = React.forwardRef<HTMLDivElement, DetailRowProps>(
  ({ label, value, isLast = false, isClickable = false, onClick }, ref) => {
    return (
      <div
        ref={ref}
        className={`py-[8px] flex items-center ${
          !isLast ? "border-b border-[#F3F6FB]" : ""
        }`}
      >
        <span className="text-[14px] text-[#5F5F65] w-full">{label}</span>
        <span
          className={`text-[16px] w-full text-[#000000] ${isClickable ? "cursor-pointer underline" : ""}`}
          onClick={onClick}
        >
          {value ?? "-"}
        </span>
      </div>
    );
  }
);

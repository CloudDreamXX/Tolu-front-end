import { Fragment, useState } from "react";
import { ChevronDown } from "lucide-react";
import { formatDateToSlash } from "shared/lib";
import Dots from "shared/assets/icons/dots";
import { TableRow } from "../../models";
import { getIcon } from "../../lib/lib";
import { useNavigate } from "react-router-dom";
import DocumentIcon from "shared/assets/icons/document";
import { EditDocumentPopup } from "widgets/EditDocumentPopup";
import { CoachService } from "entities/coach";
import { RootState } from "entities/store";
import { useDispatch, useSelector } from "react-redux";
import { ChangeStatusPopup } from "widgets/ChangeStatusPopup";
import { FoldersService, setFolders } from "entities/folder";

interface LibraryDesktopViewProps {
  filteredItems: TableRow[];
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
}

export const LibraryDesktopView: React.FC<LibraryDesktopViewProps> = ({
  filteredItems,
  expandedFolders,
  toggleFolder,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [isMarkAsOpen, setIsMarkAsOpen] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();

  const handleDotsClick = (row: TableRow, event: React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    setSelectedRow(row);
    setPopupPosition({ top: rect.top, left: rect.left });
    setIsMenuOpen(!isMenuOpen);
  };

  const onStatusComplete = async (
    status:
      | "Raw"
      | "Ready for Review"
      | "Waiting"
      | "Second Review Requested"
      | "Ready to Publish"
      | "Live"
      | "Archived"
  ) => {
    const newStatus = {
      id: selectedRow?.id ?? "",
      status: status,
    };
    await CoachService.changeStatus(newStatus, token);

    const fetchFolders = async () => {
      try {
        const { folders, foldersMap } = await FoldersService.getFolders();
        dispatch(setFolders({ folders, foldersMap }));
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();

    setIsMarkAsOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl p-[24px] border border-[#E6E6E6] bg-white hidden md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-white text-[#5F5F65] text-left mb-[10px] font-[500]">
            <tr>
              <th className="pb-[24px] text-[18px] font-[500]">Type</th>
              <th className="pb-[24px] text-[18px] font-[500]">Title</th>
              <th className="pb-[24px] text-[18px] font-[500]">Files</th>
              <th className="pb-[24px] text-[18px] font-[500]">Created</th>
              <th className="pb-[24px] text-[18px] font-[500]">Status</th>
              <th className="pb-[24px] text-[18px] font-[500]"> </th>
            </tr>
          </thead>
          <tbody className="text-[#1D1D1F] bg-white">
            {filteredItems.map((row, index) => (
              <LibraryTableRow
                key={row.id}
                row={row}
                index={index}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                onDotsClick={handleDotsClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      {isMenuOpen && selectedRow && (
        <EditDocumentPopup
          onEdit={() => {}}
          onMove={() => {}}
          onDublicate={() => {}}
          onMarkAs={() => setIsMarkAsOpen(true)}
          onArchive={() => {}}
          onDelete={() => {}}
          position={popupPosition}
          type={selectedRow?.type}
        />
      )}
      {isMarkAsOpen && (
        <ChangeStatusPopup
          onClose={() => setIsMarkAsOpen(false)}
          onComplete={onStatusComplete}
          currentStatus={
            selectedRow!.status as
              | "Raw"
              | "Ready for Review"
              | "Waiting"
              | "Second Review Requested"
              | "Ready to Publish"
              | "Live"
              | "Archived"
          }
        />
      )}
    </>
  );
};

interface LibraryTableRowProps {
  row: TableRow;
  index: number;
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
  onDotsClick: (row: TableRow, event: React.MouseEvent) => void;
}

const LibraryTableRow: React.FC<LibraryTableRowProps> = ({
  row,
  index,
  expandedFolders,
  toggleFolder,
  onDotsClick,
}) => {
  const isExpanded = expandedFolders.has(row.id);
  const hasChildren = row.subfolders?.length ?? row.content?.length;
  const bgClass = index % 2 === 0 ? "bg-white" : "bg-[#AAC6EC1A]";

  return (
    <Fragment>
      {/* Main Row */}
      <tr className={`border-t border-[#E6E6E6] ${bgClass}`}>
        <td className="py-[12px] px-[8px] font-medium text-gray-700 w-[112px]">
          <div className="flex items-center w-24 gap-2">
            {hasChildren ? (
              <button
                onClick={() => toggleFolder(row.id)}
                className={`${isExpanded ? "rotate-[180deg]" : ""} cursor-pointer`}
              >
                <ChevronDown />
              </button>
            ) : (
              <span className="ml-6"></span>
            )}
            {getIcon(row.type)}
          </div>
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-black">
          {row.title}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
          {row.filesCount} Files
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
          {formatDateToSlash(new Date(row.createdAt))}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
          {row.status === "Raw" ? "Pending review" : row.status}
        </td>
        <td className="py-[12px] pr-[8px]"></td>
      </tr>

      {/* Children Rows */}
      {isExpanded && (
        <>
          {row.subfolders?.map((child) => (
            <SubfolderTableRow
              key={child.id}
              subfolder={child}
              parentIndex={index}
              expandedFolders={expandedFolders}
              toggleFolder={toggleFolder}
              folderId={row.id}
              onDotsClick={onDotsClick}
            />
          ))}
          {row.content?.map((item) => (
            <ContentTableRow
              key={item.id}
              content={item}
              parentIndex={index}
              paddingLeft="pl-[38px]"
              folderId={row.id}
              onDotsClick={onDotsClick}
            />
          ))}
        </>
      )}
    </Fragment>
  );
};

interface SubfolderTableRowProps {
  subfolder: TableRow;
  parentIndex: number;
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
  folderId: string;
  onDotsClick: (row: TableRow, event: React.MouseEvent) => void;
}

const SubfolderTableRow: React.FC<SubfolderTableRowProps> = ({
  subfolder,
  parentIndex,
  expandedFolders,
  folderId,
  toggleFolder,
  onDotsClick,
}) => {
  const isExpanded = expandedFolders.has(subfolder.id);
  const hasContent = subfolder.content?.length;
  const bgClass = parentIndex % 2 === 0 ? "bg-white" : "bg-[#AAC6EC1A]";

  return (
    <Fragment>
      {/* Subfolder Row */}
      <tr className={bgClass}>
        <td className="py-[12px] pr-[8px] pl-[38px] flex items-center gap-2">
          {hasContent ? (
            <button
              onClick={() => toggleFolder(subfolder.id)}
              className={`${isExpanded ? "rotate-[180deg]" : ""} cursor-pointer`}
            >
              <ChevronDown />
            </button>
          ) : (
            <span className="ml-6"></span>
          )}
          {getIcon(subfolder.type)}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-black">
          {subfolder.title}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
          {subfolder.filesCount} Files
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
          {formatDateToSlash(new Date(subfolder.createdAt))}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
          {subfolder.status === "Raw" ? "Pending review" : subfolder.status}
        </td>
        <td className="py-[12px] pr-[8px]">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDotsClick(subfolder, e);
            }}
          >
            <Dots />
          </button>
        </td>
      </tr>

      {/* Subfolder Content */}
      {isExpanded &&
        subfolder.content?.map((item) => (
          <ContentTableRow
            key={item.id}
            content={item}
            parentIndex={parentIndex}
            folderId={folderId}
            paddingLeft="pl-[68px]"
            onDotsClick={onDotsClick}
          />
        ))}
    </Fragment>
  );
};

interface ContentTableRowProps {
  content: TableRow;
  parentIndex: number;
  paddingLeft: string;
  folderId: string;
  onDotsClick: (row: TableRow, event: React.MouseEvent) => void;
}

const ContentTableRow: React.FC<ContentTableRowProps> = ({
  content,
  parentIndex,
  paddingLeft,
  folderId,
  onDotsClick,
}) => {
  const nav = useNavigate();
  const bgClass = parentIndex % 2 === 0 ? "bg-white" : "bg-[#AAC6EC1A]";
  const hasMessages = content.messages && content.messages.length > 0;

  return (
    <>
      <tr
        className={`${bgClass} cursor-pointer`}
        onClick={(e) => {
          e.stopPropagation();
          nav(
            `/content-manager/library/folder/${folderId}/document/${content.id}`
          );
        }}
      >
        <td className={`pl-3 pr-[18px] ${paddingLeft}`}>
          {getIcon(content.type, "ml-auto")}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-black">
          {content.title}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
          {(content.content &&
            content.content?.length > 0 &&
            content.content?.length) ||
            "-"}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
          {formatDateToSlash(new Date(content.createdAt))}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
          {content.status === "Raw" ? "Pending review" : content.status}
        </td>
        <td className="py-[12px] pr-[8px]">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onDotsClick(content, e);
            }}
          >
            <Dots />
          </div>
        </td>
      </tr>

      {hasMessages &&
        content.messages &&
        content.messages.map((msg) => (
          <tr
            key={msg.id}
            className={`${bgClass} cursor-pointer`}
            onClick={(e) => {
              e.stopPropagation();
              nav(
                `/content-manager/library/folder/${folderId}/document/${content.id}`
              );
            }}
          >
            <td className={`pl-[68px]`}>
              <DocumentIcon className="ml-auto" />
            </td>
            <td className="py-[12px] pl-[18px] pr-[8px] text-[18px] font-[500] text-black">
              {msg.title}
            </td>
            <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
              {(msg.content &&
                msg.content?.length > 0 &&
                msg.content?.length) ||
                "-"}
            </td>
            <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
              {formatDateToSlash(new Date(msg.created_at || ""))}
            </td>
            <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
              {msg.status === "Raw" ? "Pending review" : msg.status}
            </td>
            <td className="py-[12px] pr-[8px]">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDotsClick(msg, e);
                }}
              >
                <Dots />
              </button>
            </td>
          </tr>
        ))}
    </>
  );
};

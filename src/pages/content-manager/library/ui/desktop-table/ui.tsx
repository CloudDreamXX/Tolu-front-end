import { Fragment } from "react";
import { ChevronDown } from "lucide-react";
import { formatDateToSlash } from "shared/lib";
import Dots from "shared/assets/icons/dots";
import { TableRow } from "../../models";
import { getIcon } from "../../lib/lib";
import { DocumentEditPopover } from "entities/folder";
import { useNavigate } from "react-router-dom";

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
  return (
    <div className="overflow-x-auto rounded-2xl p-[24px] border border-[#E6E6E6] bg-white hidden md:block">
      <table className="min-w-full text-sm">
        <thead className="bg-white text-[#5F5F65] text-left mb-[10px] font-[500]">
          <tr>
            <th className="pb-[24px] text-[18px] font-[500]">Type</th>
            <th className="pb-[24px] text-[18px] font-[500]">Title</th>
            <th className="pb-[24px] text-[18px] font-[500]">Q-ty</th>
            <th className="pb-[24px] text-[18px] font-[500]">Created</th>
            <th className="pb-[24px] text-[18px] font-[500]">Reviewers</th>
            <th className="pb-[24px] text-[18px] font-[500]">Price</th>
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
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

interface LibraryTableRowProps {
  row: TableRow;
  index: number;
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
}

const LibraryTableRow: React.FC<LibraryTableRowProps> = ({
  row,
  index,
  expandedFolders,
  toggleFolder,
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
          {row.reviewers}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
          {row.price}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
          {row.status}
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
            />
          ))}
          {row.content?.map((item) => (
            <ContentTableRow
              key={item.id}
              content={item}
              parentIndex={index}
              paddingLeft="pl-[38px]"
              folderId={row.id}
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
}

const SubfolderTableRow: React.FC<SubfolderTableRowProps> = ({
  subfolder,
  parentIndex,
  expandedFolders,
  toggleFolder,
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
          {subfolder.reviewers}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
          {subfolder.price}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
          {subfolder.status}
        </td>
        <td className="py-[12px] pr-[8px]">
          <button>
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
            folderId={subfolder.id}
            paddingLeft="pl-[68px]"
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
}

const ContentTableRow: React.FC<ContentTableRowProps> = ({
  content,
  parentIndex,
  paddingLeft,
  folderId,
}) => {
  const nav = useNavigate();
  const bgClass = parentIndex % 2 === 0 ? "bg-white" : "bg-[#AAC6EC1A]";

  return (
    <tr
      className={bgClass}
      onClick={(e) => {
        e.stopPropagation();
        nav(
          `/content-manager/library/folder/${content.id}/document/${content.id}`
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
        {content.filesCount || "-"}
      </td>
      <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
        {formatDateToSlash(new Date(content.createdAt))}
      </td>
      <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
        {content.reviewers}
      </td>
      <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
        {content.price}
      </td>
      <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65]">
        {content.status}
      </td>
      <td className="py-[12px] pr-[8px]">
        <div>
          <Dots />
        </div>
      </td>
    </tr>
  );
};

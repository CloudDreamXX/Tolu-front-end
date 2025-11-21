import { IFolder } from "entities/folder";
import { RootState } from "entities/store";
import { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import ReadyForReview from "shared/assets/icons/ready-for-review";
import { formatDateToSlash } from "shared/lib";
import { ChangeStatusPopup } from "widgets/ChangeStatusPopup";
import { ChooseSubfolderPopup } from "widgets/ChooseSubfolderPopup";
import { DeleteMessagePopup } from "widgets/DeleteMessagePopup";
import { EditDocumentPopup } from "widgets/EditDocumentPopup";
import { getIcon } from "../../lib/lib";
import { TableRow } from "../../models";
import { Button } from "shared/ui";

type LibraryDesktopViewProps = {
  filteredItems: TableRow[];
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
  selectedRow: TableRow | null;
  isMenuOpen: boolean;
  popupPosition: { top: number; left: number };
  isMarkAsOpen: boolean;
  isDeleteOpen: boolean;
  isDublicateOpen: boolean;
  isMoveOpen: boolean;
  isImproveOpen: boolean;
  idToDuplicate: string;
  folders: RootState["folder"]["folders"];

  onDotsClick: (row: TableRow, e: React.MouseEvent) => void;
  onStatusComplete: (
    status:
      | "Raw"
      | "Ready for Review"
      | "Waiting"
      | "Second Review Requested"
      | "Ready to Publish"
      | "Live"
      | "Archived"
  ) => Promise<void>;
  onDeleteClick: (id: string) => Promise<void>;
  onDuplicateClick: (id: string) => void;
  onDuplicateAndMoveClick: (id: string, subfolderId: string) => Promise<void>;
  onMoveClick: (id: string, subfolderId: string) => Promise<void>;

  setIsMarkAsOpen: (v: boolean) => void;
  setIsDeleteOpen: (v: boolean) => void;
  setIsDublicateOpen: (v: boolean) => void;
  setIsMoveOpen: (v: boolean) => void;
  setIsImproveOpen: (v: boolean) => void;
  setSelectedRow: (row: TableRow | null) => void;
  setPopupPosition: (coords: { top: number; left: number }) => void;
};

export const LibraryDesktopView: React.FC<LibraryDesktopViewProps> = ({
  filteredItems,
  expandedFolders,
  toggleFolder,
  selectedRow,
  isMenuOpen,
  popupPosition,
  isMarkAsOpen,
  isDeleteOpen,
  isDublicateOpen,
  isMoveOpen,
  isImproveOpen,
  idToDuplicate,
  folders,

  onDotsClick,
  onStatusComplete,
  onDeleteClick,
  onDuplicateClick,
  onDuplicateAndMoveClick,
  onMoveClick,

  setIsMarkAsOpen,
  setIsDeleteOpen,
  setIsDublicateOpen,
  setIsMoveOpen,
  setIsImproveOpen,
}) => {
  const findParentFolderId = (
    folders: IFolder[],
    targetId: string
  ): string | null => {
    for (const folder of folders) {
      if (folder.id === targetId) return folder.id;

      if (folder.subfolders?.some((sf) => sf.id === targetId)) {
        return folder.id;
      }

      if (folder.content?.some((c) => c.id === targetId)) {
        return folder.id;
      }

      for (const subfolder of folder.subfolders ?? []) {
        if (subfolder.content?.some((c) => c.id === targetId)) {
          return folder.id;
        }
        for (const msg of subfolder.content ?? []) {
          if (msg.messages?.some((m) => m.id === targetId)) {
            return folder.id;
          }
        }
      }
    }
    return null;
  };

  return (
    <>
      <div className="overflow-x-auto rounded-2xl p-[24px] w-full border border-[#E6E6E6] bg-white hidden md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-white text-[#5F5F65] text-left mb-[10px] font-[500]">
            <tr>
              <th className="pb-[24px] text-[14px] xl:text-[18px]  font-[500]">
                Type
              </th>
              <th className="pb-[24px] text-[14px] xl:text-[18px]  font-[500]">
                Title
              </th>
              <th className="pb-[24px] text-[14px] xl:text-[18px]  font-[500]">
                Files
              </th>
              <th className="pb-[24px] text-[14px] xl:text-[18px]  font-[500]">
                Created
              </th>
              <th className="pb-[24px] text-[14px] xl:text-[18px]  font-[500]">
                Status
              </th>
              <th className="pb-[24px] text-[14px] xl:text-[18px]  font-[500]">
                {" "}
              </th>
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
                onDotsClick={onDotsClick}
              />
            ))}
          </tbody>
        </table>
      </div>
      {isMenuOpen && selectedRow && (
        <EditDocumentPopup
          onEdit={() => {}}
          onMove={() => setIsMoveOpen(true)}
          onDublicate={() => onDuplicateClick(selectedRow.id)}
          onMarkAs={() => setIsMarkAsOpen(true)}
          onArchive={() => {}}
          onDelete={() => setIsDeleteOpen(true)}
          onImproveWithAI={
            selectedRow.status === "Ready for Review"
              ? () => {
                  onDuplicateClick(selectedRow.id);
                  setIsImproveOpen(true);
                }
              : undefined
          }
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
          handleMoveClick={onMoveClick}
          contentId={selectedRow?.id}
        />
      )}

      {isDeleteOpen && (
        <DeleteMessagePopup
          contentId={selectedRow?.id ?? ""}
          onCancel={() => setIsDeleteOpen(false)}
          onDelete={onDeleteClick}
        />
      )}
      {isDublicateOpen && (
        <ChooseSubfolderPopup
          title={"Duplicate"}
          contentId={idToDuplicate}
          handleSave={onDuplicateAndMoveClick}
          onClose={() => setIsDublicateOpen(false)}
          parentFolderId={findParentFolderId(folders, idToDuplicate) ?? ""}
        />
      )}
      {isMoveOpen && (
        <ChooseSubfolderPopup
          title={"Move"}
          contentId={selectedRow?.id ?? ""}
          handleSave={onMoveClick}
          onClose={() => setIsMoveOpen(false)}
          parentFolderId={
            findParentFolderId(folders, selectedRow?.id ?? "") ?? ""
          }
        />
      )}
      {isImproveOpen && (
        <ChooseSubfolderPopup
          title={"Improve with AI"}
          description="Lorem ipsum dolor sit amet consectetur. Convallis ut rutrum diam quam."
          contentId={idToDuplicate}
          handleSave={onDuplicateAndMoveClick}
          onClose={() => setIsImproveOpen(false)}
          parentFolderId={folders[0].id}
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
  const [popupRow, setPopupRow] = useState<TableRow | null>(null);
  const fileCellRef = useRef<HTMLTableCellElement | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupStyle, setPopupStyle] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (popupRow && fileCellRef.current) {
      const rect = fileCellRef.current.getBoundingClientRect();
      setPopupStyle({
        top: rect.top + window.scrollY - 250,
        left: rect.left + window.scrollX,
      });
    }
  }, [popupRow]);

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

  return (
    <Fragment>
      {/* Main Row */}
      <tr className={`border-t border-[#E6E6E6] ${bgClass}`}>
        <td className="py-[12px] px-[8px] font-medium text-gray-700 w-[112px]">
          <div className="flex items-center w-24 gap-2">
            {hasChildren ? (
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                onClick={() => toggleFolder(row.id)}
                className={`${isExpanded ? "rotate-[180deg]" : ""} cursor-pointer`}
              >
                <MaterialIcon iconName="keyboard_arrow_down" />
              </Button>
            ) : (
              <span className="ml-6"></span>
            )}
            {getIcon(row.type)}
          </div>
        </td>
        <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500] text-black ">
          {row.title}
        </td>
        <td
          ref={fileCellRef}
          className={`py-[12px] pr-[8px] text-[14px] xl:text-[18px]  font-[500] ${popupRow === row ? "text-[#1C63DB]" : "text-[#5F5F65]"} hover:text-[#1C63DB] hover:underline cursor-pointer`}
          onClick={(e) => {
            e.stopPropagation();
            setPopupRow(row);
          }}
        >
          {row.filesCount} Files
        </td>
        <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
          {formatDateToSlash(new Date(row.createdAt))}
        </td>
        <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
          <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
            {row.status === "Raw" && (
              <span className="flex items-center gap-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
                <MaterialIcon iconName="schedule" />
                Pending review
              </span>
            )}
            {row.status === "Ready for Review" && (
              <span className="flex items-center gap-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
                <ReadyForReview />
                Ready for Review
              </span>
            )}
            {row.status === "Second review" && (
              <span className="flex items-center gap-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
                <MaterialIcon iconName="flag" className="text-red-500" />
                Second review
              </span>
            )}
            {["Raw", "Ready for Review", "Second review"].includes(
              row.status
            ) === false && row.status}
          </td>
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

      {popupRow && (
        <div
          ref={popupRef}
          className="absolute z-50 bg-white rounded-lg border border-[#E3E3E3] shadow-lg w-[365px] h-[254px] px-[14px] py-[16px]"
          style={{
            top: popupStyle.top,
            left: popupStyle.left,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-[700] text-[#1D1D1F] ">
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
            {popupRow.subfolders?.map((sf) => (
              <div key={sf.id} className="mb-4">
                <h3 className="text-[13px] font-medium text-[#5F5F65]  mb-[10px]">
                  /{sf.title}
                </h3>
                <ul className="space-y-[10px]">
                  {sf.fileNames?.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-[16px] text-[14px] text-[#1D1D1F] font-[500] "
                      // onClick={() => {
                      //   nav(
                      //     `/content-manager/library/folder/${popupRow.id}/document/${item.id}`
                      //   );
                      //   setPopupRow(null);
                      // }}
                    >
                      <MaterialIcon iconName="docs" fill={1} />
                      {item.filename}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
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
  const [popupRow, setPopupRow] = useState<TableRow | null>(null);
  const fileCellRef = useRef<HTMLTableCellElement | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupStyle, setPopupStyle] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    if (popupRow && fileCellRef.current) {
      const rect = fileCellRef.current.getBoundingClientRect();
      setPopupStyle({
        top: rect.top + window.scrollY - 250,
        left: rect.left + window.scrollX,
      });
    }
  }, [popupRow]);

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

  return (
    <Fragment>
      {/* Subfolder Row */}
      <tr className={bgClass}>
        <td className="py-[12px] pr-[8px] pl-[38px] flex items-center gap-2">
          {hasContent ? (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              onClick={() => toggleFolder(subfolder.id)}
              className={`${isExpanded ? "rotate-[180deg]" : ""} cursor-pointer`}
            >
              <MaterialIcon iconName="keyboard_arrow_down" />
            </Button>
          ) : (
            <span className="ml-6"></span>
          )}
          {getIcon(subfolder.type)}
        </td>
        <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500]  text-black">
          {subfolder.title}
        </td>
        <td
          ref={fileCellRef}
          className={`py-[12px] pr-[8px] text-[14px] xl:text-[18px]  font-[500] ${popupRow === subfolder ? "text-[#1C63DB]" : "text-[#5F5F65]"} hover:text-[#1C63DB] hover:underline cursor-pointer`}
          onClick={(e) => {
            e.stopPropagation();
            setPopupRow(subfolder);
          }}
        >
          {subfolder.filesCount} Files
        </td>
        <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
          {formatDateToSlash(new Date(subfolder.createdAt))}
        </td>
        <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
          {subfolder.status === "Raw" && (
            <span className="flex items-center gap-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
              <MaterialIcon iconName="schedule" />
              Pending review
            </span>
          )}
          {subfolder.status === "Ready for Review" && (
            <span className="flex items-center gap-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
              <ReadyForReview />
              Ready for Review
            </span>
          )}
          {subfolder.status === "Second review" && (
            <span className="flex items-center gap-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
              <MaterialIcon iconName="flag" className="text-red-500" />
              Second review
            </span>
          )}
          {["Raw", "Ready for Review", "Second review"].includes(
            subfolder.status
          ) === false && subfolder.status}
        </td>
        <td className="py-[12px] pr-[8px]">
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            onClick={(e) => {
              e.stopPropagation();
              onDotsClick(subfolder, e);
            }}
            className="rounded-full hover:bg-[#AAC6EC40]"
          >
            <MaterialIcon iconName="more_vert" />
          </Button>
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

      {popupRow && (
        <div
          ref={popupRef}
          className="absolute z-50 bg-white rounded-lg border border-[#E3E3E3] shadow-lg w-[365px] h-[254px] px-[14px] py-[16px]"
          style={{
            top: popupStyle.top,
            left: popupStyle.left,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[20px] font-[700] text-[#1D1D1F] ">
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
            <div className="mb-4">
              <ul className="space-y-[10px]">
                {popupRow.fileNames?.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-[16px] text-[14px] text-[#1D1D1F] font-[500] "
                    // onClick={() => {
                    //   nav(
                    //     `/content-manager/library/folder/${popupRow.id}/document/${item.id}`
                    //   );
                    //   setPopupRow(null);
                    // }}
                  >
                    <MaterialIcon iconName="docs" fill={1} />
                    {item.filename}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
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
        <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500] text-black ">
          {content.title}
        </td>
        <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500] text-[#5F5F65] ">
          {(content.content &&
            content.content?.length > 0 &&
            content.content?.length) ||
            "-"}
        </td>
        <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500] text-[#5F5F65] ">
          {formatDateToSlash(new Date(content.createdAt))}
        </td>
        <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500] text-[#5F5F65] ">
          {content.status === "Raw" && (
            <span className="flex items-center gap-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
              <MaterialIcon iconName="schedule" />
              Pending review
            </span>
          )}
          {content.status === "Ready for Review" && (
            <span className="flex items-center gap-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
              <ReadyForReview />
              Ready for Review
            </span>
          )}
          {content.status === "Second review" && (
            <span className="flex items-center gap-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
              <MaterialIcon iconName="flag" className="text-red-500" />
              Second review
            </span>
          )}
          {["Raw", "Ready for Review", "Second review"].includes(
            content.status
          ) === false && content.status}
        </td>
        <td className="py-[12px] pr-[8px]">
          <div
            onClick={(e) => {
              e.stopPropagation();
              onDotsClick(content, e);
            }}
          >
            <MaterialIcon iconName="more_vert" />
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
              <MaterialIcon iconName="docs" fill={1} className="ml-auto" />
            </td>
            <td className="py-[12px] pl-[18px] pr-[8px] text-[14px] xl:text-[18px] font-[500] text-black ">
              {msg.title}
            </td>
            <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500] text-[#5F5F65] ">
              {(msg.content &&
                msg.content?.length > 0 &&
                msg.content?.length) ||
                "-"}
            </td>
            <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500] text-[#5F5F65] ">
              {formatDateToSlash(new Date(msg.created_at || ""))}
            </td>
            <td className="py-[12px] pr-[8px] text-[14px] xl:text-[18px] font-[500] text-[#5F5F65] ">
              {msg.status === "Raw" && (
                <span className="flex items-center gap-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
                  <MaterialIcon iconName="schedule" />
                  Pending review
                </span>
              )}
              {msg.status === "Ready for Review" && (
                <span className="flex items-center gap-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
                  <ReadyForReview />
                  Ready for Review
                </span>
              )}
              {msg.status === "Second review" && (
                <span className="flex items-center gap-[8px] text-[14px] xl:text-[18px] font-[500]  text-[#5F5F65]">
                  <MaterialIcon iconName="flag" className="text-red-500" />
                  Second review
                </span>
              )}
              {["Raw", "Ready for Review", "Second review"].includes(
                msg.status
              ) === false && msg.status}
            </td>
            <td className="py-[12px] pr-[8px]">
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                onClick={(e) => {
                  e.stopPropagation();
                  onDotsClick(msg, e);
                }}
              >
                <MaterialIcon iconName="more_vert" />
              </Button>
            </td>
          </tr>
        ))}
    </>
  );
};

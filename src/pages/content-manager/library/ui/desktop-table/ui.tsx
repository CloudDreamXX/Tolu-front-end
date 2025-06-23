import { Fragment, useEffect, useRef, useState } from "react";
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
import {
  ContentToMove,
  FoldersService,
  IFolder,
  setFolders,
} from "entities/folder";
import { DeleteMessagePopup } from "widgets/DeleteMessagePopup";
import { ChooseSubfolderPopup } from "widgets/ChooseSubfolderPopup";
import { ContentService } from "entities/content";
import CloseIcon from "shared/assets/icons/close";

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
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const [isDublicateOpen, setIsDublicateOpen] = useState<boolean>(false);
  const [isMoveOpen, setIsMoveOpen] = useState<boolean>(false);
  const [isImproveOpen, setIsImproveOpen] = useState<boolean>(false);
  const [idToDuplicate, setIsIdToDuplicate] = useState<string>("");
  const token = useSelector((state: RootState) => state.user.token);
  const dispatch = useDispatch();
  const folders = useSelector((state: RootState) => state.folder);

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

  const handleDeleteClick = async (id: string) => {
    await FoldersService.deleteContent(id);
    setIsDeleteOpen(false);
    setIsMenuOpen(false);
  };

  const handleDublicateClick = async (id: string) => {
    setIsDublicateOpen(true);
    const response = await ContentService.duplicateContentById(id);
    setIsIdToDuplicate(response.duplicated_content.id);
  };

  const handleDublicateAndMoveClick = async (
    id: string,
    subfolderId: string
  ) => {
    const payload: ContentToMove = {
      content_id: id,
      target_folder_id: subfolderId,
    };
    await FoldersService.moveFolderContent(payload);
    setIsDublicateOpen(false);
    setIsMenuOpen(false);
  };

  const handleMoveClick = async (id: string, subfolderId: string) => {
    const payload: ContentToMove = {
      content_id: id,
      target_folder_id: subfolderId,
    };
    await FoldersService.moveFolderContent(payload);
    setIsMoveOpen(false);
    setIsMenuOpen(false);
  };

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
      <div className="overflow-x-auto rounded-2xl p-[24px] border border-[#E6E6E6] bg-white hidden md:block">
        <table className="min-w-full text-sm">
          <thead className="bg-white text-[#5F5F65] text-left mb-[10px] font-[500]">
            <tr>
              <th className="pb-[24px] text-[18px] font-inter font-[500]">
                Type
              </th>
              <th className="pb-[24px] text-[18px] font-inter font-[500]">
                Title
              </th>
              <th className="pb-[24px] text-[18px] font-inter font-[500]">
                Files
              </th>
              <th className="pb-[24px] text-[18px] font-inter font-[500]">
                Created
              </th>
              <th className="pb-[24px] text-[18px] font-inter font-[500]">
                Status
              </th>
              <th className="pb-[24px] text-[18px] font-inter font-[500]"> </th>
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
          onMove={() => setIsMoveOpen(true)}
          onDublicate={() => handleDublicateClick(selectedRow.id)}
          onMarkAs={() => setIsMarkAsOpen(true)}
          onArchive={() => {}}
          onDelete={() => setIsDeleteOpen(true)}
          onImproveWithAI={
            selectedRow.status === "Ready for Review"
              ? () => setIsImproveOpen(true)
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
        />
      )}

      {isDeleteOpen && (
        <DeleteMessagePopup
          contentId={selectedRow?.id!}
          onCancel={() => setIsDeleteOpen(false)}
          onDelete={handleDeleteClick}
        />
      )}
      {isDublicateOpen && (
        <ChooseSubfolderPopup
          title={"Duplicate"}
          contentId={idToDuplicate}
          handleSave={handleDublicateAndMoveClick}
          onClose={() => setIsDublicateOpen(false)}
          parentFolderId={
            findParentFolderId(folders.folders, idToDuplicate) || ""
          }
        />
      )}
      {isMoveOpen && (
        <ChooseSubfolderPopup
          title={"Move"}
          contentId={selectedRow?.id!}
          handleSave={handleMoveClick}
          onClose={() => setIsMoveOpen(false)}
          parentFolderId={
            findParentFolderId(folders.folders, selectedRow!.id) || ""
          }
        />
      )}
      {isImproveOpen && (
        <ChooseSubfolderPopup
          title={"Improve with AI"}
          description="Lorem ipsum dolor sit amet consectetur. Convallis ut rutrum diam quam."
          contentId={selectedRow?.id!}
          handleSave={handleMoveClick}
          onClose={() => setIsImproveOpen(false)}
          parentFolderId={folders.folders[0].id}
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
  const nav = useNavigate();
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
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-black font-inter">
          {row.title}
        </td>
        <td
          ref={fileCellRef}
          className={`py-[12px] pr-[8px] text-[18px] font-inter font-[500] ${popupRow === row ? "text-[#1C63DB]" : "text-[#5F5F65]"} hover:text-[#1C63DB] hover:underline cursor-pointer`}
          onClick={(e) => {
            e.stopPropagation();
            setPopupRow(row);
          }}
        >
          {row.filesCount} Files
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] font-inter text-[#5F5F65]">
          {formatDateToSlash(new Date(row.createdAt))}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] font-inter text-[#5F5F65]">
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

      {popupRow && (
        <div
          ref={popupRef}
          className="absolute z-50 bg-white rounded-lg border border-[#E3E3E3] shadow-lg w-[365px] h-[254px] px-[14px] py-[16px]"
          style={{
            top: popupStyle.top,
            left: popupStyle.left,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[20px] font-[700] text-[#1D1D1F] font-inter">
              Files in "{popupRow.title}"
            </h2>
            <button onClick={() => setPopupRow(null)}>
              <CloseIcon />
            </button>
          </div>

          <div className="overflow-y-auto" style={{ height: "179px" }}>
            {popupRow.subfolders?.map((sf) => (
              <div key={sf.id} className="mb-4">
                <h3 className="text-[13px] font-medium text-[#5F5F65] font-inter mb-[10px]">
                  /{sf.title}
                </h3>
                <ul className="space-y-[10px]">
                  {sf.fileNames?.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-[16px] text-[14px] text-[#1D1D1F] font-[500] font-inter"
                      // onClick={() => {
                      //   nav(
                      //     `/content-manager/library/folder/${popupRow.id}/document/${item.id}`
                      //   );
                      //   setPopupRow(null);
                      // }}
                    >
                      <DocumentIcon />
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

  console.log(popupRow);

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
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] font-inter text-black">
          {subfolder.title}
        </td>
        <td
          ref={fileCellRef}
          className={`py-[12px] pr-[8px] text-[18px] font-inter font-[500] ${popupRow === subfolder ? "text-[#1C63DB]" : "text-[#5F5F65]"} hover:text-[#1C63DB] hover:underline cursor-pointer`}
          onClick={(e) => {
            e.stopPropagation();
            setPopupRow(subfolder);
          }}
        >
          {subfolder.filesCount} Files
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] font-inter text-[#5F5F65]">
          {formatDateToSlash(new Date(subfolder.createdAt))}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] font-inter text-[#5F5F65]">
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

      {popupRow && (
        <div
          ref={popupRef}
          className="absolute z-50 bg-white rounded-lg border border-[#E3E3E3] shadow-lg w-[365px] h-[254px] px-[14px] py-[16px]"
          style={{
            top: popupStyle.top,
            left: popupStyle.left,
          }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-[20px] font-[700] text-[#1D1D1F] font-inter">
              Files in "{popupRow.title}"
            </h2>
            <button onClick={() => setPopupRow(null)}>
              <CloseIcon />
            </button>
          </div>

          <div className="overflow-y-auto" style={{ height: "179px" }}>
            <div className="mb-4">
              <ul className="space-y-[10px]">
                {popupRow.fileNames?.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-[16px] text-[14px] text-[#1D1D1F] font-[500] font-inter"
                    // onClick={() => {
                    //   nav(
                    //     `/content-manager/library/folder/${popupRow.id}/document/${item.id}`
                    //   );
                    //   setPopupRow(null);
                    // }}
                  >
                    <DocumentIcon />
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
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-black font-inter">
          {content.title}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65] font-inter">
          {(content.content &&
            content.content?.length > 0 &&
            content.content?.length) ||
            "-"}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65] font-inter">
          {formatDateToSlash(new Date(content.createdAt))}
        </td>
        <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65] font-inter">
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
            <td className="py-[12px] pl-[18px] pr-[8px] text-[18px] font-[500] text-black font-inter">
              {msg.title}
            </td>
            <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65] font-inter">
              {(msg.content &&
                msg.content?.length > 0 &&
                msg.content?.length) ||
                "-"}
            </td>
            <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65] font-inter">
              {formatDateToSlash(new Date(msg.created_at || ""))}
            </td>
            <td className="py-[12px] pr-[8px] text-[18px] font-[500] text-[#5F5F65] font-inter">
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

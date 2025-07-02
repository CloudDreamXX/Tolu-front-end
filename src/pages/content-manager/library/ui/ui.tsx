import AiCreate from "shared/assets/icons/ai-create";
import Search from "shared/assets/icons/search";
import { useCallback, useEffect, useState } from "react";
import { Input } from "shared/ui";
import {
  ContentToMove,
  FoldersService,
  FolderToDelete,
  IFolder,
  ISubfolder,
  setFolders,
} from "entities/folder";
import { RootState } from "entities/store";
import { useSelector, useDispatch } from "react-redux";
import { DateSelector } from "shared/ui/date-selector";
import { useLibraryLogic } from "../lib";
import { LibraryMobileView } from "./mobile-table";
import { LibraryDesktopView } from "./desktop-table";
import { TableRow } from "../models";
import { CoachService } from "entities/coach";
import { ContentService } from "entities/content";

export const ContentManagerLibrary: React.FC = () => {
  const [choosedDate, setChoosedDate] = useState<Date>(new Date());
  const [search, setSearch] = useState<string>("");
  const token = useSelector((state: RootState) => state.user.token);
  const folders = useSelector((state: RootState) => state.folder);
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TableRow | null>(null);
  const [popupPosition, setPopupPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const [isMarkAsOpen, setIsMarkAsOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDublicateOpen, setIsDublicateOpen] = useState(false);
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isImproveOpen, setIsImproveOpen] = useState(false);
  const [idToDuplicate, setIdToDuplicate] = useState("");
  const { expandedFolders, toggleFolder, filteredItems } = useLibraryLogic(
    folders.folders,
    search
  );

  const fetchFolders = useCallback(async () => {
    try {
      const { folders, foldersMap } = await FoldersService.getFolders();
      dispatch(setFolders({ folders, foldersMap }));
    } catch (error) {
      console.error("Error fetching folders:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchFolders();
  }, [token, dispatch]);

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
    await CoachService.changeStatus(newStatus);
    await fetchFolders();
    setIsMarkAsOpen(false);
    setIsMenuOpen(false);
  };

  const isContentId = (id: string): boolean => {
    const searchContent = (foldersList: typeof folders.folders): boolean => {
      for (const folder of foldersList) {
        if (folder.content?.some((c) => c.id === id)) return true;
        for (const sub of folder.subfolders ?? []) {
          if (sub.content?.some((c) => c.id === id)) return true;
          for (const msg of sub.content ?? []) {
            if (msg.messages?.some((m) => m.id === id)) return true;
          }
        }
      }
      return false;
    };

    return searchContent(folders.folders);
  };

  const handleDeleteClick = async (id: string) => {
    if (isContentId(id)) {
      await FoldersService.deleteContent(id);
    } else {
      let folderToDelete: IFolder | ISubfolder | undefined;

      for (const folder of folders.folders) {
        if (folder.id === id) {
          folderToDelete = folder;
          break;
        }

        const foundSub = folder.subfolders?.find((sf) => sf.id === id);
        if (foundSub) {
          folderToDelete = foundSub;
          break;
        }
      }

      const hasChildren =
        (folderToDelete?.subfolders?.length ?? 0) > 0 ||
        (folderToDelete?.content?.length ?? 0) > 0;

      const folder: FolderToDelete = {
        folder_id: id,
        force_delete: hasChildren,
      };

      await FoldersService.deleteFolder(folder);
    }

    await fetchFolders();
    setIsDeleteOpen(false);
    setIsMenuOpen(false);
  };

  const handleDublicateClick = async (id: string) => {
    setIsDublicateOpen(true);
    const response = await ContentService.duplicateContentById(id);
    setIdToDuplicate(response.duplicated_content.id);
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
    await fetchFolders();
    setIsDublicateOpen(false);
    setIsImproveOpen(false);
    setIsMenuOpen(false);
  };

  const handleMoveClick = async (id: string, subfolderId: string) => {
    const payload: ContentToMove = {
      content_id: id,
      target_folder_id: subfolderId,
    };
    await FoldersService.moveFolderContent(payload);
    await fetchFolders();
    setIsMoveOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <div className="flex flex-col gap-12 p-8 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
          <AiCreate width={24} height={24} fill="#000" />
          Library
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col-reverse gap-[16px] md:flex-row justify-between w-full">
          <DateSelector
            choosedDate={choosedDate}
            onDateChange={setChoosedDate}
          />
          <div className="w-full md:w-[300px]">
            <Input
              placeholder="Search"
              icon={<Search />}
              className="rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <LibraryMobileView
          filteredItems={filteredItems}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
          onDotsClick={handleDotsClick}
        />

        <LibraryDesktopView
          filteredItems={filteredItems}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
          folders={folders.folders}
          selectedRow={selectedRow}
          isMenuOpen={isMenuOpen}
          popupPosition={popupPosition}
          isMarkAsOpen={isMarkAsOpen}
          isDeleteOpen={isDeleteOpen}
          isDublicateOpen={isDublicateOpen}
          isMoveOpen={isMoveOpen}
          isImproveOpen={isImproveOpen}
          idToDuplicate={idToDuplicate}
          onDotsClick={handleDotsClick}
          onStatusComplete={onStatusComplete}
          onDeleteClick={handleDeleteClick}
          onDuplicateClick={handleDublicateClick}
          onDuplicateAndMoveClick={handleDublicateAndMoveClick}
          onMoveClick={handleMoveClick}
          setIsMarkAsOpen={setIsMarkAsOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          setIsDublicateOpen={setIsDublicateOpen}
          setIsMoveOpen={setIsMoveOpen}
          setIsImproveOpen={setIsImproveOpen}
          setSelectedRow={setSelectedRow}
          setPopupPosition={setPopupPosition}
        />
      </div>
    </div>
  );
};

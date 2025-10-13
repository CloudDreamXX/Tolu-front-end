import {
  useChangeStatusMutation,
  useGetAllUserContentQuery,
} from "entities/coach";
import { useDuplicateContentByIdMutation } from "entities/content";
import {
  useGetFoldersQuery,
  useDeleteFolderMutation,
  useMoveFolderContentMutation,
  useDeleteContentMutation,
} from "entities/folder/api";
import { IFolder, ISubfolder, setFolders } from "entities/folder";
import { RootState } from "entities/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, DateSelector, Input } from "shared/ui";
import { useLibraryLogic } from "../lib";
import { TableRow } from "../models";
import { ContentCard } from "./content-card/ui";
import { LibraryDesktopView } from "./desktop-table";
import { LibraryMobileView } from "./mobile-table";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export const ContentManagerLibrary: React.FC = () => {
  const [choosedDate, setChoosedDate] = useState<Date>(new Date());
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const foldersState = useSelector((state: RootState) => state.folder);
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
    foldersState.folders,
    debouncedSearch
  );
  const [contentCardsView, setContentCardsView] = useState<boolean>(false);

  const [duplicateContentById] = useDuplicateContentByIdMutation();
  const [changeStatus] = useChangeStatusMutation();

  const { data: folderResponse, refetch: refetchFolders } = useGetFoldersQuery(
    undefined,
    { refetchOnMountOrArgChange: true }
  );
  const [deleteFolder] = useDeleteFolderMutation();
  const [moveFolderContent] = useMoveFolderContentMutation();
  const [deleteContent] = useDeleteContentMutation();

  const { data: allContentResponse } = useGetAllUserContentQuery();
  const allContent = allContentResponse?.content ?? [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (folderResponse) {
      const { folders, foldersMap } = folderResponse;
      dispatch(setFolders({ folders, foldersMap }));
    }
  }, [folderResponse, dispatch]);

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
    const newStatus = { id: selectedRow?.id ?? "", status };
    await changeStatus(newStatus).unwrap();
    await refetchFolders();
    setIsMarkAsOpen(false);
    setIsMenuOpen(false);
  };

  const isContentId = (id: string): boolean => {
    const searchContent = (
      foldersList: typeof foldersState.folders
    ): boolean => {
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
    return searchContent(foldersState.folders);
  };

  const handleDeleteClick = async (id: string) => {
    try {
      if (isContentId(id)) {
        await deleteContent(id).unwrap();
      } else {
        let folderToDelete: IFolder | ISubfolder | undefined;
        for (const folder of foldersState.folders) {
          if (folder.id === id) folderToDelete = folder;
          const foundSub = folder.subfolders?.find((sf) => sf.id === id);
          if (foundSub) folderToDelete = foundSub;
        }

        const hasChildren =
          (folderToDelete?.subfolders?.length ?? 0) > 0 ||
          (folderToDelete?.content?.length ?? 0) > 0;

        await deleteFolder({
          folder_id: id,
          force_delete: hasChildren,
        }).unwrap();
      }

      await refetchFolders();
      setIsDeleteOpen(false);
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleDublicateClick = async (id: string) => {
    setIsDublicateOpen(true);
    try {
      const response = await duplicateContentById(id).unwrap();
      setIdToDuplicate(response.duplicated_content.id);
    } catch (error) {
      console.error("Error duplicating content:", error);
    }
  };

  const handleDublicateAndMoveClick = async (
    id: string,
    subfolderId: string
  ) => {
    await moveFolderContent({
      content_id: id,
      target_folder_id: subfolderId,
    }).unwrap();

    await refetchFolders();
    setIsDublicateOpen(false);
    setIsImproveOpen(false);
    setIsMenuOpen(false);
  };

  const handleMoveClick = async (id: string, subfolderId: string) => {
    await moveFolderContent({
      content_id: id,
      target_folder_id: subfolderId,
    }).unwrap();

    await refetchFolders();
    setIsMoveOpen(false);
    setIsMenuOpen(false);
  };

  const filteredContent = useMemo(() => {
    if (debouncedSearch === "") return allContent;
    const searchLower = debouncedSearch.toLowerCase();
    return allContent?.filter(
      (content) =>
        content.title.toLowerCase().includes(searchLower) ||
        content.query.toLowerCase().includes(searchLower) ||
        content.content.toLowerCase().includes(searchLower)
    );
  }, [allContent, debouncedSearch]);

  return (
    <div className="flex flex-col gap-12 p-8 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
          <MaterialIcon iconName={"stars_2"} fill={1} /> Library
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col-reverse gap-[16px] md:flex-row justify-between items-center w-full">
          <DateSelector
            choosedDate={choosedDate}
            onDateChange={setChoosedDate}
          />
          <div
            className={`w-full ${contentCardsView ? "md:w-[600px]" : "md:w-[300px]"}`}
          >
            <Input
              placeholder="Search"
              icon={<MaterialIcon iconName="search" />}
              className="rounded-full focus:border-[#1C63DB]"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value.length > 0) setContentCardsView(true);
              }}
              onFocus={() => setContentCardsView(true)}
              onBlur={() => {
                setTimeout(() => {
                  if (search === "") setContentCardsView(false);
                }, 150);
              }}
            />
          </div>
          {contentCardsView && (
            <p className="text-[14px] text-[#5F5F65] font-[500]">
              Found {filteredContent?.length} files
            </p>
          )}
        </div>

        <LibraryMobileView
          filteredItems={filteredItems}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
          onDotsClick={handleDotsClick}
        />

        {filteredContent?.length ? (
          <>
            {contentCardsView ? (
              <div className="grid grid-cols-2 gap-4">
                {filteredContent.map((content) => (
                  <ContentCard
                    key={content.id}
                    title={content.title}
                    content={content.content}
                    query={content.query}
                    id={content.id}
                    searchQuery={debouncedSearch}
                  />
                ))}
              </div>
            ) : (
              <LibraryDesktopView
                filteredItems={filteredItems}
                expandedFolders={expandedFolders}
                toggleFolder={toggleFolder}
                folders={foldersState.folders}
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
            )}
          </>
        ) : (
          <Card className="w-full max-w-xl py-6 mx-auto text-center px-11 rounded-2xl">
            <h2 className="text-2xl font-bold">Nothing found?</h2>
            <h3 className="text-lg font-bold">
              Try changing your search query
            </h3>
          </Card>
        )}
      </div>
    </div>
  );
};

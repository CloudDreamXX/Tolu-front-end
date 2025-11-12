import {
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useGetFoldersQuery,
} from "entities/folder/api";
import { IFolder, NewFolder } from "entities/folder";
import { RootState } from "entities/store";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, toast } from "shared/lib";
import { CreateSubfolderPopup } from "widgets/CreateSubfolderPopup";
import { DeleteMessagePopup } from "widgets/DeleteMessagePopup";
import { MenuItem } from "widgets/EditDocumentPopup";
import { findFilePath, getNumberOfContent, isSameRoot } from "../utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui";

interface FolderTreeProps {
  folders: IFolder[];
  level: number;
  isNarrow: boolean;
  openFolders: Set<string>;
  toggleFolder: (folder: IFolder) => void;
  handleDrop: (
    folderId: string,
    fileId: string,
    sourceFolderId: string,
    rootFolderId: string
  ) => void;
  dragOverFolderId: string | null;
  setDragOverFolderId: (id: string | null) => void;
  rootFolderId?: string;
  onChildrenItemClick?: () => void;
  isMoving: boolean;
}

export const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  level,
  isNarrow,
  openFolders,
  toggleFolder,
  handleDrop,
  dragOverFolderId,
  setDragOverFolderId,
  rootFolderId,
  onChildrenItemClick,
  isMoving,
}) => {
  const nav = useNavigate();
  const { documentId, folderId } = useParams();
  const { folders: allFolders } = useSelector(
    (state: RootState) => state.folder
  );
  const [menuOpenFolderId, setMenuOpenFolderId] = useState<string | null>(null);
  const [createPopup, setCreatePopup] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const expandedForDocRef = useRef<string | null>(null);

  const [createFolderMutation] = useCreateFolderMutation();
  const [deleteFolderMutation] = useDeleteFolderMutation();
  const { refetch: refetchFolders } = useGetFoldersQuery();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!documentId) return;
    if (expandedForDocRef.current === documentId) return;
    if (!allFolders?.length) return;

    const path = findFilePath(allFolders, documentId);
    if (!path?.length) return;

    for (const item of path) {
      if (!openFolders.has(item.id)) {
        const f = findFolder(item.id, allFolders);
        if (f) toggleFolder(f);
      }
    }
    expandedForDocRef.current = documentId;
  }, [documentId, allFolders, toggleFolder, openFolders]);

  const findFolder = (
    folderId: string,
    folders: IFolder[]
  ): IFolder | undefined => {
    for (const folder of folders) {
      if (folder.id === folderId) return folder;
      if (folder.subfolders) {
        const found = findFolder(folderId, folder.subfolders);
        if (found) return found;
      }
    }
    return undefined;
  };

  const folderToDelete = findFolder(menuOpenFolderId as string, allFolders);
  const hasContentInside =
    (folderToDelete && folderToDelete?.content?.length > 0) || false;

  const onFolderDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverFolderId(folderId);
  };

  const onFolderDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverFolderId(null);
    }
  };

  const onFolderDrop = (e: React.DragEvent, folderId: string) => {
    if (isMoving) return;
    const contentId = e.dataTransfer.getData("contentId");
    const sourceFolderId = e.dataTransfer.getData("sourceFolderId");
    const sourceRootFolderId = e.dataTransfer.getData("sourceRootFolderId");

    handleDrop(folderId, contentId, sourceFolderId, sourceRootFolderId);
    setDragOverFolderId(null);
  };

  const onContentDragStart = (
    e: React.DragEvent,
    contentId: string,
    folderId: string,
    rootId: string
  ) => {
    if (isMoving) return;
    e.dataTransfer.setData("contentId", contentId);
    e.dataTransfer.setData("sourceFolderId", folderId);
    e.dataTransfer.setData("sourceRootFolderId", rootId);
  };

  const onContentDragEnd = () => setDragOverFolderId(null);

  const handleDotsClick = (folderId: string) => {
    setMenuOpenFolderId((prevId) => (prevId === folderId ? null : folderId));
  };

  const handleDeleteFolder = async () => {
    if (!menuOpenFolderId) return;
    try {
      await deleteFolderMutation({
        folder_id: menuOpenFolderId,
        force_delete: hasContentInside,
      }).unwrap();

      toast({ title: "Deleted successfully" });
      setMenuOpenFolderId(null);
      setIsDeleteOpen(false);
      await refetchFolders();
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete folder",
        description: "Please try again later.",
      });
    }
  };

  const createFolder = async (name: string, description: string) => {
    if (!menuOpenFolderId) return;
    try {
      const newFolder: NewFolder = {
        name,
        description,
        parent_folder_id: menuOpenFolderId,
      };
      await createFolderMutation(newFolder).unwrap();

      toast({ title: "Folder created successfully" });
      setMenuOpenFolderId(null);
      setCreatePopup(false);
      await refetchFolders();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast({
        variant: "destructive",
        title: "Failed to create folder",
        description: "Please try again later.",
      });
    }
  };

  return (
    <>
      {folders.map((folder) => (
        <div key={folder.id} className="relative ml-4 select-none">
          <div
            className="flex items-center px-4 py-[7px]"
            onDragOver={(e) => onFolderDragOver(e, folder.id)}
            onDragLeave={onFolderDragLeave}
            onDrop={(e) => onFolderDrop(e, folder.id)}
          >
            <div
              className={cn(
                "flex items-center gap-3 cursor-pointer transition-colors",
                folderId === folder.id ? "text-blue-500" : "",
                isSameRoot(allFolders, dragOverFolderId, rootFolderId) &&
                  dragOverFolderId === folder.id &&
                  "bg-blue-50"
              )}
              onClick={() => toggleFolder(folder)}
            >
              <MaterialIcon
                iconName={
                  openFolders.has(folder.id)
                    ? "keyboard_arrow_up"
                    : "keyboard_arrow_down"
                }
                className="shrink-0"
              />

              {level === 0 ? null : (
                <MaterialIcon iconName="folder_open" fill={1} />
              )}
              <span>{folder.name}</span>
            </div>

            <span className="rounded-full bg-[#F3F6FB] text-[10px] text-[#1C63DB] mx-1 p-2 max-w-5 max-h-5 flex items-center justify-center">
              {getNumberOfContent(folder)}
            </span>

            <span
              className="ml-auto px-[8px] cursor-pointer"
              onClick={() => handleDotsClick(folder.id)}
            >
              <MaterialIcon iconName="more_vert" />
            </span>
          </div>

          {menuOpenFolderId === folder.id && (
            <div
              ref={dropdownRef}
              className="absolute z-50 w-fit p-[16px_14px] flex flex-col items-start gap-[6px]
             bg-white rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] right-8"
            >
              <MenuItem
                icon={<MaterialIcon iconName="add" />}
                label={"Create folder"}
                onClick={() => {
                  setCreatePopup(true);
                }}
              />
              {level > 0 && (
                <MenuItem
                  icon={
                    <MaterialIcon
                      iconName="delete"
                      className="text-[#FF1F0F]"
                    />
                  }
                  label={"Delete"}
                  onClick={() => setIsDeleteOpen(true)}
                />
              )}
            </div>
          )}

          {folder.subfolders && openFolders.has(folder.id) && (
            <FolderTree
              folders={folder.subfolders}
              level={level + 1}
              isNarrow={isNarrow}
              openFolders={openFolders}
              toggleFolder={toggleFolder}
              handleDrop={handleDrop}
              dragOverFolderId={dragOverFolderId}
              setDragOverFolderId={setDragOverFolderId}
              rootFolderId={folder.id}
              onChildrenItemClick={onChildrenItemClick}
              isMoving={isMoving}
            />
          )}

          {openFolders.has(folder.id) && (
            <div
              className={cn(
                "pl-8",
                dragOverFolderId === folder.id && "bg-blue-50"
              )}
              onDrop={(e) => onFolderDrop(e, folder.id)}
              onDragOver={(e) => onFolderDragOver(e, folder.id)}
              onDragLeave={onFolderDragLeave}
            >
              {folder.content?.map((content) => (
                <div
                  key={content.id}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-[7px] pl-4 group rounded-md transition cursor-grab ",
                    documentId === content.id
                      ? "text-blue-500"
                      : "hover:bg-gray-100"
                  )}
                  draggable
                  onDragStart={(e) =>
                    onContentDragStart(
                      e,
                      content.id,
                      folder.id,
                      rootFolderId ?? folder.id
                    )
                  }
                  onDragEnd={onContentDragEnd}
                  onClick={() => {
                    onChildrenItemClick?.();
                    nav(
                      `/content-manager/library/folder/${rootFolderId ?? folder.id}/document/${content.id}`
                    );
                  }}
                >
                  <MaterialIcon
                    iconName="drag_indicator"
                    weight={300}
                    size={20}
                    className="shrink-0 group-hover:stroke-blue-500"
                  />
                  {content.contentType === "Card" ? (
                    <MaterialIcon
                      iconName="playing_cards"
                      className="w-5 h-5 shrink-0 group-hover:stroke-blue-500"
                    />
                  ) : (
                    <MaterialIcon
                      iconName="docs"
                      className="w-5 h-5 shrink-0 group-hover:stroke-blue-500"
                    />
                  )}
                  <TooltipProvider delayDuration={500}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-nowrap text-[14px] font-semibold group-hover:text-blue-500 truncate max-w-[80px] block">
                          {content.aiTitle ?? content.title}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="z-50 p-[16px] max-w-[309px]">
                        <div className="text-[#1B2559] text-sm leading-[1.4] font-medium">
                          {content.aiTitle ?? content.title}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              ))}

              {!folder.content?.length && !folder.subfolders?.length && (
                <p className="px-4 py-2 text-sm italic text-gray-400 transition-colors rounded-md">
                  Empty folder
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {isMoving && (
        <div className="fixed inset-0 z-50 cursor-wait bg-white/10 backdrop-blur-sm" />
      )}

      {createPopup && (
        <CreateSubfolderPopup
          onClose={() => setCreatePopup(false)}
          onComplete={createFolder}
        />
      )}

      {isDeleteOpen && (
        <DeleteMessagePopup
          contentId={menuOpenFolderId ?? ""}
          onCancel={() => setIsDeleteOpen(false)}
          onDelete={handleDeleteFolder}
          text={
            hasContentInside
              ? "This folder contains documents. Are you sure you want to delete it?"
              : undefined
          }
        />
      )}
    </>
  );
};

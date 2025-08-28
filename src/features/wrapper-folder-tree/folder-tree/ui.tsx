import {
  FoldersService,
  IFolder,
  NewFolder,
  setFolders,
} from "entities/folder";
import { RootState } from "entities/store";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, toast } from "shared/lib";
import { CreateSubfolderPopup } from "widgets/CreateSubfolderPopup";
import { DeleteMessagePopup } from "widgets/DeleteMessagePopup";
import { MenuItem } from "widgets/EditDocumentPopup";
import { getNumberOfContent, isSameRoot } from "../utils";

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
  const [createPopup, setCreatePopup] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const dispatch = useDispatch();

  const findFolder = (
    folderId: string,
    folders: IFolder[]
  ): IFolder | undefined => {
    for (const folder of folders) {
      if (folder.id === folderId) {
        return folder;
      }
      if (folder.subfolders) {
        const foundInSubfolders = findFolder(folderId, folder.subfolders);
        if (foundInSubfolders) {
          return foundInSubfolders;
        }
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

  const onContentDragEnd = () => {
    setDragOverFolderId(null);
  };

  const handleDotsClick = (folderId: string) => {
    setMenuOpenFolderId((prevId) => (prevId === folderId ? null : folderId));
  };

  const handleDeleteFolder = async () => {
    try {
      await FoldersService.deleteFolder({
        folder_id: menuOpenFolderId as string,
        force_delete: hasContentInside,
      });

      toast({ title: "Deleted successfully" });
      setMenuOpenFolderId(null);
      setIsDeleteOpen(false);

      const folderResponse = await FoldersService.getFolders();
      dispatch(setFolders(folderResponse));
    } catch (error) {
      console.error("Error deleting a folder:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete a folder",
        description: "Failed to delete a folder. Please try again.",
      });
    }
  };

  const createFolder = async (name: string, description: string) => {
    try {
      const newFolder: NewFolder = {
        name: name,
        description: description,
        parent_folder_id: menuOpenFolderId as string,
      };

      await FoldersService.createFolder(newFolder);

      toast({ title: "Created successfully" });
      setMenuOpenFolderId(null);
      setCreatePopup(false);

      const folderResponse = await FoldersService.getFolders();
      dispatch(setFolders(folderResponse));
    } catch (error) {
      console.error("Error creating a folder:", error);
      toast({
        variant: "destructive",
        title: "Failed to create a folder",
        description: "Failed to create a folder. Please try again.",
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
              className="absolute z-50 w-fit p-[16px_14px] flex flex-col items-start gap-[6px]
             bg-white rounded-[10px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)] right-8"
            >
              <MenuItem
                icon={<MaterialIcon iconName="add" />}
                label={"Create folders"}
                onClick={() => setCreatePopup(true)}
              />
              {!allFolders.find((item) => item.id === menuOpenFolderId) && (
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
                  <MaterialIcon
                    iconName="docs"
                    size={20}
                    weight={300}
                    className="shrink-0 group-hover:stroke-blue-500"
                  />
                  <span className="text-nowrap text-[14px] font-semibold group-hover:text-blue-500 truncate max-w-[80px] block">
                    {content.aiTitle ?? content.title}
                  </span>
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

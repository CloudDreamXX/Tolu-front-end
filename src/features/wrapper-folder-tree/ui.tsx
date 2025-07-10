import { FoldersService, setFolders } from "entities/folder";
import { RootState } from "entities/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { findFolderPath } from "./utils";
import { FolderTree } from "./folder-tree";

interface WrapperFolderTreeProps {
  onChildrenItemClick?: () => void;
}

export const WrapperFolderTree = ({
  onChildrenItemClick,
}: WrapperFolderTreeProps) => {
  const dispatch = useDispatch();
  const { folders } = useSelector((state: RootState) => state.folder);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [isMoving, setIsMoving] = useState(false);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const { folders, foldersMap } = await FoldersService.getFolders();
        dispatch(setFolders({ folders, foldersMap }));
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, [dispatch]);

  const toggleFolder = (folderId: string) => {
    setOpenFolders((prev) => {
      const newOpenFolders = new Set(prev);
      if (newOpenFolders.has(folderId)) {
        newOpenFolders.delete(folderId);
      } else {
        newOpenFolders.add(folderId);
      }
      return newOpenFolders;
    });
  };

  const handleDrop = async (
    targetFolderId: string,
    sourceContentId: string,
    sourceFolderId: string,
    sourceRootFolderId: string
  ) => {
    if (!sourceContentId || isMoving) return;
    if (targetFolderId === sourceFolderId) return;

    const targetRootId = findFolderPath(folders, targetFolderId)?.[0].id;
    if (targetRootId && targetRootId !== sourceRootFolderId) return;

    setIsMoving(true);
    try {
      await FoldersService.moveFolderContent({
        target_folder_id: targetFolderId,
        content_id: sourceContentId,
      });

      const { folders, foldersMap } = await FoldersService.getFolders();
      dispatch(setFolders({ folders, foldersMap }));
    } catch (error) {
      console.error("Error moving file:", error);
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <FolderTree
      folders={folders}
      level={0}
      isNarrow={false}
      openFolders={openFolders}
      toggleFolder={toggleFolder}
      handleDrop={handleDrop}
      dragOverFolderId={dragOverFolderId}
      setDragOverFolderId={setDragOverFolderId}
      onChildrenItemClick={onChildrenItemClick}
      isMoving={isMoving}
    />
  );
};

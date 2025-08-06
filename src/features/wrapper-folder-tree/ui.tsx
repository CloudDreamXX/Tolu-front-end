import { FoldersService, IFolder, setFolders } from "entities/folder";
import { RootState } from "entities/store";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FolderTree } from "./folder-tree";
import { findFolderPath } from "./utils";

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
  const [loading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [targetFolder, setTargetFolder] = useState<IFolder | undefined>(
    undefined
  );
  const [hasMore, setHasMore] = useState<boolean>(false);

  const findFolderInSubfolders = (
    folderId: string,
    folders: IFolder[]
  ): IFolder | null => {
    for (const folder of folders) {
      if (folder.id === folderId) {
        return folder;
      }
      if (folder.subfolders) {
        const foundInSubfolder = findFolderInSubfolders(
          folderId,
          folder.subfolders
        );
        if (foundInSubfolder) {
          return foundInSubfolder;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const { folders: newFolders, foldersMap } =
          await FoldersService.getFolders(page, limit, targetFolder?.id);

        if (targetFolder) {
          const updatedFolder = findFolderInSubfolders(
            targetFolder.id,
            newFolders
          );

          if (updatedFolder) {
            updatedFolder.content = [
              ...(targetFolder.content || []),
              ...(updatedFolder.content || []),
            ];

            const updatedFolders = newFolders.map((folder) =>
              folder.id === updatedFolder.id ? updatedFolder : folder
            );

            dispatch(setFolders({ folders: updatedFolders, foldersMap }));
          } else {
            dispatch(setFolders({ folders: newFolders, foldersMap }));
          }
        } else {
          dispatch(setFolders({ folders: newFolders, foldersMap }));
        }

        setIsLoading(false);
        setHasMore(
          (targetFolder && targetFolder.pagination.total_pages > page) || false
        );
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, [dispatch, page, limit, targetFolder?.id]);

  const handleScroll = () => {
    if (
      containerRef.current &&
      containerRef.current.scrollTop + containerRef.current.clientHeight >=
        containerRef.current.scrollHeight &&
      hasMore
    ) {
      setPage(page + 1);
    }
  };

  const FolderSkeletonRow = () => {
    const getRandomWidth = () => {
      const min = 60;
      const max = 180;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return (
      <>
        {[...Array(3)].map((_, index) => {
          const randomWidth = getRandomWidth();

          return (
            <div
              key={index}
              className="md:grid md:grid-cols-6 md:items-center md:py-[12px] flex flex-col gap-2 p-[10px] rounded-[8px] bg-white md:rounded-none md:border-x-0 animate-pulse"
            >
              <div
                className="h-[10px] skeleton-gradient rounded-[24px]"
                style={{ width: `${randomWidth}px` }}
              />
            </div>
          );
        })}
      </>
    );
  };

  const toggleFolder = (folder: IFolder) => {
    setTargetFolder(folder);
    setOpenFolders((prev) => {
      const newOpenFolders = new Set(prev);
      if (newOpenFolders.has(folder.id)) {
        newOpenFolders.delete(folder.id);
      } else {
        newOpenFolders.add(folder.id);
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

      const { folders, foldersMap } = await FoldersService.getFolders(
        page,
        limit,
        targetFolder?.id
      );
      dispatch(setFolders({ folders, foldersMap }));
    } catch (error) {
      console.error("Error moving file:", error);
    } finally {
      setIsMoving(false);
    }
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{ maxHeight: "400px", overflowY: "auto" }}
    >
      {loading ? (
        <FolderSkeletonRow />
      ) : (
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
      )}
    </div>
  );
};

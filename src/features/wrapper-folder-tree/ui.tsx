import { IFolder, setFolders } from "entities/folder";
import {
  useGetFoldersQuery,
  useMoveFolderContentMutation,
} from "entities/folder/api";
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
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [targetFolder, setTargetFolder] = useState<IFolder | undefined>(
    undefined
  );
  const [hasMore, setHasMore] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    data: folderResponse,
    isLoading,
    refetch,
  } = useGetFoldersQuery(
    {
      page,
      page_size: limit,
      folder_id: targetFolder?.id,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [moveFolderContent] = useMoveFolderContentMutation();

  useEffect(() => {
    if (folderResponse) {
      const { folders: newFolders, foldersMap } = folderResponse;
      dispatch(setFolders({ folders: newFolders, foldersMap }));

      const target = targetFolder;
      const hasNext =
        !!target?.pagination?.total_pages &&
        target.pagination.total_pages > page;
      setHasMore(hasNext);
    }
  }, [folderResponse, dispatch, page, targetFolder]);

  // const findFolderInSubfolders = (
  //   folderId: string,
  //   folders: IFolder[]
  // ): IFolder | null => {
  //   for (const folder of folders) {
  //     if (folder.id === folderId) return folder;
  //     if (folder.subfolders) {
  //       const found = findFolderInSubfolders(folderId, folder.subfolders);
  //       if (found) return found;
  //     }
  //   }
  //   return null;
  // };

  const handleScroll = () => {
    if (
      containerRef.current &&
      containerRef.current.scrollTop + containerRef.current.clientHeight >=
      containerRef.current.scrollHeight &&
      hasMore
    ) {
      setPage((prev) => prev + 1);
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
      await moveFolderContent({
        target_folder_id: targetFolderId,
        content_id: sourceContentId,
      }).unwrap();

      await refetch();
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
      {isLoading ? (
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

import { FoldersService, IFolder, setFolders } from "entities/folder";
import { RootState } from "entities/store";
import { PathEntry } from "features/document-management/hooks/util";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  FolderOpen,
  GripVertical,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "shared/lib";

interface FolderTreeProps {
  folders: IFolder[];
  level: number;
  isNarrow: boolean;
  openFolders: Set<string>;
  toggleFolder: (folderId: string) => void;
  handleDrop: (
    folderId: string,
    fileId: string,
    sourceFolderId: string,
    rootFolderId: string
  ) => void;
  dragOverFolderId: string | null;
  setDragOverFolderId: (id: string | null) => void;
  rootFolderId?: string;
  onCloseMobMenu?: () => void;
  isMoving: boolean;
}

interface WrapperFolderTreeProps {
  onCloseMobMenu?: () => void;
}

const FolderTree: React.FC<FolderTreeProps> = ({
  folders,
  level,
  isNarrow,
  openFolders,
  toggleFolder,
  handleDrop,
  dragOverFolderId,
  setDragOverFolderId,
  rootFolderId,
  onCloseMobMenu,
  isMoving,
}) => {
  const nav = useNavigate();
  const { documentId, folderId } = useParams();

  const getNumberOfContent = (folder: IFolder) => {
    let contentCount = folder.content ? folder.content.length : 0;
    if (folder.subfolders) {
      folder.subfolders.forEach((subfolder) => {
        contentCount += getNumberOfContent(subfolder);
      });
    }
    return contentCount;
  };

  return (
    <>
      <div className="ml-4">
        {folders.map((folder) => (
          <div key={folder.id}>
            <div
              className={cn(
                "flex items-center gap-3 px-4 py-[7px] cursor-pointer transition-colors",
                folderId === folder.id ? "text-blue-500" : ""
              )}
              onClick={() => toggleFolder(folder.id)}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverFolderId(folder.id);
              }}
              onDragLeave={() => setDragOverFolderId(null)}
            >
              {openFolders.has(folder.id) ? (
                <ChevronUp className="w-5 h-5 shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 shrink-0" />
              )}
              {level === 0 ? null : <FolderOpen className="w-5 h-5 shrink-0" />}
              <span>{folder.name}</span>
              <span className="rounded-full bg-[#F3F6FB] text-[10px] text-[#1C63DB] p-2 max-w-5 max-h-5 flex items-center justify-center">
                {getNumberOfContent(folder)}
              </span>
            </div>

            {folder.subfolders && openFolders.has(folder.id) && (
              <div className="pl-2">
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
                  onCloseMobMenu={onCloseMobMenu}
                  isMoving={isMoving}
                />
              </div>
            )}

            {openFolders.has(folder.id) && (
              <div
                className={cn(
                  "pl-8",
                  dragOverFolderId === folder.id &&
                    "bg-blue-50 border-l-4 border-blue-400"
                )}
                onDrop={(e) => {
                  if (isMoving) return;
                  const contentId = e.dataTransfer.getData("contentId");
                  const sourceFolderId =
                    e.dataTransfer.getData("sourceFolderId");
                  const rootFolderId = e.dataTransfer.getData("rootFolderId");
                  handleDrop(
                    folder.id,
                    contentId,
                    sourceFolderId,
                    rootFolderId
                  );
                  setDragOverFolderId(null);
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOverFolderId(folder.id);
                }}
                onDragLeave={() => setDragOverFolderId(null)}
              >
                {folder.content?.map((content) => (
                  <div
                    key={content.id}
                    className={cn(
                      "flex items-center gap-3 px-4 py-[7px] pl-4 cursor-pointer group rounded-md transition",
                      documentId === content.id
                        ? "text-blue-500"
                        : "hover:bg-gray-100"
                    )}
                    draggable
                    onDragStart={(e) => {
                      if (isMoving) return;
                      e.dataTransfer.setData("contentId", content.id);
                      e.dataTransfer.setData("sourceFolderId", folder.id);
                      e.dataTransfer.setData(
                        "rootFolderId",
                        rootFolderId || ""
                      );
                    }}
                    onDragEnd={() => setDragOverFolderId(null)}
                    onClick={() => {
                      onCloseMobMenu?.();
                      nav(
                        `/content-manager/library/folder/${rootFolderId}/document/${content.id}`
                      );
                    }}
                  >
                    <GripVertical className="w-5 h-5 shrink-0 group-hover:stroke-blue-500" />
                    <FileText className="w-5 h-5 shrink-0 group-hover:stroke-blue-500" />
                    <span className="text-nowrap text-[14px] font-semibold group-hover:text-blue-500 truncate max-w-[110px] block">
                      {content.title}
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
      </div>
      {isMoving && (
        <div className="fixed inset-0 z-50 cursor-wait bg-white/10 backdrop-blur-sm" />
      )}
    </>
  );
};

const WrapperFolderTree = ({ onCloseMobMenu }: WrapperFolderTreeProps) => {
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
    contentId: string,
    sourceFolderId: string,
    rootFolderId: string
  ) => {
    if (!contentId || isMoving) return;
    if (targetFolderId === sourceFolderId) return;

    const targetRootId = findFolderPath(folders, targetFolderId)?.[0];
    if (targetRootId && targetRootId.id !== rootFolderId) return;

    setIsMoving(true);
    try {
      await FoldersService.moveFolderContent({
        target_folder_id: targetFolderId,
        content_id: contentId,
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
      onCloseMobMenu={onCloseMobMenu}
      isMoving={isMoving}
    />
  );
};

const findFolderPath = (
  folders: IFolder[],
  targetFolderId: string,
  path: PathEntry[] = []
): PathEntry[] | null => {
  for (const folder of folders) {
    const newPath = [...path, { id: folder.id, name: folder.name }];

    if (folder.id === targetFolderId) {
      return newPath;
    }

    if (folder.subfolders?.length) {
      const result = findFolderPath(folder.subfolders, targetFolderId, newPath);
      if (result) return result;
    }
  }

  return null;
};

export default WrapperFolderTree;

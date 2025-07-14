import { useState } from "react";
import { ContentItem, Folder } from "entities/client";
import { ChevronUp, ChevronDown, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "shared/lib";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "entities/store";
import { setFolderId } from "entities/client/lib";

type WrapperProps = {
  onPopupClose?: () => void;
};

const WrapperLibraryFolderTree: React.FC<WrapperProps> = ({ onPopupClose }) => {
  const folders = useSelector((state: RootState) => state.client.folders);
  const [openFolders, setOpenFolders] = useState<Set<string>>(new Set());
  const dispatch = useDispatch();
  const nav = useNavigate();

  const folderHasChildren = (id: string): boolean => {
    const folder = folders.find((f) => f.id === id);
    return !!(folder?.subfolders?.length || folder?.content?.length);
  };

  const toggleFolder = (id: string) => {
    const isOpen = openFolders.has(id);
    dispatch(setFolderId(id));
    nav("/library");

    if (isOpen || !folderHasChildren(id)) {
      onPopupClose?.();
    }

    setOpenFolders((prev) => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <LibraryFolderTree
      folders={folders}
      level={0}
      isNarrow={false}
      openFolders={openFolders}
      toggleFolder={toggleFolder}
      onCloseMobMenu={onPopupClose}
    />
  );
};

interface Props {
  folders: Folder[];
  level: number;
  isNarrow: boolean;
  openFolders: Set<string>;
  toggleFolder: (id: string) => void;
  onCloseMobMenu?: () => void;
}

const LibraryFolderTree: React.FC<Props> = ({
  folders,
  level,
  isNarrow,
  openFolders,
  toggleFolder,
  onCloseMobMenu,
}) => {
  const nav = useNavigate();
  const { documentId } = useParams();
  const folderId = useSelector((state: RootState) => state.client.folderId);

  return (
    <div className="ml-4">
      {folders.map((folder) => (
        <div key={folder.id}>
          <div
            className={cn(
              "flex items-center gap-3 px-4 py-[7px] cursor-pointer transition-colors text-[18px] font-semibold",
              level > 0 && "text-[16px]",
              (folderId === folder.id || documentId === folder.id) &&
                "text-[#1C63DB]"
            )}
            onClick={() => toggleFolder(folder.id)}
          >
            {openFolders.has(folder.id) ? (
              <ChevronUp className="w-5 h-5 shrink-0" />
            ) : (
              <ChevronDown className="w-5 h-5 shrink-0" />
            )}
            <span>{folder.name}</span>
          </div>

          {openFolders.has(folder.id) && (
            <div className="pl-6">
              {folder.content?.length > 0
                ? folder.content.map((doc: ContentItem) => (
                    <div
                      key={doc.id}
                      className={cn(
                        "flex items-center gap-3 px-4 py-[7px] pl-4 cursor-pointer group rounded-md transition",
                        documentId === doc.id
                          ? "text-[#1C63DB]"
                          : "hover:bg-gray-100"
                      )}
                      onClick={() => {
                        onCloseMobMenu?.();
                        nav(`/library/document/${doc.id}`);
                      }}
                    >
                      <FileText className="w-5 h-5 shrink-0 group-hover:stroke-blue-500" />
                      <span className="truncate max-w-[110px] text-[16px] font-semibold group-hover:text-blue-500">
                        {doc.title}
                      </span>
                    </div>
                  ))
                : !folder.subfolders?.length && (
                    <p className="px-4 py-2 text-sm italic text-gray-400">
                      No content
                    </p>
                  )}

              {folder.subfolders && folder.subfolders?.length > 0 && (
                <LibraryFolderTree
                  folders={folder.subfolders}
                  level={level + 1}
                  isNarrow={isNarrow}
                  openFolders={openFolders}
                  toggleFolder={toggleFolder}
                  onCloseMobMenu={onCloseMobMenu}
                />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default WrapperLibraryFolderTree;

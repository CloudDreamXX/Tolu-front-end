import { NewFolder, setFolders } from "entities/folder";
import { FoldersService } from "entities/folder/api";
import { RootState } from "entities/store";
import { Edit, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ArrowBack from "shared/assets/icons/arrowBack";
import ClosedFolder from "shared/assets/icons/closed-folder";
import Dots from "shared/assets/icons/dots";
import { Eye } from "shared/assets/icons/eye";
import Plus from "shared/assets/icons/plus";
import SubfolderIcon from "shared/assets/icons/subfolders";
import { toast } from "shared/lib/hooks/use-toast";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Badge,
} from "shared/ui";
import { CreateSubfolderPopup } from "widgets/CreateSubfolderPopup";

interface PopoverFolderProps {
  setFolderId?: (folderId: string) => void;
  customTrigger?: React.ReactNode;
}

export const PopoverFolder: React.FC<PopoverFolderProps> = ({
  setFolderId,
  customTrigger,
}) => {
  const [search, setSearch] = useState<string>("");
  const { foldersMap } = useSelector((state: RootState) => state.folder);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [selectedFolderName, setSelectedFolderName] = useState<string>("");
  const [subfolders, setSubfolders] = useState<{ name: string; id: string }[]>(
    []
  );
  const token = useSelector((state: RootState) => state.user.token);
  const [createPopup, setCreatePopup] = useState<boolean>(false);
  const [subfolderPopup, setSubfolderPopup] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [parentFolderId, setParentFolderId] = useState<string | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await FoldersService.getFolders();
        dispatch(setFolders(response));
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchFolders();
  }, [token, dispatch]);

  const folderData = Object.keys(foldersMap)
    .map((category) =>
      foldersMap[category].map(
        (folder: {
          name: string;
          id: string;
          subfolders: { name: string; id: string }[];
        }) => ({
          name: folder.name,
          id: folder.id,
          subfolders: folder.subfolders || [],
        })
      )
    )
    .flat();

  const filteredFolders = useMemo(() => {
    return folderData.filter((folder) =>
      folder.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, folderData]);

  const toggleFolderSelection = (folder: {
    name: string;
    id: string;
    subfolders?: { name: string; id: string }[];
  }) => {
    if (subfolderPopup) {
      setSelectedFolder(folder.id);
      setSelectedFolderName(folder.name);
      console.log("Selected folder:", folder.name);
      setFolderId && setFolderId(folder.id);
      setPopoverOpen(false);
      return;
    }

    if (folder.subfolders && folder.subfolders.length > 0) {
      setSelectedFolder(null);
      setSubfolders(folder.subfolders);
      setSelectedFolderName(folder.name);
      setParentFolderId(folder.id);
      setSubfolderPopup(true);
    } else {
      setParentFolderId(folder.id);
      setSelectedFolderName(folder.name);
      toast({
        title: "Please add a subfolder",
        description: "You must create or select a subfolder to proceed.",
        variant: "destructive",
      });
    }
  };

  const createFolder = async (name: string, description: string) => {
    try {
      const newFolder: NewFolder = {
        name: name,
        description: description,
        parent_folder_id: parentFolderId as string,
      };

      const response = await FoldersService.createFolder(newFolder, token);
      const newFolderId = response.folder.id;

      setFolderId && setFolderId(newFolderId);
      setSelectedFolder(newFolderId);

      toast({ title: "Created successfully" });
      setCreatePopup(false);

      const folderResponse = await FoldersService.getFolders();
      dispatch(setFolders(folderResponse));

      const updatedParentFolder = Object.values(folderResponse)
        .flat()
        .find((folder) => folder.id === parentFolderId);

      if (updatedParentFolder && updatedParentFolder.subfolders) {
        setSubfolders(updatedParentFolder.subfolders);
        setSubfolderPopup(true);
      }
    } catch (error) {
      console.error("Error creating a folder:", error);
      toast({
        variant: "destructive",
        title: "Failed to create a folder",
        description: "Failed to create a folder. Please try again.",
      });
    }
  };

  const handleBackClick = () => {
    setSubfolderPopup(false);
    setSubfolders([]);
    setParentFolderId(null);
  };

  const handleCreateSubfolder = (parentId: string, parentName: string) => {
    setParentFolderId(parentId);
    setSelectedFolderName(parentName);
    setCreatePopup(true);
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          {customTrigger ?? (
            <Button
              variant="secondary"
              className="w-12 h-12 p-[10px] rounded-full relative"
            >
              <ClosedFolder />
              {selectedFolder && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center px-1 rounded-full text-[10px] font-bold"
                >
                  1
                </Badge>
              )}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-[526px] p-6 flex flex-col gap-6">
          {!subfolderPopup ? (
            <>
              <Input
                variant="bottom-border"
                placeholder="Choose a folder"
                className="py-1/2 h-[26px] pl-2 bg-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="grid w-full grid-cols-2 overflow-y-auto max-h-[250px] gap-x-6 gap-y-2">
                {filteredFolders.map((folder) => (
                  <button
                    className={`flex flex-row rounded-[10px] shadow-lg justify-between w-full py-2 px-[14px] gap-2 ${
                      selectedFolder === folder.id
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-white"
                    }`}
                    key={folder.id}
                    onClick={() => toggleFolderSelection(folder)}
                  >
                    <span className="text-lg font-semibold text-gray-900 truncate">
                      {folder.name}
                    </span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-8 h-8 p-0 rounded-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Dots />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-3 flex flex-col gap-3 bg-white">
                        <Button
                          variant="ghost"
                          className="items-center justify-start w-full h-8 p-1 font-medium"
                          onClick={() =>
                            handleCreateSubfolder(folder.id, folder.name)
                          }
                        >
                          <Plus width={24} height={24} /> Add subfolder
                        </Button>
                        {folder.subfolders && folder.subfolders.length > 0 && (
                          <Button
                            variant="ghost"
                            className="items-center justify-start w-full h-8 p-1 font-medium"
                            onClick={() => toggleFolderSelection(folder)}
                          >
                            <SubfolderIcon width={24} height={24} /> View
                            subfolders
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          className="items-center justify-start w-full h-8 p-1 font-medium"
                        >
                          <Edit width={24} height={24} /> Rename
                        </Button>
                        <Button
                          variant="ghost"
                          className="items-center justify-start w-full h-8 p-1 font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2
                            width={24}
                            height={24}
                            className="text-destructive"
                          />{" "}
                          Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <button onClick={handleBackClick}>
                  <ArrowBack color="#1D1D1F" />
                </button>
                <div className="text-[18px] font-semibold text-black flex items-center gap-2">
                  {selectedFolderName}
                  <button
                    onClick={() =>
                      handleCreateSubfolder(parentFolderId!, selectedFolderName)
                    }
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <Plus />
                  </button>
                </div>
              </div>
              <div className="grid w-full grid-cols-2 overflow-y-auto max-h-[200px] gap-x-6 gap-y-2">
                {subfolders.map((subfolder) => (
                  <button
                    className={`flex flex-row rounded-[10px] shadow-lg justify-between w-full py-2 px-[14px] gap-2 ${
                      selectedFolder === subfolder.id
                        ? "bg-blue-50 border border-blue-200"
                        : "bg-white"
                    }`}
                    key={subfolder.id}
                    onClick={() => toggleFolderSelection(subfolder)}
                  >
                    <span className="text-lg font-semibold text-gray-900 truncate">
                      {subfolder.name}
                    </span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-8 h-8 p-0 rounded-full"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Dots />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-3 flex flex-col gap-3 bg-white">
                        <Button
                          variant="ghost"
                          className="items-center justify-start w-full h-8 p-1 font-medium"
                        >
                          <Eye /> View source files
                        </Button>
                        <Button
                          variant="ghost"
                          className="items-center justify-start w-full h-8 p-1 font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2
                            width={24}
                            height={24}
                            className="text-destructive"
                          />{" "}
                          Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </button>
                ))}
              </div>
            </>
          )}
        </PopoverContent>
      </Popover>

      {createPopup && (
        <CreateSubfolderPopup
          onClose={() => setCreatePopup(false)}
          onComplete={createFolder}
        />
      )}
    </>
  );
};

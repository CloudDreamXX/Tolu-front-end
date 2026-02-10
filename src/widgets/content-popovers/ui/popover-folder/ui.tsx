import { IFolder, ISubfolder, NewFolder, setFolders } from "entities/folder";
import {
  useGetFoldersQuery,
  useCreateFolderMutation,
  useDeleteFolderMutation,
} from "entities/folder/api";
import { RootState } from "entities/store";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { toast } from "shared/lib/hooks/use-toast";
import {
  Badge,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/ui";
import { CreateSubfolderPopup } from "widgets/CreateSubfolderPopup";
import { DeleteMessagePopup } from "widgets/DeleteMessagePopup";

interface PopoverFolderProps {
  folderId?: string;
  setFolderId?: (folderId: string) => void;
  customTrigger?: React.ReactNode;
  setExistingFiles?: (files: string[]) => void;
  setExistingInstruction?: (instruction: string) => void;
  smallChat?: boolean;
}

export const PopoverFolder: React.FC<PopoverFolderProps> = ({
  folderId,
  setFolderId,
  customTrigger,
  setExistingFiles,
  setExistingInstruction,
  smallChat,
}) => {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(
    folderId || null
  );
  const [selectedFolderName, setSelectedFolderName] = useState<string>("");
  const [subfolders, setSubfolders] = useState<ISubfolder[]>([]);
  const [createPopup, setCreatePopup] = useState<boolean>(false);
  const [subfolderPopup, setSubfolderPopup] = useState<boolean>(false);
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  const [parentFolderId, setParentFolderId] = useState<string | null>(null);
  const [folderHistory, setFolderHistory] = useState<
    { id: string; name: string; subfolders: ISubfolder[] }[]
  >([]);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const dispatch = useDispatch();
  const { folders: allFolders } = useSelector(
    (state: RootState) => state.folder
  );

  const {
    data: folderResponse,
    isFetching,
    refetch: refetchFolders,
  } = useGetFoldersQuery(undefined, { refetchOnMountOrArgChange: true });
  const [createFolder] = useCreateFolderMutation();
  const [deleteFolder] = useDeleteFolderMutation();

  useEffect(() => {
    if (folderResponse) {
      dispatch(setFolders(folderResponse));
      const firstFolder =
        folderResponse.folders[1] ?? folderResponse.folders[0];
      if (firstFolder?.subfolders) {
        setSubfolders(firstFolder.subfolders);
        setSelectedFolderName(firstFolder.name);
        setParentFolderId(firstFolder.id);
        setSubfolderPopup(true);
      }
    }
  }, [folderResponse, dispatch]);

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

  const folderToDelete = useMemo(() => {
    return selectedFolder ? findFolder(selectedFolder, allFolders) : undefined;
  }, [selectedFolder, allFolders]);

  const hasContentInside =
    (folderToDelete && folderToDelete?.content?.length > 0) || false;

  useEffect(() => {
    if (!folderId) {
      setSelectedFolder(null);
      return;
    }

    setSelectedFolder(folderId);
    const folder = findFolder(folderId, allFolders);

    if (folder) {
      setExistingFiles?.(folder.fileNames?.map((f) => f.filename) ?? []);
      setExistingInstruction?.(folder.customInstructions ?? "");
      setParentFolderId((folder as any).parent_folder_id ?? parentFolderId);
    } else {
      setExistingFiles?.([]);
      setExistingInstruction?.("");
    }
  }, [folderId, allFolders]);

  const handleCreateFolder = async (name: string, description: string) => {
    if (!parentFolderId) return;
    try {
      const newFolder: NewFolder = {
        name,
        description,
        parent_folder_id: parentFolderId,
      };
      const response = await createFolder(newFolder).unwrap();

      setFolderId?.(response.data.folder.id);
      setSelectedFolder(response.data.folder.id);
      toast({ title: "Folder created successfully" });
      setCreatePopup(false);
      await refetchFolders();
    } catch (error) {
      console.error("Error creating folder:", error);
      toast({
        variant: "destructive",
        title: "Failed to create folder",
        description: "Please try again.",
      });
    }
  };

  const handleDeleteFolder = async () => {
    if (!selectedFolder) return;
    try {
      await deleteFolder({
        folder_id: selectedFolder,
        force_delete: hasContentInside,
      }).unwrap();

      toast({ title: "Folder deleted successfully" });
      setIsDeleteOpen(false);
      setSelectedFolder(null);
      setSelectedFolderName("");
      await refetchFolders();
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast({
        variant: "destructive",
        title: "Failed to delete folder",
        description: "Please try again.",
      });
    }
  };

  const toggleFolderSelection = (folder: IFolder) => {
    if (subfolderPopup) {
      setSelectedFolder(folder.id);
      setFolderId?.(folder.id);
      setExistingFiles?.(folder.fileNames?.map((f) => f.filename) || []);
      setExistingInstruction?.(folder.customInstructions ?? "");
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

  const handleCreateSubfolder = (parentId: string) => {
    setParentFolderId(parentId);
    setCreatePopup(true);
  };

  const handleDeleteOpen = (id: string, name: string) => {
    setSelectedFolder(id);
    setSelectedFolderName(name);
    setIsDeleteOpen(true);
  };

  return (
    <>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          {customTrigger ?? (
            <Button
              variant={smallChat ? "default" : "secondary"}
              className={`w-12 h-12 p-[10px] rounded-full relative ${smallChat ? "text-[#1C63DB]" : "bg-[#F3F6FB]"}`}
            >
              <MaterialIcon iconName="folder" />
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

        <PopoverContent className="w-[358px] md:w-[526px] p-6 flex flex-col gap-6">
          <div className="text-[18px] font-semibold text-black flex items-center justify-between gap-2">
            <div className="flex gap-[8px] items-center">
              {folderHistory.length > 0 && (
                <Button
                  variant={"unstyled"}
                  size={"unstyled"}
                  className="p-1 rounded w-fit hover:bg-gray-100"
                  onClick={() => {
                    const previous = folderHistory[folderHistory.length - 1];
                    setFolderHistory((prev) => prev.slice(0, -1));
                    setSelectedFolder(null);
                    setSubfolders(previous.subfolders);
                    setSelectedFolderName(previous.name);
                    setParentFolderId(previous.id);
                  }}
                >
                  <MaterialIcon iconName="arrow_back" />
                </Button>
              )}
              {selectedFolderName || "Folders"}
            </div>
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              onClick={() => handleCreateSubfolder(parentFolderId!)}
              className="p-1 rounded hover:bg-gray-100"
            >
              <MaterialIcon iconName="add" />
            </Button>
          </div>

          <div className="grid w-full md:grid-cols-2 overflow-y-auto max-h-[200px] gap-x-6 gap-y-2">
            {isFetching ? (
              <p className="text-gray-400 italic">Loading folders...</p>
            ) : subfolders.length > 0 ? (
              subfolders.map((subfolder) => (
                <Button
                  variant={"unstyled"}
                  size={"unstyled"}
                  className={`flex flex-row rounded-[10px] shadow-lg justify-between w-full py-2 px-[14px] gap-2 ${selectedFolder === subfolder.id
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
                        <MaterialIcon iconName="more_vert" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-3 flex flex-col gap-3 bg-white">
                      <Button
                        variant="ghost"
                        className="items-center justify-start w-full h-8 p-1 font-medium"
                        onClick={() => handleCreateSubfolder(subfolder.id)}
                      >
                        <MaterialIcon iconName="add" />
                        Create folder
                      </Button>
                      <Button
                        variant="ghost"
                        className="items-center justify-start w-full h-8 p-1 font-medium"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (subfolder.subfolders?.length) {
                            setFolderHistory((prev) => [
                              ...prev,
                              {
                                id: parentFolderId!,
                                name: selectedFolderName,
                                subfolders,
                              },
                            ]);
                            setSelectedFolder(null);
                            setSubfolders(subfolder.subfolders);
                            setSelectedFolderName(subfolder.name);
                            setParentFolderId(subfolder.id);
                            setSubfolderPopup(true);
                          } else {
                            toast({
                              title: "No subfolders available",
                              description:
                                "This folder has no nested subfolders.",
                            });
                          }
                        }}
                      >
                        <MaterialIcon iconName="folder" fill={1} /> Open folders
                      </Button>
                      <Button
                        variant="ghost"
                        className="items-center justify-start w-full h-8 p-1 font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() =>
                          handleDeleteOpen(subfolder.id, subfolder.name)
                        }
                      >
                        <MaterialIcon
                          iconName="delete"
                          fill={1}
                          className="text-destructive"
                        />
                        Delete
                      </Button>
                    </PopoverContent>
                  </Popover>
                </Button>
              ))
            ) : (
              <p className="text-gray-500">No subfolders found</p>
            )}
          </div>
        </PopoverContent>
      </Popover>

      {isDeleteOpen && (
        <DeleteMessagePopup
          contentId={selectedFolder ?? ""}
          onCancel={() => setIsDeleteOpen(false)}
          onDelete={handleDeleteFolder}
          text={
            hasContentInside
              ? "This folder contains documents. Are you sure you want to delete it?"
              : undefined
          }
        />
      )}

      {createPopup && (
        <CreateSubfolderPopup
          onClose={() => setCreatePopup(false)}
          onComplete={handleCreateFolder}
        />
      )}
    </>
  );
};

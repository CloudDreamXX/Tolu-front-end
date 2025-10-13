import { ISubfolder, setFolders } from "entities/folder";
import {
  useGetFoldersQuery,
  useCreateFolderMutation,
} from "entities/folder/api";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { toast } from "shared/lib/hooks/use-toast";
import { Button, Popover, PopoverContent, PopoverTrigger } from "shared/ui";
import { CreateSubfolderPopup } from "widgets/CreateSubfolderPopup";
interface ChooseSubfolderPanelProps {
  parentFolderId: string;
  selectedFolderId: string | null;
  onSelect: (folderId: string) => void;
}

export const ChooseSubfolderPanel: React.FC<ChooseSubfolderPanelProps> = ({
  parentFolderId,
  selectedFolderId,
  onSelect,
}) => {
  const [subfolders, setSubfolders] = useState<ISubfolder[]>([]);
  const [selectedFolderName, setSelectedFolderName] = useState<string>("");
  const [createPopup, setCreatePopup] = useState(false);
  const dispatch = useDispatch();

  const {
    data: folderResponse,
    refetch: refetchFolders,
    isFetching,
  } = useGetFoldersQuery(undefined, { refetchOnMountOrArgChange: true });

  const [createFolder] = useCreateFolderMutation();

  useEffect(() => {
    if (!folderResponse) return;

    dispatch(setFolders(folderResponse));

    const selectedFolder = folderResponse.folders.find(
      (f) => f.id === parentFolderId
    );

    if (selectedFolder?.subfolders) {
      setSubfolders(selectedFolder.subfolders);
      setSelectedFolderName(selectedFolder.name);
    }
  }, [folderResponse, parentFolderId, dispatch]);

  const handleCreateSubfolder = async (
    name: string,
    description: string
  ): Promise<void> => {
    try {
      await createFolder({
        name,
        description,
        parent_folder_id: parentFolderId,
      }).unwrap();

      toast({ title: "Subfolder created successfully" });
      setCreatePopup(false);
      await refetchFolders();
    } catch (error) {
      console.error("Error creating subfolder:", error);
      toast({
        variant: "destructive",
        title: "Failed to create subfolder",
        description: "Please try again.",
      });
    }
  };

  const currentParent = useMemo(() => {
    if (!folderResponse) return null;
    return folderResponse.folders.find((f) => f.id === parentFolderId) ?? null;
  }, [folderResponse, parentFolderId]);

  useEffect(() => {
    if (currentParent?.subfolders) {
      setSubfolders(currentParent.subfolders);
      setSelectedFolderName(currentParent.name);
    }
  }, [currentParent]);

  return (
    <div className="w-full">
      <div className="text-[18px] font-semibold text-black flex items-center justify-between">
        {selectedFolderName || "Folder"}
        <button
          onClick={() => setCreatePopup(true)}
          className="p-1 ml-auto rounded hover:bg-gray-100"
        >
          <MaterialIcon iconName="add" />
        </button>
      </div>

      {isFetching && (
        <p className="text-sm text-gray-400 italic mt-2">
          Loading subfolders...
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto py-4">
        {subfolders.length ? (
          subfolders.map((subfolder) => (
            <button
              key={subfolder.id}
              className={`flex justify-between items-center py-2 px-3 rounded-[10px] shadow-lg ${
                selectedFolderId === subfolder.id
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-white"
              }`}
              onClick={() => onSelect(subfolder.id)}
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
                  >
                    <MaterialIcon iconName="visibility" />
                    View source files
                  </Button>
                  <Button
                    variant="ghost"
                    className="items-center justify-start w-full h-8 p-1 font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <MaterialIcon
                      iconName="delete"
                      fill={1}
                      className="text-[#FF1F0F]"
                    />
                    Delete
                  </Button>
                </PopoverContent>
              </Popover>
            </button>
          ))
        ) : (
          <div className="text-gray-500">
            {isFetching ? "Loading..." : "No subfolders found"}
          </div>
        )}
      </div>

      {createPopup && (
        <CreateSubfolderPopup
          onClose={() => setCreatePopup(false)}
          onComplete={handleCreateSubfolder}
        />
      )}
    </div>
  );
};

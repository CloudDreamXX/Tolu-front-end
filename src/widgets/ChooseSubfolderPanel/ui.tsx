import { ISubfolder, setFolders } from "entities/folder";
import { FoldersService } from "entities/folder/api";
import { RootState } from "entities/store";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Dots from "shared/assets/icons/dots";
import { Eye } from "shared/assets/icons/eye";
import Plus from "shared/assets/icons/plus";
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
  const { folders } = useSelector((state: RootState) => state.folder);
  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    const fetchSubfolders = async () => {
      try {
        const folderResponse = await FoldersService.getFolders();
        dispatch(setFolders(folderResponse));

        const parentFolder = folderResponse.folders.find(
          (f) => f.id === parentFolderId
        );

        if (parentFolder?.subfolders) {
          setSubfolders(parentFolder.subfolders);
          setSelectedFolderName(parentFolder.name);
        }
      } catch (error) {
        console.error("Error fetching folders:", error);
      }
    };

    fetchSubfolders();
  }, [parentFolderId, dispatch, token]);

  const handleCreateSubfolder = async (
    name: string,
    description: string
  ): Promise<void> => {
    try {
      const response = await FoldersService.createFolder({
        name,
        description,
        parent_folder_id: parentFolderId,
      });

      onSelect(response.folder.id);
      setCreatePopup(false);
      toast({ title: "Created successfully" });

      const folderResponse = await FoldersService.getFolders();
      dispatch(setFolders(folderResponse));

      const updatedParent = folderResponse.folders.find(
        (f) => f.id === parentFolderId
      );

      if (updatedParent?.subfolders) {
        setSubfolders(updatedParent.subfolders);
      }
    } catch (error) {
      console.error("Error creating subfolder:", error);
    }
  };

  return (
    <div className="w-full">
      <div className="text-[18px] font-semibold text-black flex items-center justify-between mb-3">
        {selectedFolderName}
        <button
          onClick={() => setCreatePopup(true)}
          className="p-1 rounded hover:bg-gray-100 ml-auto"
        >
          <Plus />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[300px] overflow-y-auto">
        {subfolders.map((subfolder) => (
          <button
            key={subfolder.id}
            className={`flex justify-between items-center py-2 px-3 rounded-[10px] shadow-lg ${selectedFolderId === subfolder.id
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
                  <Trash2 className="text-destructive" /> Delete
                </Button>
              </PopoverContent>
            </Popover>
          </button>
        ))}
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

import { Edit, PlusIcon, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import ClosedFolder from "shared/assets/icons/closed-folder";
import Dots from "shared/assets/icons/dots";
import Plus from "shared/assets/icons/plus";
import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Input,
  Badge,
} from "shared/ui";

interface PopoverFolderProps {
  customTrigger?: React.ReactNode;
}

export const PopoverFolder: React.FC<PopoverFolderProps> = ({
  customTrigger,
}) => {
  const [search, setSearch] = useState<string>("");
  const [folders] = useState<string[]>([
    "Mood Sings",
    "Hormones 101",
    "Menopause Migraines",
    "Lifestyle",
    "Anxiety",
    "Food Sensitivities",
    "Hot Flashes",
    "Sleep Disturbance",
  ]);
  const [selectedFolders, setSelectedFolders] = useState<string[]>([]);

  const filteredFolders = useMemo(() => {
    return folders.filter((folder) =>
      folder.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, folders]);

  const toggleFolderSelection = (folder: string) => {
    setSelectedFolders((prev) =>
      prev.includes(folder)
        ? prev.filter((f) => f !== folder)
        : [...prev, folder]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        {customTrigger ?? (
          <Button
            variant="secondary"
            className="w-12 h-12 p-[10px] rounded-full relative"
          >
            <ClosedFolder />
            {selectedFolders.length > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 min-w-5 h-5 flex items-center justify-center px-1 rounded-full text-[10px] font-bold"
              >
                {selectedFolders.length}
              </Badge>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[526px] p-6 flex flex-col gap-6">
        <Input
          variant="bottom-border"
          iconRight={<PlusIcon className="relative left-3" />}
          placeholder="Choose a folder"
          className="py-1/2 h-[26px] pl-2 bg-transparent"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grid w-full grid-cols-2 overflow-y-auto max-h-[250px] gap-x-6 gap-y-2">
          {filteredFolders.map((folder, index) => (
            <button
              className={`flex flex-row rounded-[10px] shadow-lg justify-between w-full py-2 px-[14px] gap-2 ${
                selectedFolders.includes(folder)
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-white"
              }`}
              key={folder}
              onClick={() => toggleFolderSelection(folder)}
            >
              <span className="text-lg font-semibold text-gray-900 truncate">
                {folder}
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
                    <Plus width={24} height={24} /> Add subfolder
                  </Button>
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
      </PopoverContent>
    </Popover>
  );
};

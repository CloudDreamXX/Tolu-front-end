import { TableRow } from "../../models";
import { LibraryItemCard } from "../library-item-card";

interface LibraryMobileViewProps {
  filteredItems: TableRow[];
  expandedFolders: Set<string>;
  toggleFolder: (id: string) => void;
}

export const LibraryMobileView: React.FC<LibraryMobileViewProps> = ({
  filteredItems,
  expandedFolders,
  toggleFolder,
}) => {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      {filteredItems.map((folder) => (
        <LibraryItemCard
          key={folder.id}
          item={folder}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
          level={0}
        />
      ))}
    </div>
  );
};

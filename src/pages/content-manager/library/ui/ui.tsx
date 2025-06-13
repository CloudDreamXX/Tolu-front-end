import AiCreate from "shared/assets/icons/ai-create";
import Search from "shared/assets/icons/search";
import { useEffect, useState } from "react";
import { Input } from "shared/ui";
import { FoldersService, setFolders } from "entities/folder";
import { RootState } from "entities/store";
import { useSelector, useDispatch } from "react-redux";
import { DateSelector } from "shared/ui/date-selector";
import { useLibraryLogic } from "../lib";
import { LibraryMobileView } from "./mobile-table";
import { LibraryDesktopView } from "./desktop-table";

export const ContentManagerLibrary: React.FC = () => {
  const [choosedDate, setChoosedDate] = useState<Date>(new Date());
  const [search, setSearch] = useState<string>("");
  const token = useSelector((state: RootState) => state.user.token);
  const folders = useSelector((state: RootState) => state.folder);
  const dispatch = useDispatch();

  const { expandedFolders, toggleFolder, filteredItems } = useLibraryLogic(
    folders.folders,
    search
  );

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
  }, [token, dispatch]);

  return (
    <div className="flex flex-col gap-12 p-8 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
          <AiCreate width={24} height={24} fill="#000" />
          Library
        </h1>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col-reverse gap-[16px] md:flex-row justify-between w-full">
          <DateSelector
            choosedDate={choosedDate}
            onDateChange={setChoosedDate}
          />
          <div className="w-full md:w-[300px]">
            <Input
              placeholder="Search"
              icon={<Search />}
              className="rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <LibraryMobileView
          filteredItems={filteredItems}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
        />

        <LibraryDesktopView
          filteredItems={filteredItems}
          expandedFolders={expandedFolders}
          toggleFolder={toggleFolder}
        />
      </div>
    </div>
  );
};

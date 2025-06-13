import {
  DocumentCard,
  FolderCard,
  IDocumentMock,
  IFolderMock,
} from "entities/folder";
import { ChevronDown, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import AiCreate from "shared/assets/icons/ai-create";
import Search from "shared/assets/icons/search";
import { formatDateToSlash } from "shared/lib";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
} from "shared/ui";
import { FOLDERS } from "../folder/mock";
import { MOCK_DOCUMENT } from "../document/mock";

export const ContentManagerApproved: React.FC = () => {
  const [folders] = useState<IFolderMock[]>(
    FOLDERS.filter((doc) => doc.status === "ready-to-publish")
  );
  const [documents] = useState<IDocumentMock[]>(
    MOCK_DOCUMENT.filter((doc) => doc.reviewStatus === "ready-to-publish")
  );
  const [choosedDate, setChoosedDate] = useState<Date>(new Date());
  const [search, setSearch] = useState<string>("");

  const filteredItems = useMemo(() => {
    const folderItems = folders.filter((folder) => {
      return folder.name.toLowerCase().includes(search.toLowerCase());
    });
    const documentItems = documents.filter((document) => {
      return document.title.toLowerCase().includes(search.toLowerCase());
    });
    return [...folderItems, ...documentItems];
  }, [folders, choosedDate]);

  return (
    <div className="flex flex-col gap-12 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
          <AiCreate width={24} height={24} fill="#000" />
          Approved contents{" "}
        </h1>
        <p className="text-sm font-medium">
          These contents are approved by certified reviewer and ready to get
          published in public library.
        </p>
      </div>
      <div className="flex flex-col gap-12">
        <div className="flex flex-row justify-between w-full">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex flex-row gap-1.5 items-center text-sm">
              {formatDateToSlash(choosedDate)} <ChevronDown size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
              <div className="flex flex-col gap-2 p-4">
                <h2 className="text-sm font-semibold">Select date</h2>
                <input
                  type="date"
                  value={choosedDate.toISOString().split("T")[0]}
                  onChange={(e) => setChoosedDate(new Date(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="flex flex-row gap-2">
            <Button variant={"blue2"}>
              <Plus size={16} />
              New folder
            </Button>
            <div className="w-[300px]">
              <Input
                placeholder="Search"
                icon={<Search />}
                className="rounded-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap w-full gap-4">
          {filteredItems.slice(0, 10).map((item) => {
            if ("documents" in item) {
              return <FolderCard key={item.id} folder={item} />;
            } else {
              return <DocumentCard key={item.id} document={item} />;
            }
          })}
        </div>
      </div>
    </div>
  );
};

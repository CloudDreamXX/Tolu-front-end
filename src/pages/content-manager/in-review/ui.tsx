import { DocumentCard, IDocumentMock } from "entities/folder";
import { ChevronDown } from "lucide-react";
import React, { useMemo, useState } from "react";
import AiCreate from "shared/assets/icons/ai-create";
import Search from "shared/assets/icons/search";
import { formatDateToSlash } from "shared/lib";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  Input,
} from "shared/ui";
import { MOCK_DOCUMENT } from "../document/mock";

export const ContentManagerInReview: React.FC = () => {
  const [documents] = useState<IDocumentMock[]>(
    MOCK_DOCUMENT.filter((doc) => doc.status === "in-review")
  );
  const [choosedDate, setChoosedDate] = useState<Date>(new Date());
  const [search, setSearch] = useState<string>("");

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      return doc.aiTitle.toLowerCase().includes(search.toLowerCase());
    });
  }, [documents, choosedDate]);

  return (
    <div className="flex flex-col gap-12 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
          <AiCreate width={24} height={24} fill="#000" />
          In-review contents{" "}
        </h1>
        <p className="text-sm font-medium">
          These contents are under review by certified or licensed health
          professionals. Once approved they can be marked ready to get published
          in public library.
        </p>
      </div>
      <div className="flex flex-col gap-6">
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
          <div className="max-w-[300px] w-full">
            <Input
              placeholder="Search"
              icon={<Search />}
              className="rounded-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-row flex-wrap w-full gap-4">
          {filteredDocuments.map((doc) => (
            <DocumentCard key={doc.aiTitle} document={doc} />
          ))}
        </div>
      </div>
    </div>
  );
};

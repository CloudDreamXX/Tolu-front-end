import { ClientService, Folder } from "entities/client";
import { setFolders, setLoading } from "entities/client/lib";
import { ContentService, ContentStatus } from "entities/content";
import { HealthHistory } from "entities/health-history";
import { RootState } from "entities/store";
import { LibraryCard } from "features/library-card";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BookMark from "shared/assets/icons/book-mark";
import GlobeIcon from "shared/assets/icons/globe";
import TwoUsersIcon from "shared/assets/icons/two-users";
import { usePageWidth } from "shared/lib";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Input,
  ScrollArea,
} from "shared/ui";
import { HealthProfileForm } from "widgets/health-profile-form";

interface LibraryClientContentProps {
  healthHistory?: HealthHistory;
}

export const LibraryClientContent = ({
  healthHistory,
}: LibraryClientContentProps) => {
  const [search, setSearch] = useState("");
  const [statusMap, setStatusMap] = useState<Record<string, ContentStatus>>({});
  const [filteredFolders, setFilteredFolders] = useState<Folder[]>([]);

  const { isMobile } = usePageWidth();
  const nav = useNavigate();
  const folders = useSelector((state: RootState) => state.client.folders);
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.client.loading);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(setLoading(true));

        const response = await ClientService.getLibraryContent();
        dispatch(setFolders(response.folders));

        const statusMapFromContent: Record<string, ContentStatus> = {};
        const collectStatuses = (folders: Folder[]) => {
          folders.forEach((folder) => {
            folder.content?.forEach((item) => {
              if (item.status) {
                statusMapFromContent[item.id] = {
                  content_id: item.id,
                  status: item.status,
                };
              }
            });
            if (folder.subfolders) collectStatuses(folder.subfolders);
          });
        };

        collectStatuses(response.folders);
        setStatusMap(statusMapFromContent);
      } catch (error) {
        console.error("Failed to fetch library content:", error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filterFoldersAndContent = (folders: Folder[], searchTerm: string) => {
      return folders
        .filter((folder) => {
          const folderMatches = folder.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

          const contentMatches = folder.content?.some((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
          );

          const subfolderMatches = folder.subfolders?.some((subfolder) =>
            subfolder.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          return folderMatches || contentMatches || subfolderMatches;
        })
        .map((folder) => {
          const filteredContent = folder.content?.filter((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
          );
          const filteredSubfolders = folder.subfolders?.filter((subfolder) =>
            subfolder.name.toLowerCase().includes(searchTerm.toLowerCase())
          );

          return {
            ...folder,
            content: filteredContent,
            subfolders: filteredSubfolders,
          };
        });
    };

    const filtered = filterFoldersAndContent(folders, search);
    setFilteredFolders(filtered);
  }, [search, folders]);

  const LibraryCardSkeleton = () => {
    const getRandomWidth = (min: number, max: number) =>
      `${Math.floor(Math.random() * (max - min + 1)) + min}px`;

    return (
      <div
        className="w-full flex flex-col items-start p-4 gap-[8px] animate-pulse"
        style={{
          borderRadius: "18px",
          border: "1px solid #5F5F65",
          backgroundColor: "#FFF",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.04)",
        }}
      >
        <div className="flex items-center justify-between w-full">
          <div
            className="h-[12px] rounded-[8px] skeleton-gradient"
            style={{ width: getRandomWidth(160, 250) }}
          />
          <BookMark color="#5F5F65" />
        </div>
        <div className="bg-[#F5F5F5] p-[8px] rounded-[8px]">
          <div
            className="h-[12px] rounded-[8px] skeleton-gradient max-w-[250px] md:max-w-none"
            style={{ width: getRandomWidth(180, 300) }}
          />
        </div>
        <div className="flex w-full justify-between pt-[8px]">
          <div className="flex flex-col items-left gap-[4px]">
            <div
              className="h-[10px] rounded-[24px] skeleton-gradient"
              style={{ width: getRandomWidth(100, 150) }}
            />
            <div
              className="h-[10px] rounded-[24px] skeleton-gradient"
              style={{ width: getRandomWidth(100, 150) }}
            />
          </div>
          <div className="hidden md:flex flex-col items-left gap-[4px]">
            <div
              className="h-[10px] rounded-[24px] skeleton-gradient"
              style={{ width: getRandomWidth(100, 150) }}
            />
            <div
              className="h-[10px] rounded-[24px] skeleton-gradient"
              style={{ width: getRandomWidth(100, 150) }}
            />
          </div>
          <div className="hidden md:flex flex-col items-left gap-[4px]">
            <div
              className="h-[10px] rounded-[24px] skeleton-gradient"
              style={{ width: getRandomWidth(100, 150) }}
            />
            <div
              className="h-[10px] rounded-[24px] skeleton-gradient"
              style={{ width: getRandomWidth(100, 150) }}
            />
          </div>
        </div>
      </div>
    );
  };

  const onStatusChange = async (
    id: string,
    status: "read" | "saved_for_later"
  ) => {
    const newStatus: ContentStatus = {
      content_id: id,
      status,
    };
    const response = await ContentService.updateStatus(newStatus);
    if (response) {
      setStatusMap((prev) => ({
        ...prev,
        [id]: newStatus,
      }));
    }

    const folders = await ClientService.getLibraryContent();
    dispatch(setFolders(folders.folders));
  };

  const onDocumentClick = (id: string) => {
    nav(`/library/document/${id}`);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2 mb-4 md:gap-4">
        <HealthProfileForm healthHistory={healthHistory} />
        <Button
          variant="brightblue"
          size={isMobile ? "sm" : "icon"}
          className="px-[10px] rounded-full md:h-14 md:w-14"
        >
          {isMobile ? "Providers" : <TwoUsersIcon />}
        </Button>
        <Button
          variant="blue2"
          size={isMobile ? "sm" : "icon"}
          className="px-[10px] rounded-full text-[#1C63DB] md:h-14 md:w-14"
        >
          {isMobile ? "Communities (soon)" : <GlobeIcon />}{" "}
        </Button>
      </div>

      <Input
        placeholder="Search by name or content"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
        icon={<Search className="w-4 h-4" />}
        autoFocus
      />
      <ScrollArea className="flex-1 min-h-0 pr-2 mt-4">
        {loading ? (
          <div className="flex flex-col w-full gap-4 px-2">
            {[...Array(5)].map((_, idx) => (
              <Accordion
                key={idx}
                type="single"
                collapsible
                className="w-full mb-4"
                defaultValue={`item-${idx}`}
              >
                <AccordionItem value={`item-${idx}`}>
                  <AccordionTrigger className="pt-0">
                    <div className="h-[16px] w-[177px] skeleton-gradient rounded-[24px]" />
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-row flex-wrap gap-4 pb-2">
                    {[...Array(3)].map((_, cardIdx) => (
                      <LibraryCardSkeleton key={cardIdx} />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ))}
          </div>
        ) : filteredFolders.length > 0 ? (
          filteredFolders.map((folder, index) => (
            <Accordion
              key={folder.id}
              type="single"
              collapsible
              className="w-full mb-4"
              defaultValue={`item-${index}`}
            >
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className="pt-0">
                  {folder.name}
                </AccordionTrigger>
                {folder.reading_percentage > 0 && (
                  <div className="w-full flex flex-col gap-[8px] mb-[24px]">
                    <div className="flex justify-end">
                      <span className="text-[16px] text-[#1B2559] font-[600]">
                        {folder.reading_percentage}%
                      </span>
                    </div>
                    <div className="h-[4px] w-full bg-[#E0F0FF] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1C63DB]"
                        style={{ width: `${folder.reading_percentage}%` }}
                      />
                    </div>
                  </div>
                )}
                <AccordionContent className="flex flex-row flex-wrap w-full gap-4 pb-2">
                  {Array.isArray(folder.subfolders) &&
                  folder.subfolders.length > 0 ? (
                    folder.subfolders.map((item) => (
                      <Accordion
                        key={item.id}
                        type="single"
                        collapsible
                        className="w-full mb-4 relative
            border border-[#008FF6]
            rounded-[18px]
            transition-transform duration-200
            shadow-[0px_4px_4px_rgba(0,0,0,0.25)]
            group-hover:shadow-[4px_4px_4px_rgba(0,0,0,0.25)]"
                        defaultValue={`item-${index}`}
                      >
                        <AccordionItem
                          className="text-[16px]"
                          value={`item-${index}`}
                        >
                          <AccordionTrigger className="pt-0">
                            {item.name}
                          </AccordionTrigger>
                          {item.reading_percentage > 0 && (
                            <div className="w-full flex flex-col gap-[8px] mb-[24px]">
                              <div className="flex justify-end">
                                <span className="text-[16px] text-[#1B2559] font-[600]">
                                  {item.reading_percentage}%
                                </span>
                              </div>
                              <div className="h-[4px] w-full bg-[#E0F0FF] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#1C63DB]"
                                  style={{
                                    width: `${item.reading_percentage}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}
                          <AccordionContent className="flex flex-row flex-wrap w-full gap-4 pb-2">
                            {Array.isArray(item.content) &&
                            item.content.length > 0 ? (
                              item.content.map((item) => (
                                <LibraryCard
                                  id={item.id}
                                  key={item.id}
                                  title={item.title}
                                  author={item.author_name}
                                  onStatusChange={onStatusChange}
                                  contentStatus={statusMap[item.id]}
                                  onDocumentClick={onDocumentClick}
                                />
                              ))
                            ) : (
                              <div className="text-sm text-muted-foreground">
                                No content available for this folder.
                              </div>
                            )}
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ))
                  ) : Array.isArray(folder.content) &&
                    folder.content.length > 0 ? (
                    folder.content.map((item) => (
                      <LibraryCard
                        id={item.id}
                        key={item.id}
                        title={item.title}
                        author={item.author_name}
                        onStatusChange={onStatusChange}
                        contentStatus={statusMap[item.id]}
                        onDocumentClick={onDocumentClick}
                      />
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No content available for this folder.
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))
        ) : (
          <div className="w-full text-center text-gray-500">
            We couldn’t find anything matching your search. Try adjusting the
            filters or search terms.
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

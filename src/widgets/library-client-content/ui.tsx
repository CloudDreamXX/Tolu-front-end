import { ClientService, Folder } from "entities/client";
import { ContentService, ContentStatus } from "entities/content";
import { HealthHistoryService } from "entities/health-history";
import { LibraryCard } from "features/library-card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BookMark from "shared/assets/icons/book-mark";
import Search from "shared/assets/icons/search";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Input,
} from "shared/ui";

export const LibraryClientContent = () => {
  const [search, setSearch] = useState("");
  const [folders, setFolders] = useState<Folder[]>([]);
  const [statusMap, setStatusMap] = useState<Record<string, ContentStatus>>({});
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ClientService.getLibraryContent();
        setFolders(response.folders);
      } catch (error) {
        console.error("Failed to fetch library content:", error);
      }
    };

    fetchData();
  }, []);

  const onStatusChange = async (id: string, status: "read" | "saved_for_later") => {
    const newStatus: ContentStatus = {
      content_id: id,
      status,
    };
    const response = await ContentService.updateStatus(newStatus);
    if (response) {
      setStatusMap(prev => ({
        ...prev,
        [id]: newStatus,
      }));
    }
  };

  const onDocumentClick = (id: string) => {
    nav(`/library/document/${id}`)
  }

  return (
    <div className="flex flex-col w-full">
      <Input
        placeholder="Search by name or content"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
        icon={<Search className="w-4 h-4" />}
        autoFocus
      />
      {folders.map((folder, index) => (
        <Accordion
          key={folder.id}
          type="single"
          collapsible
          className="w-full mt-4"
          defaultValue={`item-${index}`}
        >
          <AccordionItem value={`item-${index}`}>
            <AccordionTrigger className="pt-0">
              {folder.name}
            </AccordionTrigger>
            <AccordionContent className="flex flex-row flex-wrap gap-4 pb-2">
              {folder.content.map((item) => (
                <LibraryCard
                  id={item.id}
                  key={item.id}
                  title={item.title}
                  author={item.author_name}
                  type={"Text"}
                  status={"To read"}
                  progress={item.read_count}
                  onStatusChange={onStatusChange}
                  contentStatus={statusMap[item.id]}
                  onDocumentClick={onDocumentClick} />
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

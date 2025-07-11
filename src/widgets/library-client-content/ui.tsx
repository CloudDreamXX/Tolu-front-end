import { ClientService, Folder } from "entities/client";
import { ContentService, ContentStatus } from "entities/content";
import { LibraryCard } from "features/library-card";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Search from "shared/assets/icons/search";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Input,
  ScrollArea,
} from "shared/ui";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "entities/store";
import { setFolders } from "entities/client/lib";

export const LibraryClientContent = () => {
  const [search, setSearch] = useState("");
  const [statusMap, setStatusMap] = useState<Record<string, ContentStatus>>({});
  const nav = useNavigate();
  const folderId = useSelector((state: RootState) => state.client.folderId);
  const folders = useSelector((state: RootState) => state.client.folders);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ClientService.getLibraryContent();
        dispatch(setFolders(response.folders));
      } catch (error) {
        console.error("Failed to fetch library content:", error);
      }
    };

    fetchData();
  }, []);

  const findFolderById = (folders: Folder[], id: string): Folder | null => {
    for (const folder of folders) {
      if (folder.id === id) return folder;
      if (folder.subfolders?.length) {
        const found = findFolderById(folder.subfolders, id);
        if (found) return found;
      }
    }
    return null;
  };

  const filteredFolders = folderId
    ? (() => {
        const result = findFolderById(folders, folderId);
        return result ? [result] : [];
      })()
    : folders;

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
  };

  const onDocumentClick = (id: string) => {
    nav(`/library/document/${id}`);
  };

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
      <ScrollArea className="flex-1 min-h-0 pr-2 mt-4">
        {filteredFolders &&
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
                <AccordionContent className="flex flex-row flex-wrap gap-4 pb-2">
                  {Array.isArray(folder.content) ? (
                    folder.content.map((item) => (
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
          ))}
      </ScrollArea>
    </div>
  );
};

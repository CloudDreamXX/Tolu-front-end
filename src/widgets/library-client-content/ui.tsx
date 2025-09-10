import { ClientService, Folder } from "entities/client";
import { setFolders, setLoading } from "entities/client/lib";
import { ContentService, ContentStatus } from "entities/content";
import { HealthHistory } from "entities/health-history";
import { RootState } from "entities/store";
import { LibraryCard } from "features/library-card";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
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

type ContentItem = NonNullable<Folder["content"]>[number];

type FolderFeed = {
  items: ContentItem[];
  page: number;
  hasMore: boolean;
  totalPages?: number;
  loading: boolean;
};

const PAGE_SIZE = 10;

const findFolderById = (
  folders: Folder[] = [],
  id: string
): Folder | undefined => {
  for (const f of folders) {
    if (f.id === id) return f;
    if (Array.isArray(f.subfolders) && f.subfolders.length) {
      const hit = findFolderById(f.subfolders, id);
      if (hit) return hit;
    }
  }
  return undefined;
};

export const LibraryClientContent = ({
  healthHistory,
}: LibraryClientContentProps) => {
  const [search, setSearch] = useState("");
  const [statusMap, setStatusMap] = useState<Record<string, ContentStatus>>({});
  const [filteredFolders, setFilteredFolders] = useState<Folder[]>([]);
  const [openTop, setOpenTop] = useState<string>("");
  const [openSub, setOpenSub] = useState<Record<string, string>>({});
  const [folderContentMap, setFolderContentMap] = useState<
    Record<string, FolderFeed>
  >({});

  const folderContentMapRef = useRef(folderContentMap);
  useEffect(() => {
    folderContentMapRef.current = folderContentMap;
  }, [folderContentMap]);

  const { isMobile } = usePageWidth();
  const nav = useNavigate();
  const folders = useSelector((state: RootState) => state.client.folders);
  const loading = useSelector((state: RootState) => state.client.loading);
  const dispatch = useDispatch();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelElems = useRef<Record<string, Element | null>>({});

  useEffect(() => {
    (async () => {
      try {
        dispatch(setLoading(true));
        const response = await ClientService.getLibraryContent(
          1,
          PAGE_SIZE,
          null
        );
        dispatch(setFolders(response.folders || []));

        const status: Record<string, ContentStatus> = {};
        const collect = (fs: Folder[]) => {
          fs.forEach((f) => {
            f.content?.forEach((c) => {
              if (c.status)
                status[c.id] = { content_id: c.id, status: (c as any).status };
            });
            if (f.subfolders?.length) collect(f.subfolders);
          });
        };
        collect(response.folders || []);
        setStatusMap(status);
      } catch (err) {
        console.error("Failed to fetch library content:", err);
      } finally {
        dispatch(setLoading(false));
      }
    })();
  }, [dispatch]);

  useEffect(() => {
    const filterFoldersAndContent = (fs: Folder[], q: string) => {
      const ql = q.trim().toLowerCase();
      if (!ql) return fs;

      const filterTree = (folder: Folder): Folder | null => {
        const folderMatches = folder.name.toLowerCase().includes(ql);
        const filteredContent = (folder.content || []).filter((item) =>
          item.title.toLowerCase().includes(ql)
        );
        const filteredSubfolders = (folder.subfolders || [])
          .map(filterTree)
          .filter(Boolean) as Folder[];

        const subfolderNameMatch = (folder.subfolders || []).some((sf) =>
          sf.name.toLowerCase().includes(ql)
        );

        if (
          folderMatches ||
          filteredContent.length ||
          filteredSubfolders.length ||
          subfolderNameMatch
        ) {
          return {
            ...folder,
            content: filteredContent,
            subfolders: filteredSubfolders,
          };
        }
        return null;
      };

      return fs.map(filterTree).filter(Boolean) as Folder[];
    };

    setFilteredFolders(filterFoldersAndContent(folders || [], search));
  }, [search, folders]);

  const loadFolderPage = useCallback(
    async (folderId: string, reset = false) => {
      setFolderContentMap((prev) => {
        const current = prev[folderId] || {
          items: [],
          page: 0,
          hasMore: true,
          loading: false,
        };
        if (current.loading || (!reset && !current.hasMore)) return prev;
        return {
          ...prev,
          [folderId]: {
            ...current,
            ...(reset
              ? { items: [], page: 0, hasMore: true, totalPages: undefined }
              : {}),
            loading: true,
          },
        };
      });

      try {
        const currentFeed = folderContentMapRef.current[folderId];
        const nextPage = reset ? 1 : (currentFeed?.page || 0) + 1;

        const resp = await ClientService.getLibraryContent(
          nextPage,
          PAGE_SIZE,
          folderId
        );

        let returned = findFolderById(resp.folders ?? [], folderId);

        if (
          !returned &&
          resp.folders?.length === 1 &&
          resp.folders[0].id === folderId
        ) {
          returned = resp.folders[0];
        }

        if (!returned) {
          setFolderContentMap((prev) => ({
            ...prev,
            [folderId]: {
              ...(prev[folderId] || { items: [], page: 0 }),
              loading: false,
              hasMore: false,
              page: nextPage,
              totalPages: prev[folderId]?.totalPages,
            },
          }));
          return;
        }

        const newItems: ContentItem[] = returned.content ?? [];
        const pageFromApi = returned.pagination?.current_page ?? nextPage;
        const hasMoreFromApi = Boolean(returned.pagination?.has_next);
        const totalPagesFromApi = returned.pagination?.total_pages;

        setFolderContentMap((prev) => {
          const base = prev[folderId] || {
            items: [],
            page: 0,
            hasMore: true,
            loading: false,
          };
          const merged = reset ? newItems : [...base.items, ...newItems];
          return {
            ...prev,
            [folderId]: {
              items: merged,
              page: pageFromApi,
              hasMore: hasMoreFromApi,
              totalPages: totalPagesFromApi,
              loading: false,
            },
          };
        });

        if (newItems.length) {
          const statusUpdates: Record<string, ContentStatus> = {};
          newItems.forEach((it) => {
            if ((it as any).status)
              statusUpdates[it.id] = {
                content_id: it.id,
                status: (it as any).status,
              };
          });
          if (Object.keys(statusUpdates).length)
            setStatusMap((prev) => ({ ...prev, ...statusUpdates }));
        } else if (!hasMoreFromApi) {
          setFolderContentMap((prev) => ({
            ...prev,
            [folderId]: {
              ...(prev[folderId] || {
                items: [] as ContentItem[],
                page: pageFromApi,
              }),
              loading: false,
              hasMore: false,
            },
          }));
        }
      } catch (e) {
        console.error("Failed to load folder page:", e);
        setFolderContentMap((prev) => {
          const base = prev[folderId] || {
            items: [],
            page: 0,
            hasMore: true,
            loading: false,
          };
          return {
            ...prev,
            [folderId]: { ...base, loading: false, hasMore: false },
          };
        });
      }
    },
    []
  );

  const handleOpenTop = useCallback(
    (value: string, folder: Folder) => {
      setOpenTop(value);
      if (value) {
        const feed = folderContentMapRef.current[folder.id];
        if (!feed || feed.items.length === 0)
          void loadFolderPage(folder.id, true);
      }
    },
    [loadFolderPage]
  );

  const handleOpenSub = useCallback(
    (parentId: string, value: string, sub: Folder) => {
      setOpenSub((prev) => ({ ...prev, [parentId]: value }));
      if (value) {
        const feed = folderContentMapRef.current[sub.id];
        if (!feed || feed.items.length === 0) void loadFolderPage(sub.id, true);
      }
    },
    [loadFolderPage]
  );

  useEffect(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const folderId = (entry.target as HTMLElement).dataset.folderId;
            if (!folderId) return;
            const feed = folderContentMapRef.current[folderId];
            if (feed && !feed.loading && feed.hasMore)
              void loadFolderPage(folderId);
          });
        },
        { root: null, rootMargin: "200px", threshold: 0.01 }
      );
    }

    return () => {
      const observer = observerRef.current;
      if (observer) {
        Object.values(sentinelElems.current).forEach(
          (el) => el && observer.unobserve(el)
        );
        observer.disconnect();
        observerRef.current = null;
      }
    };
  }, [loadFolderPage]);

  const setSentinelRef = useCallback(
    (folderId: string) => (el: HTMLDivElement | null) => {
      const observer = observerRef.current;
      const prevEl = sentinelElems.current[folderId];

      if (observer && prevEl) observer.unobserve(prevEl);

      sentinelElems.current[folderId] = el;

      if (observer && el) observer.observe(el);
    },
    []
  );

  const LibraryCardSkeleton = useMemo(() => {
    const Comp = () => {
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
            <MaterialIcon iconName="bookmark" className="text-[#5F5F65]" />
          </div>
          <div className="bg-[#F5F5F5] p-[8px] rounded-[8px]">
            <div
              className="h-[12px] rounded-[8px] skeleton-gradient max-w-[250px] md:max-w-none"
              style={{ width: getRandomWidth(180, 300) }}
            />
          </div>
          <div className="flex w-full justify-between pt-[8px]">
            <div className="flex flex-col gap-[4px]">
              <div
                className="h-[10px] rounded-[24px] skeleton-gradient"
                style={{ width: getRandomWidth(100, 150) }}
              />
              <div
                className="h-[10px] rounded-[24px] skeleton-gradient"
                style={{ width: getRandomWidth(100, 150) }}
              />
            </div>
            <div className="hidden md:flex flex-col gap-[4px]">
              <div
                className="h-[10px] rounded-[24px] skeleton-gradient"
                style={{ width: getRandomWidth(100, 150) }}
              />
              <div
                className="h-[10px] rounded-[24px] skeleton-gradient"
                style={{ width: getRandomWidth(100, 150) }}
              />
            </div>
            <div className="hidden md:flex flex-col gap-[4px]">
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
    return Comp;
  }, []);

  const onStatusChange = async (
    id: string,
    status: "read" | "saved_for_later"
  ) => {
    const newStatus: ContentStatus = { content_id: id, status };
    const response = await ContentService.updateStatus(newStatus);
    if (response) setStatusMap((prev) => ({ ...prev, [id]: newStatus }));

    const refreshed = await ClientService.getLibraryContent(1, PAGE_SIZE, null);
    dispatch(setFolders(refreshed.folders));
  };

  const onDocumentClick = (id: string) => nav(`/library/document/${id}`);

  const renderFeed = (folderId: string) => {
    const feed = folderContentMap[folderId];
    const items = feed?.items || [];
    const isLoading = !!feed?.loading;

    if (!items.length && isLoading) {
      return (
        <div className="flex flex-col w-full gap-4 px-2">
          {[...Array(3)].map((_, i) => (
            <LibraryCardSkeleton key={i} />
          ))}
        </div>
      );
    }

    return (
      <>
        {items.length ? (
          items.map((it) => (
            <LibraryCard
              id={it.id}
              key={it.id}
              title={it.title}
              author={it.author_name}
              onStatusChange={onStatusChange}
              contentStatus={statusMap[it.id]}
              onDocumentClick={onDocumentClick}
            />
          ))
        ) : (
          <div className="text-sm text-muted-foreground">
            No content available for this folder.
          </div>
        )}

        <div
          ref={setSentinelRef(folderId)}
          data-folder-id={folderId}
          className="w-full"
        />

        {isLoading && (
          <div className="py-2 text-xs text-muted-foreground">Loading…</div>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2 mb-4 md:gap-4">
        <HealthProfileForm healthHistory={healthHistory} />
        <Button
          variant="blue2"
          size={isMobile ? "sm" : "icon"}
          className="px-[10px] rounded-full text-[#1C63DB] md:h-14 md:w-14"
          disabled
        >
          {isMobile ? "Providers" : <MaterialIcon iconName="groups" fill={1} />}
        </Button>
        <Button
          variant="blue2"
          size={isMobile ? "sm" : "icon"}
          className="px-[10px] rounded-full text-[#1C63DB] md:h-14 md:w-14"
          disabled
        >
          {isMobile ? (
            "Communities (soon)"
          ) : (
            <MaterialIcon iconName="language" />
          )}
        </Button>
      </div>

      <Input
        placeholder="Search by name or content"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
        icon={<MaterialIcon iconName="search" />}
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
                value=""
              >
                <AccordionItem value={`skeleton-${idx}`}>
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
          filteredFolders.map((folder, index) => {
            const valueKey = `item-${index}`;
            const isOpen = openTop === valueKey;

            return (
              <Accordion
                key={folder.id}
                type="single"
                collapsible
                className="w-full mb-4"
                value={isOpen ? valueKey : ""}
                onValueChange={(v) => handleOpenTop(v, folder)}
              >
                <AccordionItem value={valueKey}>
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

                  <AccordionContent className="flex flex-col gap-4 pb-2">
                    {Array.isArray(folder.subfolders) &&
                    folder.subfolders.length > 0 ? (
                      folder.subfolders.map((sub, sIdx) => {
                        const subKey = `sub-${sIdx}`;
                        const subOpen = (openSub[folder.id] || "") === subKey;
                        return (
                          <Accordion
                            key={sub.id}
                            type="single"
                            collapsible
                            className="w-full mb-2 relative border border-[#008FF6] rounded-[18px] transition-shadow duration-200 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                            value={subOpen ? subKey : ""}
                            onValueChange={(v) =>
                              handleOpenSub(folder.id, v, sub)
                            }
                          >
                            <AccordionItem
                              className="text-[16px]"
                              value={subKey}
                            >
                              <AccordionTrigger className="pt-0">
                                {sub.name}
                              </AccordionTrigger>

                              {sub.reading_percentage > 0 && (
                                <div className="w-full flex flex-col gap-[8px] mb-[24px]">
                                  <div className="flex justify-end">
                                    <span className="text-[16px] text-[#1B2559] font-[600]">
                                      {sub.reading_percentage}%
                                    </span>
                                  </div>
                                  <div className="h-[4px] w-full bg-[#E0F0FF] rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-[#1C63DB]"
                                      style={{
                                        width: `${sub.reading_percentage}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                              <AccordionContent className="flex flex-row flex-wrap w-full gap-4 pb-2">
                                {renderFeed(sub.id)}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        );
                      })
                    ) : (
                      <div className="flex flex-row flex-wrap w-full gap-4">
                        {renderFeed(folder.id)}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })
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

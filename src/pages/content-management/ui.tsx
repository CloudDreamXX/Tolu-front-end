import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Input,
} from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { usePageWidth } from "shared/lib";

import { Folder } from "entities/client";
import { LibraryCard } from "features/library-card";
import { AdminStatus } from "entities/content";
import {
  AdminFoldersStructureResponse,
  useGetFoldersStructureQuery,
  useLazyGetFoldersStructureQuery,
} from "entities/admin";

type ContentItem = NonNullable<Folder["content"]>[number];

type FolderFeed = {
  items: ContentItem[];
  page: number;
  hasMore: boolean;
  totalPages?: number;
  loading: boolean;
};

const CATEGORY_LABEL: Record<keyof AdminFoldersStructureResponse, string> = {
  flagged: "Flagged",
  ai_generated: "AI Generated",
  in_review: "In Review",
  approved: "Approved",
  published: "Published",
  archived: "Archived",
  pagination: "Meta",
  admin_access: "Meta",
  filtered_by_user: "Meta",
  target_user_id: "Meta",
};

const CATEGORY_KEYS: (keyof AdminFoldersStructureResponse)[] = [
  "flagged",
  "ai_generated",
  "in_review",
  "approved",
  "published",
  "archived",
];

const PAGE_SIZE = 10;

export const findFolderById = (
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

export const ContentManagement = () => {
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState<
    { key: string; label: string; folders: Folder[] }[]
  >([]);
  const [filteredGroups, setFilteredGroups] = useState<typeof groups>([]);

  const [statusMap, setStatusMap] = useState<Record<string, AdminStatus>>({});
  const [openTop, setOpenTop] = useState<Record<string, string>>({});
  const [openSub, setOpenSub] = useState<Record<string, string>>({});

  const [folderContentMap, setFolderContentMap] = useState<
    Record<string, FolderFeed>
  >({});
  const folderContentMapRef = useRef(folderContentMap);
  useEffect(() => {
    folderContentMapRef.current = folderContentMap;
  }, [folderContentMap]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelElems = useRef<Record<string, Element | null>>({});

  const nav = useNavigate();
  const { isMobile } = usePageWidth();

  const { data: resp } = useGetFoldersStructureQuery({
    page: 1,
    page_size: PAGE_SIZE,
  });

  const [triggerGetFolders] = useLazyGetFoldersStructureQuery();

  // const [isCardsTab, setIsCardsTab] = useState(false);

  useEffect(() => {
    if (!resp) return;
    const built =
      CATEGORY_KEYS.map((k) => ({
        key: String(k),
        label: CATEGORY_LABEL[k],
        folders: (resp[k] as Folder[]) || [],
      })) || [];
    setGroups(built);
    setFilteredGroups(built);

    const status: Record<string, AdminStatus> = {};
    const collect = (fs: Folder[]) => {
      fs.forEach((f) => {
        f.content?.forEach((c) => {
          const st = (c as any).status;
          if (st) status[c.id] = { content_id: c.id, status: st };
        });
        if (f.subfolders?.length) collect(f.subfolders);
      });
    };
    built.forEach((g) => collect(g.folders));
    setStatusMap(status);
  }, [resp]);

  useEffect(() => {
    const ql = search.trim().toLowerCase();
    if (!ql) {
      setFilteredGroups(groups);
      return;
    }
    const filterTree = (folder: Folder): Folder | null => {
      const folderMatches = folder.name?.toLowerCase().includes(ql);
      const filteredContent = (folder.content || []).filter((it) =>
        it.title?.toLowerCase().includes(ql)
      );
      const filteredSubfolders = (folder.subfolders || [])
        .map(filterTree)
        .filter(Boolean) as Folder[];
      const subfolderNameMatch = (folder.subfolders || []).some((sf) =>
        sf.name?.toLowerCase().includes(ql)
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

    const next = groups
      .map((g) => ({
        ...g,
        folders: (g.folders || []).map(filterTree).filter(Boolean) as Folder[],
      }))
      .filter((g) => g.folders.length > 0);

    setFilteredGroups(next);
  }, [search, groups]);

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

      const currentFeed = folderContentMapRef.current[folderId];
      const nextPage = reset ? 1 : (currentFeed?.page || 0) + 1;

      try {
        const res = await triggerGetFolders({
          page: nextPage,
          page_size: PAGE_SIZE,
          folder_id: folderId,
        }).unwrap();

        const allRoots = CATEGORY_KEYS.flatMap(
          (k) => (res[k] as Folder[]) || []
        );
        let returned = findFolderById(allRoots, folderId);
        if (!returned && allRoots.length === 1 && allRoots[0].id === folderId) {
          returned = allRoots[0];
        }
        if (!returned) {
          setFolderContentMap((prev) => ({
            ...prev,
            [folderId]: { ...prev[folderId], loading: false, hasMore: false },
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
          const updates: Record<string, AdminStatus> = {};
          newItems.forEach((it) => {
            const st = (it as any).status;
            if (st) updates[it.id] = { content_id: it.id, status: st };
          });
          if (Object.keys(updates).length)
            setStatusMap((prev) => ({ ...prev, ...updates }));
        }
      } catch (e) {
        console.error("Failed to load folder page:", e);
        setFolderContentMap((prev) => ({
          ...prev,
          [folderId]: { ...prev[folderId], loading: false, hasMore: false },
        }));
      }
    },
    [triggerGetFolders]
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
            if (feed && !feed.loading && feed.hasMore) {
              void loadFolderPage(folderId);
            }
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

  useEffect(() => {
    const ql = search.trim().toLowerCase();
    if (!ql) {
      setFilteredGroups(groups);
      return;
    }

    const filterTree = (folder: Folder): Folder | null => {
      const folderMatches = folder.name?.toLowerCase().includes(ql);
      const filteredContent = (folder.content || []).filter((it) =>
        it.title?.toLowerCase().includes(ql)
      );
      const filteredSubfolders = (folder.subfolders || [])
        .map(filterTree)
        .filter(Boolean) as Folder[];
      const subfolderNameMatch = (folder.subfolders || []).some((sf) =>
        sf.name?.toLowerCase().includes(ql)
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

    const next = groups
      .map((g) => ({
        ...g,
        folders: (g.folders || []).map(filterTree).filter(Boolean) as Folder[],
      }))
      .filter((g) => g.folders.length > 0);

    setFilteredGroups(next);
  }, [search, groups]);

  const handleOpenTop = useCallback(
    (groupKey: string, value: string, folder: Folder) => {
      setOpenTop((prev) => ({ ...prev, [groupKey]: value }));
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

  const LibraryCardSkeleton = useMemo(() => {
    const Comp = () => {
      const w = (min: number, max: number) =>
        `${Math.floor(Math.random() * (max - min + 1)) + min}px`;
      return (
        <div
          className="w-full flex flex-col items-start p-4 gap-[8px] animate-pulse"
          style={{
            borderRadius: "18px",
            border: "1px solid #5F5F65",
            backgroundColor: "#FFF",
            boxShadow: "0 4px 4px rgba(0,0,0,.04)",
          }}
        >
          <div className="flex items-center justify-between w-full">
            <div
              className="h-[12px] rounded-[8px] skeleton-gradient"
              style={{ width: w(160, 250) }}
            />
            <MaterialIcon iconName="bookmark" className="text-[#5F5F65]" />
          </div>
          <div className="bg-[#F5F5F5] p-[8px] rounded-[8px]">
            <div
              className="h-[12px] rounded-[8px] skeleton-gradient max-w-[250px] md:max-w-none"
              style={{ width: w(180, 300) }}
            />
          </div>
          <div className="flex w-full justify-between pt-[8px]">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${i === 0 ? "flex" : "hidden md:flex"} flex-col gap-[4px]`}
              >
                <div
                  className="h-[10px] rounded-[24px] skeleton-gradient"
                  style={{ width: w(100, 150) }}
                />
                <div
                  className="h-[10px] rounded-[24px] skeleton-gradient"
                  style={{ width: w(100, 150) }}
                />
              </div>
            ))}
          </div>
        </div>
      );
    };
    return Comp;
  }, []);

  const onDocumentClick = (id: string) =>
    nav(`/content-management/document/${id}`);

  const renderFeed = (folderId: string, cards?: boolean) => {
    const feed = folderContentMap[folderId];
    const items = feed?.items || [];
    const isLoadingFeed = !!feed?.loading;

    const filteredItemsWithoutCards = items.filter(
      (item) => item.content_type !== "Card"
    );
    const filteredItemsWithCards = items.filter(
      (item) => item.content_type === "Card"
    );

    const itemsToRender = cards
      ? filteredItemsWithCards
      : filteredItemsWithoutCards;

    if (!itemsToRender.length && isLoadingFeed) {
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
        {itemsToRender.length ? (
          itemsToRender.map((it) => (
            <LibraryCard
              id={it.id}
              key={it.id}
              title={it.title}
              author={it.author_name}
              adminStatus={statusMap[it.id]}
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
        {isLoadingFeed && (
          <div className="py-2 text-xs text-muted-foreground">Loading…</div>
        )}
      </>
    );
  };

  const renderSubTree = (
    parentId: string,
    subfolders: Folder[],
    keyPrefix: string,
    cards: boolean
  ) => {
    return subfolders.map((sub, idx) => {
      const subKey = `${keyPrefix}-${idx}`;
      const isOpen = (openSub[parentId] || "") === subKey;

      return (
        <Accordion
          key={sub.id}
          type="single"
          collapsible
          className="w-full mb-2 relative border border-[#008FF6] rounded-[18px] transition-shadow duration-200 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
          value={isOpen ? subKey : ""}
          onValueChange={(v) => handleOpenSub(parentId, v, sub)}
        >
          <AccordionItem className="text-[16px]" value={subKey}>
            <AccordionTrigger className="pt-0">{sub.name}</AccordionTrigger>

            <AccordionContent className="flex flex-col gap-4 pb-2">
              {Array.isArray(sub.subfolders) && sub.subfolders.length > 0 && (
                <div className="flex flex-col gap-2">
                  {renderSubTree(sub.id, sub.subfolders, subKey, cards)}
                </div>
              )}

              <div className="flex flex-row flex-wrap w-full gap-4">
                {renderFeed(sub.id, cards)}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      );
    });
  };

  return (
    <div className="flex flex-col gap-[16px] p-8 overflow-y-auto h-[100%]">
      {/* <div className="flex gap-[16px] items-center">
        <button
          className={`w-[200px] text-[18px] xl:text-xl font-medium px-[16px] py-[8px] rounded-[8px] ${!isCardsTab ? "bg-[#1C63DB] text-white" : ""}`}
          onClick={() => setIsCardsTab(false)}
        >
          Articles
        </button>
        <button
          className={`w-[200px] text-[18px] xl:text-xl font-medium px-[16px] py-[8px] rounded-[8px] ${isCardsTab ? "bg-[#1C63DB] text-white" : ""}`}
          onClick={() => setIsCardsTab(true)}
        >
          Cards
        </button>
      </div> */}

      <Input
        placeholder="Search by name or content"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
        icon={<MaterialIcon iconName="search" />}
        autoFocus={!isMobile}
      />

      <div className="tabs-content">
        {/* {isCardsTab ? (
          <div className="flex flex-col gap-4">
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group, gIdx) => {
                const groupKey = group.key;
                return (
                  <div key={groupKey} className="mb-2">
                    {group.folders.length ? (
                      group.folders.map((folder, index) => {
                        const valueKey = `g${gIdx}-f${index}`;
                        const isOpen = (openTop[groupKey] || "") === valueKey;

                        return (
                          <Accordion
                            key={folder.id}
                            type="single"
                            collapsible
                            className="w-full"
                            value={isOpen ? valueKey : ""}
                            onValueChange={(v) =>
                              handleOpenTop(groupKey, v, folder)
                            }
                          >
                            <AccordionItem
                              value={valueKey}
                              className="border border-[#008FF6] rounded-[18px] transition-shadow duration-200 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                            >
                              <AccordionTrigger className="pt-0">
                                {folder.name}
                              </AccordionTrigger>

                              <AccordionContent className="flex flex-col gap-4 pb-2">
                                {Array.isArray(folder.subfolders) &&
                                  folder.subfolders.length > 0 && (
                                    <div className="flex flex-col gap-2">
                                      {renderSubTree(
                                        folder.id,
                                        folder.subfolders,
                                        valueKey,
                                        true
                                      )}
                                    </div>
                                  )}

                                <div className="flex flex-row flex-wrap w-full gap-4">
                                  {renderFeed(folder.id, true)}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        );
                      })
                    ) : (
                      <div className="w-full text-sm text-muted-foreground">
                        No folders.
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="w-full text-center text-gray-500">
                We couldn’t find anything matching your search. Try adjusting
                the filters or search terms.
              </div>
            )}
          </div>
        ) : ( */}
        <div className="flex flex-col gap-4">
          {filteredGroups.length > 0 ? (
            filteredGroups.map((group, gIdx) => {
              const groupKey = group.key;
              return (
                <div key={groupKey} className="mb-2">
                  {group.folders.length ? (
                    group.folders.map((folder, index) => {
                      const valueKey = `g${gIdx}-f${index}`;
                      const isOpen = (openTop[groupKey] || "") === valueKey;

                      return (
                        <Accordion
                          key={folder.id}
                          type="single"
                          collapsible
                          className="w-full"
                          value={isOpen ? valueKey : ""}
                          onValueChange={(v) =>
                            handleOpenTop(groupKey, v, folder)
                          }
                        >
                          <AccordionItem
                            value={valueKey}
                            className="border border-[#008FF6] rounded-[18px] transition-shadow duration-200 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
                          >
                            <AccordionTrigger className="pt-0">
                              {folder.name}
                            </AccordionTrigger>

                            <AccordionContent className="flex flex-col gap-4 pb-2">
                              {Array.isArray(folder.subfolders) &&
                                folder.subfolders.length > 0 && (
                                  <div className="flex flex-col gap-2">
                                    {renderSubTree(
                                      folder.id,
                                      folder.subfolders,
                                      valueKey,
                                      false
                                    )}
                                  </div>
                                )}

                              <div className="flex flex-row flex-wrap w-full gap-4">
                                {renderFeed(folder.id, false)}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      );
                    })
                  ) : (
                    <div className="w-full text-sm text-muted-foreground">
                      No folders.
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="w-full text-center text-gray-500">
              We couldn’t find anything matching your search. Try adjusting the
              filters or search terms.
            </div>
          )}
        </div>
        {/* )} */}
      </div>
    </div>
  );
};

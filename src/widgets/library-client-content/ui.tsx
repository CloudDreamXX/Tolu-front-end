import {
  CoachListItem,
  Folder,
  useLazyDownloadCoachPhotoQuery,
  useGetCoachesQuery,
  useGetLibraryContentQuery,
  useLazyGetCoachProfileQuery,
  useLazyGetLibraryContentQuery,
} from "entities/client";
import { ContentStatus, useUpdateStatusMutation } from "entities/content";
import { RootState } from "entities/store";
import { LibraryCard } from "features/library-card";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { phoneMask, usePageWidth } from "shared/lib";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  Dialog,
  DialogContent,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ScrollArea,
} from "shared/ui";
import { HealthProfileForm } from "widgets/health-profile-form";

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

const getHeadshotFilename = (url?: string | null): string | null => {
  if (!url) return null;
  const clean = url.trim().split(/[?#]/)[0];
  const parts = clean.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";
  return last ? decodeURIComponent(last) : null;
};

export const LibraryClientContent = () => {
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

  const [providersOpen, setProvidersOpen] = useState(false);

  const [selectedCoachId, setSelectedCoachId] = useState<string | null>(null);
  const [coachProfiles, setCoachProfiles] = useState<Record<string, any>>({});
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});

  const [coachDialogOpen, setCoachDialogOpen] = useState(false);

  const [updateStatus] = useUpdateStatusMutation();
  const { data: response, refetch: refetchLibraryContent } =
    useGetLibraryContentQuery({
      page: 1,
      page_size: PAGE_SIZE,
      folder_id: null,
    });
  const [getCoachProfile, { data: coachProfileData }] =
    useLazyGetCoachProfileQuery();
  const [getLibraryContent] = useLazyGetLibraryContentQuery();
  const {
    data: coaches,
    refetch: refetchCoaches,
    isLoading: isLoadingCoaches,
  } = useGetCoachesQuery();
  const [downloadCoachPhoto] = useLazyDownloadCoachPhotoQuery();

  const selectedCoach = useMemo(
    () => coaches?.data?.coaches?.find((c) => c.coach_id === selectedCoachId) ?? null,
    [coaches, selectedCoachId]
  );

  useEffect(() => {
    (async () => {
      try {
        const status: Record<string, ContentStatus> = {};
        const collect = (fs: Folder[]) => {
          fs.forEach((f) => {
            f.content?.forEach((c) => {
              if (c.status)
                status[c.id] = {
                  content_id: c.id,
                  status_data: { status: (c as any).status },
                };
            });
            if (f.subfolders?.length) collect(f.subfolders);
          });
        };
        collect(response?.data?.folders || []);
        setStatusMap(status);
      } catch (err) {
        console.error("Failed to fetch library content:", err);
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
            ...(reset ? { items: [], page: 0, hasMore: true } : {}),
            loading: true,
          },
        };
      });

      try {
        const currentFeed = folderContentMapRef.current[folderId];
        const nextPage = reset ? 1 : (currentFeed?.page || 0) + 1;

        const response = await getLibraryContent({
          page: nextPage,
          page_size: PAGE_SIZE,
          folder_id: folderId,
        }).unwrap();

        let returned = findFolderById(response?.data.folders ?? [], folderId);

        if (
          !returned &&
          response &&
          response.data.folders?.length === 1 &&
          response.data.folders[0].id === folderId
        ) {
          returned = response.data.folders[0];
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
                status_data: { status: (it as any).status },
              };
          });
          if (Object.keys(statusUpdates).length)
            setStatusMap((prev) => ({ ...prev, ...statusUpdates }));
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
    [getLibraryContent]
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
    const newStatus: ContentStatus = {
      content_id: id,
      status_data: { status: status },
    };
    const response = await updateStatus(newStatus);
    if (response) setStatusMap((prev) => ({ ...prev, [id]: newStatus }));
    refetchLibraryContent();
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

  const fetchPhotoUrl = useCallback(
    async (coachId: string, filename?: string | null) => {
      if (!filename) return null;
      if (photoUrls[coachId]) return photoUrls[coachId];
      try {
        const { data: blob } = await downloadCoachPhoto({
          coachId,
          filename,
        });
        if (!blob) return null;
        const url = URL.createObjectURL(blob);
        setPhotoUrls((prev) => ({ ...prev, [coachId]: url }));
        return url;
      } catch (e) {
        console.warn("Photo download failed:", e);
        return null;
      }
    },
    [photoUrls]
  );

  const handleOpenCoach = useCallback(
    async (coach: CoachListItem) => {
      setSelectedCoachId(coach.coach_id);
      setCoachDialogOpen(true);

      try {
        if (!coachProfiles[coach.coach_id]) {
          const res = await getCoachProfile(coach.coach_id).unwrap();
          setCoachProfiles((p) => ({
            ...p,
            [coach.coach_id]: res,
          }));
          const fn = getHeadshotFilename(
            coachProfileData?.detailed_profile?.headshot_url ??
            coach.profile?.headshot_url
          );
          if (fn) void fetchPhotoUrl(coach.coach_id, fn);
        } else {
          const fn = getHeadshotFilename(
            coachProfiles[coach.coach_id]?.detailed_profile?.headshot_url ??
            coach.profile?.headshot_url
          );
          if (fn) void fetchPhotoUrl(coach.coach_id, fn);
        }
      } catch (e) {
        console.error("Failed to load coach profile:", e);
      }
    },
    [coachProfiles, fetchPhotoUrl]
  );

  const onProvidersOpenChange = useCallback(
    (open: boolean) => {
      setProvidersOpen(open);
      if (open) refetchCoaches();
    },
    [setProvidersOpen, refetchCoaches]
  );
  useEffect(() => {
    return () => {
      Object.values(photoUrls).forEach((u) => URL.revokeObjectURL(u));
    };
  }, [photoUrls]);

  useEffect(() => {
    if (!providersOpen || !coaches?.data?.coaches?.length) return;
    coaches?.data?.coaches?.forEach((c) => {
      if (c.profile?.headshot_url && !photoUrls[c.coach_id]) {
        void fetchPhotoUrl(
          c.coach_id,
          getHeadshotFilename(c.profile?.headshot_url)
        );
      }
    });
  }, [providersOpen, coaches, photoUrls, fetchPhotoUrl]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-2 mb-4 md:gap-4">
        <HealthProfileForm />
        <Popover open={providersOpen} onOpenChange={onProvidersOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="blue2"
              size={isMobile ? "sm" : "icon"}
              className="text-[12px] px-[10px] rounded-full text-[#1C63DB] md:h-14 md:w-14"
            >
              {isMobile ? (
                "Providers"
              ) : (
                <MaterialIcon iconName="groups" fill={1} />
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            className="w-fit md:w-[360px] p-0 rounded-[18px] border border-[#1C63DB] shadow-[0px_4px_12px_rgba(0,0,0,0.12)] bg-white"
            align="start"
          >
            <div className="p-3 border-b border-[#EAEAEA]">
              <div className="text-[14px] font-semibold text-[#1D1D1F]">
                Your Providers
              </div>
              <div className="text-[12px] text-muted-foreground">
                Coaches linked to your account
              </div>
            </div>

            <ScrollArea className="max-h-[360px]">
              {isLoadingCoaches ? (
                <div className="p-4 text-sm text-muted-foreground">
                  Loading…
                </div>
              ) : coaches?.data?.coaches?.length ? (
                <ul className="p-2">
                  {coaches?.data.coaches
                    .filter(
                      (coach, index, self) =>
                        index ===
                        self.findIndex((c) => c.coach_id === coach.coach_id)
                    )
                    .map((c) => {
                      const name =
                        (c?.basic_info?.first_name &&
                          `${c?.basic_info?.first_name.slice(0, 1)} ${c?.basic_info?.last_name?.slice(0, 1)}`) ||
                        c.basic_info?.name;
                      const photo = photoUrls[c.coach_id];

                      return (
                        <li
                          key={c.coach_id}
                          className="p-2 rounded-[12px] hover:bg-[#F5F5F5] transition-colors"
                        >
                          <Button
                            variant={"unstyled"}
                            size={"unstyled"}
                            onClick={() => handleOpenCoach(c)}
                            className="flex items-center w-full gap-3 text-left"
                          >
                            <div className="h-10 w-10 rounded-full bg-[#E0F0FF] overflow-hidden flex items-center justify-center text-sm font-medium text-[#1C63DB]">
                              {photo ? (
                                <img
                                  src={photo}
                                  alt={name}
                                  className="object-cover w-full h-full"
                                />
                              ) : (
                                name?.slice(0, 2).toUpperCase()
                              )}
                            </div>

                            <div className="truncate font-medium text-[14px]">
                              {name}
                            </div>
                          </Button>
                        </li>
                      );
                    })}
                </ul>
              ) : (
                <div className="p-4 text-sm text-muted-foreground">
                  No providers yet.
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>

        <Dialog open={coachDialogOpen} onOpenChange={setCoachDialogOpen}>
          <DialogContent className="max-w-[560px] p-0 rounded-xl overflow-hidden">
            <div className="flex items-center gap-3 p-4 border-b">
              <div className="h-12 w-12 rounded-full bg-[#E0F0FF] overflow-hidden flex items-center justify-center text-sm font-medium text-[#1C63DB]">
                {selectedCoachId && photoUrls[selectedCoachId] ? (
                  <img
                    src={photoUrls[selectedCoachId]}
                    alt={selectedCoach?.basic_info?.name || "Coach"}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  (
                    (coachProfileData?.basic_info?.first_name &&
                      `${coachProfileData?.basic_info?.first_name.slice(0, 1)}${coachProfileData?.basic_info?.last_name.slice(0, 1)}`) ||
                    selectedCoach?.basic_info?.name ||
                    "C"
                  )
                    .slice(0, 2)
                    .toUpperCase()
                )}
              </div>

              <div className="min-w-0">
                <div className="text-base font-semibold truncate">
                  {(coachProfileData?.basic_info?.first_name &&
                    `${coachProfileData?.basic_info?.first_name} ${coachProfileData?.basic_info?.last_name}`) ||
                    selectedCoach?.basic_info?.name ||
                    "Coach"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {coachProfiles[selectedCoachId!]?.basic_info?.role_name ||
                    "Practitioner"}
                  {coachProfiles[selectedCoachId!]?.relationship_details
                    ?.is_primary_coach === "yes"
                    ? " • Primary coach"
                    : ""}
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 text-sm">
              <p className="leading-relaxed">
                {coachProfiles[selectedCoachId!]?.detailed_profile?.bio ||
                  selectedCoach?.profile?.bio ||
                  "No bio provided."}
              </p>

              <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                <span className="text-muted-foreground">Email:</span>
                {coachProfiles[selectedCoachId!]?.basic_info?.email || "—"}

                <span className="text-muted-foreground">Phone:</span>
                {(coachProfiles[selectedCoachId!]?.basic_info?.phone &&
                  phoneMask(
                    coachProfiles[selectedCoachId!]?.basic_info?.phone
                  )) ||
                  "—"}

                <span className="text-muted-foreground">Timezone:</span>
                {coachProfiles[selectedCoachId!]?.detailed_profile?.timezone ||
                  "—"}

                <span className="text-muted-foreground">Languages:</span>
                {(
                  coachProfiles[selectedCoachId!]?.detailed_profile
                    ?.languages || []
                ).join(", ") || "—"}

                <span className="text-muted-foreground">Experience:</span>
                {coachProfiles[selectedCoachId!]?.detailed_profile
                  ?.years_experience ?? "—"}

                <span className="text-muted-foreground">Working duration:</span>
                {coachProfiles[selectedCoachId!]?.relationship_details
                  ?.working_duration || "—"}
              </div>
            </div>

            <Button onClick={() => setCoachDialogOpen(false)}>Close</Button>
          </DialogContent>
        </Dialog>

        <Button
          variant="blue2"
          size={isMobile ? "sm" : "icon"}
          className="text-[12px] px-[10px] rounded-full text-[#1C63DB] md:h-14 md:w-14"
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

      <ScrollArea className="flex-1 min-h-0 mt-4">
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

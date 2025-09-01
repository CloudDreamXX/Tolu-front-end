import { AdminService } from "entities/admin";
import { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui";
import { FiltersPopup } from "widgets/filters-popup";
import parse from "html-react-parser";

type RowType = "Coach" | "Client";

export type Row = {
  type: RowType;
  name: string;
  email: string;
  query: string;
  rating: number | null;
  date?: string | null;
  sourceId?: string;
  htmlContent?: string;
  comments?: string;
};

const PAGE_SIZE = 10;

const nameFromEmail = (email: string) => {
  const raw = email.split("@")[0].replace(/[._-]/g, " ");
  return raw
    .split(" ")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
};

export const fmtDate = (iso?: string | null) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";

  const dd = String(d.getUTCDate()).padStart(2, "0");
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = d.getUTCFullYear();

  return `${dd}/${mm}/${yyyy}`;
};

export type SortBy = "newest" | "oldest";

type SentimentFilter = "all" | "positive" | "negative";

type DateRange = { start?: string; end?: string };

type TypeFilter = "All" | RowType;

export type AppliedFilters = {
  sentiment: SentimentFilter;
  submit: DateRange;
  rating: DateRange;
  sort: SortBy;
};

const defaultFilters: AppliedFilters = {
  sentiment: "all",
  submit: {},
  rating: {},
  sort: "newest",
};

export const FeedbackHub = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");

  const within = (iso: string | null | undefined, range: DateRange) => {
    if (!range.start && !range.end) return true;
    if (!iso) return false;

    const t = new Date(iso).getTime();
    const s = range.start
      ? new Date(range.start).setHours(0, 0, 0, 0)
      : -Infinity;
    const e = range.end
      ? new Date(range.end).setHours(23, 59, 59, 999)
      : Infinity;
    return t >= s && t <= e;
  };

  const [isFiltersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<AppliedFilters>(defaultFilters);
  const [draftFilters, setDraftFilters] =
    useState<AppliedFilters>(defaultFilters);
  const [isQueryOpen, setIsQueryOpen] = useState(false);
  const [queryText, setQueryText] = useState<string>("");
  const [answerText, setAnswerText] = useState<string>("");

  const openQuery = (text?: string, answer?: string) => {
    setQueryText(text || "—");
    setAnswerText(answer || "");
    setIsQueryOpen(true);
  };
  const closeQuery = () => setIsQueryOpen(false);

  useEffect(() => {
    if (!isQueryOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeQuery();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isQueryOpen]);

  useEffect(() => {
    if (!isQueryOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isQueryOpen]);

  useEffect(() => setPage(1), [typeFilter]);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const res = await AdminService.getFeedback(
          PAGE_SIZE,
          (page - 1) * PAGE_SIZE
        );

        const coach = (res?.coach_feedback?.data ?? []).map(
          (c: any): Row => ({
            type: "Coach",
            name: nameFromEmail(c.coach_email),
            email: c.coach_email,
            query: c.query ?? "",
            rating: c.rating ?? null,
            date: c.rated_at ?? null,
            htmlContent: c.content,
            comments: c.rating_comment,
          })
        );

        const client: Row[] = (res?.client_feedback?.data ?? []).map(
          (c: any): Row => ({
            type: "Client",
            name: nameFromEmail(c.client_email),
            email: c.client_email,
            query: c.query ?? "",
            rating:
              typeof c.satisfaction_score === "number"
                ? c.satisfaction_score
                : null,
            date: c.created_at ?? null,
            htmlContent: c.content,
            sourceId: c.source_id,
            comments: c.rating_comment,
          })
        );

        const merged = [...coach, ...client].sort((a, b) => {
          const da = a.date ? new Date(a.date).getTime() : -Infinity;
          const db = b.date ? new Date(b.date).getTime() : -Infinity;
          return db - da;
        });

        setRows(merged);
        const combinedTotal =
          res?.summary?.combined_total ??
          Math.max(
            res?.coach_feedback?.total ?? 0,
            res?.client_feedback?.total ?? 0
          );
        setTotalPages(Math.max(1, Math.ceil(combinedTotal / PAGE_SIZE)));
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, [page]);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return rows.filter((r) => {
      const matchesType = typeFilter === "All" || r.type === typeFilter;
      const matchesSearch =
        !term ||
        [r.name, r.email, r.query, r.sourceId ?? ""].some((f) =>
          (f ?? "").toLowerCase().includes(term)
        );

      const matchesSentiment =
        filters.sentiment === "all" ||
        (filters.sentiment === "positive"
          ? (r.rating ?? 0) >= 4
          : (r.rating ?? 0) <= 2);

      const matchesSubmit = within(r.date, filters.submit);
      const matchesRating = within(r.date, filters.rating);

      return (
        matchesType &&
        matchesSearch &&
        matchesSentiment &&
        matchesSubmit &&
        matchesRating
      );
    });
  }, [rows, searchTerm, typeFilter, filters]);

  const getVisiblePages = (current: number, total: number, maxVisible = 4) => {
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const onApplyFilters = () => {
    setFilters(draftFilters);
    setPage(1);
    setFiltersOpen(false);
  };

  const htmlToText = (html?: string | null) => {
    if (!html) return "";
    const el = document.createElement("div");
    el.innerHTML = html;
    return (el.textContent || "").replace(/\s+/g, " ").trim();
  };

  return (
    <div className="flex flex-col gap-4 md:gap-[35px] p-8 overflow-y-auto h-full">
      <div className="hidden md:block flex items-center gap-2 xl:absolute top-[21px] z-[999]">
        {(["All", "Coach", "Client"] as const).map((tab) => {
          const isActive = typeFilter === tab;
          return (
            <button
              key={tab}
              role="tab"
              aria-selected={isActive}
              onClick={() => setTypeFilter(tab)}
              className={[
                "px-[66px] py-[16px] rounded-t-[16px] text-[#1D1D1F] text-[18px] font-semibold bg-[#F2F4F6]",
                "transition-colors relative",
                isActive ? "border border-b-[#F2F4F6] border-[#97999A]" : "",
              ].join(" ")}
            >
              {tab}

              {isActive && (
                <>
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-[1px] left-[-16px] right-[-16px] h-[2px]
                           bg-[#F2F4F6] z-[9999]"
                  />

                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-[1px] -right-[16px] w-[16px] h-[16px]
                           bg-[#F2F4F6] border-b border-l border-[#97999A]
                           rounded-bl-[16px] z-[99999]"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-[1px] -left-[16px] w-[16px] h-[16px]
                           bg-[#F2F4F6] border-b border-r border-[#97999A]
                           rounded-br-[16px] z-[99999]"
                  />

                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-[1px] left-[-1px] w-[2px] h-[16px]
                 bg-[#F2F4F6] z-30"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -bottom-[1px] right-[-1px] w-[2px] h-[16px]
                 bg-[#F2F4F6] z-30"
                  />
                </>
              )}
            </button>
          );
        })}
      </div>
      <div className="absolute md:top-[201px] xl:top-[81px] md:left-0 md:right-0 xl:left-[97px] 2xl:left-[300px] border-b border-[#97999A]" />

      <div className="flex flex-row justify-between gap-4 md:items-baseline xl:items-center">
        <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
          <MaterialIcon iconName="chat" fill={1} />
          Feedback
        </h1>

        <div className="flex flex-col gap-[16px] items-end">
          <div className="flex items-center gap-4">
            <Button
              variant={"light-blue"}
              className="text-[#1C63DB] text-[16px] font-semibold py-[10px] px-[16px]"
              onClick={() => {
                setDraftFilters(filters);
                setFiltersOpen(true);
              }}
            >
              <MaterialIcon iconName="page_info" />
              Filter
            </Button>
            <div className="hidden xl:flex gap-2 items-center rounded-full border border-[#DBDEE1] px-[12px] py-[10px] bg-white w-[306px]">
              <MaterialIcon
                iconName="search"
                size={16}
                className="text-gray-600"
              />
              <input
                type="text"
                placeholder="Search by keyword, email, or content ID"
                className="outline-none w-full text-[14px] text-[#1D1D1F] placeholder:text-[#5F5F65]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="hidden md:flex items-center justify-center px-[16px] py-[8px] rounded-[8px] border border-transparent hover:border-[#1C63DB] text-[#5F5F65] hover:text-[#1C63DB]">
              <MaterialIcon
                iconName="table"
                size={20}
                fill={1}
                className="text-[#1C63DB]"
              />
            </button>
            <button className="hidden md:flex items-center justify-center px-[16px] py-[8px] rounded-[8px] border border-transparent hover:border-[#1C63DB] text-[#5F5F65] hover:text-[#1C63DB]">
              <MaterialIcon
                iconName="stack"
                fill={1}
                size={20}
                className="text-[#1C63DB]"
              />
            </button>
          </div>
          <div className="hidden md:flex xl:hidden gap-2 items-center rounded-full border border-[#DBDEE1] px-[12px] py-[10px] bg-white w-[306px]">
            <MaterialIcon
              iconName="search"
              size={16}
              className="text-gray-600"
            />
            <input
              type="text"
              placeholder="Search by keyword, email, or content ID"
              className="outline-none w-full text-[14px] text-[#1D1D1F] placeholder:text-[#5F5F65]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="md:hidden flex gap-2 items-center rounded-full border border-[#DBDEE1] px-[12px] py-[10px] bg-white w-full">
        <MaterialIcon iconName="search" size={16} className="text-gray-600" />
        <input
          type="text"
          placeholder="Search by keyword, email, or content ID"
          className="outline-none w-full text-[14px] text-[#1D1D1F] placeholder:text-[#5F5F65]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="w-full overflow-x-auto">
        <div className="bg-white rounded-xl border border-[#E6E8EB] p-[24px] min-w-[1400px]">
          <div className="grid grid-cols-11 pb-[24px] border-b text-[18px] font-[500] text-[#5F5F65] mb-[24px]">
            <div className="col-span-1">User type</div>
            <div className="col-span-3">Query</div>
            <div className="col-span-1">Rating</div>
            <div className="col-span-2">Feedback</div>
            <div className="col-span-3">Content preview</div>
            <div className="col-span-1">Date</div>
          </div>

          <div>
            {loading && (
              <div className="p-6 text-sm text-center text-gray-500">
                Loading…
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="p-6 text-sm text-center text-gray-500">
                No feedback found.
              </div>
            )}

            {!loading &&
              filtered.slice(0, PAGE_SIZE).map((r, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-11 px-[12px] py-[8px] items-center ${
                    idx % 2 === 0 ? "bg-white" : "bg-[#F7F9FD] rounded-[8px]"
                  }`}
                >
                  <div className="col-span-1">
                    <span
                      className={`px-[12px] py-[8px] rounded-full text-[16px] font-[500] ${
                        r.type === "Coach"
                          ? "bg-[#F0F3FF] text-[#000E66]"
                          : "bg-[#FBF0FF] text-[#460066]"
                      }`}
                    >
                      {r.type}
                    </span>
                  </div>

                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => openQuery(r.query, r.htmlContent)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && openQuery(r.query, r.htmlContent)
                    }
                    title={r.query || undefined}
                    className="col-span-3 min-w-0 pr-[20px] underline cursor-pointer truncate
             text-[18px] font-[500] text-[#5F5F65] hover:text-[#1C63DB]"
                  >
                    {r.query || "—"}
                  </div>

                  {isQueryOpen && (
                    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
                      <div
                        className="absolute inset-0 bg-black/5"
                        onClick={closeQuery}
                        aria-hidden
                      />
                      <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="query-modal-title"
                        className="relative z-[10001] w-[min(90vw,800px)] max-h-[80vh]
                 bg-white border rounded-2xl p-4 md:p-6 overflow-y-auto scrollbar-hide"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h2
                            id="query-modal-title"
                            className="text-xl text-[#1D1D1F] font-semibold"
                          >
                            {queryText}
                          </h2>
                          <button
                            onClick={closeQuery}
                            className="rounded hover:bg-gray-100"
                            aria-label="Close"
                          >
                            <MaterialIcon iconName="close" />
                          </button>
                        </div>

                        <div className="mt-8 text-[16px] text-[#1D1D1F] whitespace-pre-wrap break-words">
                          {parse(answerText)}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center col-span-1 gap-2">
                    {r.rating != null ? (
                      <span
                        className={`inline-flex items-center justify-center px-[12px] py-[8px] rounded-full text-[16px] font-[500] ${
                          r.rating >= 4
                            ? "bg-[#F0FFF5] text-[#006622]"
                            : r.rating === 3
                              ? "bg-[#FFF6F0] text-[#663C00]"
                              : "bg-[#FFF0F0] text-[#660000]"
                        }`}
                      >
                        {r.rating}
                      </span>
                    ) : (
                      <span className="text-[#5F5F65] pl-[12px]">—</span>
                    )}
                    {r.rating === 1 && (
                      <MaterialIcon
                        iconName="warning"
                        className="text-[#FF1F0F]"
                        fill={1}
                      />
                    )}
                  </div>

                  <div className="col-span-2 text-[18px] font-[500] text-[#5F5F65]">
                    {r.comments || "—"}
                  </div>

                  <TooltipProvider delayDuration={500}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="cursor-pointer col-span-3 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[18px] font-[500] text-[#5F5F65] pr-[20px]">
                          {htmlToText(r.htmlContent)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="z-50 p-[16px] md:w-[470px]">
                        <div className="text-[#5F5F65] text-[18px] leading-[1.4] font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="text-[#1D1D1F]">User:</span>{" "}
                          {r.query}
                        </div>
                        <div className="text-[#5F5F65] text-[18px] leading-[1.4] font-medium overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="text-[#1D1D1F]">Answer:</span>{" "}
                          {htmlToText(r.htmlContent)}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="col-span-1 text-[18px] font-[500] text-[#5F5F65]">
                    {fmtDate(r.date)}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pb-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border border-[#DBDEE1] rounded-[8px] disabled:opacity-60"
          >
            <MaterialIcon iconName="arrow_left_alt" />
          </button>

          {getVisiblePages(page, totalPages).map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => setPage(pageNumber)}
              className={`flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border rounded-[8px] ${
                page === pageNumber
                  ? "border-[#1C63DB] text-[#1C63DB]"
                  : "border-[#DBDEE1] text-black"
              }`}
            >
              {pageNumber}
            </button>
          ))}

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            className="flex items-center justify-center p-[10px] w-[40px] h-[40px] bg-white border border-[#DBDEE1] rounded-[8px] disabled:opacity-60"
          >
            <MaterialIcon iconName="arrow_right_alt" />
          </button>
        </div>
      )}

      {isFiltersOpen && (
        <FiltersPopup
          draftFilters={draftFilters}
          setDraftFilters={setDraftFilters}
          onSave={onApplyFilters}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>
  );
};

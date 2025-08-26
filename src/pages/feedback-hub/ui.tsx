import { ChatTextIcon } from "@phosphor-icons/react/dist/ssr";
import { AdminService } from "entities/admin";
import {
  Search,
  Eye,
  AlertTriangle,
  ArrowUpRightIcon,
  Settings2,
  Copy,
  Table,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Arrow from "shared/assets/icons/pages-arrow";
import { Button, TooltipWrapper } from "shared/ui";

type RowType = "Coach" | "Client";

type Row = {
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

const fmtDate = (iso?: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

export const FeedbackHub = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  //   const [selected, setSelected] = useState<Row | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const res = await AdminService.getFeedback(
          PAGE_SIZE,
          (page - 1) * PAGE_SIZE
        );

        const coach: Row[] = (res?.coach_feedback?.data ?? []).map(
          (c: any): Row => ({
            type: "Coach",
            name: nameFromEmail(c.coach_email),
            email: c.coach_email,
            query: c.query ?? "",
            rating: c.rating ?? null,
            date: c.rated_at ?? null,
            htmlContent: c.content,
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
            sourceId: c.source_id,
            comments: c.comments ?? "",
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
    if (!term) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.query].some((f) =>
        (f ?? "").toLowerCase().includes(term)
      )
    );
  }, [rows, searchTerm]);

  const getVisiblePages = (current: number, total: number, maxVisible = 4) => {
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="flex flex-col gap-4 md:gap-[35px] p-8 overflow-y-auto h-full">
      <div className="flex flex-row gap-4 justify-between md:items-baseline xl:items-center">
        <h1 className="flex flex-row items-center gap-2 text-3xl font-bold">
          <ChatTextIcon />
          Feedback
        </h1>

        <div className="flex flex-col gap-[16px] items-end">
          <div className="flex gap-4 items-center">
            <Button
              variant={"light-blue"}
              className="text-[#1C63DB] text-[16px] font-semibold py-[10px] px-[16px]"
            >
              <Settings2 className="rotate-[90deg]" />
              Filter
            </Button>
            <div className="hidden xl:flex gap-2 items-center rounded-full border border-[#DBDEE1] px-[12px] py-[10px] bg-white w-[306px]">
              <Search className="w-4 h-4 text-gray-600" />
              <input
                type="text"
                placeholder="Search by keyword, email, or content ID"
                className="outline-none w-full text-[14px] text-[#1D1D1F] placeholder:text-[#5F5F65]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="hidden md:block px-[16px] py-[8px] rounded-[8px] border border-transparent hover:border-[#1C63DB] text-[#5F5F65] hover:text-[#1C63DB]">
              <Table className="w-4 h-4" />
            </button>
            <button className="hidden md:block px-[16px] py-[8px] rounded-[8px] border border-transparent hover:border-[#1C63DB] text-[#5F5F65] hover:text-[#1C63DB]">
              <Copy className="w-4 h-4" />
            </button>
          </div>
          <div className="hidden md:flex xl:hidden gap-2 items-center rounded-full border border-[#DBDEE1] px-[12px] py-[10px] bg-white w-[306px]">
            <Search className="w-4 h-4 text-gray-600" />
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
        <Search className="w-4 h-4 text-gray-600" />
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
          <div className="grid grid-cols-12 pb-[24px] border-b text-[18px] font-[500] text-[#5F5F65] mb-[24px]">
            <div className="col-span-1">Type</div>
            <div className="col-span-2">Name</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-3">Query</div>
            <div className="col-span-1">Rating</div>
            <div className="col-span-1">Date</div>
            <div className="col-span-1">Actions</div>
          </div>

          <div>
            {loading && (
              <div className="p-6 text-center text-sm text-gray-500">
                Loading…
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="p-6 text-center text-sm text-gray-500">
                No feedback found.
              </div>
            )}

            {!loading &&
              filtered.slice(0, PAGE_SIZE).map((r, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-12 px-[12px] py-[8px] items-center ${
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

                  <div className="col-span-2 text-[18px] font-[500] text-[#1D1D1F]">
                    {r.name || "—"}
                  </div>
                  <div className="col-span-3 text-[18px] font-[500] text-[#5F5F65]">
                    {r.email}
                  </div>

                  <div className="col-span-3 text-[18px] font-[500] text-[#5F5F65] truncate">
                    {r.query || "—"}
                  </div>

                  <div className="col-span-1 flex items-center justify-center gap-2">
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
                      <span className="text-gray-400">—</span>
                    )}
                    {r.rating === 1 && (
                      <AlertTriangle className="w-[24px] h-[24px] text-[#FF1F0F]" />
                    )}
                  </div>

                  <div className="col-span-1 text-[18px] font-[500] text-[#5F5F65]">
                    {fmtDate(r.date)}
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-3">
                    <TooltipWrapper content="View Details">
                      <button
                        className="p-2 rounded-md hover:bg-gray-100"
                        // onClick={() => setSelected(r)}
                      >
                        <Eye className="w-[32px] h-[32px] text-[#1C63DB]" />
                      </button>
                    </TooltipWrapper>

                    <TooltipWrapper content=" Link to Original Content">
                      <button
                        className={`p-2 rounded-md ${
                          r.sourceId
                            ? "hover:bg-gray-100"
                            : "opacity-40 cursor-not-allowed"
                        }`}
                        onClick={() => {
                          // if (!r.sourceId) return;
                          // window.open(`/document/${r.sourceId}`, "_blank");
                        }}
                      >
                        <ArrowUpRightIcon className="w-[32px] h-[32px] text-[#1C63DB]" />
                      </button>
                    </TooltipWrapper>
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
            <span className="rotate-180">
              <Arrow />
            </span>
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
            <Arrow />
          </button>
        </div>
      )}
    </div>
  );
};

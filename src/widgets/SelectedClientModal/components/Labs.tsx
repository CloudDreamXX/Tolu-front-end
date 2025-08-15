import React, { useMemo, useState } from "react";
import Search from "shared/assets/icons/search";
import { Input } from "shared/ui";

type LabReport = {
  id: string;
  name: string;
  description: string;
  pages: number;
};

const MOCK_REPORTS: LabReport[] = [
  {
    id: "1",
    name: "Lab_report_05.24.pdf",
    description: "Vitamin D has improved 15% since last test",
    pages: 6,
  },
  {
    id: "2",
    name: "Lab_report_05.24.pdf",
    description: "Vitamin D has improved 15% since last test",
    pages: 6,
  },
  {
    id: "3",
    name: "Lab_report_05.24.pdf",
    description: "Vitamin D has improved 15% since last test",
    pages: 6,
  },
];

const PdfIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
      stroke="#1D1D1F"
      strokeWidth="1.5"
    />
    <path d="M14 2v6h6" stroke="#1D1D1F" strokeWidth="1.5" />
    <text x="7" y="18" fontSize="8" fontFamily="Arial" fill="#1D1D1F">
      PDF
    </text>
  </svg>
);
const EyeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
      stroke="#1D1D1F"
      strokeWidth="1.6"
    />
    <circle cx="12" cy="12" r="3" stroke="#1D1D1F" strokeWidth="1.6" />
  </svg>
);
const DownloadIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 3v12"
      stroke="#1D1D1F"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path
      d="m7 11 5 5 5-5"
      stroke="#1D1D1F"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 21h14"
      stroke="#1D1D1F"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);
const CloseX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path
      d="M18 6 6 18M6 6l12 12"
      stroke="#1D1D1F"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const Labs: React.FC = () => {
  const [rows] = useState<LabReport[]>(MOCK_REPORTS);
  const [preview, setPreview] = useState<{
    open: boolean;
    file?: LabReport;
    page: number;
  }>({
    open: false,
    file: undefined,
    page: 0,
  });

  const totalPages = preview.file?.pages ?? 0;
  const pageDisplay = useMemo(
    () => `${preview.page + 1} / ${Math.max(totalPages, 1)}`,
    [preview.page, totalPages]
  );
  const [search, setSearch] = useState<string>("");

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [rows, search]);

  const openPreview = (file: LabReport) =>
    setPreview({ open: true, file, page: 0 });

  const closePreview = () =>
    setPreview({ open: false, file: undefined, page: 0 });

  const nextPage = () =>
    setPreview((p) =>
      p.file ? { ...p, page: Math.min(p.page + 1, (p.file.pages ?? 1) - 1) } : p
    );
  const prevPage = () =>
    setPreview((p) => (p.file ? { ...p, page: Math.max(p.page - 1, 0) } : p));

  const handleDownload = (file: LabReport) => {
    const blob = new Blob(
      [`Mock PDF for ${file.name}\n\n(Replace with a real file URL or blob)`],
      { type: "application/pdf" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="md:hidden w-full mb-[16px]">
        <Input
          placeholder="Search"
          icon={<Search />}
          className="rounded-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="rounded-[12px] border border-[#DBDEE1] overflow-hidden">
        <div className="bg-[#F3F6FB] text-[#1C63DB] font-semibold px-6 py-3 flex italic">
          <div className="w-full md:w-1/3">Name</div>
          <div className="hidden md:block md:w-2/3">Description</div>
        </div>

        <div className="bg-white">
          {filteredRows.map((r, i) => (
            <div
              key={r.id}
              className={[
                "px-6 py-3 flex items-center justify-between",
                i !== rows.length - 1 ? "border-b border-[#DBDEE1]" : "",
              ].join(" ")}
            >
              <div className="flex flex-col gap-[16px]">
                <div className="w-full md:w-1/3 flex items-center gap-3">
                  <PdfIcon />
                  <span className="text-[14px] text-[#1D1D1F]">{r.name}</span>
                </div>
                <div className="md:hidden text-[14px] text-[#1D1D1F] leading-[18px] italic max-w-[200px]">
                  {r.description}
                </div>
              </div>

              <div className="w-fit md:w-2/3 flex items-center justify-between gap-3">
                <div className="hidden md:block text-[14px] text-[#1D1D1F] leading-[18px] italic max-w-[200px]">
                  {r.description}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openPreview(r)}
                    className="p-2 rounded hover:bg-black/5"
                    title="View"
                    aria-label="View"
                  >
                    <EyeIcon />
                  </button>
                  <button
                    onClick={() => handleDownload(r)}
                    className="p-2 rounded hover:bg-black/5"
                    title="Download"
                    aria-label="Download"
                  >
                    <DownloadIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview modal */}
      {preview.open && preview.file && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30">
          <div className="bg-white w-[720px] max-w-[92vw] max-h-[640px] md:max-h-[90vh] rounded-[16px] shadow-xl overflow-hidden flex flex-col">
            <div className="px-5 py-4 flex items-center justify-between">
              <h2 className="text-[18px] font-bold">
                Preview{" "}
                <span className="text-[#1D1D1F]">“{preview.file.name}”</span>
              </h2>
              <button
                className="p-1 rounded hover:bg-black/5"
                onClick={closePreview}
              >
                <CloseX />
              </button>
            </div>

            <div className="relative flex-1 bg-[#F7F7F8] rounded-[8px] mx-[5px] md:mx-[40px] mb-[24px] px-[5px] md:px-6 py-6 overflow-auto">
              <div className="absolute left-1/2 -translate-x-1/2 top-3 bg-[#161616BF] rounded-full px-3 py-1 text-[12px] font-semibold text-white">
                {pageDisplay}
              </div>

              <div className="mx-auto w-full md:w-[560px] bg-white rounded-[12px] shadow p-6 space-y-5">
                {Array.from({ length: 6 }).map((_, idx) => (
                  <p key={idx} className="text-[13px] leading-6 text-[#1D1D1F]">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut
                    et massa mi. Aliquam in hendrerit urna. Pellentesque sit
                    amet sapien fringilla, mattis ligula consequat, ultrices
                    mauris. Maecenas vitae mattis tellus. Nullam quis imperdiet
                    augue. Vestibulum auctor ornare leo, non suscipit magna
                    interdum eu. Curabitur pellentesque nibh nibh, at maximus
                    ante fermentum sit amet.
                  </p>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-center gap-3">
                <button
                  onClick={prevPage}
                  disabled={preview.page <= 0}
                  className={[
                    "px-3 py-1 rounded-full border border-[#DBDEE1] text-sm",
                    preview.page <= 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-black/5",
                  ].join(" ")}
                >
                  Prev
                </button>
                <button
                  onClick={nextPage}
                  disabled={preview.page >= totalPages - 1}
                  className={[
                    "px-3 py-1 rounded-full border border-[#DBDEE1] text-sm",
                    preview.page >= totalPages - 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-black/5",
                  ].join(" ")}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Labs;

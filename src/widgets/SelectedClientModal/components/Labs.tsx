import { LabsInfo } from "entities/coach";
import React, { useMemo, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button, Input } from "shared/ui";

type LabReport = {
  id: string;
  name: string;
  description: string;
  pages: number;
  url?: string;
};

type Props = {
  client: LabsInfo[];
  handleDownloadFile: (name: string) => Promise<void>;
};

const normalizeLab = (raw: LabsInfo, idx: number): LabReport => {
  const id = String(
    raw?.id ??
      raw?.lab_id ??
      raw?.uuid ??
      raw?.documentId ??
      raw?.report_id ??
      idx + 1
  );

  const name = String(
    raw?.name ??
      raw?.file_name ??
      raw?.filename ??
      raw?.title ??
      `Lab_report_${idx + 1}.pdf`
  );

  const description = String(
    raw?.description ?? raw?.desc ?? raw?.notes ?? raw?.summary ?? ""
  );

  const pagesNum = Number(raw?.pages ?? raw?.page_count ?? raw?.num_pages ?? 1);
  const pages = Number.isFinite(pagesNum) && pagesNum > 0 ? pagesNum : 1;

  const url =
    (raw?.url as string) ??
    (raw?.file_url as string) ??
    (raw?.download_url as string) ??
    (raw?.link as string) ??
    undefined;

  return { id, name, description, pages, url };
};

const Labs: React.FC<Props> = ({ client, handleDownloadFile }) => {
  const rows = useMemo<LabReport[]>(
    () => (Array.isArray(client) ? client.map(normalizeLab) : []),
    [client]
  );

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
        (r.description ?? "").toLowerCase().includes(q)
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

  return (
    <>
      <div className="md:hidden w-full mb-[16px]">
        <Input
          placeholder="Search"
          icon={<MaterialIcon iconName="search" size={16} />}
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
          {filteredRows.length === 0 ? (
            <div className="px-6 py-6 text-sm text-[#5F5F65]">
              No lab reports yet.
            </div>
          ) : (
            filteredRows.map((r, i) => (
              <div
                key={r.id}
                className={[
                  "px-6 py-3 flex items-center justify-between",
                  i !== filteredRows.length - 1
                    ? "border-b border-[#DBDEE1]"
                    : "",
                ].join(" ")}
              >
                <div className="flex flex-col gap-[16px]">
                  <div className="flex items-center w-full gap-3 md:w-1/3">
                    <MaterialIcon iconName="picture_as_pdf" />
                    <span className="text-[14px] text-[#1D1D1F]">{r.name}</span>
                  </div>
                  <div className="md:hidden text-[14px] text-[#1D1D1F] leading-[18px] italic max-w-[200px]">
                    {r.description}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 w-fit md:w-2/3">
                  <div className="hidden md:block text-[14px] text-[#1D1D1F] leading-[18px] italic max-w-[200px]">
                    {r.description}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant={"unstyled"}
                      size={"unstyled"}
                      onClick={() => openPreview(r)}
                      className="p-2 rounded hover:bg-black/5"
                      title="View"
                      aria-label="View"
                    >
                      <MaterialIcon iconName="visibility" fill={1} />
                    </Button>
                    <Button
                      variant={"unstyled"}
                      size={"unstyled"}
                      onClick={() => handleDownloadFile(r.name)}
                      className="p-2 rounded hover:bg-black/5"
                      title="Download"
                      aria-label="Download"
                    >
                      <MaterialIcon iconName="download" fill={1} />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preview modal */}
      {preview.open && preview.file && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30">
          <div className="bg-white w-[720px] max-w-[92vw] max-height-[90vh] rounded-[16px] shadow-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4">
              <h2 className="text-[18px] font-bold">
                Preview{" "}
                <span className="text-[#1D1D1F]">“{preview.file.name}”</span>
              </h2>
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                className="p-1 rounded hover:bg-black/5"
                onClick={closePreview}
              >
                <MaterialIcon iconName="close" fill={1} />
              </Button>
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
                    interdum eu.
                  </p>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 mt-4">
                <Button
                  variant={"unstyled"}
                  size={"unstyled"}
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
                </Button>
                <Button
                  variant={"unstyled"}
                  size={"unstyled"}
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
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Labs;

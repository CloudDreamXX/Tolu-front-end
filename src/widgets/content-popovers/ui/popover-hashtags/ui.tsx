import {
  useGetAllHashtagsQuery,
  useGetContentHashtagsQuery,
  useAddHashtagsMutation,
  useDeleteHashtagsMutation,
} from "entities/content";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Popover, PopoverTrigger, PopoverContent, Button } from "shared/ui";

interface HashtagPopoverProps {
  contentId: string;
  customTrigger?: React.ReactNode;
  disabled?: boolean;
  onChange?: (hashtags: string[]) => void;
}

const normalize = (v: string) =>
  v.trim().replace(/^#/, "").replace(/\s+/g, "_");

const HashtagPopover: React.FC<HashtagPopoverProps> = ({
  contentId,
  customTrigger,
  disabled,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { data: allHashtagsData } = useGetAllHashtagsQuery();
  const { data: contentHashtagsData } = useGetContentHashtagsQuery(contentId);

  const [addHashtags] = useAddHashtagsMutation();
  const [deleteHashtags] = useDeleteHashtagsMutation();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    if (contentHashtagsData?.hashtags) {
      setSelected(contentHashtagsData?.hashtags.map(normalize));
      onChange?.(contentHashtagsData?.hashtags.map(normalize));
    }
    setLoading(false);

    setTimeout(() => inputRef.current?.focus(), 0);
  }, [open, contentId, contentHashtagsData, onChange]);

  const allHashtags = useMemo(() => {
    return allHashtagsData?.hashtags?.map(normalize) || [];
  }, [allHashtagsData]);

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query).toLowerCase();
    const base = allHashtags.filter((item: string) => !selected.includes(item));
    if (!normalizedQuery) return base;
    return base.filter((item: string) =>
      item.toLowerCase().includes(normalizedQuery)
    );
  }, [query, allHashtags, selected]);

  const existsExact = useMemo(() => {
    const normalizedQuery = normalize(query);
    return (
      !!normalizedQuery &&
      allHashtags.some(
        (t: string) => t.toLowerCase() === normalizedQuery.toLowerCase()
      )
    );
  }, [query, allHashtags]);

  const add = async (tag: string) => {
    const normalizedTag = normalize(tag);
    if (!normalizedTag || selected.includes(normalizedTag)) return;
    await addHashtags({
      content_id: contentId,
      hashtags: [normalizedTag],
    }).unwrap();
    setSelected((prev) => {
      const next = [...prev, normalizedTag];
      onChange?.(next);
      return next;
    });
    setQuery("");
    inputRef.current?.focus();
  };

  const remove = async (tag: string) => {
    await deleteHashtags({ content_id: contentId, hashtags: [tag] }).unwrap();
    setSelected((item) => {
      const next = item.filter((item) => item !== tag);
      onChange?.(next);
      return next;
    });
  };

  const createOrAdd = () => {
    const normalizedTag = normalize(query);
    if (!normalizedTag) return;
    add(normalizedTag);
  };

  return (
    <Popover
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) setQuery("");
      }}
    >
      <PopoverTrigger asChild disabled={disabled}>
        {customTrigger ?? (
          <Button
            variant="outline"
            className="flex w-full items-center justify-between rounded-[18px] px-4 py-2"
          >
            <span className="text-left">
              <span className="block text-[16px] font-bold">Hashtags</span>
              <span className="block text-[12px] text-[#5F5F65]">
                Add or create
              </span>
            </span>
            {selected.length > 0 && (
              <span className="rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-bold text-white">
                {selected.length}
              </span>
            )}
          </Button>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-[360px] p-4 flex flex-col gap-3 rounded-2xl bg-[#F9FAFB]">
        <div className="flex flex-wrap gap-2 min-h-[30px]">
          {selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm"
            >
              #{item}
              <button
                className="text-gray-500 hover:text-black"
                onClick={() => remove(item)}
              >
                ×
              </button>
            </span>
          ))}
          {selected.length === 0 && (
            <span className="text-sm text-[#5F5F65]">No hashtags yet</span>
          )}
        </div>

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              if (!existsExact && query.trim()) createOrAdd();
            }
          }}
          placeholder="Search or create hashtag…"
          className="flex flex-col w-full rounded-[18px] border border-input bg-background outline-none px-6 py-4 min-h-fit"
        />

        <div className="w-full flex items-center gap-[8px] max-h-[200px] overflow-y-auto">
          {loading ? (
            <div className="p-3 text-sm text-[#5F5F65]">Loading…</div>
          ) : (
            <>
              {query.trim() && !existsExact && (
                <Button variant="brightblue" onClick={createOrAdd}>
                  Create hashtag
                </Button>
              )}
              {filtered.length > 0
                ? filtered.map((item: string) => (
                    <Button variant="brightblue" onClick={() => add(item)}>
                      #{item}
                    </Button>
                  ))
                : !query.trim() && (
                    <div className="p-3 text-sm text-[#5F5F65]">
                      No available hashtags
                    </div>
                  )}
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HashtagPopover;

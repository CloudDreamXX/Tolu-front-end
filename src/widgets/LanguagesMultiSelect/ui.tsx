import * as React from "react";

type MultiSelectProps = {
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function LanguagesMultiSelect({
  options,
  value,
  onChange,
  name,
  placeholder = "Select languages",
  disabled,
}: MultiSelectProps) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [highlight, setHighlight] = React.useState<number>(-1);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = options.filter((opt) =>
    normalizedQuery ? opt.toLowerCase().includes(normalizedQuery) : true
  );

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function toggle(opt: string) {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
    setQuery("");
    setOpen(true);
    setHighlight(-1);
    inputRef.current?.focus();
  }

  function removeAt(idx: number) {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !query && value.length) {
      e.preventDefault();
      onChange(value.slice(0, -1));
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min((h < 0 ? -1 : h) + 1, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.max((h <= 0 ? 0 : h) - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      if (open && filtered.length && highlight >= 0) {
        e.preventDefault();
        toggle(filtered[highlight]);
      }
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
  }

  return (
    <div ref={rootRef} className="w-full">
      {name &&
        value.map((v) => (
          <input key={v} type="hidden" name={`${name}[]`} value={v} />
        ))}

      <div
        className={[
          "w-full min-h-10 flex flex-wrap items-center gap-2 rounded-[8px] border",
          "border-[#DFDFDF] bg-white px-3 py-2 focus-within:border-[#1C63DB]",
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-text",
        ].join(" ")}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls="languages-listbox"
        onClick={() => {
          if (!disabled) {
            setOpen(true);
            inputRef.current?.focus();
          }
        }}
      >
        {value.length === 0 && !query ? (
          <span className="text-sm select-none text-muted-foreground">
            {placeholder}
          </span>
        ) : null}

        {value.map((lang, i) => (
          <span
            key={lang}
            className="inline-flex items-center gap-1 rounded-md bg-gray-100 text-black px-2 py-0.5 text-sm"
          >
            {lang}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeAt(i);
              }}
              aria-label={`Remove ${lang}`}
              className="opacity-60 hover:opacity-100"
            >
              ×
            </button>
          </span>
        ))}

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setHighlight(-1);
          }}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder={value.length ? "" : undefined}
          className="flex-1 min-w-[6ch] bg-transparent outline-none text-sm h-6"
          aria-label="Languages"
        />

        <svg
          className="w-4 h-4 ml-auto pointer-events-none opacity-60"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {open && (
        <ul
          id="languages-listbox"
          role="listbox"
          aria-multiselectable
          className="w-full p-1 mt-1 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg max-h-72"
        >
          {filtered.length === 0 && (
            <li className="px-2 py-2 text-sm text-gray-500 select-none">
              No results
            </li>
          )}
          {filtered.map((opt, idx) => {
            const active = idx === highlight;
            const checked = value.includes(opt);
            return (
              <li
                key={opt}
                role="option"
                aria-selected={checked}
                className={[
                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                  active ? "bg-gray-100" : "hover:bg-gray-50",
                ].join(" ")}
                onMouseEnter={() => setHighlight(idx)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => toggle(opt)}
              >
                <input
                  type="checkbox"
                  readOnly
                  checked={checked}
                  className="w-4 h-4 border-gray-300 rounded"
                />
                {opt}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

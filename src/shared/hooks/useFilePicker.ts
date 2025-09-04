import { useCallback, useMemo, useRef, useState, useEffect } from "react";

export type PickItem = {
  id: string;
  file: File;
  previewUrl?: string;
  isImage: boolean;
  isPdf: boolean;
};

export interface UseFilePickerOptions {
  accept?: string[];
  maxFiles?: number;
  maxFileSize?: number;
  dedupe?: boolean;
}

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

export function useFilePicker(opts: UseFilePickerOptions = {}) {
  const {
    accept = ["application/pdf", "image/jpeg", "image/png"],
    maxFiles,
    maxFileSize,
    dedupe = true,
  } = opts;

  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<PickItem[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptAttr = useMemo(
    () => (accept.length ? accept.join(",") : undefined),
    [accept]
  );

  const isAllowedType = useCallback(
    (file: File) => {
      if (!accept.length) return true;
      return accept.some((rule) => {
        if (rule.startsWith("."))
          return file.name.toLowerCase().endsWith(rule.toLowerCase());
        if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1));
        return file.type === rule;
      });
    },
    [accept]
  );

  const validate = useCallback(
    (file: File): string | null => {
      if (!isAllowedType(file)) return "Unsupported file type";
      if (maxFileSize && file.size > maxFileSize) return "File is too large";
      return null;
    },
    [isAllowedType, maxFileSize]
  );

  const makeItem = (file: File): PickItem => {
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(file) : undefined;
    return { id: uid(), file, isImage, isPdf, previewUrl };
  };

  const makeItems = (files: File[]): PickItem[] => {
    return files.map((file) => makeItem(file));
  };

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files);
      const next: PickItem[] = [];
      let total = items.length;

      for (const f of list) {
        if (maxFiles && total >= maxFiles) break;

        const v = validate(f);
        if (v) {
          setError(v);
          continue;
        }

        if (dedupe) {
          const exists = items.some(
            (i) =>
              i.file.name === f.name &&
              i.file.size === f.size &&
              i.file.lastModified === f.lastModified
          );
          if (exists) continue;
        }

        next.push(makeItem(f));
        total++;
      }

      if (next.length) {
        setItems((prev) => [...prev, ...next]);
        setError(null);
      }
    },
    [dedupe, items, maxFiles, validate]
  );

  const setFiles = useCallback((files: File[]) => {
    return setItems(makeItems(files));
  }, []);

  const open = useCallback(() => inputRef.current?.click(), []);

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const tgt = prev.find((i) => i.id === id);
      if (tgt?.previewUrl) URL.revokeObjectURL(tgt.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clear = useCallback(() => {
    setItems((prev) => {
      prev.forEach((i) => i.previewUrl && URL.revokeObjectURL(i.previewUrl));
      return [];
    });
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      items.forEach((i) => i.previewUrl && URL.revokeObjectURL(i.previewUrl));
    };
  }, []);

  const getInputProps = () => ({
    ref: inputRef,
    type: "file" as const,
    multiple: true,
    accept: acceptAttr,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) addFiles(e.target.files);
      e.currentTarget.value = "";
    },
  });

  const getDropzoneProps = () => ({
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(true);
    },
    onDragLeave: () => setDragOver(false),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length)
        addFiles(e.dataTransfer.files);
    },
    onClick: open,
  });

  return {
    items,
    files: items.map((i) => i.file),
    dragOver,
    error,

    addFiles,
    setFiles,
    remove,
    clear,
    open,

    getInputProps,
    getDropzoneProps,
  };
}

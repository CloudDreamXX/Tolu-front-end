import { useEffect, useState, useRef } from "react";
import { HealthHistoryService } from "entities/health-history";
import { cn } from "shared/lib";
import { renderAsync } from "docx-preview";

export const DocxPreview = ({ file }: { file: File }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      if (!file || !containerRef.current) return;
      const buffer = await file.arrayBuffer();
      await renderAsync(buffer, containerRef.current);
    };
    load();
  }, [file]);

  return <div ref={containerRef} className="docx-preview absolute inset-0" />;
};

export const LabFilePreview = ({
  filename,
  clientId,
  className,
}: {
  filename: string;
  clientId?: string;
  className?: string;
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileBlob, setFileBlob] = useState<File | null>(null);

  useEffect(() => {
    let url: string;

    const fetchPreview = async () => {
      try {
        const blob = await HealthHistoryService.getLabReport({
          filename,
          client_id: clientId,
        });
        url = URL.createObjectURL(blob);
        setPreviewUrl(url);

        const file = new File([blob], filename, { type: blob.type });
        setFileBlob(file);
      } catch (err) {
        console.error("Preview error:", err);
      }
    };

    fetchPreview();

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [filename, clientId]);

  if (!previewUrl) {
    return <p className="text-sm text-gray-500">Loading preview...</p>;
  }

  return filename.endsWith(".pdf") ? (
    <iframe
      src={previewUrl}
      className={cn("w-full h-[600px] rounded-md", className)}
    />
  ) : filename.endsWith(".docx") || filename.endsWith(".doc") ? (
    fileBlob ? (
      <DocxPreview file={fileBlob} />
    ) : (
      <p className="text-sm text-gray-500">Unable to preview document</p>
    )
  ) : (
    <img
      src={previewUrl}
      alt={filename}
      className={cn("w-full rounded-md object-contain", className)}
    />
  );
};

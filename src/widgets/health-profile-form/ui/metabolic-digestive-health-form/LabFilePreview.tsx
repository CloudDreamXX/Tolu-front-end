import { useEffect, useState } from "react";
import { HealthHistoryService } from "entities/health-history";
import { cn } from "shared/lib";

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
    <iframe src={previewUrl} className={cn("w-full rounded-md", className)} />
  ) : (
    <img
      src={previewUrl}
      alt={filename}
      className={cn("w-full rounded-md object-contain", className)}
    />
  );
};

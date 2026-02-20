import { API_ROUTES } from "shared/api";

export const getAvatarUrl = async (fileUrl: string | null): Promise<string> => {
  if (!fileUrl) return "";

  try {
    const baseUrl = String(import.meta.env.VITE_API_URL || "").replace(
      /\/$/,
      ""
    );
    const normalizedFileName = (fileUrl.split("/").pop() || fileUrl)
      .split("?")[0]
      .replace(/\.[a-z0-9]+$/i, "");
    const encodedFilename = encodeURIComponent(normalizedFileName);

    return `${baseUrl}${API_ROUTES.CHAT.UPLOADED_AVATAR.replace("{filename}", encodedFilename)}`;
  } catch (error) {
    console.error("Error fetching avatar:", error);
    return "";
  }
};

export const getYMD = (d: Date) => ({
  y: d.getFullYear(),
  m: d.getMonth(),
  d: d.getDate(),
});

export const isToday = (d: Date) => {
  const now = new Date();
  const a = getYMD(d);
  const b = getYMD(now);
  return a.y === b.y && a.m === b.m && a.d === b.d;
};

export const dayKey = (d: Date) => {
  const { y, m, d: dd } = getYMD(d);
  return `${y}-${m + 1}-${dd}`;
};

export const formatDayLabel = (d: Date) => {
  if (isToday(d)) return "Today";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export const toUserTZ = (s: string | null) => {
  if (!s) return new Date(NaN);

  if (/([+-]\d{2}:\d{2}|Z)$/.test(s)) return new Date(s);

  const regex =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,6}))?$/;
  const m = regex.exec(s);
  if (!m) return new Date(s);

  const [, y, mo, d, h, mi, se, frac] = m;
  const ms = Number((frac ?? "0").slice(0, 3).padEnd(3, "0"));
  return new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +se, ms));
};

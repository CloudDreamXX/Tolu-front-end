export type ClientProfileData = {
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  timezone: string;
};

export const defaultData: ClientProfileData = {
  name: "",
  phone: "",
  email: "",
  dob: "",
  gender: "",
  timezone: "",
};

export const parseDob = (s?: string | null): Date | undefined => {
  if (!s) return undefined;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return undefined;
  const dt = new Date(y, m - 1, d);
  return Number.isNaN(dt.getTime()) ? undefined : dt;
};

export const formatDob = (date: Date | null | undefined): string => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

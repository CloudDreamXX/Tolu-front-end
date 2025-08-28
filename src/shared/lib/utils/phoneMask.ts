export const phoneMask = (value: string): string => {
  const raw = value.replace(/\D/g, "");
  const digits = raw.startsWith("1") ? raw.slice(1) : raw;
  const d = digits.slice(0, 10);

  if (d.length === 0) return "+1 ";
  if (d.length < 4) return `+1 (${d}`;
  if (d.length < 7) return `+1 (${d.slice(0, 3)}) ${d.slice(3)}`;
  return `+1 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

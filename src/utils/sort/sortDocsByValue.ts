type SortDirection = "asc" | "desc";

const parseDate = (str: string): number => {
  const [day, month, year] = str.split("/").map(Number);
  return new Date(year, month - 1, day).getTime();
};

const parseSize = (str: string): number => {
  return parseFloat(str.replace(/[^0-9.]/g, ""));
};

export const sortDocsByValue = (docs: any[], key: string, direction: SortDirection) => {
  const getValue = (item: any): string | number => {
    switch (key) {
      case "date":
        return parseDate(item[key]);
      case "size":
        return parseSize(item[key]);
      default:
        return item[key];
    }
  };

  const multiplier = direction === "asc" ? 1 : -1;

  return [...docs].sort((a, b) => {
    const aValue = getValue(a);
    const bValue = getValue(b);

    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * multiplier;
    }

    return ((aValue as number) - (bValue as number)) * multiplier;
  });
};

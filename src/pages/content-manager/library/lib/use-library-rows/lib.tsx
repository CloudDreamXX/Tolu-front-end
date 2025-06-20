import { useMemo, useState } from "react";
import { IFolder } from "entities/folder";
import { TableRow } from "../../models";

export const useLibraryLogic = (folders: IFolder[], search: string) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const convertToTableRows = (folders: IFolder[]): TableRow[] => {
    return folders.map(
      (folder): TableRow => ({
        id: folder.id,
        type: "folder",
        title: folder.name,
        filesCount: folder.totalContentItems,
        createdAt: folder.createdAt,
        reviewers: folder.reviewerName || "-",
        price: folder.price || "-",
        status: folder.status || "-",
        subfolders:
          folder.subfolders?.map(
            (sub): TableRow => ({
              id: sub.id,
              type: "subfolder",
              title: sub.name,
              filesCount: sub.totalContentItems,
              createdAt: sub.createdAt,
              reviewers: sub.reviewerName || "-",
              price: sub.price || "-",
              status: sub.status || "-",
              subfolders: [],
              content:
                sub.content?.map(
                  (c): TableRow => ({
                    id: c.id,
                    type: "content",
                    title: c.title,
                    filesCount: 0,
                    createdAt: c.createdAt,
                    reviewers: c.reviewerName || "-",
                    price: c.price || "-",
                    status: c.status || "-",
                    messages: c.messages || [],
                  })
                ) || [],
            })
          ) || [],
        content:
          folder.content?.map(
            (c): TableRow => ({
              id: c.id,
              type: "content",
              title: c.title,
              filesCount: 0,
              createdAt: c.createdAt,
              reviewers: c.reviewerName || "-",
              price: c.price || "-",
              status: c.status || "-",
              messages: c.messages || [],
            })
          ) || [],
      })
    );
  };

  const filteredItems = useMemo(() => {
    const tableRows = convertToTableRows(folders);

    if (!search) return tableRows;

    const searchLower = search.toLowerCase();
    return tableRows.filter((row) =>
      row.title.toLowerCase().includes(searchLower)
    );
  }, [search, folders]);

  return {
    expandedFolders,
    toggleFolder,
    filteredItems,
  };
};

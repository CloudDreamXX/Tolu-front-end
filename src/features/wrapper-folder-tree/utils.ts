import { IFolder } from "entities/folder";

export type PathEntry = { id: string; name: string };

export const findFolderPath = (
  folders: IFolder[],
  targetFolderId?: string,
  path: PathEntry[] = []
): PathEntry[] | null => {
  for (const folder of folders) {
    const newPath = [...path, { id: folder.id, name: folder.name }];

    if (folder.id === targetFolderId) {
      return newPath;
    }

    if (folder.subfolders?.length) {
      const result = findFolderPath(folder.subfolders, targetFolderId, newPath);
      if (result) return result;
    }
  }

  return null;
};

export const findFilePath = (
  folders: IFolder[],
  contentId: string,
  path: PathEntry[] = []
): PathEntry[] | null => {
  for (const folder of folders) {
    const newPath = [...path, { id: folder.id, name: folder.name }];

    const foundFile = folder.content.find((file) => file.id === contentId);
    if (foundFile) {
      return [
        ...newPath,
        { id: foundFile.id, name: foundFile.aiTitle ?? foundFile.title },
      ];
    }

    const subfolderPath = findInSubfolders(
      folder.subfolders,
      contentId,
      newPath
    );
    if (subfolderPath) return subfolderPath;
  }

  return null;
};

const findInSubfolders = (
  subfolders: IFolder[],
  contentId: string,
  path: PathEntry[]
): PathEntry[] | null => {
  for (const sub of subfolders) {
    const newPath = [...path, { id: sub.id, name: sub.name }];

    const foundFile = sub.content.find((file) => file.id === contentId);
    if (foundFile) {
      return [...newPath, { id: foundFile.id, name: foundFile.aiTitle }];
    }

    const deeper = findInSubfolders(sub.subfolders, contentId, newPath);
    if (deeper) return deeper;
  }

  return null;
};

export const isSameRoot = (
  allFolders: IFolder[],
  targetFolderId: string | undefined | null,
  sourceFolderRootId: string | undefined
): boolean => {
  if (!targetFolderId || !sourceFolderRootId) return false;

  const targetRoot = findFolderPath(allFolders, targetFolderId)?.[0]?.id;
  return targetRoot === sourceFolderRootId;
};

export const getNumberOfContent = (folder: IFolder) => {
  let contentCount = folder.content ? folder.content.length : 0;
  if (folder.subfolders) {
    folder.subfolders.forEach((subfolder) => {
      contentCount += getNumberOfContent(subfolder);
    });
  }
  return contentCount;
};

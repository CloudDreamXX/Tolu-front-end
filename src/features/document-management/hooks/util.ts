import { IFolder } from "entities/folder";

export type PathEntry = { id: string; name: string };

export const findFilePath = (
  folders: IFolder[],
  contentId: string,
  path: PathEntry[] = []
): PathEntry[] | null => {
  for (const folder of folders) {
    const newPath = [...path, { id: folder.id, name: folder.name }];

    const foundFile = folder.content.find((file) => file.id === contentId);
    if (foundFile) {
      return [...newPath, { id: foundFile.id, name: foundFile.title }];
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
      return [...newPath, { id: foundFile.id, name: foundFile.title }];
    }

    const deeper = findInSubfolders(sub.subfolders, contentId, newPath);
    if (deeper) return deeper;
  }

  return null;
};

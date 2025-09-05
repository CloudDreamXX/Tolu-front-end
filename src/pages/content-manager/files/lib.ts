import { FileLibraryFolder } from "entities/files-library";

type FetchAllLike = {
  root_folders?: FileLibraryFolder[];
};

export function findViewingFolderInFiles(
  viewingFolderId: string,
  files: FetchAllLike | null | undefined
): FileLibraryFolder | null {
  if (!viewingFolderId || !files) return null;

  const stack: FileLibraryFolder[] = [];

  if (Array.isArray(files.root_folders)) {
    stack.push(...files.root_folders);
  }

  const visited = new Set<string>();

  while (stack.length) {
    const node = stack.pop()!;
    if (visited.has(node.id)) continue;
    visited.add(node.id);

    if (node.id === viewingFolderId) {
      return node;
    }

    if (Array.isArray(node.subfolders) && node.subfolders.length) {
      stack.push(...node.subfolders);
    }
  }

  return null;
}

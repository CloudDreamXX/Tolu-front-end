import { IFolder, ISubfolder } from "entities/folder";

export const findPath = (
  id: string,
  nodes: IFolder[],
  trail: IFolder[] = []
): IFolder[] | null => {
  for (const n of nodes) {
    const nextTrail = [...trail, n];
    if (n.id === id) return nextTrail;
    if (n.subfolders?.length) {
      const res = findPath(id, n.subfolders as unknown as IFolder[], nextTrail);
      if (res) return res;
    }
  }
  return null;
};

export const primeSelection = (
  id: string,
  all: IFolder[],
  opts: {
    setSelectedFolder: (v: string) => void;
    setParentFolderId: (v: string) => void;
    setSelectedFolderName: (v: string) => void;
    setSubfolders: (v: ISubfolder[]) => void;
    setSubfolderPopup: (v: boolean) => void;
    setExistingFiles?: (v: string[]) => void;
    setExistingInstruction?: (v: string) => void;
    setPopoverOpen?: (v: boolean) => void;
    setFolderId?: (v: string) => void;
  }
) => {
  const path = findPath(id, all);
  if (!path) return;
  const node = path[path.length - 1];
  const parent = path.length > 1 ? path[path.length - 2] : node;

  opts.setSelectedFolder(node.id);
  opts.setParentFolderId(parent.id);
  opts.setSelectedFolderName(parent.name);
  opts.setSubfolders(parent.subfolders ?? []);
  opts.setSubfolderPopup(true);

  opts.setFolderId?.(node.id);

  opts.setExistingFiles?.(node.fileNames?.map((f) => f.filename) ?? []);
  console.log("node", node.customInstructions ?? "");
  opts.setExistingInstruction?.(node.customInstructions ?? "");
  opts.setPopoverOpen?.(false);
};

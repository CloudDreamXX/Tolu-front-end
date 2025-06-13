export interface TableRow {
  id: string;
  parentId?: string;
  title: string;
  createdAt: string;
  reviewers: string | null;
  filesCount: number;
  price: string;
  status: string;
  type: "folder" | "subfolder" | "video" | "voice" | "content";
  subfolders?: TableRow[];
  content?: TableRow[];
}

export interface Reviewers {
  id: string;
  name: string;
  avatar: string;
}

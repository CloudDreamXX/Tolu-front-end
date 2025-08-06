import { API_ROUTES, ApiService } from "shared/api";
import {
  IFolder,
  IContentItem,
  ISubfolder,
  IFileNames,
  IFolderItemResponse,
  ISubfolderResponse,
  IContentItemResponse,
  IFileNamesResponse,
  NewFolder,
  IFolderMap,
  ContentToMove,
  FolderToDelete,
} from "./model";

export class FoldersService {
  private static serializeFileNames(
    fileNames: IFileNamesResponse[]
  ): IFileNames[] {
    return fileNames?.map((file) => ({
      path: file.path,
      filename: file.filename,
      contentType: file.content_type,
    }));
  }

  private static serializeContentItem(
    item: IContentItemResponse
  ): IContentItem {
    return {
      id: item.id,
      title: item.title,
      chatId: item.chat_id,
      creatorId: item.creator_id,
      createdAt: item.created_at,
      reviewerName: item.reviewer_name,
      price: item.price,
      status: item.status,
      messages: item.messages,
    };
  }

  private static serializeSubfolder(subfolder: ISubfolderResponse): ISubfolder {
    return {
      id: subfolder.id,
      name: subfolder.name,
      fileCount: subfolder.file_count,
      fileNames: this.serializeFileNames(subfolder?.file_names ?? []),
      customInstructions: subfolder.custom_instructions,
      creatorId: subfolder.creator_id,
      createdAt: subfolder.created_at,
      reviewerName: this.normalizeReviewerName(subfolder.reviewer_name),
      price: this.normalizePrice(subfolder.price),
      status: subfolder.status,
      totalContentItems: subfolder.total_content_items,
      pagination: subfolder.pagination,
      subfolders: (Array.isArray(subfolder?.subfolders)
        ? subfolder?.subfolders
        : []
      )?.map((sub) => this.serializeSubfolder(sub)),
      content: (subfolder?.content ?? [])?.map((content) =>
        this.serializeContentItem(content)
      ),
    };
  }

  private static serializeFolder(folder: IFolderItemResponse): IFolder {
    return {
      id: folder.id ?? folder.folder_id,
      name: folder.name,
      fileCount: folder.file_count,
      fileNames: this.serializeFileNames(folder?.file_names ?? []),
      customInstructions: folder.custom_instructions,
      creatorId: folder.creator_id,
      createdAt: folder.created_at,
      reviewerName: this.normalizeReviewerName(folder.reviewer_name),
      price: this.normalizePrice(folder.price),
      status: folder.status,
      totalContentItems: folder.total_content_items,
      subfolders: (folder?.subfolders ?? [])?.map((sub) =>
        this.serializeSubfolder(sub)
      ),
      content: (folder.content ?? [])?.map((content) =>
        this.serializeContentItem(content)
      ),
      isSystemFolder: false,
      parentFolderId: folder.parent_folder_id,
      description: folder.description,
      isRootFolder: true,
      isSubfolder: false,
      isEmpty: folder.total_content_items === 0,
      pagination: folder.pagination,
    };
  }

  private static normalizeReviewerName(
    reviewerName: string | null
  ): string | null {
    if (!reviewerName || reviewerName === "None" || reviewerName === "[]") {
      return null;
    }
    return reviewerName;
  }

  private static normalizePrice(price: string | null): string | null {
    if (!price || price === "None") {
      return null;
    }
    return price;
  }

  static async createFolder(payload: NewFolder): Promise<any> {
    return ApiService.post<any>(API_ROUTES.FOLDERS.CREATE, payload);
  }

  static async getFolders(
    page?: number,
    page_size?: number,
    folder_id?: string
  ): Promise<{
    folders: IFolder[];
    foldersMap: IFolderMap;
  }> {
    try {
      const params: Record<string, any> = {};

      if (page) {
        params.page = page;
      }
      if (page_size) {
        params.page_size = page_size;
      }

      if (folder_id) {
        params.folder_id = folder_id;
      }

      const response = await ApiService.get<any>(API_ROUTES.FOLDERS.STRUCTURE, {
        params,
      });

      const foldersData = response.data ?? response;
      const allFolders: IFolder[] = [];

      const categories = [
        "ai_generated",
        "in_review",
        "approved",
        "published",
        "archived",
      ];

      categories.forEach((category) => {
        if (foldersData[category] && Array.isArray(foldersData[category])) {
          const serializedFolders = foldersData[category]?.map(
            (folder: IFolderItemResponse) => {
              return this.serializeFolder(folder);
            }
          );
          allFolders.push(...serializedFolders);
        }
      });

      return {
        folders: allFolders,
        foldersMap: allFolders.reduce((map: IFolderMap, folder) => {
          if (!map[folder.id]) {
            map[folder.id] = [];
          }
          map[folder.id].push(folder);
          return map;
        }, {}),
      };
    } catch (error) {
      console.error("Error in getFolders:", error);
      throw error;
    }
  }

  static async getFoldersByStatus(): Promise<{
    aiGenerated: IFolder[];
    inReview: IFolder[];
    approved: IFolder[];
    published: IFolder[];
    archived: IFolder[];
  }> {
    try {
      const response = await ApiService.get<any>(API_ROUTES.FOLDERS.STRUCTURE);

      const foldersData = response.data ?? response;

      return {
        aiGenerated: (foldersData.ai_generated ?? [])?.map(
          this.serializeFolder
        ),
        inReview: (foldersData.in_review ?? [])?.map(this.serializeFolder),
        approved: (foldersData.approved ?? [])?.map(this.serializeFolder),
        published: (foldersData.published ?? [])?.map(this.serializeFolder),
        archived: (foldersData.archived ?? [])?.map(this.serializeFolder),
      };
    } catch (error) {
      console.error("Error in getFoldersByStatus:", error);
      throw error;
    }
  }

  static async getFolder(id: string): Promise<IFolder> {
    const endpoint = API_ROUTES.FOLDERS.GET_FOLDER.replace("{id}", id);
    const response = await ApiService.get<{
      folder: IFolderItemResponse;
    }>(endpoint);
    if (!response) {
      throw new Error("Folder not found");
    }

    return FoldersService.serializeFolder(response.folder);
  }

  static async moveFolderContent(payload: ContentToMove): Promise<any> {
    return ApiService.post<any>(API_ROUTES.FOLDERS.MOVE_CONTENT, payload);
  }

  static async deleteContent(
    contentId: string
  ): Promise<{ success: boolean; message: string }> {
    return ApiService.delete<{ success: boolean; message: string }>(
      API_ROUTES.FOLDERS.DELETE_CONTENT,
      { content_id: contentId }
    );
  }

  static async deleteFolder(
    data: FolderToDelete
  ): Promise<{ success: boolean; message: string }> {
    return ApiService.delete<{ success: boolean; message: string }>(
      API_ROUTES.FOLDERS.DELETE_FOLDER,
      data
    );
  }
}

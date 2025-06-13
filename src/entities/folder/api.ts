import { API_ROUTES, ApiService } from "shared/api";
import {
  FolderResponse,
  IFolder,
  IFolderMap,
  IFolderResponse,
  NewFolder,
} from "./model";

export class FoldersService {
  private static serializeContentItem(item: any) {
    return {
      id: item.id,
      title: item.title,
      chatId: item.chat_id,
      creatorId: item.creator_id,
      createdAt: item.created_at,
      reviewerName:
        item.reviewer_name && item.reviewer_name !== "None"
          ? item.reviewer_name
          : null,
      price: item.price && item.price !== "None" ? item.price : null,
      status: item.status ?? null,
    };
  }

  private static serializeSubfolder(subfolder: any): any {
    return {
      id: subfolder.id,
      name: subfolder.name,
      fileCount: subfolder.file_count,
      fileNames:
        subfolder.file_names?.map((file: any) => ({
          path: file.path,
          filename: file.filename,
          contentType: file.content_type,
        })) ?? [],
      customInstructions: subfolder.custom_instructions,
      creatorId: subfolder.creator_id,
      createdAt: subfolder.created_at,
      reviewerName:
        subfolder.reviewer_name &&
        subfolder.reviewer_name !== "None" &&
        subfolder.reviewer_name !== "[]"
          ? subfolder.reviewer_name
          : null,
      price:
        subfolder.price && subfolder.price !== "None" ? subfolder.price : null,
      status: subfolder.status ?? null,
      totalContentItems: subfolder.total_content_items,
      subfolders:
        subfolder.subfolders?.map(FoldersService.serializeSubfolder) ?? [],
      content:
        subfolder.content?.map(FoldersService.serializeContentItem) ?? [],
    };
  }

  private static serializeFolder(folder: any): IFolder {
    return {
      id: folder.id,
      name: folder.name,
      fileCount: folder.file_count,
      fileNames:
        folder.file_names?.map((file: any) => ({
          path: file.path,
          filename: file.filename,
          contentType: file.content_type,
        })) ?? [],
      customInstructions: folder.custom_instructions,
      creatorId: folder.creator_id,
      createdAt: folder.created_at,
      reviewerName:
        folder.reviewer_name && folder.reviewer_name !== "None"
          ? folder.reviewer_name
          : null,
      price: folder.price && folder.price !== "None" ? folder.price : null,
      status: folder.status ?? null,
      totalContentItems: folder.total_content_items,
      subfolders:
        folder.subfolders?.map(FoldersService.serializeSubfolder) ?? [],
      content: folder.content?.map(FoldersService.serializeContentItem) ?? [],
      isSystemFolder: folder.is_system_folder ?? false,
      parentFolderId: folder.parent_folder_id ?? null,
      parentFolderName: folder.parent_folder_name ?? null,
      description: folder.description ?? null,
      isRootFolder: folder.is_root_folder ?? false,
      isSubfolder: folder.is_subfolder ?? false,
      isEmpty: folder.is_empty ?? false,
    };
  }

  static async createFolder(
    payload: NewFolder,
    token: string | null
  ): Promise<any> {
    return ApiService.post<any>(API_ROUTES.FOLDERS.CREATE, payload, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "Content-Type": "application/json",
      },
    });
  }

  static async getFolders(token: string | null): Promise<{
    folders: IFolder[];
    foldersMap: IFolderMap;
  }> {
    const foldersData = await ApiService.get<IFolderResponse>(
      API_ROUTES.FOLDERS.STRUCTURE,
      {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          "Content-Type": "application/json",
        },
      }
    );

    const allFolders: IFolder[] = [];

    if (foldersData.ai_generated && Array.isArray(foldersData.ai_generated)) {
      allFolders.push(
        ...foldersData.ai_generated.map(FoldersService.serializeFolder)
      );
    }

    if (foldersData.in_review && Array.isArray(foldersData.in_review)) {
      allFolders.push(
        ...foldersData.in_review.map(FoldersService.serializeFolder)
      );
    }

    if (foldersData.approved && Array.isArray(foldersData.approved)) {
      allFolders.push(
        ...foldersData.approved.map(FoldersService.serializeFolder)
      );
    }

    if (foldersData.published && Array.isArray(foldersData.published)) {
      allFolders.push(
        ...foldersData.published.map(FoldersService.serializeFolder)
      );
    }

    if (foldersData.archived && Array.isArray(foldersData.archived)) {
      allFolders.push(
        ...foldersData.archived.map(FoldersService.serializeFolder)
      );
    }

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
  }

  static async getFolder(
    token: string | null,
    id: string
  ): Promise<FolderResponse> {
    const endpoint = API_ROUTES.FOLDERS.GET_FOLDER.replace("{id}", id);
    const response = await ApiService.get<any>(endpoint, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        Accept: "application/json",
      },
    });

    return {
      success: response.success,
      message: response.message,
      folder: {
        folder_id: response.folder.folder_id,
        name: response.folder.name,
        is_system_folder: response.folder.is_system_folder,
        content:
          response.folder.content?.map((item: any) => ({
            id: item.id,
            title: item.title,
            status: item.status,
            created_at: item.created_at,
            updated_at: item.updated_at,
          })) ?? [],
        subfolders: response.folder.subfolders ?? [],
        created_at: response.folder.created_at,
      },
    };
  }
}

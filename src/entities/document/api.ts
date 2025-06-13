import { API_ROUTES, ApiService } from "shared/api";
import { IDocument, IDocumentResponse } from "./model";

export class DocumentsService {
  private static serealizeDocument(response: IDocumentResponse): IDocument {
    return {
      ...response,
      createdAt: response.created_at,
      originalFolderId: response.original_folder_id,
      originalFolderName: response.original_folder_name,
      originalInstructions: response.original_instructions ?? null,
      originalFiles: response.original_files,
      sharedWith: {
        totalShares: response.shared_with.total_shares,
        clients: response.shared_with.clients,
      },
      revenueGenerated: response.revenue_generated,
      readCount: response.read_count,
      savedCount: response.saved_count,
      feedbackCount: response.feedback_count,
      comments: response.comments,
      socialMediaShares: response.social_media_shares,
    };
  }

  static async getDocumentById(id: string): Promise<IDocument | null> {
    const response = await ApiService.post<IDocumentResponse>(
      API_ROUTES.DOCUMENTS.DETAILS
    );
    return DocumentsService.serealizeDocument(response) ?? null;
  }
}

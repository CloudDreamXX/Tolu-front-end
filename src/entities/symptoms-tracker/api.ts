import { API_ROUTES, ApiService } from "shared/api";
import { AiSuggestions, SymptomData } from "./model";

export class SymptomsTrackerService {
  static async addSymptoms(
    data: SymptomData,
    photo: File | null,
    voice: File | null
  ): Promise<any> {
    const formData = new FormData();

    formData.append("symptom_data", JSON.stringify(data));

    if (photo) {
      formData.append("photo", photo);
    }

    if (voice) {
      formData.append("voice_note", voice);
    }

    return ApiService.post<any>(
      API_ROUTES.SYMPTOMS_TRACKER.POST_SYMPTOMS,
      formData
    );
  }

  static async getSymptomByDate(date: string): Promise<any> {
    const endpoint = API_ROUTES.SYMPTOMS_TRACKER.POST_SYMPTOMS.replace(
      "{target_date}",
      date
    );
    return ApiService.get<any>(endpoint);
  }

  static async getAiSuggestions(): Promise<AiSuggestions> {
    return ApiService.get<AiSuggestions>(
      API_ROUTES.SYMPTOMS_TRACKER.GET_SUGGESTIONS
    );
  }

  static async deleteSymptom(id: string): Promise<any> {
    const endpoint = API_ROUTES.SYMPTOMS_TRACKER.DELETE_SYMPTOM.replace(
      "{symptom_id}",
      id
    );
    return ApiService.get<any>(endpoint);
  }
}

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SymptomData, SymptomResponse, AiSuggestions } from "./model";
import { API_ROUTES } from "shared/api";
import { RootState } from "entities/store";

export const symptomsTrackerApi = createApi({
  reducerPath: "symptomsTrackerApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user?.token;

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    addSymptoms: builder.mutation<
      any,
      { data: SymptomData; photo: File | null; voice: File | null }
    >({
      query: ({ data, photo, voice }) => {
        const formData = new FormData();
        formData.append("symptom_data", JSON.stringify(data));
        if (photo) formData.append("photo", photo);
        if (voice) formData.append("audio_note", voice);

        return {
          url: API_ROUTES.SYMPTOMS_TRACKER.POST_SYMPTOMS,
          method: "POST",
          body: formData,
        };
      },
    }),
    editSymptoms: builder.mutation<
      any,
      {
        recordId: string;
        data: SymptomData;
        photo: File | null;
        voice: File | null;
      }
    >({
      query: ({ recordId, data, photo, voice }) => {
        const formData = new FormData();
        formData.append("symptom_data", JSON.stringify(data));
        if (photo) formData.append("photo", photo);
        if (voice) formData.append("audio_note", voice);

        return {
          url: API_ROUTES.SYMPTOMS_TRACKER.PUT_SYMPTOMS.replace(
            "{record_id}",
            recordId
          ),
          method: "PUT",
          body: formData,
        };
      },
    }),
    getSymptomByDate: builder.query<SymptomResponse, string>({
      query: (date) =>
        API_ROUTES.SYMPTOMS_TRACKER.GET_SYMPTOMS.replace("{target_date}", date),
    }),
    getAiSuggestions: builder.query<AiSuggestions, void>({
      query: () => API_ROUTES.SYMPTOMS_TRACKER.GET_SUGGESTIONS,
    }),
    deleteSymptom: builder.mutation<any, string>({
      query: (id) => ({
        url: API_ROUTES.SYMPTOMS_TRACKER.DELETE_SYMPTOM.replace(
          "{symptom_id}",
          id
        ),
        method: "DELETE",
      }),
    }),
    getSymptomsByDateForCoach: builder.query<
      SymptomResponse,
      { clientId: string; targetDate: string }
    >({
      query: ({ clientId, targetDate }) =>
        API_ROUTES.SYMPTOMS_TRACKER.GET_SYMPTOMS_COACH
          .replace("{client_id}", clientId)
          .replace("{target_date}", targetDate),
    }),
  }),
});

export const {
  useAddSymptomsMutation,
  useEditSymptomsMutation,
  useGetSymptomByDateQuery,
  useGetAiSuggestionsQuery,
  useDeleteSymptomMutation,
  useGetSymptomsByDateForCoachQuery,
} = symptomsTrackerApi;
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { SymptomData, AiSuggestions } from "./model";
import { API_ROUTES } from "shared/api";
import { RootState } from "entities/store";
import { BaseResponse } from "entities/models";

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
      {
        data: {
          date: string;
          mood_score: number;
          notes?: string | null;
          meal_details?: any;
          symptoms?: any;
          triggers?: any;
          medications?: any;
          supplements?: any;
          sleep_quality?: string | null;
          energy_level?: string | null;
          stress_level?: string | null;
        };
        voice?: File | null;
        photo?: File | null;
      }
    >({
      query: ({ data, voice, photo }) => {
        const formData = new FormData();

        formData.append("date", data.date);
        formData.append("mood_score", String(data.mood_score));

        if (data.notes) formData.append("notes", data.notes);
        if (data.meal_details)
          formData.append("meal_details", JSON.stringify(data.meal_details));

        if (Array.isArray(data.symptoms)) {
          formData.append("symptoms", JSON.stringify(data.symptoms));
        } else if (data.symptoms) {
          try {
            const arr = JSON.parse(data.symptoms);
            formData.append("symptoms", JSON.stringify(arr));
          } catch {
            formData.append("symptoms", JSON.stringify([data.symptoms]));
          }
        }
        if (Array.isArray(data.triggers)) {
          formData.append("triggers", JSON.stringify(data.triggers));
        } else if (data.triggers) {
          try {
            const arr = JSON.parse(data.triggers);
            formData.append("triggers", JSON.stringify(arr));
          } catch {
            formData.append("triggers", JSON.stringify([data.triggers]));
          }
        }
        if (data.medications)
          formData.append("medications", JSON.stringify(data.medications));
        if (data.supplements)
          formData.append("supplements", JSON.stringify(data.supplements));
        if (data.sleep_quality)
          formData.append("sleep_quality", data.sleep_quality);
        if (data.energy_level)
          formData.append("energy_level", data.energy_level);
        if (data.stress_level)
          formData.append("stress_level", data.stress_level);

        if (voice) formData.append("voice_note", voice);
        if (photo) formData.append("photo", photo);

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
    getSymptomByDate: builder.query<BaseResponse<SymptomData[]>, string>({
      query: (date) =>
        API_ROUTES.SYMPTOMS_TRACKER.GET_SYMPTOMS.replace("{target_date}", date),
    }),
    getAiSuggestions: builder.query<BaseResponse<AiSuggestions>, void>({
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
      SymptomData[],
      { clientId: string; targetDate: string }
    >({
      query: ({ clientId, targetDate }) =>
        API_ROUTES.SYMPTOMS_TRACKER.GET_SYMPTOMS_COACH.replace(
          "{client_id}",
          clientId
        ).replace("{target_date}", targetDate),
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

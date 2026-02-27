import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "shared/api";
import {
  HealthHistory,
  HealthHistoryResponse,
  GetLabReportRequest,
  CreateMedicationParams,
  GetMedicationsParams,
  Medication,
  UpdateMedicationParams,
  Supplement,
  GetSupplementsParams,
  CreateSupplementParams,
  UpdateSupplementParams,
} from "./model";
import { RootState } from "entities/store";
import { BaseResponse } from "entities/models";

export const healthHistoryApi = createApi({
  reducerPath: "healthHistoryApi",
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
    getUserHealthHistory: builder.query<HealthHistory, void>({
      query: () => API_ROUTES.HEALTH_HISTORY.GET,
      transformResponse: (response: BaseResponse<HealthHistory>) =>
        response.data ? response.data : ({} as HealthHistory),
    }),

    getCoachClientHealthHistory: builder.query<HealthHistory, string>({
      query: (clientId) =>
        API_ROUTES.HEALTH_HISTORY.GET_COACH_CLIENT.replace(
          "{client_id}",
          clientId
        ),
      transformResponse: (response: BaseResponse<HealthHistoryResponse>) =>
        response.data.health_history
          ? response.data.health_history
          : ({} as HealthHistory),
    }),

    createHealthHistory: builder.mutation<
      any,
      {
        healthData: HealthHistory;
        labFiles?: File[];
        clientId?: string | null;
      }
    >({
      query: ({ healthData, labFiles, clientId }) => {
        const formData = new FormData();
        // Append each healthData field as a separate form entry (all as strings)
        Object.entries(healthData).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            // If value is an object or array, stringify it
            if (typeof value === "object") {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });
        // Attach lab files if present
        if (labFiles && labFiles.length > 0) {
          labFiles.forEach((file) => {
            formData.append("lab_file", file);
          });
        }
        // Build URL with client_id as query param if present
        const url = clientId
          ? `${API_ROUTES.HEALTH_HISTORY.POST}?client_id=${encodeURIComponent(clientId)}`
          : API_ROUTES.HEALTH_HISTORY.POST;
        return {
          url,
          method: "POST",
          body: formData,
        };
      },
    }),

    getLabReport: builder.query<Blob, GetLabReportRequest>({
      query: ({ filename, client_id }) => ({
        url: `/health-history/lab-report/${filename}`,
        params: { client_id },
        responseHandler: (res) => res.blob(),
      }),
    }),

    updateCoachClientHealthHistory: builder.mutation<
      BaseResponse<{
        message: string;
        health_history_id: string;
        user_id: string;
        updated_at: string;
        lab_files_count: number;
      }>,
      {
        clientId: string;
        data: HealthHistory;
        labFiles?: File[];
      }
    >({
      query: ({ clientId, data, labFiles }) => {
        const formData = new FormData();
        // Append each data field as a separate form entry (all as strings)
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (typeof value === "object") {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });
        // Attach lab files if present
        if (labFiles && labFiles.length > 0) {
          labFiles.forEach((file) => {
            formData.append("lab_file", file);
          });
        }
        return {
          url: API_ROUTES.HEALTH_HISTORY.EDIT.replace("{client_id}", clientId),
          method: "PUT",
          body: formData,
        };
      },
    }),

    getMedicationsByChat: builder.query<Medication[], GetMedicationsParams>({
      query: ({ chatId, limit = 100, offset = 0 }) => ({
        url: API_ROUTES.HEALTH_HISTORY.GET_MEDICATIONS.replace(
          "{chat_id}",
          chatId
        ),
        params: { limit, offset },
      }),
      transformResponse: (
        response: BaseResponse<{ medications: Medication[] }>
      ) => response.data.medications,
    }),

    createMedication: builder.mutation<
      BaseResponse<Medication>,
      CreateMedicationParams
    >({
      query: ({ medicationData, file }) => {
        const formData = new FormData();

        if (medicationData.chat_id) {
          formData.append("chat_id", medicationData.chat_id);
        }
        if (medicationData.target_user_id) {
          formData.append("target_user_id", medicationData.target_user_id);
        }
        if (medicationData.title) {
          formData.append("title", medicationData.title);
        }
        formData.append("content", medicationData.content);

        if (file) {
          formData.append("file", file);
        }

        return {
          url: API_ROUTES.HEALTH_HISTORY.ADD_MEDICATION,
          method: "POST",
          body: formData,
        };
      },
    }),

    updateMedication: builder.mutation<
      BaseResponse<Medication>,
      UpdateMedicationParams
    >({
      query: ({ medicationId, medicationData, file }) => {
        const formData = new FormData();

        if (medicationData.title !== undefined) {
          formData.append("title", medicationData.title);
        }
        if (medicationData.content !== undefined) {
          formData.append("content", medicationData.content);
        }
        formData.append(
          "remove_file",
          String(medicationData.remove_file ?? false)
        );

        if (file) {
          formData.append("file", file);
        }

        return {
          url: API_ROUTES.HEALTH_HISTORY.UPDATE_MEDICATION.replace(
            "{medication_id}",
            medicationId
          ),
          method: "PUT",
          body: formData,
        };
      },
    }),

    deleteMedication: builder.mutation<
      { message: string },
      { medicationId: string }
    >({
      query: ({ medicationId }) => ({
        url: API_ROUTES.HEALTH_HISTORY.DELETE_MEDICATION.replace(
          "{medication_id}",
          medicationId
        ),
        method: "DELETE",
      }),
    }),

    serveMedicationFile: builder.query<Blob, { fileUuid: string }>({
      query: ({ fileUuid }) => ({
        url: API_ROUTES.HEALTH_HISTORY.SERVE_MEDICATION_FILE.replace(
          "{file_uuid}",
          fileUuid
        ),
        responseHandler: (response) => response.blob(),
      }),
    }),

    getSupplementsByChat: builder.query<Supplement[], GetSupplementsParams>({
      query: ({ chatId, limit = 100, offset = 0 }) => ({
        url: API_ROUTES.HEALTH_HISTORY.GET_SUPPLEMENTS.replace(
          "{chat_id}",
          chatId
        ),
        params: { limit, offset },
      }),
      transformResponse: (
        response: BaseResponse<{ supplements: Supplement[] }>
      ) => response.data.supplements,
    }),

    createSupplement: builder.mutation<
      BaseResponse<Supplement>,
      CreateSupplementParams
    >({
      query: ({ supplementData, file }) => {
        const formData = new FormData();

        if (supplementData.chat_id) {
          formData.append("chat_id", supplementData.chat_id);
        }
        if (supplementData.target_user_id) {
          formData.append("target_user_id", supplementData.target_user_id);
        }
        if (supplementData.title) {
          formData.append("title", supplementData.title);
        }
        formData.append("content", supplementData.content);

        if (file) {
          formData.append("file", file);
        }

        return {
          url: API_ROUTES.HEALTH_HISTORY.ADD_SUPPLEMENT,
          method: "POST",
          body: formData,
        };
      },
    }),

    updateSupplement: builder.mutation<
      BaseResponse<Supplement>,
      UpdateSupplementParams
    >({
      query: ({ supplementId, supplementData, file }) => {
        const formData = new FormData();

        if (supplementData.title !== undefined) {
          formData.append("title", supplementData.title);
        }
        if (supplementData.content !== undefined) {
          formData.append("content", supplementData.content);
        }
        formData.append(
          "remove_file",
          String(supplementData.remove_file ?? false)
        );

        if (file) {
          formData.append("file", file);
        }
        return {
          url: API_ROUTES.HEALTH_HISTORY.UPDATE_SUPPLEMENT.replace(
            "{supplement_id}",
            supplementId
          ),
          method: "PUT",
          body: formData,
        };
      },
    }),

    deleteSupplement: builder.mutation<
      { message: string },
      { supplementId: string }
    >({
      query: ({ supplementId }) => ({
        url: API_ROUTES.HEALTH_HISTORY.DELETE_SUPPLEMENT.replace(
          "{supplement_id}",
          supplementId
        ),
        method: "DELETE",
      }),
    }),

    serveSupplementFile: builder.query<Blob, { fileUuid: string }>({
      query: ({ fileUuid }) => ({
        url: API_ROUTES.HEALTH_HISTORY.SERVE_SUPPLEMENT_FILE.replace(
          "{file_uuid}",
          fileUuid
        ),
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetUserHealthHistoryQuery,
  useGetCoachClientHealthHistoryQuery,
  useCreateHealthHistoryMutation,
  useGetLabReportQuery,
  useUpdateCoachClientHealthHistoryMutation,
  useGetMedicationsByChatQuery,
  useCreateMedicationMutation,
  useUpdateMedicationMutation,
  useDeleteMedicationMutation,
  useServeMedicationFileQuery,
  useLazyServeMedicationFileQuery,
  useGetSupplementsByChatQuery,
  useCreateSupplementMutation,
  useUpdateSupplementMutation,
  useDeleteSupplementMutation,
  useServeSupplementFileQuery,
  useLazyServeSupplementFileQuery,
} = healthHistoryApi;

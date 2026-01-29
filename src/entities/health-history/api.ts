import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "shared/api";
import {
  HealthHistory,
  HealthHistoryPostData,
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
      transformResponse: (response: BaseResponse<HealthHistoryResponse>) =>
        response.data.health_history,
    }),

    getCoachClientHealthHistory: builder.query<HealthHistory, string>({
      query: (clientId) =>
        API_ROUTES.HEALTH_HISTORY.GET_COACH_CLIENT.replace(
          "{client_id}",
          clientId
        ),
      transformResponse: (response: BaseResponse<HealthHistoryResponse>) =>
        response.data.health_history,
    }),

    createHealthHistory: builder.mutation<
      any,
      {
        healthData: HealthHistoryPostData;
        labFiles?: File[];
        clientId?: string | null;
      }
    >({
      query: ({ healthData, labFiles, clientId }) => {
        const formData = new FormData();

        formData.append("health_data", JSON.stringify(healthData));

        if (labFiles && labFiles.length > 0) {
          labFiles.forEach((file) => {
            formData.append("lab_file", file);
          });
        }

        if (clientId !== undefined) {
          formData.append("client_id", clientId ?? "");
        }

        return {
          url: API_ROUTES.HEALTH_HISTORY.POST,
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
        data: Partial<HealthHistoryPostData>;
        labFiles?: File[];
      }
    >({
      query: ({ clientId, data, labFiles }) => {
        const formData = new FormData();

        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

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
      transformResponse: (response: BaseResponse<{ medications: Medication[] }>) =>
        response.data.medications,
    }),

    createMedication: builder.mutation<BaseResponse<Medication>, CreateMedicationParams>({
      query: ({ medicationData, file }) => {
        const formData = new FormData();

        formData.append("medication_data", JSON.stringify(medicationData));

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

    updateMedication: builder.mutation<BaseResponse<Medication>, UpdateMedicationParams>({
      query: ({ medicationId, medicationData, file }) => {
        const formData = new FormData();

        formData.append(
          "medication_data",
          JSON.stringify({
            remove_file: false,
            ...medicationData,
          })
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
      transformResponse: (response: BaseResponse<{ supplements: Supplement[] }>) =>
        response.data.supplements,
    }),

    createSupplement: builder.mutation<BaseResponse<Supplement>, CreateSupplementParams>({
      query: ({ supplementData, file }) => {
        const formData = new FormData();

        formData.append("supplement_data", JSON.stringify(supplementData));

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

    updateSupplement: builder.mutation<BaseResponse<Supplement>, UpdateSupplementParams>({
      query: ({ supplementId, supplementData, file }) => {
        const formData = new FormData();

        formData.append(
          "supplement_data",
          JSON.stringify({
            remove_file: false,
            ...supplementData,
          })
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

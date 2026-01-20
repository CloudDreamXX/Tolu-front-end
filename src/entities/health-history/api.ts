import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "shared/api";
import {
  HealthHistory,
  HealthHistoryPostData,
  HealthHistoryResponse,
  GetLabReportRequest,
} from "./model";
import { RootState } from "entities/store";

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
      transformResponse: (response: HealthHistoryResponse) =>
        response.health_history,
    }),

    getCoachClientHealthHistory: builder.query<HealthHistory, string>({
      query: (clientId) =>
        API_ROUTES.HEALTH_HISTORY.GET_COACH_CLIENT.replace(
          "{client_id}",
          clientId
        ),
      transformResponse: (response: HealthHistoryResponse) =>
        response.health_history,
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
      {
        message: string;
        health_history_id: string;
        user_id: string;
        updated_at: string;
        lab_files_count: number;
      },
      {
        clientId: string;
        data: Partial<HealthHistoryPostData>;
        labFiles?: File[];
      }
    >({
      query: ({ clientId, data, labFiles }) => {
        const formData = new FormData();

        // Append all provided health history fields individually
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        // Append lab files (matches: lab_file: List[UploadFile])
        if (labFiles && labFiles.length > 0) {
          labFiles.forEach((file) => {
            formData.append("lab_file", file);
          });
        }

        return {
          url: API_ROUTES.HEALTH_HISTORY.EDIT.replace(
            "{client_id}",
            clientId
          ),
          method: "PUT",
          body: formData,
        };
      },
    }),

  }),
});

export const {
  useGetUserHealthHistoryQuery,
  useGetCoachClientHealthHistoryQuery,
  useCreateHealthHistoryMutation,
  useGetLabReportQuery,
  useUpdateCoachClientHealthHistoryMutation,
} = healthHistoryApi;

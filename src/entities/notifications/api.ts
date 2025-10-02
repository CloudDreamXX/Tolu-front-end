import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "shared/api";
import { NotificationPreferences, Notifications, Notification } from "./model";
import { RootState } from "entities/store";

export const notificationsApi = createApi({
  reducerPath: "notificationsApi",
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
    getNotifications: builder.query<
      Notification[],
      {
        page: number;
        limit: number;
        unread_only: boolean;
        type_filter: string | null;
      }
    >({
      query: ({
        page = 1,
        limit = 20,
        unread_only = false,
        type_filter = null,
      }) => ({
        url: API_ROUTES.NOTIFICATIONS.GET_NOTIFICATIONS,
        params: { page, limit, unread_only, type_filter },
      }),
    }),

    getUnreadCount: builder.query<any, void>({
      query: () => API_ROUTES.NOTIFICATIONS.GET_UNREAD,
    }),

    markNotificationAsRead: builder.mutation<any, Notifications>({
      query: (data) => ({
        url: API_ROUTES.NOTIFICATIONS.MARK_AS_READ,
        method: "POST",
        body: data,
      }),
    }),

    dismissNotifications: builder.mutation<any, string>({
      query: (notificationId) => ({
        url: API_ROUTES.NOTIFICATIONS.DISMISS_NOTIFICATION.replace(
          "{notification_id}",
          notificationId
        ),
        method: "POST",
      }),
    }),

    getNotificationPreferences: builder.query<any, void>({
      query: () => API_ROUTES.NOTIFICATIONS.GET_NOTIFICATION_PREFERENCES,
    }),

    updateNotificationPreferences: builder.mutation<
      any,
      NotificationPreferences
    >({
      query: (data) => ({
        url: API_ROUTES.NOTIFICATIONS.UPDATE_NOTIFICATION_PREFERENCES,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
  useDismissNotificationsMutation,
  useGetNotificationPreferencesQuery,
  useUpdateNotificationPreferencesMutation,
} = notificationsApi;

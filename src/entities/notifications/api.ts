import { API_ROUTES, ApiService } from "shared/api";
import { NotificationPreferences, Notifications, Notification } from "./model";

export class NotificationsService {
  static async getNotifications(
    page: number = 1,
    limit: number = 20,
    unread_only: boolean = false,
    type_filter: string | null = null
  ): Promise<Notification[]> {
    const params = {
      page,
      limit,
      unread_only,
      type_filter,
    };
    return ApiService.get<Notification[]>(
      API_ROUTES.NOTIFICATIONS.GET_NOTIFICATIONS,
      {
        params,
      }
    );
  }

  static async getUnreadCount(): Promise<any> {
    return ApiService.get<any>(API_ROUTES.NOTIFICATIONS.GET_UNREAD);
  }

  static async markNotificationAsRead(data: Notifications): Promise<any> {
    return ApiService.post<any>(API_ROUTES.NOTIFICATIONS.MARK_AS_READ, data);
  }

  static async dismissNotifications(notificationId: string): Promise<any> {
    const endpoint = API_ROUTES.NOTIFICATIONS.DISMISS_NOTIFICATION.replace(
      "{notification_id}",
      notificationId
    );
    return ApiService.post<any>(endpoint);
  }

  static async getNotificationPreferences(): Promise<any> {
    return ApiService.get<any>(
      API_ROUTES.NOTIFICATIONS.GET_NOTIFICATION_PREFERENCES
    );
  }

  static async updateNotificationPreferences(
    data: NotificationPreferences
  ): Promise<any> {
    return ApiService.put<any>(
      API_ROUTES.NOTIFICATIONS.UPDATE_NOTIFICATION_PREFERENCES,
      data
    );
  }
}

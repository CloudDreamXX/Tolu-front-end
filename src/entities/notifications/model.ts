export interface Notifications {
  notification_ids: string[];
}

export interface NotificationPreferences {
  notifications_enabled: boolean;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "content_share" | "other";
  priority: "normal" | "high";
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
  read_at: string | null;
  expires_at: string | null;
  notification_metadata: any | null;
}

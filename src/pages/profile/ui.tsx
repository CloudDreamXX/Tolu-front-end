import { RootState } from "entities/store";
import { ChangePasswordRequest, UserService } from "entities/user";
import { Bell, Plus, RefreshCcw, RotateCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SignOutIcon from "shared/assets/icons/signout";
import { cn, toast } from "shared/lib";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "shared/ui";
import { Card } from "./components/Card";
import { Switch } from "./components/Switch";
import { Field } from "./components/Field";
import { Notification, NotificationsService } from "entities/notifications";
import { ChatSocketService } from "entities/chat";
import { ClientEditProfileModal } from "widgets/client-edit-profile-modal";
import { useFilePicker } from "widgets/message-tabs/ui/messages-tab/useFilePicker";
import { ChangePasswordModal } from "widgets/change-password-modal";
import { Client, ClientService } from "entities/client";
import { ClientProfileData } from "widgets/client-edit-profile-modal/types";

export const ClientProfile = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [emailNotif, setEmailNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const { open, getInputProps } = useFilePicker({
    accept: ["image/*"],
    maxFiles: 1,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const [user, setUser] = useState<Client | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await ClientService.getClientProfile();
      setUser(res);
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (message.notification.type === "content_share") {
        toast({
          title: "New Content Shared",
          description: message.notification.message,
        });

        fetchNotifications();
      }
    };

    ChatSocketService.on("notification", (message: any) =>
      handleNewMessage(message)
    );

    return () => {
      ChatSocketService.off("notification", (message: any) =>
        handleNewMessage(message)
      );
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await NotificationsService.getNotifications();
      setNotifications(response);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await NotificationsService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error("Failed to fetch unread notifications count", error);
    }
  };

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
    if (!isPopupOpen) {
      fetchNotifications();
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await NotificationsService.markNotificationAsRead({
        notification_ids: [notificationId],
      });
      fetchNotifications();
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const dismissNotification = async (notificationId: string) => {
    try {
      await NotificationsService.dismissNotifications(notificationId);
      fetchNotifications();
    } catch (error) {
      console.error("Failed to dismiss notification", error);
    }
  };

  const fetchNotificationPreferences = async () => {
    try {
      await NotificationsService.getNotificationPreferences();
    } catch (error) {
      console.error("Failed to fetch notification preferences", error);
    }
  };

  // const updateNotificationPreferences = async () => {
  //   try {
  //     await NotificationsService.updateNotificationPreferences({
  //       notifications_enabled: true,
  //     });
  //   } catch (error) {
  //     console.error("Failed to update notification preferences", error);
  //   }
  // };

  useEffect(() => {
    fetchUnreadCount();
    fetchNotificationPreferences();
  }, []);

  const handleSignOut = async () => {
    try {
      await UserService.signOut(token);
      toast({
        title: "Sign out successful",
      });
      localStorage.clear();
      window.location.href = "/auth";
    } catch (error) {
      console.error("Sign out failed:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "Sign out failed. Please try again",
      });
    }
  };

  const handleChangePassword = async (oldPass: string, newPass: string) => {
    try {
      const data: ChangePasswordRequest = {
        old_password: oldPass,
        new_password: newPass,
      };
      await UserService.changePassword(data);
      toast({
        title: "Updated successfully",
      });
    } catch (err) {
      console.error("Failed to change password", err);
      toast({
        variant: "destructive",
        title: "Failed to change password",
        description: "Failed to change password. Please try again.",
      });
    }
  };

  const handleEditProfile = async (data: ClientProfileData) => {
    try {
      await ClientService.updateUserProfile(data);
    } catch (err) {
      console.error("Failed to update information", err);
      toast({
        variant: "destructive",
        title: "Failed to update information",
        description: "Failed to update information. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 md:gap-6 ">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-[4.5px] text-[#1D1D1F] text-[24px] md:text-[32px] font-bold">
          Personal profile
        </div>
        <button onClick={togglePopup}>
          <Bell />
          {unreadCount > 0 && (
            <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full top-1 right-4">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {isPopupOpen && (
        <div className="absolute p-4 overflow-y-auto bg-white shadow-md top-16 right-4 rounded-xl w-96 max-h-96">
          <div className="flex justify-between mb-2">
            <h4 className="text-lg font-semibold">Notifications</h4>
            <button onClick={togglePopup} className="text-gray-600">
              Close
            </button>
          </div>
          <div className="space-y-3">
            {notifications?.length ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex flex-col justify-between gap-[16px] p-3 border-b border-gray-200 rounded-md"
                >
                  <div className="flex flex-col">
                    <p className="text-sm font-medium text-gray-800">
                      {notification.message}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="text-xs text-white bg-[#1C63DB] p-[8px] rounded-[8px]"
                    >
                      Mark as read
                    </button>
                    <button
                      onClick={() => dismissNotification(notification.id)}
                      className="text-xs text-black bg-[#D5DAE2] p-[8px] rounded-[8px]"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No new notifications</p>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-end gap-4 p-4 bg-white md:justify-between rounded-2xl md:p-6">
        <div className="flex items-center gap-6 ">
          <div className="relative">
            <img
              className="w-[100px] h-[100px] rounded-full object-cover"
              src="/profile.png"
              alt="Frances Swann"
            />
            <input className="hidden" {...getInputProps()} />

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="brightblue"
                  className="absolute bottom-0 right-0 inline-flex items-center justify-center
                   w-8 h-8 rounded-full bg-[#1C63DB] text-white
                   hover:opacity-90 focus:outline-none"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="bottom"
                align="start"
                sideOffset={8}
                className="
        z-50 min-w-[180px] rounded-xl border border-[#E6ECF7]
        bg-[#F3F7FD] p-2 shadow-lg
      "
                onCloseAutoFocus={(e) => e.preventDefault()}
              >
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    open();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer focus:bg-white focus:text-inherit"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-white border rounded-lg">
                    <RefreshCcw className="w-4 h-4" />
                  </span>
                  Change photo
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer focus:bg-white focus:text-inherit"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-white border rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </span>
                  Delete photo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <p className="mb-1 text-2xl font-semibold">{user?.name || ""}</p>
            <p className="px-2 bg-blue-100 py-1.5 text-blue-600 font-semibold rounded-full inline-block text-nowrap">
              Member since {user?.created_at || ""}
            </p>
          </div>
        </div>

        <Button
          variant={"blue2"}
          className="px-8 text-base font-semibold text-blue-700"
          onClick={() => handleSignOut()}
        >
          <SignOutIcon className="text-blue-700" />
          Log out
        </Button>
      </div>

      <div className="flex flex-col gap-[16px] md:gap-[24px] lg:grid lg:grid-cols-2 lg:gap-[24px] lg:gap-y-[24px]">
        <div className="order-1 lg:order-none lg:col-start-1 lg:row-start-1">
          <Card
            title="Account Info"
            action={
              <Button
                variant={"blue2"}
                className="px-8 text-base font-semibold text-blue-700"
                onClick={() => setEditModalOpen(true)}
              >
                Edit
              </Button>
            }
          >
            <div className="grid grid-cols-2 gap-x-[16px] gap-y-[16px] md:gap-x-[24px] md:gap-y-[24px]">
              <Field label="Name" value={user?.name || ""} />
              <Field label="Phone number" value="+1 (310) 555-7493" />

              <Field label="Date of birth" value="10/10/1990" />
              <Field label="Gender" value={user?.gender || ""} />

              <Field label="Email:" value={user?.email || ""} />
              <Field label="Time zone:" value={user?.timezone || ""} />
            </div>

            <div className="flex justify-end border-t border-[#EAECF0] mt-6 pt-6">
              <Button
                variant="link"
                className="text-[#1C63DB]"
                onClick={() => setChangePasswordModalOpen(true)}
              >
                Change password
              </Button>
            </div>
          </Card>
        </div>

        <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-3">
          <Card
            title="Daily Journal Overview"
            action={
              <Button
                variant={"blue2"}
                className="px-8 text-base font-semibold text-blue-700"
              >
                <RotateCcw className="text-blue-700 " /> Update
              </Button>
            }
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-1 border-b border-[#D5DAE2] pb-6">
                <p className="text-sm text-[#5F5F65]">Date of last check: </p>
                <p className="text-lg font-semibold text-[#1D1D1F]">
                  May 14, 2025 4:00 pm
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-[#5F5F65]">
                  Most Noticeable Symptom Today
                </p>

                <div className="flex items-center gap-[8px] flex-wrap">
                  {[
                    "Fatigue",
                    "Brain fog",
                    "Hot flashes",
                    "Headache",
                    "Insomnia",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-[#5F5F65]">Duration</p>

                <div className="flex items-center gap-[8px]">
                  {["1–3 hours"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-[#5F5F65]">Suspected Triggers</p>

                <div className="flex items-center gap-[8px]">
                  {["Skipping breakfast", "Poor sleep", "Gluten"].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-[#5F5F65]">
                  Sleep Quality (Auto-sync from Apple Watch)
                </p>

                <div className="flex items-center gap-[8px]">
                  {[
                    "Total sleep: 7h 40min",
                    "Woke up: 3 times",
                    "Fell back sleep: easy",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-[#5F5F65]">Meals & Timing</p>

                <div className="flex items-center gap-[8px]">
                  {["Ate within 1 hour of waking", "Tried new food"].map(
                    (item) => (
                      <div
                        key={item}
                        className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
                      >
                        {item}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="brightblue">See full Daily Journal</Button>
              </div>
            </div>
          </Card>
        </div>

        <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-2">
          <Card title="Preferences">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2.5">
                <Switch checked={emailNotif} onChange={setEmailNotif} />
                <span
                  className={cn(emailNotif ? "text-blue-600" : "text-gray-600")}
                >
                  Email notifications
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <Switch checked={pushNotif} onChange={setPushNotif} />
                <span
                  className={cn(pushNotif ? "text-blue-600" : "text-gray-600")}
                >
                  Push notifications
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ClientEditProfileModal
        initial={{
          name: user?.name || "",
          email: user?.email || "",
          phone: user?.phone || "",
          dob: user?.dob || "",
          timezone: user?.timezone || "",
          gender: user?.gender || "",
        }}
        onSave={handleEditProfile}
        open={editModalOpen}
        setOpen={setEditModalOpen}
      />
      <ChangePasswordModal
        open={changePasswordModalOpen}
        onOpenChange={setChangePasswordModalOpen}
        onSubmit={handleChangePassword}
        mode="change" //we have mode for 'create' and 'change'
      />
    </div>
  );
};

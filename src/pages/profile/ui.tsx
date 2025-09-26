import { ChatSocketService } from "entities/chat";
import { Client, ClientService } from "entities/client";
import { Notification, NotificationsService } from "entities/notifications";
import { RootState } from "entities/store";
import { ChangePasswordRequest, UserService } from "entities/user";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, phoneMask, toast } from "shared/lib";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "shared/ui";
import { ChangePasswordModal } from "widgets/change-password-modal";
import { ClientEditProfileModal } from "widgets/client-edit-profile-modal";
import { ClientProfileData } from "widgets/client-edit-profile-modal/types";
import { useFilePicker } from "shared/hooks/useFilePicker";
import { Card } from "./components/Card";
import { Field } from "./components/Field";
import { Switch } from "./components/Switch";
import { useNavigate } from "react-router-dom";
import { OnboardingInfo } from "./components/OnboardingInfo";
import { setFromUserInfo } from "entities/store/clientOnboardingSlice";
import { DailyJournalOverview } from "./components/DailyJournalOverview/ui";

export const ClientProfile = () => {
  const token = useSelector((state: RootState) => state.user.token);
  // const [emailNotif, setEmailNotif] = useState(false);
  // const [pushNotif, setPushNotif] = useState(true);
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const nav = useNavigate();
  const tabs = [
    { id: "journal", label: "Daily Journal" },
    { id: "intake", label: "Intake form" },
  ] as const;

  const [tab, setTab] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    const loadUser = async () => {
      const userInfo = await UserService.getOnboardClient();
      dispatch(setFromUserInfo(userInfo));
    };
    loadUser();
  }, []);

  useEffect(() => {
    let objectUrl: string | null = null;

    (async () => {
      const u = await ClientService.getClientProfile();
      setUser(u);

      const filename = u.photo_url?.split("/").pop() || "";
      if (!filename) return;

      const blob = await UserService.downloadProfilePhoto(filename);
      objectUrl = URL.createObjectURL(blob);
      setPhotoUrl(objectUrl);
    })();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (
        message.notification.type === "content_share" ||
        message.notification.type === "message"
      ) {
        toast({
          title: message.notification.title,
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

  const onPickPhoto = async (file: File) => {
    if (!user) return;
    try {
      setPreviewUrl(URL.createObjectURL(file));

      const payload: ClientProfileData = {
        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        dob: user.dob ?? "",
        timezone: user.timezone ?? "",
        gender: user.gender ?? "",
      };

      await ClientService.updateUserProfile(payload, file);
      toast({ title: "Photo updated" });

      const res = await ClientService.getClientProfile();
      setUser(res);
    } catch (err) {
      console.error("Failed to update photo", err);
      toast({
        variant: "destructive",
        title: "Failed to update photo",
        description: "Please try again.",
      });
      setPreviewUrl(null);
    }
  };

  const handleEditProfile = async (data: ClientProfileData, photo?: File) => {
    try {
      await ClientService.updateUserProfile(data, photo);
      const res = await ClientService.getClientProfile();
      setUser(res);
      toast({
        title: "All changes have been saved.",
      });
    } catch (err) {
      console.error("Failed to update information", err);
      toast({
        variant: "destructive",
        title: "Failed to update information",
        description: "Failed to update information. Please try again.",
      });
    }
  };

  const initials = user?.name
    ? user.name.split(" ").length > 1
      ? user.name
          .split(" ")
          .map((word) => word[0].toUpperCase())
          .slice(0, 2)
          .join("")
      : user.name.slice(0, 2).toUpperCase()
    : "UN";

  const ClientProfileLoadingSkeleton = () => {
    const getRandomWidth = (min: number, max: number) =>
      `${Math.floor(Math.random() * (max - min + 1)) + min}px`;

    return (
      <div className="flex flex-col gap-6 p-4 md:p-6 md:gap-6">
        <div className="flex gap-3 items-center justify-between animate-pulse">
          <div
            className="h-[24px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
            style={{ width: getRandomWidth(200, 400) }}
          />
        </div>

        <div className="hidden md:flex flex-wrap items-center md:justify-end gap-4 p-4 bg-white md:justify-between rounded-2xl md:p-6 ">
          <div className="flex items-center gap-6 animate-pulse">
            <div className="w-[100px] h-[100px] bg-gray-300 rounded-full"></div>
            <div>
              <p className="mb-1">
                <div
                  className="h-[18px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                  style={{ width: getRandomWidth(100, 190) }}
                />
              </p>
            </div>
          </div>

          <div className="w-[153px] h-[40px] bg-gray-300 rounded-full animate-pulse"></div>
        </div>

        <div className="flex flex-col gap-[16px] md:gap-[24px] lg:grid lg:grid-cols-2 lg:gap-[24px] lg:gap-y-[24px]">
          <div className="order-1 lg:order-none lg:col-start-1 lg:row-start-1">
            <div className="bg-white rounded-[16px] p-[16px] md:p-[24px] border border-[#EAECF0]">
              <div className="flex justify-between items-center mb-[24px] animate-pulse">
                <div className="h-[20px] md:h-[24px] h:text-[28px] bg-gray-300 rounded-[24px] w-[164px] md:max-w-full" />
                <div className="h-[20px] md:h-[24px] h:text-[28px] bg-gray-300 rounded-[24px] w-[93px] md:max-w-full" />
              </div>
              <div className="md:hidden flex items-center gap-6 mb-[24px]">
                <div className="flex items-center gap-6 ">
                  <div className="w-[100px] h-[100px] bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="mb-1">
                      <div
                        className="h-[18px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                        style={{ width: getRandomWidth(100, 190) }}
                      />
                    </p>
                  </div>
                </div>
                <div className="w-[153px] h-[40px] bg-gray-300 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[16px] gap-y-[16px] md:gap-x-[24px] md:gap-y-[24px] animate-pulse">
                <div className="flex flex-col gap-[4px]">
                  <div
                    className="h-[18px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                    style={{ width: getRandomWidth(100, 190) }}
                  />
                  <div
                    className="h-[20px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                    style={{ width: getRandomWidth(100, 190) }}
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <div
                    className="h-[18px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                    style={{ width: getRandomWidth(100, 190) }}
                  />
                  <div
                    className="h-[20px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                    style={{ width: getRandomWidth(100, 190) }}
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <div
                    className="h-[18px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                    style={{ width: getRandomWidth(100, 190) }}
                  />
                  <div
                    className="h-[20px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                    style={{ width: getRandomWidth(100, 190) }}
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <div
                    className="h-[18px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                    style={{ width: getRandomWidth(100, 190) }}
                  />
                  <div
                    className="h-[20px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                    style={{ width: getRandomWidth(100, 190) }}
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <div
                    className="h-[18px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                    style={{ width: getRandomWidth(100, 190) }}
                  />
                  <div
                    className="h-[20px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                    style={{ width: getRandomWidth(100, 190) }}
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <div
                    className="h-[18px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                    style={{ width: getRandomWidth(100, 190) }}
                  />
                  <div
                    className="h-[20px] bg-gray-300 rounded-[24px] max-w-[300px] md:max-w-full"
                    style={{ width: getRandomWidth(100, 190) }}
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-[#EAECF0] mt-6 pt-6 animate-pulse">
                <div className="w-[153px] h-[40px] bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-3">
            <div className="bg-white rounded-[16px] p-[16px] md:p-[24px] border border-[#EAECF0]">
              <div className="flex flex-col gap-6 animate-pulse">
                <div className="flex justify-between">
                  <div className="flex flex-col gap-1 border-b border-[#D5DAE2] pb-6">
                    <div
                      className="h-[18px] bg-gray-300 rounded-[24px] max-w-[200px]"
                      style={{ width: getRandomWidth(100, 180) }}
                    />
                    <div
                      className="h-[24px] bg-gray-300 rounded-[24px] max-w-[150px]"
                      style={{ width: getRandomWidth(100, 200) }}
                    />
                  </div>
                  <div className="hidden md:flex w-[120px] h-[40px] bg-gray-300 rounded-full" />
                </div>

                <div className="flex flex-col gap-2">
                  <div
                    className="h-[18px] bg-gray-300 rounded-[24px] max-w-[200px]"
                    style={{ width: getRandomWidth(100, 180) }}
                  />
                  <div className="flex items-center gap-[8px] flex-wrap">
                    {["", "", "", "", ""].map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div
                    className="h-[18px] bg-gray-300 rounded-[24px] max-w-[200px]"
                    style={{ width: getRandomWidth(100, 180) }}
                  />
                  <div className="flex items-center gap-[8px]">
                    {[""].map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div
                    className="h-[18px] bg-gray-300 rounded-[24px] max-w-[200px]"
                    style={{ width: getRandomWidth(100, 180) }}
                  />
                  <div className="flex items-center gap-[8px]">
                    {[""].map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div
                    className="h-[18px] bg-gray-300 rounded-[24px] max-w-[200px]"
                    style={{ width: getRandomWidth(100, 180) }}
                  />
                  <div className="flex items-center gap-[8px]">
                    {[""].map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div
                    className="h-[18px] bg-gray-300 rounded-[24px] max-w-[200px]"
                    style={{ width: getRandomWidth(100, 180) }}
                  />
                  <div className="flex items-center gap-[8px]">
                    {[""].map((_, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex justify-between md:justify-end">
                  <div className="md:hidden w-[120px] h-[40px] bg-gray-300 rounded-full" />
                  <div className="w-[170px] h-[40px] bg-gray-300 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-2">
            <div className="bg-white rounded-[16px] p-[16px] md:p-[24px] border border-[#EAECF0]">
              <div className="h-[20px] md:h-[24px] h:text-[28px] bg-gray-300 rounded-[24px] w-[164px] md:max-w-full mb-[24px] animate-pulse" />
              <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-[28px] bg-gray-300 rounded-[24px] w-[200px]" />

                <div className="h-[28px] bg-gray-300 rounded-[24px] w-[200px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!user) {
    return (
      <>
        <div className="flex gap-[12px] px-[20px] py-[10px] bg-white text-[#1B2559] text-[16px] border border-[#1C63DB] rounded-[10px] w-fit absolute z-50 top-[56px] left-[50%] translate-x-[-50%] xl:translate-x-[-25%]">
          <span className="inline-flex h-5 w-5 items-center justify-center">
            <MaterialIcon
              iconName="progress_activity"
              className="text-blue-600 animate-spin"
            />
          </span>
          Please wait, we are loading the information...
        </div>
        <ClientProfileLoadingSkeleton />
      </>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6 md:gap-6 ">
      <div className="flex gap-3 items-center justify-between">
        <div className="flex items-center gap-[24px] text-[#1D1D1F] text-[24px] md:text-[32px] font-bold">
          Personal profile
        </div>
        <button onClick={togglePopup}>
          <MaterialIcon iconName="notifications" fill={1} />
          {unreadCount > 0 && (
            <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full top-1 right-4">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {isPopupOpen && (
        <div className="absolute p-4 overflow-y-auto bg-white shadow-md top-16 right-4 rounded-xl w-96 max-h-96 z-[999]">
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

      <div className="hidden md:flex flex-wrap items-center md:justify-end gap-4 p-4 bg-white md:justify-between rounded-2xl md:p-6">
        <div className="flex items-center gap-6 ">
          <div className="relative w-[100px] h-[100px]">
            <Avatar className="object-cover w-full h-full rounded-full">
              <AvatarImage src={previewUrl || photoUrl || undefined} />
              <AvatarFallback className="text-3xl bg-slate-300 ">
                {initials}
              </AvatarFallback>
            </Avatar>
            <input
              className="hidden"
              {...getInputProps()}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onPickPhoto(f);
              }}
            />

            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="brightblue"
                  className="absolute bottom-0 right-0 inline-flex items-center justify-center
                   w-8 h-8 rounded-full bg-[#1C63DB] text-white
                   hover:opacity-90 focus:outline-none"
                >
                  <MaterialIcon iconName="add" />
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
                    <MaterialIcon iconName="cached" />
                  </span>
                  Change photo
                </DropdownMenuItem>

                {/* <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer focus:bg-white focus:text-inherit"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-white border rounded-lg">
                    <MaterialIcon iconName="delete" />
                  </span>
                  Delete photo
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <p className="mb-1 text-[18px] md:text-2xl font-semibold">
              {user?.name || ""}
            </p>
            {user?.created_at && (
              <p className="px-2 bg-blue-100 py-1.5 text-[14px] text-blue-600 font-semibold rounded-full inline-block text-nowrap">
                Member since {formatDate(user.created_at)}
              </p>
            )}
          </div>
        </div>

        <Button
          variant={"blue2"}
          className="px-8 text-base font-semibold text-blue-700"
          onClick={() => handleSignOut()}
        >
          <MaterialIcon iconName="exit_to_app" />
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
            <div className="md:hidden flex items-center gap-6 mb-[24px]">
              <div className="relative w-[100px] h-[100px]">
                <Avatar className="object-cover w-full h-full rounded-full">
                  <AvatarImage src={previewUrl || photoUrl || undefined} />
                  <AvatarFallback className="text-3xl bg-slate-300 ">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <input
                  className="hidden"
                  {...getInputProps()}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onPickPhoto(f);
                  }}
                />

                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="brightblue"
                      className="absolute bottom-0 right-0 inline-flex items-center justify-center
                   w-8 h-8 rounded-full bg-[#1C63DB] text-white
                   hover:opacity-90 focus:outline-none"
                    >
                      <MaterialIcon iconName="add" />
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
                        <MaterialIcon iconName="cached" />
                      </span>
                      Change photo
                    </DropdownMenuItem>

                    {/* <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                  }}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg cursor-pointer focus:bg-white focus:text-inherit"
                >
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-white border rounded-lg">
                    <MaterialIcon iconName="delete" />
                  </span>
                  Delete photo
                </DropdownMenuItem> */}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div>
                <p className="mb-1 text-[18px] md:text-2xl font-semibold">
                  {user?.name || ""}
                </p>
                {user?.created_at && (
                  <p className="px-2 bg-blue-100 py-1.5 text-[14px] text-blue-600 font-semibold rounded-full inline-block text-nowrap">
                    Member since {formatDate(user.created_at)}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[16px] gap-y-[16px] md:gap-x-[24px] md:gap-y-[24px]">
              <Field label="Name" value={user?.name || ""} />
              <Field
                label="Phone number"
                value={phoneMask(user?.phone || "")}
              />

              <Field label="Date of birth" value={user?.dob || ""} />
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
            title={tabs[tab].label}
            action={
              <div className="flex items-center max-w-full gap-4 p-2 overflow-x-auto bg-white border rounded-full no-scrollbar">
                {tabs.map((s, i) => (
                  <button
                    key={s.id}
                    className={cn(
                      "py-2.5 px-4 font-bold text-sm text-nowrap",
                      s.id === tabs[tab].id
                        ? "bg-[#F2F4F6] border rounded-full"
                        : undefined
                    )}
                    onClick={() => setTab(i)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            }
          >
            {tabs[tab].id === "journal" ? (
              <DailyJournalOverview />
            ) : (
              <OnboardingInfo embedded />
            )}
          </Card>
        </div>

        <div className="order-2 lg:order-none lg:col-start-1 lg:row-start-2">
          <Card title="Preferences">
            <div className="flex flex-col gap-4 opacity-[0.5]">
              <div className="flex items-center gap-2.5 pointer-events-none">
                <Switch
                  checked={true}
                  onChange={() => {}}
                  // onChange={() => setEmailNotif(!emailNotif)}
                />
                <span className={"text-blue-600"}>Email notifications</span>
              </div>

              <div className="flex items-center gap-2.5 pointer-events-none">
                <Switch
                  checked={true}
                  onChange={() => {}}
                  // onChange={() => setPushNotif(!pushNotif)}
                />
                <span className={"text-blue-600"}>Push notifications</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      <Button
        variant={"blue2"}
        className="md:hidden w-fit ml-auto px-8 text-base font-semibold text-blue-700"
        onClick={() => handleSignOut()}
      >
        <MaterialIcon iconName="exit_to_app" />
        Log out
      </Button>

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
        onForgot={() => nav("/forgot-password")}
        mode="change" //we have mode for 'create' and 'change'
      />
    </div>
  );
};

import { ChatSocketService } from "entities/chat";
import { useLazyDownloadLicenseFileQuery } from "entities/coach";
import { ChangePasswordRequest } from "entities/user";
import React, { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, phoneMask, toast } from "shared/lib";
import {
  checkPasswordStrength,
  StrengthMeter,
} from "shared/lib/utils/passwordChecker";
import { Avatar, AvatarFallback, AvatarImage, Button, Input } from "shared/ui";
import { CouchEditProfileModal } from "widgets/couch-edit-profile-modal";
import {
  useGetOnboardingUserQuery,
  useChangePasswordMutation,
  useLazyDownloadProfilePhotoQuery,
} from "entities/user";
import {
  useDismissNotificationsMutation,
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkNotificationAsReadMutation,
} from "entities/notifications";

export const ContentManagerProfile = () => {
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [licensePhotos, setLicensePhotos] = useState<string[]>([]);
  const result = useMemo(
    () => checkPasswordStrength(newPassword),
    [newPassword]
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [downloadLicenseFile] = useLazyDownloadLicenseFileQuery();
  const [downloadProfilePhoto] = useLazyDownloadProfilePhotoQuery();
  const [changePassword] = useChangePasswordMutation();
  const { data: user } = useGetOnboardingUserQuery();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const { data: notifications, refetch: refetchNotifications } =
    useGetNotificationsQuery({
      page: 1,
      limit: 20,
      unread_only: false,
      type_filter: null,
    });
  const { data: unreadCount } = useGetUnreadCountQuery();
  const [markNotificationAsRead] = useMarkNotificationAsReadMutation();
  const [dismissNotification] = useDismissNotificationsMutation();

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      if (
        message.notification.type === "invitation_requested" ||
        message.notification.type === "client_joined" ||
        message.notification.type === "message"
      ) {
        toast({
          title: message.notification.title,
          description: message.notification.message,
        });
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

  const handleNotificationAction = async (
    notificationId: string,
    action: "read" | "dismiss"
  ) => {
    try {
      if (action === "read") {
        await markNotificationAsRead({ notification_ids: [notificationId] });
      } else {
        await dismissNotification(notificationId);
      }
    } catch (error) {
      console.error("Failed to update notification", error);
    }
  };

  const togglePopup = () => {
    setIsPopupOpen((prev) => !prev);
    if (!isPopupOpen) {
      refetchNotifications();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  useEffect(() => {
    if (!user) return;
    const revokeUrls: string[] = [];

    const createUrlFromPath = async (
      path?: string | null
    ): Promise<string | null> => {
      if (!path) return null;

      if (/^(https?:|data:|blob:)/i.test(path)) {
        return path;
      }

      const filename = path.split("/").pop() || path;
      try {
        const blob = await downloadLicenseFile(filename).unwrap();
        const url = URL.createObjectURL(blob);
        revokeUrls.push(url);
        return url;
      } catch (e) {
        console.error("Failed to download file:", filename, e);
        return null;
      }
    };

    (async () => {
      try {
        const headshotFilename = user.profile?.basic_info?.headshot
          ? user.profile.basic_info.headshot.split("/").pop()
          : null;

        if (headshotFilename) {
          const blob = await downloadProfilePhoto(headshotFilename).unwrap();
          const headshot = URL.createObjectURL(blob);
          revokeUrls.push(headshot);
          setPhotoUrl(headshot);
        }

        const licensePaths: string[] =
          user.onboarding?.practitioner_info?.license_files ?? [];
        const urls = await Promise.all(
          licensePaths.map((p) => createUrlFromPath(p))
        );
        setLicensePhotos(urls.filter((x): x is string => Boolean(x)));
      } finally {
        setLoading(false);
      }
    })();

    return () => revokeUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [user, downloadLicenseFile, downloadProfilePhoto]);

  const handleChangePassword = async (oldPass: string, newPass: string) => {
    try {
      const body: ChangePasswordRequest = {
        old_password: oldPass,
        new_password: newPass,
      };
      await changePassword(body).unwrap();
      toast({ title: "Password updated successfully" });
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      console.error("Failed to change password", err);
      toast({
        variant: "destructive",
        title: "Password change failed",
        description: "Please try again.",
      });
    }
  };

  const initials = (() => {
    const info = user?.profile?.basic_info;
    if (!info) return "UN";

    if (info.first_name && info.last_name) {
      return (
        `${info.first_name?.[0] ?? ""}${info.last_name?.[0] ?? ""}`.toUpperCase() ||
        "UN"
      );
    }

    if (info.first_name) {
      return (info.first_name.slice(0, 2) || "UN").toUpperCase();
    }

    if (info.name) {
      const parts = info.name.trim().split(" ").filter(Boolean);
      if (parts.length > 1) {
        return (
          parts
            .map((p) => p[0]?.toUpperCase() ?? "")
            .slice(0, 2)
            .join("") || "UN"
        );
      }
      return (parts[0]?.slice(0, 2) || "UN").toUpperCase();
    }

    return "UN";
  })();

  const ProfileLoadingSkeleton = () => {
    const getRandomWidth = (min: number, max: number) =>
      `${Math.floor(Math.random() * (max - min + 1)) + min}px`;

    return (
      <div className="p-[16px] md:p-[24px] xl:py-[32px] xl:px-[24px] flex flex-col gap-[24px] md:gap-[32px] overflow-y-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between animate-pulse">
          {/* Text and Title Block */}
          <div className="flex flex-col md:flex-row items-start gap-[16px]">
            <div className="flex flex-col gap-3 text-[24px] w-full lg:w-fit">
              <div
                className="h-[24px] skeleton-gradient rounded-[24px] w-[150px]"
                style={{ width: getRandomWidth(100, 200) }}
              />
              <div
                className="h-[20px] skeleton-gradient rounded-[24px] w-[200px]"
                style={{ width: getRandomWidth(200, 300) }}
              />
            </div>

            {/* Edit Button (mobile) */}
            <div className="lg:hidden flex flex-col w-full lg:w-fit">
              <div
                className="h-[44px] skeleton-gradient rounded-full w-full"
                style={{ width: getRandomWidth(250, 350) }}
              />
            </div>
          </div>

          {/* Edit Button (desktop) */}
          <div className="hidden lg:flex w-full md:w-[166px] justify-center">
            <div
              className="h-[44px] skeleton-gradient rounded-full w-full"
              style={{ width: getRandomWidth(150, 200) }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] md:gap-[24px] animate-pulse">
          {/* Avatar and Personal Information Block */}
          <div className="flex flex-col gap-10 md:flex-row rounded-[16px] bg-white p-[24px] lg:h-[324px]">
            <div className="w-[200px] h-[185px] md:w-[200px] md:h-[185px] rounded-[12px] bg-gray-300"></div>

            <div className="flex flex-col gap-2.5">
              <div
                className="h-[24px] skeleton-gradient rounded-[24px] w-[100px]"
                style={{ width: getRandomWidth(100, 200) }}
              />
              <div
                className="h-[16px] skeleton-gradient rounded-[24px] w-[200px]"
                style={{ width: getRandomWidth(200, 300) }}
              />
              <div
                className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                style={{ width: getRandomWidth(200, 500) }}
              />
            </div>
          </div>

          {/* Practitioner Type Block */}
          <div className="flex flex-col gap-[14px] justify-between w-full rounded-[16px] bg-white p-[16px] md:p-[24px]">
            <div className="flex flex-col gap-[4px]">
              <div
                className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                style={{ width: getRandomWidth(200, 500) }}
              />
              <div
                className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                style={{ width: getRandomWidth(200, 500) }}
              />
            </div>
            <div className="flex flex-col gap-[4px]">
              <div
                className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                style={{ width: getRandomWidth(200, 500) }}
              />
              <div
                className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                style={{ width: getRandomWidth(200, 500) }}
              />
            </div>
            <div className="flex flex-col gap-[4px]">
              <div
                className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                style={{ width: getRandomWidth(200, 500) }}
              />
              <div
                className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                style={{ width: getRandomWidth(200, 500) }}
              />
            </div>
            <div className="flex flex-col gap-[4px]">
              <div
                className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                style={{ width: getRandomWidth(200, 500) }}
              />
              <div
                className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                style={{ width: getRandomWidth(200, 500) }}
              />
            </div>
          </div>

          {/* Professional Background Block */}
          <div className="flex flex-col gap-[24px] rounded-[16px] bg-white p-[16px] md:p-[24px]">
            <div
              className="h-[20px] skeleton-gradient rounded-[24px] mb-4 md:mb-6 max-w-[300px] md:max-w-full"
              style={{ width: getRandomWidth(200, 500) }}
            />
            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-col gap-2">
                <div
                  className="h-[18px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                  style={{ width: getRandomWidth(200, 500) }}
                />
                <div
                  className="h-[18px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                  style={{ width: getRandomWidth(200, 500) }}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div
                  className="h-[18px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                  style={{ width: getRandomWidth(200, 500) }}
                />
                <div className="w-[155px] h-[155px] rounded-[12px] bg-gray-300"></div>
              </div>
            </div>
          </div>

          {/* Contact Information & Account Security Block */}
          <div className="flex flex-col gap-[14px] w-full rounded-[16px] bg-white p-[16px] md:p-[24px]">
            <div
              className="h-[20px] skeleton-gradient rounded-[24px] mb-4 md:mb-6 max-w-[300px] md:max-w-full"
              style={{ width: getRandomWidth(200, 500) }}
            />
            <div className="flex flex-col gap-[14px] w-full">
              <div
                className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                style={{ width: getRandomWidth(200, 400) }}
              />
              <div
                className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                style={{ width: getRandomWidth(200, 400) }}
              />
              <div
                className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                style={{ width: getRandomWidth(200, 400) }}
              />
              <div className="flex flex-col gap-[10px]">
                <div
                  className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                  style={{ width: getRandomWidth(200, 400) }}
                />
                <div className="relative flex flex-row-reverse items-center w-full lg:w-[70%]">
                  <div className="w-full h-[44px] skeleton-gradient rounded-[8px]" />
                </div>
              </div>
              <div className="flex flex-col gap-[10px]">
                <div
                  className="h-[16px] skeleton-gradient rounded-[24px] max-w-[300px] md:max-w-full"
                  style={{ width: getRandomWidth(200, 400) }}
                />
                <div className="relative flex flex-row-reverse items-center w-full lg:w-[70%]">
                  <div className="w-full h-[44px] skeleton-gradient rounded-[8px]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
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
        <ProfileLoadingSkeleton />
      </>
    );
  }

  return (
    <>
      <div className="p-[16px] md:p-[24px] xl:py-[32px] xl:px-[24px] flex flex-col gap-[24px] md:gap-[32px] overflow-y-auto">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col md:flex-row items-start gap-[16px]">
            <div className="flex flex-col gap-3 text-[24px] w-full lg:w-fit">
              <p className="text-[#1C63DB] font-bold">
                Your Professional Profile
              </p>
              <p className="text-xl font-medium">
                Your next client starts with your profile. Make a splash!
              </p>
            </div>
            <Button
              variant={"brightblue"}
              className="flex lg:hidden w-full md:w-[300px] justify-center"
              onClick={() => setEditModalOpen(true)}
            >
              <MaterialIcon iconName="edit_square" size={20} /> Edit
            </Button>
          </div>
          <div className="flex gap-[24px] items-center">
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              className="flex items-center justify-center"
              onClick={togglePopup}
            >
              <MaterialIcon iconName="notifications" fill={1} />
              {unreadCount > 0 && (
                <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full top-1 right-4">
                  {unreadCount}
                </span>
              )}
            </Button>
            <Button
              variant={"brightblue"}
              className="hidden lg:flex w-full md:w-[166px] justify-center"
              onClick={() => setEditModalOpen(true)}
            >
              <MaterialIcon iconName="edit_square" size={20} /> Edit
            </Button>
          </div>
        </div>

        {isPopupOpen && (
          <div className="absolute p-4 overflow-y-auto bg-white shadow-md top-16 right-4 rounded-xl w-96 max-h-96 z-[999]">
            <div className="flex justify-between mb-2">
              <h4 className="text-lg font-semibold">Notifications</h4>
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                onClick={togglePopup}
                className="text-gray-600"
              >
                Close
              </Button>
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
                      <Button
                        variant={"unstyled"}
                        size={"unstyled"}
                        onClick={() =>
                          handleNotificationAction(notification.id, "read")
                        }
                        className="text-xs text-white bg-[#1C63DB] p-[8px] rounded-[8px]"
                      >
                        Mark as read
                      </Button>
                      <Button
                        variant={"unstyled"}
                        size={"unstyled"}
                        onClick={() =>
                          handleNotificationAction(notification.id, "dismiss")
                        }
                        className="text-xs text-black bg-[#D5DAE2] p-[8px] rounded-[8px]"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No new notifications</p>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] md:gap-[24px]">
          <Card>
            <div className="flex flex-col gap-10 md:flex-row">
              <Avatar className="w-[143px] h-[133px] md:w-[200px] md:h-[185px] rounded-[12px] object-cover block">
                <AvatarImage src={photoUrl || undefined} />
                <AvatarFallback className="text-3xl bg-slate-300">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col w-full gap-2.5">
                <p className="text-[#1D1D1F] text-2xl font-bold">
                  {user?.profile.basic_info.first_name &&
                  user?.profile.basic_info.last_name
                    ? `${user?.profile.basic_info.first_name} ${user?.profile.basic_info.last_name}`
                    : user?.profile.basic_info.name || ""}
                  ,{" "}
                  {user?.profile.basic_info.age
                    ? String(user?.profile.basic_info.age)
                    : ""}
                </p>
                <Field
                  label="Bio (400 Characters):"
                  value={user?.profile.basic_info.bio?.slice(0, 400) || ""}
                  truncate={false}
                />
              </div>
            </div>
          </Card>

          {/* Practitioner Type */}
          <Card>
            <div className="flex flex-col gap-[14px] w-full">
              <Field
                label="Practitioner Type:"
                value={
                  user?.onboarding?.practitioner_info.types
                    .filter((item) => item !== "")
                    .join(", ") || ""
                }
                truncate={false}
              />

              <Field
                label="Languages:"
                value={user?.profile?.basic_info?.languages?.join(", ") || ""}
                truncate={false}
              />

              <Field
                label="Primary focus:"
                value={user?.profile.expertise?.join(", ") || ""}
                truncate={false}
              />

              <Field label="Content profile:" value="-" />
            </div>
          </Card>

          {/* About your practice */}
          <Card title="Professional Background">
            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-col justify-between gap-[32px]">
                <div className="w-full md:col-span-2">
                  <div className="flex flex-col gap-2">
                    <span className="text-[#5F5F65] text-[18px] font-[500]">
                      Education:
                    </span>
                    <span className="text-[#1D1D1F] text-[16px] font-[500]">
                      {user?.onboarding?.practitioner_info?.school || ""}
                    </span>
                  </div>
                </div>
                <div className="md:col-span-1 flex flex-col gap-[8px]">
                  <span className="text-[#5F5F65] text-[18px] font-[500]">
                    Certificates:{" "}
                    {user?.onboarding?.practitioner_info?.license_files
                      .length || licensePhotos.length}
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    {licensePhotos?.map((item) => {
                      return (
                        <img
                          key={item}
                          src={item}
                          alt="Certificate"
                          className="w-[143px] h-[143px] xl:w-[155px] xl:h-[155px] rounded-[8px] object-cover"
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Security */}
          <Card title="Contact Information & Account Security">
            <div className="flex flex-col gap-[14px] w-full">
              <Field
                className="flex-row"
                label="Email:"
                value={user?.profile.basic_info.email || ""}
              />
              <Field
                className="flex-row"
                label="Phone number:"
                value={phoneMask(user?.profile.basic_info.phone || "")}
              />
              <Field
                className="flex-row"
                label="Time zone:"
                value={user?.profile.basic_info.timezone || ""}
              />

              <div className="flex flex-col w-full gap-4">
                <div className="flex flex-col gap-[10px]">
                  <p className="text-[16px] font-medium text-[#1D1D1F]">
                    Current password
                  </p>
                  <div className="relative flex flex-row-reverse items-center w-full lg:w-[70%]">
                    <Input
                      type={showPassword ? "password" : "text"}
                      placeholder="Enter Password"
                      name="password"
                      value={oldPassword}
                      onChange={(e) => {
                        setOldPassword(e.target.value);
                      }}
                      className={
                        "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
                      }
                    />
                    <Button
                      variant={"unstyled"}
                      size={"unstyled"}
                      type="button"
                      className="absolute mr-4"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Show password" : "Hide password"
                      }
                    >
                      <MaterialIcon
                        iconName={
                          showPassword ? "visibility_off" : "visibility"
                        }
                        size={16}
                      />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col gap-[10px]">
                  <p className="text-[16px] font-medium text-[#1D1D1F]">
                    New password
                  </p>
                  <div className="relative flex flex-row-reverse items-center w-full lg:w-[70%]">
                    <Input
                      type={showPassword ? "password" : "text"}
                      placeholder="Enter Password"
                      name="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                      }}
                      className={
                        "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
                      }
                    />
                    <Button
                      variant={"unstyled"}
                      size={"unstyled"}
                      type="button"
                      className="absolute mr-4"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Show password" : "Hide password"
                      }
                    >
                      <MaterialIcon
                        iconName={
                          showPassword ? "visibility_off" : "visibility"
                        }
                        size={16}
                      />
                    </Button>
                  </div>
                  <div className="w-full lg:w-[70%]">
                    {newPassword && (
                      <StrengthMeter
                        level={result.level as 0 | 1 | 2 | 3}
                        label={result.label}
                      />
                    )}

                    {newPassword && !result.isValid && (
                      <ul
                        id="password-help"
                        className="mt-2 list-disc pl-2 text-xs  text-[#6B7280]"
                      >
                        {result.feedback.map((f) => (
                          <li key={f}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="brightblue"
                className="mt-3 w-full md:w-[250px] disabled:opacity-[0.5] disabled:bg-slate-400 disabled:text-slate-900"
                onClick={() => handleChangePassword(oldPassword, newPassword)}
                disabled={
                  oldPassword === "" || newPassword === "" || !result.isValid
                }
              >
                Change
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <CouchEditProfileModal
        user={user ?? null}
        open={editModalOpen}
        setOpen={setEditModalOpen}
      />
    </>
  );
};

export const Field = ({
  label,
  value,
  className,
  truncate = true,
}: {
  label: string;
  value: string;
  className?: string;
  truncate?: boolean;
}) => (
  <div className={cn("flex flex-col gap-[4px] max-w-full", className)}>
    <p className="text-[#5F5F65] text-[12px] md:text-base font-medium ">
      {label}
    </p>
    <p
      className={cn("text-[#1D1D1F] text-[14px] md:text-[16px]", {
        "truncate max-w-full": truncate,
      })}
    >
      {value}
    </p>
  </div>
);

export const Card = ({
  title,
  icon,
  children,
}: {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-[16px] p-[16px] md:p-[24px] border border-[#EAECF0]">
    {title && (
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        {icon && <div className="text-[#2D6AE3]">{icon}</div>}
        {title && (
          <h3 className="text-[20px] md:text-[24px] lg:text-[20px] font-semibold text-[#1B2559]">
            {title}
          </h3>
        )}
      </div>
    )}
    {children}
  </div>
);

export default ContentManagerProfile;

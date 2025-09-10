import { ChatSocketService } from "entities/chat";
import { CoachService } from "entities/coach";
import {
  ChangePasswordRequest,
  UserOnboardingInfo,
  UserService,
} from "entities/user";
import React, { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn, phoneMask, toast } from "shared/lib";
import {
  checkPasswordStrength,
  StrengthMeter,
} from "shared/lib/utils/passwordChecker";
import { Avatar, AvatarFallback, AvatarImage, Button, Input } from "shared/ui";
import { CouchEditProfileModal } from "widgets/couch-edit-profile-modal";

export const ContentManagerProfile = () => {
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [user, setUser] = useState<UserOnboardingInfo | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [licensePhotos, setLicensePhotos] = useState<string[]>([]);
  const result = useMemo(
    () => checkPasswordStrength(newPassword),
    [newPassword]
  );

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

  useEffect(() => {
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
        const blob = await CoachService.downloadLicenseFile(filename);
        const url = URL.createObjectURL(blob);
        revokeUrls.push(url);
        return url;
      } catch (e) {
        console.error("Failed to download file:", filename, e);
        return null;
      }
    };

    (async () => {
      const u = await UserService.getOnboardingUser();
      setUser(u);

      const headshotFilename = u?.profile?.basic_info?.headshot
        ? u.profile.basic_info.headshot.split("/").pop()
        : u.profile.basic_info.headshot;
      const headshotBlob = await UserService.downloadProfilePhoto(
        headshotFilename || ""
      );
      const headshot = URL.createObjectURL(headshotBlob);
      setPhotoUrl(headshot);

      const licensePaths: string[] =
        u?.onboarding?.practitioner_info?.license_files ?? [];

      const urls = await Promise.all(
        licensePaths.map((p) => createUrlFromPath(p))
      );
      setLicensePhotos(urls.filter((x): x is string => Boolean(x)));
    })();

    return () => {
      revokeUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

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

  const initials = user?.profile.basic_info.name
    ? user.profile.basic_info.name.split(" ").length > 1
      ? user.profile.basic_info.name
          .split(" ")
          .map((word) => word[0].toUpperCase())
          .slice(0, 2)
          .join("")
      : user.profile.basic_info.name.slice(0, 2).toUpperCase()
    : "UN";

  return (
    <>
      <div className="p-[16px] md:p-[24px] xl:py-[32px] xl:px-[24px] flex flex-col gap-[24px] md:gap-[32px]">
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
          <Button
            variant={"brightblue"}
            className="hidden lg:flex w-full md:w-[166px] justify-center"
            onClick={() => setEditModalOpen(true)}
          >
            <MaterialIcon iconName="edit_square" size={20} /> Edit
          </Button>
        </div>

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
                  {user?.profile.basic_info.name || ""},{" "}
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
                  user?.onboarding?.practitioner_info.types.join(", ") || ""
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
                    <button
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
                    </button>
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
                    <button
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
                    </button>
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
        user={user}
        open={editModalOpen}
        setOpen={setEditModalOpen}
      />
    </>
  );
};

const Field = ({
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

const Card = ({
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

import {
  ChangePasswordRequest,
  UserOnboardingInfo,
  UserService,
} from "entities/user";
import React, { useEffect, useState } from "react";
import BrainIcon from "shared/assets/icons/brain";
import LeavesIcon from "shared/assets/icons/leaves";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import TestTubeIcon from "shared/assets/icons/test-tube";
import FocusAreasIcon from "shared/assets/images/FocusAreas.png";
import SafetyIcon from "shared/assets/images/Safety.png";
import UsersIcon from "shared/assets/images/Users.png";
import { phoneMask, toast } from "shared/lib";
import { CoachService } from "entities/coach";
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
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-[16px]">
            <div className="flex items-center gap-[4.5px] text-[#1D1D1F] text-[24px] md:text-[32px] font-bold w-full lg:w-fit">
              <MaterialIcon iconName="account_circle" /> My profile
            </div>
            <Button
              variant={"brightblue"}
              className="flex lg:hidden w-full w-full md:w-[300px] justify-center"
              onClick={() => setEditModalOpen(true)}
            >
              <MaterialIcon iconName="edit" fill={1} size={20} /> Edit
            </Button>
          </div>
          <Button
            variant={"brightblue"}
            className="hidden lg:flex w-full w-full md:w-[300px] justify-center"
            onClick={() => setEditModalOpen(true)}
          >
            <MaterialIcon iconName="edit" fill={1} size={20} /> Edit
          </Button>
        </div>

        <div className="bg-white rounded-[16px] p-[16px] md:p-[24px] grid md:grid-cols-[180px_1fr] gap-x-[16px] md:gap-x-[24px] gap-y-[16px] lg:grid-cols-[200px_1fr] lg:gap-[32px]">
          <Avatar className="w-[143px] h-[133px] md:w-[200px] md:h-[185px] rounded-[12px] object-cover block">
            <AvatarImage src={photoUrl || undefined} />
            <AvatarFallback className="text-3xl bg-slate-300">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="grid grid-cols-2 gap-x-[16px] gap-y-[16px] md:gap-x-[24px] md:gap-y-[24px] lg:hidden md:w-[422px] xl:w-full md:ml-auto">
            <Field
              label="Full name:"
              value={user?.profile.basic_info.name || ""}
            />
            <Field
              label="Gender:"
              value={user?.profile.basic_info.gender || ""}
            />
            <Field
              label="Email:"
              value={user?.profile.basic_info.email || ""}
            />
            <Field
              label="Phone number:"
              value={phoneMask(user?.profile.basic_info.phone || "")}
            />
            <Field
              label="Alternative name:"
              value={user?.profile.basic_info.alternate_name || ""}
            />
            <Field
              label="Age:"
              value={
                user?.profile.basic_info.age
                  ? String(user?.profile.basic_info.age)
                  : ""
              }
            />
            <div className="col-span-2">
              <Field
                label="Time zone:"
                value={user?.profile.basic_info.timezone || ""}
              />
            </div>
          </div>

          <div className="hidden lg:flex gap-[32px] w-full">
            <div className="flex flex-col gap-[56px] justify-between w-full max-w-[289px]">
              <Field
                label="Full name:"
                value={user?.profile.basic_info.name || ""}
              />
              <Field
                label="Email:"
                value={user?.profile.basic_info.email || ""}
              />
            </div>
            <div className="flex flex-col gap-[56px] justify-between w-full max-w-[289px]">
              <Field
                label="Gender:"
                value={user?.profile.basic_info.gender || ""}
              />
              <Field
                label="Phone number:"
                value={phoneMask(user?.profile.basic_info.phone || "")}
              />
            </div>
            <div className="flex flex-col gap-[56px] justify-between w-full">
              <div className="flex gap-[150px] max-w-full">
                <Field
                  label="Alternative name:"
                  value={user?.profile.basic_info.alternate_name || ""}
                />
                <Field
                  label="Age:"
                  value={
                    user?.profile.basic_info.age
                      ? String(user?.profile.basic_info.age)
                      : ""
                  }
                />
              </div>
              <Field
                label="Time zone:"
                value={user?.profile.basic_info.timezone || ""}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] md:gap-[24px]">
          {/* Safety */}
          <Card title="Security" icon={<img src={SafetyIcon} />}>
            <div className="flex flex-col gap-[16px] w-full">
              <div className="w-full">
                <h4 className="text-[#5F5F65] text-[18px] font-[500] mb-[16px]">
                  Change password:
                </h4>
                <div className="flex flex-col gap-4 w-full">
                  <div className="flex flex-col gap-[10px]">
                    <p className="text-[16px] font-semibold text-[#1D1D1F]">
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
                  <div className="hidden md:block" />
                  <div className="flex flex-col gap-[10px]">
                    <p className="text-[16px] font-semibold text-[#1D1D1F]">
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
                  </div>
                  <div className="hidden md:block" />
                </div>
                <Button
                  variant="brightblue"
                  className="mt-3 w-full md:w-[250px] disabled:opacity-[0.5]"
                  onClick={() => handleChangePassword(oldPassword, newPassword)}
                  disabled={oldPassword === "" || newPassword === ""}
                >
                  Change
                </Button>
              </div>
            </div>
          </Card>

          {/* Type of practitioner */}
          <Card title="Type of practitioner" icon={<img src={UsersIcon} />}>
            <ul className="flex flex-col gap-4">
              <PractitionerItem
                icon={
                  <MaterialIcon
                    iconName="lightbulb"
                    className="w-[24px] h-[24px] text-[#1B2559]"
                  />
                }
                title="Clinical & Licensed Healthcare Providers"
                subtitle="Physician Assistant (PA)"
              />
              <PractitionerItem
                icon={
                  <TestTubeIcon className="w-[24px] h-[24px] text-[#1B2559]" />
                }
                title="Other"
                subtitle="Healthcare Professional (General/Other)"
              />
              <PractitionerItem
                icon={
                  <LeavesIcon className="w-[24px] h-[24px] text-[#1B2559]" />
                }
                title="Functional & Holistic Health Practitioners"
                subtitle="Functional Nutrition Counselor / Coach"
              />
              <PractitionerItem
                icon={
                  <BrainIcon className="w-[24px] h-[24px] text-[#1B2559]" />
                }
                title="Lifestyle, Mind-Body, and Wellness Coaches"
                subtitle="Mind-Body Therapist (e.g., somatic, breathwork)"
              />
              <PractitionerItem
                icon={<MaterialIcon iconName="female" size={20} />}
                title="Women's Health & Specialty Coaches"
                subtitle="Menopause or Perimenopause Specialist"
              />
            </ul>
          </Card>

          {/* Primary focus area & Setup */}
          <Card
            title="Primary focus area & Setup"
            icon={<img src={FocusAreasIcon} />}
          >
            <div className="flex flex-col gap-[24px]">
              <div className="flex flex-wrap gap-2">
                {[
                  "Anxiety & Sleep",
                  "Digital Detox & Tech Overuse Recovery",
                  "Weight & Metabolic Health",
                  "Weight & Metabolic Health",
                  "Postpartum / Pelvic Floor",
                ].map((t) => (
                  <Tag key={t} label={t} />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-[24px]">
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[#5F5F65] text-[18px] font-[500]">
                    Software:
                  </span>
                  <span className="text-[#000] text-[16px] font-[500]">
                    CharmHealth
                  </span>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[#5F5F65] text-[18px]">
                    Using of AI:
                  </span>
                  <span className="text-[#000] text-[16px] font-[500]">
                    Daily
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* About your practice */}
          <Card
            title="About your practice?"
            icon={<img src={FocusAreasIcon} />}
          >
            <div className="flex flex-col gap-[32px]">
              <div className="flex flex-col xl:flex-row justify-between gap-[32px]">
                <div className="md:col-span-2 max-w-[330px]">
                  <div className="flex flex-col gap-2">
                    <span className="text-[#5F5F65] text-[18px] font-[500]">
                      Education:
                    </span>
                    <span className="text-[#1D1D1F] text-[20px] font-[500]">
                      Functional Medicine Coaching Academy (FMCA)
                    </span>
                  </div>
                </div>
                <div className="md:col-span-1 flex flex-col gap-[8px]">
                  <span className="text-[#5F5F65] text-[18px] font-[500]">
                    Certificates:{" "}
                    {user?.onboarding?.practitioner_info?.license_files
                      .length || licensePhotos.length}
                  </span>
                  {/* <div className="flex flex-wrap items-center gap-3">
                  {licensePhotos.map((item) => {
                    return (
                      <img
                        src={item}
                        alt="Certificate"
                        className="w-[143px] h-[143px] xl:w-[155px] xl:h-[155px] rounded-[8px] object-cover"
                      />
                    );
                  })}
                </div> */}
                </div>
              </div>
              <Field label="Bio:" value={user?.profile.basic_info.bio || ""} />
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

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-[4px] max-w-full">
    <p className="text-[#5F5F65] text-[12px] md:text-[18px] font-[500]">
      {label}
    </p>
    <p className="text-[#1D1D1F] text-[14px] md:text-[20px] font-[500] overflow-hidden truncate">
      {value}
    </p>
  </div>
);

const Card = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-[16px] p-[16px] md:p-[24px] border border-[#EAECF0]">
    <div className="flex items-center gap-2 mb-4 md:mb-6">
      {icon && <div className="text-[#2D6AE3]">{icon}</div>}
      <h3 className="text-[20px] md:text-[24px] lg:text-[28px] font-semibold text-[#1D1D1F]">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

const PractitionerItem = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) => (
  <li>
    <div className="flex items-start gap-[8px]">
      <div className="text-[#1B2559] mt-[2px]">{icon}</div>
      <div>
        <div className="flex items-center gap-[8px] text-[#1B2559] font-[600] text-[14px] lg:text-[20px]">
          {title}
          <MaterialIcon
            iconName="help"
            size={16}
            fill={1}
            className="text-[#1B2559]"
          />
        </div>
      </div>
    </div>
    <div className="text-[#000] text-[15px] lg:text-[16px]">{subtitle}</div>
  </li>
);

const Tag = ({ label }: { label: string }) => (
  <span className="inline-flex items-center px-[32px] py-[10px] rounded-full border border-[#1C63DB] text-[16px] text-[#5F5F65] font-semibold">
    {label}
  </span>
);

export default ContentManagerProfile;

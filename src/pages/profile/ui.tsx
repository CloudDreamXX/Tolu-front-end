import { RootState } from "entities/store";
import { UserService } from "entities/user";
import { Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import SignOutIcon from "shared/assets/icons/signout";
import { cn, toast } from "shared/lib";
import { Button } from "shared/ui";
import { Card } from "./components/Card";
import { Switch } from "./components/Switch";
import { Field } from "./components/Field";

export const ClientProfile = () => {
  const token = useSelector((state: RootState) => state.user.token);
  const [emailNotif, setEmailNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);

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

  return (
    <div className="p-[16px] md:pt-0 md:p-6 flex flex-col gap-[24px] md:gap-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-[4.5px] text-[#1D1D1F] text-[24px] md:text-[32px] font-bold">
          Personal profile
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-white rounded-2xl md:p-6">
        <div className="flex items-center gap-6 ">
          <div className="relative">
            <img
              className="w-[100px] h-[100px] rounded-full object-cover"
              src="/profile.png"
              alt="Frances Swann"
            />
            <Button
              variant="brightblue"
              className="absolute bottom-0 right-0 w-8 h-8 p-2 rounded-full hover:bg-[#1C63DB]"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div>
            <p className="mb-1 text-2xl font-semibold">Frances Swann</p>
            <p className="px-2 bg-blue-100 py-1.5 text-blue-600 font-semibold rounded-full inline-block">
              Member since April 2025
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] md:gap-[24px] md:gap-y-[24px]">
        <Card
          title="Account Info"
          action={
            <Button
              variant={"blue2"}
              className="px-8 text-base font-semibold text-blue-700"
            >
              Edit
            </Button>
          }
        >
          <div className="grid grid-cols-2 gap-x-[16px] gap-y-[16px] md:gap-x-[24px] md:gap-y-[24px]">
            <Field label="Name" value="Sophia Turner" />
            <Field label="Phone number" value="+1 (310) 555-7493" />

            <Field label="Date of birth" value="10/10/1990" />
            <Field label="Gender" value="Woman" />

            <Field label="Email:" value="smith@gmail.com" />
            <Field
              label="Time zone:"
              value="(GMT-08:00) Pacific Time (US & Canada)"
            />
          </div>

          <div className="flex justify-end border-t border-[#EAECF0] mt-6 pt-6">
            <Button variant="link" className="text-[#1C63DB]">
              Change password
            </Button>
          </div>
        </Card>

        <div className="row-span-3">
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

                <div className="flex items-center gap-[8px]">
                  {[
                    "Fatigue",
                    "Brain fog",
                    "Hot flashes",
                    "Headache",
                    "Insomnia",
                  ].map((item) => (
                    <div className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <p className="text-sm text-[#5F5F65]">Duration</p>

                <div className="flex items-center gap-[8px]">
                  {["1–3 hours"].map((item) => (
                    <div className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
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
                      <div className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
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
                    <div className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
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
                      <div className="flex items-center justify-center px-4 py-[9px] bg-[#F3F7FD] rounded-md text-base">
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
  );
};

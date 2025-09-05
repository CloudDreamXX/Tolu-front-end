import { UserService } from "entities/user";
import { ChangeEvent, FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "shared/lib/hooks/use-toast";
import { Input } from "shared/ui";

export const NewPassword = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    newPasswordRepeat: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const location = useLocation();
  const { token, email } = location.state || {};

  const formDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.newPasswordRepeat) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      if (email && token) {
        const msg = await UserService.setNewPassword(
          email,
          token,
          formData.newPassword
        );

        if (msg.message) {
          toast({
            title: "Password updated",
            description: "You can now log in with your new password.",
          });
          nav("/auth");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Missing credentials",
          description: "Email or reset token not found. Please retry the flow.",
        });
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        variant: "destructive",
        title: "Password update failed",
        description:
          "Something went wrong while updating your password. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col xl:flex-row w-full h-screen">
      {/* Left side */}
      <div className="w-full xl:max-w-[665px] h-[150px] xl:h-full bg-[#1C63DB] flex justify-center items-center xl:px-6 xl:px-[76.5px]">
        <aside className="py-[10px] px-[95px] xl:p-[40px] flex items-center justify-center flex-col">
          <h1 className="text-white  text-center text-[44.444px] xl:text-[96px] font-bold">
            Tolu AI
          </h1>
          <h3 className="capitalize  text-white text-center text-[14px] md:text-[15px] xl:text-[32px] font-semibold xl:font-medium">
            Knowledge Before Care
          </h3>
        </aside>
      </div>

      {/* Right side */}
      <div className="w-full h-full flex justify-center xl:items-center flex-1 bg-[linear-gradient(0deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.10)_100%),#FFF]">
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-[550px] flex flex-col mt-[40px] md:mt-[121px] xl:mt-0 py-[24px] px-[16px] md:p-0 xl:items-center gap-[40px] xl:gap-[60px]"
        >
          <h3 className="text-black text-center  font-semibold text-[28px] md:text-[40px]">
            Create new password
          </h3>

          <main className="flex flex-col gap-[24px] items-start self-stretch">
            {/* New password */}
            <div className="flex flex-col items-start gap-[4px] w-full">
              <label className="text-[#5f5f65] text-[16px] font-semibold ">
                New Password
              </label>
              <Input
                type="password"
                placeholder="Enter New Password"
                name="newPassword"
                onChange={formDataChangeHandler}
                className="px-[16px] py-[11px] h-[44px] rounded-[8px] bg-white border border-[#DFDFDF] outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in w-full"
              />
            </div>

            {/* Confirm new password */}
            <div className="flex flex-col items-start gap-[4px] w-full">
              <label className="text-[#5f5f65] text-[16px] font-semibold ">
                Confirm New Password
              </label>
              <Input
                type="password"
                placeholder="Repeat Password"
                name="newPasswordRepeat"
                onChange={formDataChangeHandler}
                className={`px-[16px] py-[11px] h-[44px] rounded-[8px] bg-white outline-none focus-visible:outline-none focus:duration-300 focus:ease-in w-full ${
                  passwordError
                    ? "border border-[#FF1F0F] focus:border-[#FF1F0F]"
                    : "border border-[#DFDFDF] focus:border-[#1C63DB]"
                }`}
              />
              {passwordError && (
                <p className="text-[#FF1F0F]  text-[14px] font-medium px-[4px] pt-[4px]">
                  {passwordError}
                </p>
              )}
            </div>
          </main>

          {/* Submit Button */}
          <div className="flex flex-col items-center gap-[24px] w-full mt-auto md:mt-0">
            <button
              type="submit"
              className={`w-full md:w-[250px] h-[44px] p-[16px] rounded-full flex items-center justify-center  text-[16px] font-semibold ${
                formData.newPassword.length >= 8 &&
                formData.newPasswordRepeat.length >= 8 &&
                !passwordError
                  ? "bg-[#1C63DB] text-white"
                  : "bg-[#D5DAE2] text-[#5F5F65]"
              }`}
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

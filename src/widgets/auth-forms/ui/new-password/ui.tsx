import { RootState } from "entities/store";
import { UserService } from "entities/user";
import { ChangeEvent, FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "shared/lib/hooks/use-toast";
import { Input } from "shared/ui";

export const NewPassword = () => {
  const { user: userData, tokenNewPassword } = useSelector(
    (state: RootState) => state.user
  );
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    newPassword: "",
    newPasswordRepeat: "",
  });
  const [passwordError, setPasswordError] = useState("");

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
      if (userData?.email && tokenNewPassword) {
        const msg = await UserService.setNewPassword(
          userData.email,
          tokenNewPassword,
          formData.newPassword
        );

        if (msg.message) {
          toast({
            title: "Password updated",
            description: "You can now log in with your new password.",
          });
          nav("/");
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
        description: "Something went wrong while updating your password. Please try again.",
      });
    }
  };

  return (
    <div className="w-full h-screen flex items-start py-0">
      <div className="w-full max-w-[665px] h-full flex px-[76.5px] py-0 flex-col justify-center items-center self-center bg-[#1C63DB]">
        <aside className="p-[40px] flex items-center justify-center flex-col">
          <h1 className="text-white font-open text-center text-[96px] font-bold">
            TOLU
          </h1>
          <h3 className="text-white font-open text-center text-[32px] font-medium">
            The Holistic Menopause Health Assistant
          </h3>
        </aside>
      </div>
      <div className="w-full h-full flex justify-center items-center self-stretch flex-1 bg-[linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), #FFF]">
        <form
          className="w-[550px] flex flex-col items-center gap-[60px]"
          onSubmit={handleSubmit}
        >
          <h3 className="text-black text-center font-inter font-semibold text-[40px]">
            Create new password
          </h3>
          <main className="flex flex-col gap-[24px] items-start self-stretch">
            <div className="flex flex-col items-start gap-[10] self-stretch">
              <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
                New Password
              </label>
              <Input
                type="password"
                placeholder="Enter New Password"
                name="newPassword"
                onChange={formDataChangeHandler}
                className="px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
              />
            </div>
            <div className="flex flex-col items-start gap-[10] self-stretch">
              <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
                Confirm new password
              </label>
              <div className="flex flex-row-reverse items-center w-full">
                <Input
                  type="password"
                  placeholder="Enter New Password"
                  name="newPasswordRepeat"
                  onChange={formDataChangeHandler}
                  className={
                    passwordError
                      ? "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#FF1F0F] bg-white outline-none focus-visible:outline-none focus:duration-300 focus:ease-in"
                      : "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
                  }
                />
              </div>
              <p className="text-[#FF1F0F] font-[Nunito] font-medium px-[16px] flex items-center justify-center gap-[10px]">
                {passwordError}
              </p>
            </div>
          </main>
          <div className="flex flex-col items-center gap-[24px] slef-stretch">
            <button
              type="submit"
              className={
                formData.newPassword.length > 8 &&
                formData.newPasswordRepeat.length > 8 &&
                !passwordError
                  ? "flex w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#1C63DB] text-white font-[Nunito] text-[16px] font-semibold"
                  : "flex w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#D5DAE2] text-[#5F5F65] font-[Nunito] text-[16px] font-semibold"
              }
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

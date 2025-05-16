// import { UserService } from "entities/user";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "shared/ui";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const nav = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        // const response = await UserService.forgotPassword(email);
        nav("/verify-email-pass");
      } catch (error) {
        console.error("Error sending password reset email:", error);
      }
    } else {
      console.error("Email is required");
    }
  };
  return (
    <div className="w-full h-screen flex items-start py-0">
      <div className="w-full max-w-[665px] h-full flex px-[76.5px] py-0 flex-col justify-center items-center self-center bg-[#1C63DB]">
        <aside className="p-[40px] flex items-center justify-center flex-col">
          <h1 className="text-white text-center text-[96px] font-bold font-reem">
            VITAI
          </h1>
          <h3 className="text-white text-center text-[32px] font-medium font-open">
            The Holistic Health Assistant
          </h3>
        </aside>
      </div>
      <div className="w-full h-full flex justify-center items-center self-stretch flex-1 bg-[linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), #FFF]">
        <form
          className="w-[550px] flex flex-col items-center gap-[60px]"
          onSubmit={handleSubmit}
        >
          <h3 className="text-black text-center font-inter font-semibold text-[40px]">
            Forgot password
          </h3>
          <div className="flex flex-col items-start gap-[10] self-stretch">
            <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setEmail(event.target.value)
              }
              className="px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
            />
            <p className="flex p-[4px] justify-end items-center gap-[12px] text-black text-[14px] font-normal font-[Nunito]">
              Didn't get the code?{" "}
              <span className="cursor-pointer text-[#1C63DB] underline">
                Resend
              </span>
            </p>
          </div>
          <div className="flex flex-col items-center gap-[24px] self-stretch">
            <div className="flex items-start gap-[24px]">
              <button
                type="button"
                onClick={() => nav(-1)}
                className="bg-[#008FF61A] w-[250px] h-[44px] py-[4px] px-[32px] flex items-center justify-center text-[#1C63DB] gap-[8px] rounded-full font-[Nunito] text-[16px] font-semibold"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                className={
                  email
                    ? "bg-[#1C63DB] duration-200 ease-in w-[250px] h-[44px] py-[4px] px-[32px] flex items-center justify-center text-white gap-[8px] rounded-full font-[Nunito] text-[16px] font-semibold"
                    : "duration-200 ease-in bg-[#D5DAE2] w-[250px] h-[44px] py-[4px] px-[32px] flex items-center justify-center text-[#5F5F65] gap-[8px] rounded-full font-[Nunito] text-[16px] font-semibold"
                }
              >
                Send
              </button>
            </div>
            <p className="text-[14px] font-[Nunito] font-medium">
              Remember your password?{" "}
              <Link
                to="/auth"
                className="cursor-pointer text-[#1C63DB] underline"
              >
                Log in
              </Link>
            </p>
          </div>
          <div className="flex flex-col items-center gap-[24px] slef-stretch"></div>
        </form>
      </div>
    </div>
  );
};

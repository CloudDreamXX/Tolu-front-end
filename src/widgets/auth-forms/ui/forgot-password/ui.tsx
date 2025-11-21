import { useForgotPasswordMutation } from "entities/user";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "shared/ui";
import { toast } from "shared/lib/hooks/use-toast";

export const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const nav = useNavigate();

  const [forgotPassword] = useForgotPasswordMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      try {
        await forgotPassword(email).unwrap();
        nav("/verify-email-pass");
      } catch (error) {
        console.error("Error sending password reset email:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "We couldn’t send the reset email. Please try again.",
        });
      }
    } else {
      toast({
        variant: "destructive",
        title: "Missing email",
        description: "Please enter your email before submitting.",
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-screen xl:flex-row">
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

      <div className="w-full h-full flex justify-center xl:items-center flex-1 bg-[linear-gradient(0deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.10)_100%),#FFF]">
        <form
          className="w-full md:w-[550px] flex flex-col mt-[44px] md:mt-[121px] xl:mt-0 py-[24px] px-[16px] md:p-0 xl:items-center gap-[40px] xl:gap-[60px]"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center gap-[14px]">
            <img src="/logo.png" className="w-[60px] h-[60px]" />
            <h3 className="text-black text-center  font-semibold text-[28px] md:text-[40px]">
              Forgot Password
            </h3>
          </div>

          <div className="flex flex-col items-start gap-[4px] w-full">
            <label className="text-[#5f5f65] text-[16px] font-semibold ">
              Email
            </label>
            <Input
              type="email"
              placeholder="Enter Email"
              name="email"
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setEmail(event.target.value)
              }
              className="px-[16px] py-[11px] h-[44px] rounded-[8px] bg-white border border-[#DFDFDF] outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in w-full"
            />
            <p className="flex px-[4px] pt-[4px] text-black text-[14px] font-normal  w-full xl:justify-end">
              Didn't get the code?{" "}
              <span className="cursor-pointer text-[#1C63DB] underline ml-1">
                Resend
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center gap-[24px] w-full mt-auto md:mt-0">
            <div className="flex flex-row gap-[8px] md:gap-[24px] w-full md:justify-center">
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                type="button"
                onClick={() => nav(-1)}
                className="bg-[#008FF61A] w-full md:w-[250px] h-[44px] py-[4px] px-[32px] flex items-center justify-center text-[#1C63DB] gap-[8px] rounded-full  text-[16px] font-semibold"
              >
                Back
              </Button>
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                type="submit"
                className={`w-full md:w-[250px] h-[44px] py-[4px] px-[32px] flex items-center justify-center gap-[8px] rounded-full  text-[16px] font-semibold ${
                  email
                    ? "bg-[#1C63DB] text-white"
                    : "bg-[#D5DAE2] text-[#5F5F65]"
                }`}
              >
                Send
              </Button>
            </div>

            <p className="text-black  text-[14px] font-medium">
              Remember your password?{" "}
              <Link to="/auth" className="underline text-[#1C63DB]">
                Log in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

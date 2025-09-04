import { setCredentials, UserService } from "entities/user";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "shared/lib/hooks/use-toast";

type CheckEmailProps = {
  from: "register" | "forgot-password";
};

export const CheckEmail: React.FC<CheckEmailProps> = ({ from }) => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const token = query.get("token") ?? "";
  const email = query.get("email") ?? "";
  const location = useLocation();
  const isInvitedClient = location.state?.isInvitedClient === true || null;

  useEffect(() => {
    if (from === "register" && token && email) {
      const verifyEmail = async () => {
        try {
          const msg = await UserService.verifyEmail({ email, token });
          if (msg.user && msg.accessToken) {
            dispatch(
              setCredentials({
                user: msg.user,
                accessToken: msg.accessToken,
              })
            );
            if (msg.user.roleID === 3) {
              nav("/welcome/client");
            } else {
              nav("/welcome/practitioner");
            }
          }
        } catch (error) {
          console.error("Error verifying email:", error);
          toast({
            variant: "destructive",
            title: "Verification failed",
            description:
              "We couldn't verify your email. Please try again or request a new link.",
          });
        }
      };
      verifyEmail();
    }

    if (from === "forgot-password" && token && email) {
      const verifyEmail = async () => {
        try {
          await UserService.verifyEmailPass({ email, token });
          dispatch(
            setCredentials({
              user: { email },
              accessToken: null,
              tokenNewPassword: token,
            })
          );
          nav("/new-password");
        } catch (error) {
          console.error("Error verifying password reset:", error);
          toast({
            variant: "destructive",
            title: "Verification failed",
            description:
              "We couldn't verify your reset link. Please try again or request a new one.",
          });
        }
      };
      verifyEmail();
    }
  }, [token, email, from]);

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
      {token.length > 0 && email.length > 0 && !isInvitedClient ? (
        <div className="w-full xl:w-[550px] flex-1 h-full flex justify-center items-center flex-col gap-[60px] px-[16px] py-[24px] md:p-0">
          <div className="flex flex-col items-end self-stretch justify-end gap-[24px] md:gap-[16px] mt-auto md:mt-0">
            <h1 className="text-center self-stretch text-black font-inter text-[28px] md:text-[40px] font-semibold">
              Just a moment...
            </h1>
            <h3 className="text-center self-stretch text-black font-[Nunito] text-[16px] md:text-[24px] font-normal">
              We&apos;re verifying your link. This will only take a few
              <br /> seconds.
            </h3>
          </div>
          <p className="text-black font-[Nunito] text-[14px] font-normal mt-auto md:mt-0">
            Need help?{" "}
            <span className="underline cursor-pointer text-[#1C63DB]">
              Support
            </span>
          </p>
        </div>
      ) : (
        <div className="w-full flex-1 h-full flex justify-center items-center flex-col gap-[60px] px-[16px] py-[24px] md:p-0">
          <div className="flex flex-col items-end self-stretch justify-end gap-[16px] mt-auto md:mt-0">
            <h1 className="text-center self-stretch text-black font-inter text-[28px] md:text-[40px] font-semibold">
              Check your inbox
            </h1>
            <h3 className="text-center self-stretch text-black font-[Nunito] text-[16px] md:text-[24px] font-normal">
              We&apos;ve sent you a link. Follow the instructions in
              <br /> your email to continue. Don&apos;t forget to check your
              <br /> spam or promotions folder.
            </h3>
          </div>
          <p className="mt-auto md:mt-0 text-black font-[Nunito] text-[14px] font-normal">
            Need help?{" "}
            <span className="underline cursor-pointer text-[#1C63DB]">
              Support
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

import { RootState } from "entities/store";
import { setCredentials, UserService } from "entities/user";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

type CheckEmailProps = {
  from: "register" | "forgot-password";
};

export const CheckEmail: React.FC<CheckEmailProps> = ({ from }) => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const { search } = useLocation();
  const user = useSelector((state: RootState) => state.user);
  const query = new URLSearchParams(search);
  const token = query.get("token") ?? "";
  const email = query.get("email") ?? "";

  useEffect(() => {
    if (from === "register") {
      if (token.length > 0 && email.length > 0) {
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
              if (user.user?.roleID === 3) {
                nav("/welcome/client");
                return;
              }
              nav("/welcome/practitioner");
            }
          } catch (error) {
            console.error("Error verifying email:", error);
          }
        };
        verifyEmail();
      }
    }

    if (from === "forgot-password") {
      if (token.length > 0 && email.length > 0) {
        const verifyEmail = async () => {
          try {
            const msg = await UserService.verifyEmailPass({ email, token });
            dispatch(
              setCredentials({
                user: { email },
                accessToken: null,
                tokenNewPassword: token,
              })
            );
            nav("/new-password");
          } catch (error) {
            console.error("Error verifying email:", error);
          }
        };
        verifyEmail();
      }
    }
  }, [token, email, from]);
  return (
    <div className="w-full h-screen flex items-start py-0">
      <div className="w-full max-w-[665px] h-full flex px-[76.5px] py-0 flex-col justify-center items-center self-center bg-[#1C63DB]">
        <aside className="p-[40px] flex items-center justify-center flex-col">
          <h1 className="text-white text-center text-[96px] font-bold">
            VITAI
          </h1>
          <h3 className="text-white text-center text-[32px] font-medium">
            The Holistic Health Assistant
          </h3>
        </aside>
      </div>
      {token.length > 0 && email.length > 0 ? (
        <div className="w-[550px] flex-1 h-full flex justify-center items-center flex-col gap-[60px]">
          <div className="flex flex-col items-end self-stretch justify-end gap-[16px]">
            <h1 className="text-center self-stretch text-black font-[Inter] text-[40px] font-semibold">
              Just a moment...
            </h1>
            <h3 className="text-center self-stretch text-black font-[Nunito] text-[24px] font-normal">
              We&apos;re verifying your link. This will only take a few
              <br /> seconds.
            </h3>
          </div>
          <p className="text-black font-[Nunito] text-[14px] font-normal">
            Need help?{" "}
            <span className="underline cursor-pointer text-[#1C63DB]">
              Support
            </span>
          </p>
        </div>
      ) : (
        <div className="w-[550px] flex-1 h-full flex justify-center items-center flex-col gap-[60px]">
          <div className="flex flex-col items-end self-stretch justify-end gap-[16px]">
            <h1 className="text-center self-stretch text-black font-[Inter] text-[40px] font-semibold">
              Check your inbox
            </h1>
            <h3 className="text-center self-stretch text-black font-[Nunito] text-[24px] font-normal">
              We&apos;ve sent you a link. Follow the instructions in
              <br /> your email to continue. Don&apos;t forget to check your
              <br /> spam or promotions folder.
            </h3>
          </div>
          <p className="text-black font-[Nunito] text-[14px] font-normal">
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

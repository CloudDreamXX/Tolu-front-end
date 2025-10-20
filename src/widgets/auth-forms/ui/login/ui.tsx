import {
  useAcceptCoachInviteMutation,
  useRequestNewInviteMutation,
} from "entities/client";
import { setFromUserInfo } from "entities/store/clientOnboardingSlice";
import {
  setCredentials,
  useLoginMutation,
  useRequestPasswordlessLoginMutation,
  useVerifyPasswordlessLoginMutation,
  useLazyGetOnboardClientQuery,
  useLazyGetOnboardingStatusQuery,
  useLazyGetOnboardingUserQuery,
} from "entities/user";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { toast } from "shared/lib/hooks/use-toast";
import { Input } from "shared/ui";
import { z } from "zod";
import { setCoachOnboardingData } from "entities/store/coachOnboardingSlice";
import { findFirstIncompleteStep } from "widgets/OnboardingPractitioner/onboarding-finish/helpers";
import { mapUserToCoachOnboarding } from "widgets/OnboardingPractitioner/select-type/helpers";
import { mapOnboardClientToFormState } from "entities/store/helpers";
import { findIncompleteClientField } from "widgets/OnboardingClient/DemographicStep/helpers";

export const LoginForm = () => {
  const [login] = useLoginMutation();
  const [requestPasswordlessLogin] = useRequestPasswordlessLoginMutation();
  const [verifyPasswordlessLogin] = useVerifyPasswordlessLoginMutation();
  const [acceptCoachInvite] = useAcceptCoachInviteMutation();
  const [requestNewInvite] = useRequestNewInviteMutation();

  const [triggerGetOnboardingStatus] = useLazyGetOnboardingStatusQuery();
  const [triggerGetOnboardClient] = useLazyGetOnboardClientQuery();
  const [triggerGetOnboardingUser] = useLazyGetOnboardingUserQuery();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isInvitedClient = location.state?.isInvitedClient === true || null;
  const clientEmail = location.state?.email || null;
  const coachInviteToken = location.state?.coachInviteToken;
  const redirectPath = localStorage.getItem("redirectAfterLogin");

  const [loginMode, setLoginMode] = useState<"password" | "2fa">("2fa");
  const [isCodeSent, setIsCodeSent] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    code: "",
  });
  const [showPassword, setShowPassword] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [codeError, setCodeError] = useState("");

  const loginSchema = z.object({
    email: z.string().email("The email format is incorrect."),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });

  const formDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginError("");
    setPasswordError("");
    setCodeError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    const handleSend = async () => {
      if (clientEmail) {
        try {
          await requestPasswordlessLogin({ email: clientEmail }).unwrap();
          setIsCodeSent(true);
          toast({
            title: "Code sent",
            description: "Check your email for the verification code.",
          });
        } catch (err: any) {
          toast({
            variant: "destructive",
            title: "Failed to send code",
            description: err?.data?.message || "Please try again.",
          });
        }
      }
    };

    handleSend();
  }, [clientEmail]);

  // useEffect(() => {
  //   localStorage.clear();
  //   localStorage.removeItem("persist:user");
  //   localStorage.removeItem("persist:clientMood");
  // }, [loginSchema]);

  const getOnboardingStatusWithRetry = async (attempt = 1) => {
    try {
      const res = await triggerGetOnboardingStatus().unwrap();
      return res;
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      if (status === 403 && attempt < 2) {
        await new Promise((r) => setTimeout(r, 300));
        return getOnboardingStatusWithRetry(attempt + 1);
      }
      throw err;
    }
  };

  const redirectClient = async () => {
    const onboardingComplete = await getOnboardingStatusWithRetry();

    if (onboardingComplete.onboarding_filled) {
      if (coachInviteToken)
        await acceptCoachInvite({ token: coachInviteToken }).unwrap();
      navigate("/library");
      return;
    }

    const userInfo = await triggerGetOnboardClient().unwrap();
    dispatch(setFromUserInfo(userInfo));

    const clientData = mapOnboardClientToFormState(userInfo);
    const issue = findIncompleteClientField(clientData);

    if (coachInviteToken)
      await acceptCoachInvite({ token: coachInviteToken }).unwrap();

    if (issue) {
      navigate("/library", { state: { incomplete: true } });
    } else {
      navigate("/library");
    }
  };

  const redirectCoach = async () => {
    const onboardingComplete = await getOnboardingStatusWithRetry();
    if (onboardingComplete.onboarding_filled) {
      navigate("/content-manager/create");
      return;
    }

    const coach = await triggerGetOnboardingUser().unwrap();
    const coachData = mapUserToCoachOnboarding(coach);
    dispatch(setCoachOnboardingData(coachData));

    const issue = findFirstIncompleteStep(coachData);
    if (issue)
      navigate("/content-manager/create", {
        state: { incompleteRoute: issue.route },
      });
    else navigate("/content-manager/create");
  };

  const handlePasswordLogin = async (e: FormEvent) => {
    e.preventDefault();

    const parsedData = loginSchema.safeParse(formData);
    if (!parsedData.success) {
      const errors = parsedData.error.errors;
      setLoginError(errors.find((e) => e.path[0] === "email")?.message ?? "");
      setPasswordError(
        errors.find((e) => e.path[0] === "password")?.message ?? ""
      );
      return;
    }

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(setCredentials(response));
      toast({ title: "Login successful", description: "Welcome back!" });

      if (response.user.roleName === "Client") {
        await redirectClient();
        return;
      }

      if (response.user.roleName === "Practitioner") {
        await redirectCoach();
        return;
      }

      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      const message =
        error?.data?.message ||
        error.message ||
        "Invalid email or password. Please try again.";
      setLoginError(message);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: message,
      });
    }
  };

  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.email) {
      setLoginError("Please enter your email.");
      return;
    }

    try {
      await requestPasswordlessLogin({ email: formData.email }).unwrap();
      setIsCodeSent(true);
      toast({
        title: "Code sent",
        description: "Check your email for the verification code.",
      });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Failed to send code",
        description: err?.data?.message || "Please try again.",
      });
    }
  };

  const handleVerifyCode = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.code) {
      setCodeError("Please enter your code.");
      return;
    }

    try {
      const response = await verifyPasswordlessLogin({
        email: clientEmail ? clientEmail : formData.email,
        code: formData.code,
      }).unwrap();

      dispatch(setCredentials(response));
      toast({ title: "Login successful", description: "Welcome back!" });

      if (response.user.roleName === "Client") {
        await redirectClient();
        return;
      }

      if (response.user.roleName === "Coach") {
        await redirectCoach();
        return;
      }

      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath, { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      const message = error?.data?.message || error.message || "Invalid code";
      setCodeError(message);
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: message,
      });
    }
  };

  const handleRequestInvite = async () => {
    try {
      if (!formData.email) {
        toast({
          variant: "destructive",
          title: "Missing email",
          description: "Please enter your email before requesting an invite.",
        });
        return;
      }

      await requestNewInvite({ email: formData.email }).unwrap();
      toast({
        title: "Invite Requested",
        description: "We've sent your invite request successfully.",
      });

      navigate("/verify-email", { state: { isInvitedClient: true } });
    } catch (error: any) {
      const msg =
        error?.data?.message ||
        error.message ||
        "Failed to send invite request.";
      toast({
        variant: "destructive",
        title: "Request Failed",
        description: msg,
      });
    }
  };

  return (
    <div className="flex flex-col w-full h-screen xl:flex-row">
      <div className="w-full xl:max-w-[665px] h-[150px] xl:h-full bg-[#1C63DB] flex justify-center items-center xl:px-6 xl:px-[76.5px]">
        <aside className="py-[10px] px-[95px] xl:p-[40px] flex items-center justify-center flex-col">
          <h1 className="text-white text-center text-[44.444px] xl:text-[96px] font-bold">
            Tolu AI
          </h1>
          <h3 className="capitalize text-white text-center text-[14px] md:text-[15px] xl:text-[32px] font-semibold xl:font-medium">
            Knowledge Before Care
          </h3>
        </aside>
      </div>

      <div className="flex justify-center flex-1 w-full h-full bg-white xl:items-center">
        <form
          className="w-full md:w-[550px] flex flex-col mt-[44px] md:mt-[121px] xl:mt-0 py-[24px] px-[16px] md:p-0 xl:items-center gap-[40px] xl:gap-[60px]"
          onSubmit={
            loginMode === "2fa"
              ? isCodeSent
                ? handleVerifyCode
                : handleSendCode
              : handlePasswordLogin
          }
        >
          {isCodeSent ? (
            <div className="flex flex-col self-stretch gap-[16px] mt-auto md:mt-0">
              <div className="flex flex-col items-center justify-center gap-[14px]">
                <img src="/logo.png" className="w-[60px] h-[60px]" />
                <h1 className="text-center self-stretch text-black  text-[28px] md:text-[40px] font-semibold">
                  Check your inbox
                </h1>
              </div>
              <h3 className="text-center self-stretch text-black  text-[16px] md:text-[24px] font-normal">
                We&apos;ve sent you a 6-digit code to{" "}
                <span className="font-semibold">
                  {clientEmail ? clientEmail : formData.email}
                </span>
                .
                <br /> Please enter the code below.
              </h3>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-[14px]">
              <img src="/logo.png" className="w-[60px] h-[60px]" />
              <h3 className="text-black text-center font-semibold text-[28px] md:text-[40px]">
                {loginMode === "2fa" ? "Log In with Code" : "Log In"}
              </h3>
            </div>
          )}

          <main className="flex flex-col gap-[24px] items-start self-stretch">
            {!isCodeSent && (
              <div className="flex flex-col items-start gap-[4px] w-full">
                <label className="text-[#5f5f65] text-[16px] font-semibold ">
                  Email
                </label>
                <Input
                  type="text"
                  placeholder="Enter Email"
                  name="email"
                  value={formData.email}
                  onChange={formDataChangeHandler}
                  className={`px-[16px] py-[11px] h-[44px] rounded-[8px] w-full ${
                    loginError
                      ? "border border-[#FF1F0F]"
                      : "border border-[#DFDFDF]"
                  }`}
                />
                {loginError && (
                  <p className="text-[#FF1F0F] text-[14px]">{loginError}</p>
                )}
              </div>
            )}

            {loginMode === "password" && !isInvitedClient && (
              <div className="flex flex-col items-start gap-[4px] w-full">
                <label className="text-[#5f5f65] text-[16px] font-semibold ">
                  Password
                </label>
                <div className="relative flex flex-row-reverse items-center w-full">
                  <Input
                    type={showPassword ? "password" : "text"}
                    placeholder="Enter Password"
                    name="password"
                    onChange={formDataChangeHandler}
                    className={`w-full px-[16px] py-[11px] h-[44px] rounded-[8px] ${
                      passwordError
                        ? "border border-[#FF1F0F]"
                        : "border border-[#DFDFDF] focus:border-[#1C63DB]"
                    }`}
                  />
                  {formData.password && (
                    <button
                      type="button"
                      className="absolute right-4"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <MaterialIcon
                        iconName={
                          showPassword ? "visibility_off" : "visibility"
                        }
                        size={16}
                      />
                    </button>
                  )}
                </div>
                {passwordError && (
                  <p className="text-[#FF1F0F] text-[14px]">{passwordError}</p>
                )}
              </div>
            )}

            {loginMode === "2fa" && isCodeSent && (
              <div className="flex flex-col items-center w-full gap-[12px]">
                <label className="text-[#5f5f65] text-[16px] font-semibold">
                  Verification Code
                </label>

                <div className="flex justify-between w-full max-w-[320px] gap-[8px]">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      inputMode="text"
                      pattern="[A-Za-z0-9]"
                      className="w-[44px] h-[56px] text-[24px] font-semibold text-center border border-[#DFDFDF] rounded-[8px] focus:border-[#1C63DB] focus:outline-none"
                      value={formData.code[i] || ""}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        if (!/^[A-Za-z0-9]?$/.test(val)) return;
                        const newCode = formData.code.split("");
                        newCode[i] = val;
                        const joined = newCode.join("");
                        setFormData({ ...formData, code: joined });
                        if (val && i < 5) {
                          const next = document.getElementById(
                            `code-input-${i + 1}`
                          );
                          next?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Backspace" &&
                          !formData.code[i] &&
                          i > 0
                        ) {
                          const prev = document.getElementById(
                            `code-input-${i - 1}`
                          );
                          prev?.focus();
                        }
                      }}
                      id={`code-input-${i}`}
                    />
                  ))}
                </div>

                {codeError && (
                  <p className="text-[#FF1F0F] text-[14px] font-medium pt-[4px]">
                    {codeError}
                  </p>
                )}
              </div>
            )}

            {!isInvitedClient && (
              <Link
                to="/forgot-password"
                className="self-stretch text-[14px] text-[#5F5F65] underline hover:text-[#1C63DB]"
              >
                Forgot password
              </Link>
            )}
          </main>

          <div className="flex flex-col items-center gap-[24px] w-full">
            {isInvitedClient ? (
              <button
                className={`w-full md:w-[250px] h-[44px] p-[16px] rounded-full flex items-center justify-center text-[16px] font-semibold ${
                  formData.email && !loginError
                    ? "bg-[#1C63DB] text-white"
                    : "bg-[#D5DAE2] text-[#5F5F65]"
                }`}
                onClick={handleRequestInvite}
              >
                Request invite
              </button>
            ) : (
              <button
                type="submit"
                className={`w-full md:w-[250px] h-[44px] p-[16px] rounded-full flex items-center justify-center text-[16px] font-semibold ${
                  (!isCodeSent && formData.email) ||
                  (isCodeSent && formData.code)
                    ? "bg-[#1C63DB] text-white"
                    : "bg-[#D5DAE2] text-[#5F5F65]"
                }`}
              >
                {loginMode === "2fa"
                  ? isCodeSent
                    ? "Verify Code"
                    : "Send Code"
                  : "Log In"}
              </button>
            )}

            {!isInvitedClient && (
              <p
                className="text-[#1C63DB] text-[14px] cursor-pointer"
                onClick={() => {
                  setLoginMode(loginMode === "password" ? "2fa" : "password");
                  setIsCodeSent(false);
                }}
              >
                {loginMode === "password"
                  ? "Use 2FA Email Login Instead"
                  : "Use Password Login Instead"}
              </p>
            )}

            <p className="text-black text-[14px] font-medium">
              Don’t have an account yet?{" "}
              <Link to="/register" className="underline text-[#1C63DB]">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

import {
  useAcceptCoachInviteMutation,
  useRequestNewInviteMutation,
} from "entities/client";
import {
  setCredentials,
  useLoginMutation,
  useRequestPasswordlessLoginMutation,
  useVerifyPasswordlessLoginMutation,
  useLazyGetOnboardingStatusQuery,
  useLazyGetOnboardingUserQuery,
  setUserId,
} from "entities/user";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { toast } from "shared/lib/hooks/use-toast";
import { Button, Input } from "shared/ui";
import { z } from "zod";
import { setCoachOnboardingData } from "entities/store/coachOnboardingSlice";
import { findFirstIncompleteStep } from "widgets/OnboardingPractitioner/onboarding-finish/helpers";
import { mapUserToCoachOnboarding } from "widgets/OnboardingPractitioner/select-type/helpers";
import { usePageWidth } from "shared/lib";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "shared/ui/input-otp";
import { useLazyGetUserProfileQuery } from "entities/user";

export const LoginForm = () => {
  const [login, { isLoading: isPasswordLoginLoading }] = useLoginMutation();
  const [requestPasswordlessLogin, { isLoading: isRequestingCode }] =
    useRequestPasswordlessLoginMutation();
  const [verifyPasswordlessLogin, { isLoading: isVerifyingCode }] =
    useVerifyPasswordlessLoginMutation();
  const [acceptCoachInvite] = useAcceptCoachInviteMutation();
  const [requestNewInvite] = useRequestNewInviteMutation();

  const [triggerGetOnboardingStatus] = useLazyGetOnboardingStatusQuery();
  const [triggerGetOnboardingUser] = useLazyGetOnboardingUserQuery();
  const [getUserProfile] = useLazyGetUserProfileQuery();

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
  const { isMobileOrTablet } = usePageWidth();

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
    if (coachInviteToken) {
      await acceptCoachInvite({ token: coachInviteToken }).unwrap();
      navigate("/library");
      return;
    }

    navigate("/library");
  };

  const redirectCoach = async () => {
    const onboardingComplete = await getOnboardingStatusWithRetry();
    if (onboardingComplete.data.onboarding_filled) {
      if (isMobileOrTablet) {
        navigate(`/content-manager/library/new_chat_${Date.now()}`);
      } else {
        navigate("/content-manager/create");
      }
      return;
    }

    try {
      const coach = await triggerGetOnboardingUser().unwrap();
      const coachData = mapUserToCoachOnboarding(coach.data);
      dispatch(setCoachOnboardingData(coachData));

      const issue = findFirstIncompleteStep(coachData);
      if (issue) navigate(issue.route);
      else navigate("/content-manager/create");
    } catch (err: any) {
      const detail = err?.data?.detail;
      console.error(err)
      if (
        err?.status === 400 &&
        typeof detail === "string" &&
        detail.includes("No onboarding profile found")
      ) {
        navigate("/content-manager/create", {
          state: { incompleteRoute: "/select-type" },
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failed to load onboarding data",
          description: detail || "An unexpected error occurred.",
        });
      }
    }
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

      dispatch(setCredentials(response.data));

      try {
        const profile = await getUserProfile().unwrap();

        dispatch(setUserId(profile.data.id));
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }

      toast({ title: "Login successful", description: "Welcome back!" });

      if (response.data.user.roleName === "Client") {
        await redirectClient();
        return;
      }

      if (response.data.user.roleName === "Practitioner") {
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

      dispatch(setCredentials(response.data));
      toast({ title: "Login successful", description: "Welcome back!" });

      if (response.data.user.roleName === "Client") {
        await redirectClient();
        return;
      }

      if (response.data.user.roleName === "Coach") {
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
                <h1 className="text-center self-stretch text-black text-[28px] md:text-[40px] font-semibold">
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
                  className={`px-[16px] py-[11px] h-[44px] rounded-[8px] w-full ${loginError
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
                    className={`w-full px-[16px] py-[11px] h-[44px] rounded-[8px] ${passwordError
                      ? "border border-[#FF1F0F]"
                      : "border border-[#DFDFDF]"
                      }`}
                  />
                  {formData.password && (
                    <Button
                      variant={"unstyled"}
                      size={"unstyled"}
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
                    </Button>
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

                <InputOTP
                  maxLength={6}
                  value={formData.code}
                  onChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      code: value.toUpperCase(),
                    }));
                  }}
                  containerClassName="w-full flex justify-center"
                >
                  <InputOTPGroup className="gap-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-[44px] h-[56px] text-[24px] font-semibold border border-[#DFDFDF] rounded-[8px] bg-white focus-within:border-[#1C63DB] focus-within:ring-0"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>

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
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                className={`w-full md:w-[250px] h-[44px] p-[16px] rounded-full flex items-center justify-center text-[16px] font-semibold ${formData.email && !loginError
                  ? "bg-[#1C63DB] text-white"
                  : "bg-[#D5DAE2] text-[#5F5F65]"
                  }`}
                onClick={handleRequestInvite}
              >
                Request invite
              </Button>
            ) : (
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                type="submit"
                disabled={
                  (loginMode === "2fa" &&
                    !isCodeSent &&
                    (!formData.email || isRequestingCode)) ||
                  (loginMode === "2fa" &&
                    isCodeSent &&
                    (!formData.code ||
                      formData.code.length < 6 ||
                      isVerifyingCode)) ||
                  (loginMode === "password" &&
                    (!formData.email ||
                      !formData.password ||
                      isPasswordLoginLoading))
                }
                className={`w-full md:w-[250px] h-[44px] p-[16px] rounded-full flex items-center justify-center text-[16px] font-semibold ${(loginMode === "2fa" &&
                    !isCodeSent &&
                    formData.email &&
                    !isRequestingCode) ||
                    (loginMode === "2fa" &&
                      isCodeSent &&
                      formData.code &&
                      formData.code.length >= 6 &&
                      !isVerifyingCode) ||
                    (loginMode === "password" &&
                      formData.email &&
                      formData.password &&
                      !isPasswordLoginLoading)
                    ? "bg-[#1C63DB] text-white"
                    : "bg-[#D5DAE2] text-[#5F5F65]"
                  }`}
              >
                {loginMode === "2fa"
                  ? isCodeSent
                    ? isVerifyingCode
                      ? "Verifying..."
                      : "Verify Code"
                    : isRequestingCode
                      ? "Sending..."
                      : "Send Code"
                  : isPasswordLoginLoading
                    ? "Logging in..."
                    : "Log In"}
              </Button>
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

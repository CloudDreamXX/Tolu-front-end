import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "shared/lib/hooks/use-toast";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { setCredentials, UserService } from "entities/user";
import { Input } from "shared/ui";
import { ClientService } from "entities/client";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { setFromUserInfo } from "entities/store/clientOnboardingSlice";
import { mapOnboardClientToFormState } from "entities/store/helpers";
import { setCoachOnboardingData } from "entities/store/coachOnboardingSlice";
import { findFirstIncompleteClientStep } from "widgets/OnboardingClient/DemographicStep/helpers";
import { mapUserToCoachOnboarding } from "widgets/OnboardingPractitioner/select-type/helpers";
import { findFirstIncompleteStep } from "widgets/OnboardingPractitioner/onboarding-finish/helpers";

export const LoginForm = () => {
  const loginSchema = z.object({
    email: z.string().email("The email format is incorrect."),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isInvitedClient = location.state?.isInvitedClient === true || null;
  const coachInviteToken = location.state?.coachInviteToken;
  const redirectPath = localStorage.getItem("redirectAfterLogin");

  const formDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginError("");
    setPasswordError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  useEffect(() => {
    localStorage.clear();
    localStorage.removeItem("persist:user");
    localStorage.removeItem("persist:clientMood");
  }, [loginSchema]);

  const getOnboardingStatusWithRetry = async (attempt = 1) => {
    try {
      return await UserService.getOnboardingStatus();
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      if (status === 403 && attempt < 2) {
        await sleep(300);
        return getOnboardingStatusWithRetry(attempt + 1);
      }
      throw err;
    }
  };

  const redirectClient = async () => {
    const onboardingComplete = await getOnboardingStatusWithRetry();
    if (onboardingComplete.onboarding_filled) {
      if (coachInviteToken) {
        await ClientService.acceptCoachInvite({ token: coachInviteToken });
      }
      navigate("/library");
      return;
    }
    const userInfo = await UserService.getOnboardClient();
    const clientData = mapOnboardClientToFormState(userInfo);
    dispatch(setFromUserInfo(userInfo));
    const issue = findFirstIncompleteClientStep(clientData);
    if (issue) {
      if (coachInviteToken) {
        await ClientService.acceptCoachInvite({ token: coachInviteToken });
      }
      navigate(issue.route);
    } else {
      if (coachInviteToken) {
        await ClientService.acceptCoachInvite({ token: coachInviteToken });
      }
      navigate("/library");
    }
  };

  const redirectCoach = async () => {
    const onboardingComplete = await getOnboardingStatusWithRetry();
    if (onboardingComplete.onboarding_filled) {
      navigate("/content-manager/create");
      return;
    }
    const coach = await UserService.getOnboardingUser();
    const coachData = mapUserToCoachOnboarding(coach);
    dispatch(setCoachOnboardingData(coachData));
    const issue = findFirstIncompleteStep(coachData);
    if (issue) {
      navigate(issue.route);
    } else {
      navigate("/content-manager/create");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
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
      const response = await UserService.login(formData);
      if (!response) throw new Error("No response from server");

      if (response.accessToken && response.user) {
        dispatch(
          setCredentials({
            user: response.user,
            accessToken: response.accessToken,
          })
        );
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
          return;
        } else {
          navigate("/", { replace: true });
        }
      } else {
        throw new Error("Invalid server response format");
      }
    } catch (error: any) {
      console.error(error);
      const message =
        error?.response?.data?.message ||
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

      await ClientService.requestNewInvite({ email: formData.email });
      await ClientService.requestNewInvite({ email: formData.email });

      toast({
        title: "Invite Requested",
        description: "We've sent your invite request successfully.",
      });

      navigate("/verify-email", { state: { isInvitedClient: true } });
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
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
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col items-center gap-[14px]">
            <img src="/logo.png" className="w-[60px] h-[60px]" />
            <h3 className="text-black text-center font-semibold text-[28px] md:text-[40px]">
              Log In
            </h3>
          </div>

          <main className="flex flex-col gap-[24px] items-start self-stretch">
            {/* Email */}
            <div className="flex flex-col items-start gap-[4px] w-full">
              <label className="text-[#5f5f65] text-[16px] font-semibold ">
                Email
              </label>
              <Input
                type="text"
                placeholder="Enter Email"
                name="email"
                onChange={formDataChangeHandler}
                className={`px-[16px] py-[11px] h-[44px] rounded-[8px] bg-white outline-none focus-visible:outline-none w-full ${
                  loginError
                    ? "border border-[#FF1F0F]"
                    : "border border-[#DFDFDF] focus:border-[#1C63DB]"
                }`}
              />
              {loginError && (
                <p className="text-[#FF1F0F] text-[14px] font-medium px-[4px] pt-[4px]">
                  {loginError.includes("not in our system") ? (
                    <>
                      The email address is not in our system, please{" "}
                      <Link
                        to="/register"
                        className="underline text-[#FF1F0F] hover:text-[#e11d48]"
                      >
                        create an account
                      </Link>{" "}
                      to log in
                    </>
                  ) : (
                    loginError
                  )}
                </p>
              )}
            </div>

            {/* Password */}
            {!isInvitedClient && (
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
                    className={`w-full px-[16px] py-[11px] h-[44px] rounded-[8px] bg-white outline-none focus-visible:outline-none ${
                      passwordError
                        ? "border border-[#FF1F0F]"
                        : "border border-[#DFDFDF] focus:border-[#1C63DB]"
                    }`}
                  />
                  {formData.password.length > 0 && (
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
                  <p className="text-[#FF1F0F] text-[14px] font-medium px-[4px] pt-[4px]">
                    {passwordError}
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

          <div className="flex flex-col items-center gap-[24px] w-full mt-auto md:mt-0">
            <div className="flex flex-col gap-[8px]">
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
                    formData.email &&
                    formData.password &&
                    !passwordError &&
                    !loginError
                      ? "bg-[#1C63DB] text-white"
                      : "bg-[#D5DAE2] text-[#5F5F65]"
                  }`}
                >
                  Log In
                </button>
              )}
            </div>
            <p className="text-black text-[14px] font-medium">
              Don&apos;t have an account yet?{" "}
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

import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "shared/lib/hooks/use-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { setCredentials, UserService } from "entities/user";
import { EyeClosed, EyeIcon } from "lucide-react";
import { Input } from "shared/ui";

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

  const formDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginError("");
    setPasswordError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      if (!response) {
        throw new Error("No response from server");
      }

      if (response.accessToken && response.user) {
        dispatch(
          setCredentials({
            user: response.user,
            accessToken: response.accessToken,
          })
        );
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate("/", { replace: true });
      } else {
        throw new Error("Invalid server response format");
      }
    } catch (error: any) {
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

  return (
    <div className="w-full h-screen flex items-start py-0">
      {/* Left side */}
      <div className="w-full max-w-[665px] h-full flex px-[76.5px] flex-col justify-center items-center bg-[#1C63DB]">
        <aside className="p-[40px] flex items-center justify-center flex-col">
          <h1 className="text-white font-open text-center text-[96px] font-bold">
            TOLU
          </h1>
          <h3 className="capitalize font-open text-white text-center text-[32px] font-medium">
            THE HOLISTIC MENOPAUSE HEALTH ASSISTANT
          </h3>
        </aside>
      </div>

      {/* Right side */}
      <div className="w-full h-full flex justify-center items-center flex-1 bg-white">
        <form
          className="w-[550px] flex flex-col items-center gap-[60px]"
          onSubmit={handleSubmit}
        >
          <h3 className="text-black text-center font-inter font-semibold text-[40px]">
            Log In
          </h3>

          {/* Form content */}
          <main className="flex flex-col gap-[24px] items-start self-stretch">
            {/* Email */}
            <div className="flex flex-col items-start gap-[4px] w-full">
              <label className="text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
                Email
              </label>
              <Input
                type="text"
                placeholder="Enter Email"
                name="email"
                onChange={formDataChangeHandler}
                className={`px-[16px] py-[11px] h-[44px] rounded-[8px] bg-white outline-none focus-visible:outline-none focus:duration-300 focus:ease-in w-full ${
                  loginError
                    ? "border border-[#FF1F0F] focus:border-[#FF1F0F]"
                    : "border border-[#DFDFDF] focus:border-[#1C63DB]"
                }`}
              />
              {loginError && (
                <p className="text-[#FF1F0F] font-[Nunito] text-[14px] font-medium px-[4px] pt-[4px]">
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
            <div className="flex flex-col items-start gap-[4px] w-full">
              <label className="text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
                Password
              </label>
              <div className="flex flex-row-reverse items-center w-full relative">
                <Input
                  type={showPassword ? "password" : "text"}
                  placeholder="Enter Password"
                  name="password"
                  onChange={formDataChangeHandler}
                  className={`w-full px-[16px] py-[11px] h-[44px] rounded-[8px] bg-white outline-none focus-visible:outline-none focus:duration-300 focus:ease-in ${
                    passwordError
                      ? "border border-[#FF1F0F] focus:border-[#FF1F0F]"
                      : "border border-[#DFDFDF] focus:border-[#1C63DB]"
                  }`}
                />
                {formData.password.length > 0 && (
                  <button
                    type="button"
                    className="absolute right-4"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeClosed size={16} />
                    ) : (
                      <EyeIcon size={16} />
                    )}
                  </button>
                )}
              </div>
              {passwordError && (
                <p className="text-[#FF1F0F] font-[Nunito] text-[14px] font-medium px-[4px] pt-[4px]">
                  {passwordError}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <Link
              to="/forgot-password"
              className="self-end text-[14px] text-[#5F5F65] underline font-[Nunito] hover:text-[#1C63DB]"
            >
              Forgot password
            </Link>
          </main>

          {/* Submit + Register */}
          <div className="flex flex-col items-center gap-[24px] w-full">
            <button
              type="submit"
              className={`w-[250px] h-[44px] p-[16px] rounded-full flex items-center justify-center font-[Nunito] text-[16px] font-semibold ${
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
            <p className="text-black font-[Nunito] text-[14px] font-medium">
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

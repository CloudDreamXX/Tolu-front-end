import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { setCredentials, UserService } from "entities/user";
import { EyeClosed, EyeIcon } from "lucide-react";

export const LoginForm = () => {
  const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
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

    // Validate both email and password together
    const parsedData = loginSchema.safeParse(formData);

    if (!parsedData.success) {
      // Extract error messages
      const errors = parsedData.error.errors;
      setLoginError(errors.find(e => e.path[0] === 'email')?.message ?? "");
      setPasswordError(errors.find(e => e.path[0] === 'password')?.message ?? "");
      return;
    }

    try {
      const response = await UserService.login(formData);

      if (!response) {
        throw new Error("No response from server");
      }

      console.log("API Response:", response);

      if (response.accessToken && response.user) {
        dispatch(
          setCredentials({
            user: response.user,
            accessToken: response.accessToken,
          })
        );
      } else {
        console.error("Invalid response structure:", response);
        throw new Error("Invalid server response format");
      }

      toast.success("Login Successful");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error instanceof Error ? error.message : "Login Failed");
    }
  };

  return (
    <div className="w-full h-screen flex items-start py-0">
      <div className="w-[665px] h-full flex px-[76.5px] py-0 flex-col justify-center items-center self-center bg-[#1C63DB]">
        <aside className="p-[40px] flex items-center justify-center flex-col">
          <h1 className="text-white text-center text-[96px] font-bold">VITAI</h1>
          <h3 className="text-white text-center text-[32px] font-medium">The Holistic Health Assistant</h3>
        </aside>
      </div>
      <div className="w-full h-full flex justify-center items-center self-stretch flex-1 bg-[linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), #FFF]">
        <form className="w-[550px] flex flex-col items-center gap-[60px]" onSubmit={handleSubmit}>
          <h3 className="text-black text-center font-[Inter] font-semibold text-[40px]">Log In</h3>
          <main className="flex flex-col gap-[24px] items-start self-stretch">
            <div className="flex flex-col items-start gap-[10] self-stretch">
              <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">Email</label>
              <input
                type="email"
                placeholder="Enter Email"
                name="email"
                onChange={formDataChangeHandler}
                className={ loginError ? "px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#FF1F0F] bg-white outline-none focus-visible:outline-none focus:duration-300 focus:ease-in" : "px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"}
              />
              <p className="text-[#FF1F0F] font-[Nunito] font-medium px-[16px] flex items-center justify-center gap-[10px]">{loginError}</p>
            </div>
            <div className="flex flex-col items-start gap-[10] self-stretch">
              <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">Password</label>
              <div className="flex flex-row-reverse items-center w-full">
              <input
                type={showPassword ? "password" : "text"}
                placeholder="Enter Password"
                name="password"
                onChange={formDataChangeHandler}
                className={passwordError ? "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#FF1F0F] bg-white outline-none focus-visible:outline-none focus:duration-300 focus:ease-in" : "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"}
                />
                {formData.password.length > 0 && (
                  <button type="button" className="absolute mr-2" onClick={() => setShowPassword(!showPassword)}> 
                    {!showPassword ? <EyeIcon size={16}/> : <EyeClosed size={16}/>}
                  </button>
                )}
                </div>
              <p className="text-[#FF1F0F] font-[Nunito] font-medium px-[16px] flex items-center justify-center gap-[10px]">{passwordError}</p>
            </div>
            <Link type="button" to="/forgot-password" className="flex p-[4px] justify-end items-center gap-[12px] hover:text-[#1C63DB] text-[#5F5F65] text-[14px] font-normal font-[Nunito] underline">Forgot password</Link>
          </main>
          <div className="flex flex-col items-center gap-[24px] slef-stretch">
            <button type="submit" className={ formData.email.length > 1 && formData.password.length > 1 && !passwordError && !loginError ? "flex w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#1C63DB] text-white font-[Nunito] text-[16px] font-semibold" : "flex w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#D5DAE2] text-[#5F5F65] font-[Nunito] text-[16px] font-semibold"}>Log In</button>
            <p className="text-black font-[Nunito] text-[14px] font-medium">Don't have an account yet? <Link to='/register' className="underline text-[#1C63DB] ">Sign up</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

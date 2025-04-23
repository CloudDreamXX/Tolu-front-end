import { ChangeEvent, FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "shared/ui/_deprecated";
import { setCredentials, UserService } from "entities/user";

export const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
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
    <div className="flex w-full h-screen lg:h-[500px] items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-transparent w-full max-w-3xl p-8 shadow-md backdrop-blur-[20px] border-2 border-primary/10 rounded-[20px] mt-6 space-y-6 gap-4"
      >
        <div className="text-center">
          <h5 className="text-xl md:text-[32px] text-primary font-extrabold leading-none">
            Login
          </h5>
        </div>
        <Input
          type="email"
          label="Email"
          placeholder="Email"
          name="email"
          onChange={formDataChangeHandler}
        />
        <Input
          type="password"
          label="Password"
          placeholder="Password"
          name="password"
          onChange={formDataChangeHandler}
        />
        <div className="flex items-center justify-between w-full">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            ></input>
            <span className="text-gray-700">Remember Me</span>
          </label>
        </div>
        <section className="flex justify-end w-full">
          <a href="/forgot" className="text-blue-600 hover:underline">
            Forgot Password?
          </a>
        </section>
        <Button
          text="Login"
          type="submit"
          width="w-full"
          className="bg-gray-300"
        />
      </form>
    </div>
  );
};

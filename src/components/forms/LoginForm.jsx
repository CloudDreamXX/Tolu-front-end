import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../redux/apis/apiSlice";
import { setCredentials, setUser } from "../../redux/slice/authSlice";
import Button from "../small/Button";
import Input from "../small/Input";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const formDataChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
  
      dispatch(setCredentials(response));
  
      const email = response.user?.email;
      const userType = {
        role: email === "admin@example.com" 
          ? "admin" 
          : email === "test@example.com"
          ? "coaches"
          : "user",
      };
  
      dispatch(setUser({ email }));
      localStorage.setItem("userType", JSON.stringify(userType));
  
      toast.success("Login Successful");
  
      // Redirect based on user role
      navigate(
        userType.role === "admin" 
          ? "/admin"
          : userType.role === "coaches"
          ? "/coaches"
          : "/user"
      );
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login Failed");
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
        <div class="flex items-center justify-between  w-full">
          <label class="flex items-center space-x-2">
            <input type="checkbox" className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"></input>
            <span class="text-gray-700">Remember Me</span>
          </label>
        </div>
        <section className="flex w-full justify-end">
          <a href="#" class="text-blue-600 hover:underline">Forgot Password?</a>
        </section>
        <Button text="Login" type="submit" width="w-full" />
      </form>
    </div>
  );
};

export default LoginForm;

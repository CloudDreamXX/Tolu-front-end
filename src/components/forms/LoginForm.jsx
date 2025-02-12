import { useState } from "react";
import Input from "../small/Input";
import Button from "../small/Button";
import { useLoginMutation } from "../../redux/apis/apiSlice";
import { setCredentials } from "../../redux/slice/authSlice";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate, useRoutes } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const [login] = useLoginMutation();
  // const router = useRoutes();
  const navigate = useNavigate();
  const formDataChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData).unwrap();
      dispatch(setCredentials(response)); // Store user & token in Redux
      toast.success("Login Successful");
      //   router.push("/user")
      navigate("/user"); // Redirect to /user page

    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Login Failed");
    }
  };

  return (
    <div className="flex w-full h-screen lg:h-[500px]  items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="bg-transparent w-full max-w-3xl  p-4 shadow-md backdrop-blur-[20px]  border-2 border-primary/10 rounded-[20px] mt-6 space-y-6  gap-4"
      >
        <div className="text-center">
          <h5 className="text-xl md:text-[32px] bg-gradientText text-transparent bg-clip-text font-extrabold leading-none">
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
        <Button  text="Login" type="submit" width="w-full" />
      </form>
    </div>

  );
};

export default LoginForm;

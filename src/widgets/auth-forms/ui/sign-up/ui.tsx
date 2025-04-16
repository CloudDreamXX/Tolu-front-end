import { useState, ChangeEvent, FormEvent } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserType, navigateByUserType, signupFormFields } from "../../lib";
import { Button, Input, SingUpModal1 } from "shared/ui/_deprecated";
import { setCredentials, setUser, UserService } from "entities/user";

export const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });
  const [selectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verifyEmail] = useState(true);
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    setConfirmPasswordError("");

    try {
      const userData = {
        ...formData,
        priority: ["High"],
        num_clients: "3",
        role: "user",
        location: "location",
      };

      const response = await UserService.signUp(userData);
      dispatch(setCredentials(response));

      const email = response.user?.email;
      const userType = getUserType(email);

      dispatch(setUser({ email }));
      localStorage.setItem("userType", JSON.stringify(userType));
      toast.success("SignUp Successful");
      navigateByUserType(navigate, userType.role);
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error(error instanceof Error ? error.message : "Login Failed");
    }
  };

  return (
    <>
      {isModalOpen && (
        <SingUpModal1
          isModalOpen={isModalOpen}
          selectedCategories={selectedCategories}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <form
        onSubmit={handleSubmit}
        className="bg-transparent w-full max-w-3xl p-8 shadow-md backdrop-blur-[20px] border-2 border-primary/10 rounded-[20px] mt-6 space-y-6 gap-4"
      >
        <div className="flex justify-center lg:col-span-12">
          <h5 className="text-xl md:text-[32px] text-primary font-extrabold leading-none">
            Sign up
          </h5>
        </div>
        {signupFormFields.map(({ name, label, type }) => (
          <div key={name} className="lg:col-span-12">
            <Input
              label={label}
              placeholder={label}
              name={name}
              type={type}
              onChange={formDataChangeHandler}
            />
            {name === "confirmPassword" && confirmPasswordError && (
              <p className="text-sm text-red-500">{confirmPasswordError}</p>
            )}
          </div>
        ))}
        <div
          className={`lg:col-span-12 ${verifyEmail ? "opacity-50" : "opacity-100"}`}
        >
          <Button text="Sign Up" type="submit" width="w-full " />
        </div>
      </form>
    </>
  );
};

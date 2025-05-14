import { ChangeEvent, FormEvent, useState } from "react";
import { SelectType, SignUp } from "./components";
import { UserService } from "entities/user";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setRoleID } from "entities/user";

export const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    accountType: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    newPassword: "",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const dataBE = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone,
      password: formData.password,
      dob: "2025-05-13",
      roleID: formData.accountType === "client" ? 3 : 2,
    }
    setRoleID(formData.accountType === "client" ? 3 : 2);
    try {
      console.log("Registering user with data:", dataBE);
      const data = await UserService.registerUser(dataBE);
      console.log("User registered successfully", data);
      if(data.success && dataBE.roleID === 3) {
        navigate('/verify-email');
      }
    }
    catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleCardClick = (user: string) => {
    setFormData((prev) => ({ ...prev, accountType: user }));
  }

  const formDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        {formData.accountType.length > 1 ? (
        <SignUp formData={formData} handleSubmit={handleSubmit} formDataChangeHandler={formDataChangeHandler}/>
        ) : (
         <SelectType formData={formData} handleCardClick={handleCardClick}/>
        )}
      </div>
    </div>
  );
};
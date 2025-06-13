import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { SelectType, SignUp } from "./components";
import { UserService, setRoleID } from "entities/user";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "shared/lib/hooks/use-toast";
import { ClientService } from "entities/client";

export const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    accountType: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    newPassword: "",
  });
  const { token } = useParams();

  useEffect(() => {
    const fetchInviteDetails = async () => {
      if (!token) return;

      try {
        const data = await ClientService.getInvitationDetails(token);
        setFormData((prev) => ({
          ...prev,
          name: data.client.full_name || "",
          email: data.client.email || "",
          phone: data.client.phone_number || "",
          accountType: "client",
        }));
      } catch (error) {
        console.error("Failed to fetch invitation details", error);
        toast({
          title: "Invalid or expired invitation",
          description: "Please check your invite link or request a new one.",
          variant: "destructive",
        });
        navigate("/auth");
      }
    };

    fetchInviteDetails();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const dataBE = {
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone,
      password: formData.password,
      dob: "2025-05-13",
      roleID: formData.accountType === "client" ? 3 : 2,
    };
    setRoleID(formData.accountType === "client" ? 3 : 2);
    try {
      const data = await UserService.registerUser(dataBE);
      if (data.success) {
        if (token) {
          try {
            await ClientService.acceptCoachInvite({ token });
          } catch (err) {
            console.warn("Coach link acceptance failed", err);
          }
        }

        toast({
          title: "Register successful",
          description: "Welcome!",
        });
        navigate("/verify-email");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      toast({
        title: "Email already exists",
        description: "Please use your email to log in, or use another email.",
        variant: "destructive",
      });
    }
  };

  const handleCardClick = (user: string) => {
    setFormData((prev) => ({ ...prev, accountType: user }));
  };

  const formDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex flex-col w-full h-screen xl:flex-row">
      <div className="w-full xl:max-w-[550px] 2xl:max-w-[665px] h-[150px] xl:h-full bg-[#1C63DB] flex justify-center items-center xl:px-6 xl:px-[76.5px]">
        <aside className="py-[10px] px-[95px] xl:p-[40px] flex items-center justify-center flex-col">
          <h1 className="text-white font-open text-center text-[44.444px] xl:text-[96px] font-bold">
            TOLU
          </h1>
          <h3 className="capitalize font-open text-white text-center text-[14px] md:text-[15px] xl:text-[32px] font-semibold xl:font-medium">
            THE HOLISTIC MENOPAUSE HEALTH ASSISTANT
          </h3>
        </aside>
      </div>
      <div className="w-full md:h-full px-[16px] py-[24px] mt-[40px] md:p-0 md:mt-[63px] flex justify-center items-center self-stretch flex-1 bg-[linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), #FFF]">
        {formData.accountType.length > 1 ? (
          <SignUp
            formData={formData}
            handleSubmit={handleSubmit}
            formDataChangeHandler={formDataChangeHandler}
          />
        ) : (
          <SelectType formData={formData} handleCardClick={handleCardClick} />
        )}
      </div>
    </div>
  );
};

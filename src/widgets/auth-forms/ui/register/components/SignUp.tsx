import { EyeClosed, EyeIcon } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface SignUpProps {
  formData: {
    accountType: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    newPassword: string;
  };
  handleSubmit: (e: React.FormEvent) => void;
  formDataChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SignUp: React.FC<SignUpProps> = ({
  handleSubmit,
  formData,
  formDataChangeHandler,
}) => {
  const [showPassword, setShowPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const nav = useNavigate();
  const {accountType, name, email, phone, password, newPassword} = formData;

  const passwordsMatch = () => {
    if (password.length > 8 && newPassword.length > 8) {
      return password === newPassword;
    } else {
      return false;
    }
  }

  const checkComplete = () => {
    if (accountType.length > 0 && name.length > 0 && email.length > 0 && phone.length > 0 && password.length > 0 && newPassword.length > 0 && password === newPassword) {
      return true;
    } else {
      return false;
    }
  }
  return (
    <form
      autoComplete="off"
      className="w-[550px] flex flex-col items-center gap-[60px]"
      onSubmit={handleSubmit}
    >
      <h1 className="self-stretch text-black text-center font-[Inter] text-[40px] font-semibold ">
        Sign Up
      </h1>
      <section className="w-full flex flex-col items-start gap-[24px] self-stretch">
        <div className="flex flex-col items-start gap-[10] self-stretch">
          <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
            Full name
          </label>
          <input
            type="text"
            placeholder="Enter Name"
            name="name"
            onChange={formDataChangeHandler}
            className="px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
          />
        </div>
        <div className="flex flex-col items-start gap-[10] self-stretch">
          <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            onChange={formDataChangeHandler}
            className="px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
          />
        </div>
        <div className="flex flex-col items-start gap-[10] self-stretch">
          <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter Phone Number"
            name="phone"
            onChange={formDataChangeHandler}
            className="px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
          />
        </div>
        <div className="flex flex-col items-start gap-[10] self-stretch">
          <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
            Create password
          </label>
          <div className="flex flex-row-reverse items-center w-full">
            <input
              type={showPassword ? "password" : "text"}
              placeholder="Enter Password"
              name="password"
              onChange={formDataChangeHandler}
              className="w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
            />
            {formData.password.length > 0 && (
              <button
                type="button"
                className="absolute mr-2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {!showPassword ? (
                  <EyeIcon size={16} />
                ) : (
                  <EyeClosed size={16} />
                )}
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start gap-[10] self-stretch">
          <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
            Repeat password
          </label>
          <div className="flex flex-row-reverse items-center w-full">
            <input
              type={showNewPassword ? "password" : "text"}
              placeholder="Enter Password"
              name="newPassword"
              onChange={formDataChangeHandler}
              className={!passwordsMatch() ? "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#FF1F0F] bg-white outline-none focus-visible:outline-none" : "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"}
            />
            {formData.password.length > 0 && (
                <button
                type="button"
                className="absolute mr-2"
                onClick={() => setShowNewPassword(!showNewPassword)}
                >
                {!showNewPassword ? (
                    <EyeIcon size={16} />
                ) : (
                    <EyeClosed size={16} />
                )}
              </button>
            )}
          </div>
            {!passwordsMatch() && (<p className="text-[#FF1F0F] font-[Nunito] font-medium px-[16px] flex items-center justify-center gap-[10px]">Passwords do not match</p>)}
        </div>
      </section>
      <section>
        <div className="flex flex-col items-center gap-[24px] self-stretch">
            <button type="submit" onClick={() => nav('/email-check')} className={ checkComplete() ? "flex w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#1C63DB] text-white font-[Nunito] text-[16px] font-semibold" : "flex w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#D5DAE2] text-[#5f5f65] font-[Nunito] text-[16px] font-semibold"}>
                Proceed
            </button>
            <p className="text-[14px] font-[Nunito] font-medium">Already have an account? <Link to='/auth' className="cursor-pointer text-[#1C63DB] underline">Log in</Link></p>
        </div>
      </section>
    </form>
  );
};
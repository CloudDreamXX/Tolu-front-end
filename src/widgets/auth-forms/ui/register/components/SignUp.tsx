import { EyeClosed, EyeIcon } from "lucide-react";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { Input } from "shared/ui";
import { z } from "zod";

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

const signUpSchema = z
  .object({
    accountType: z.string().min(1, "Account type is required"),
    name: z.string().min(1, "Full name is required"),
    email: z.string().email("The email format is incorrect"),
    phone: z
      .string()
      .min(10, "Phone number is too short")
      .max(15, "Phone number is too long")
      .regex(/^\d+$/, "Phone number must contain digits only"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.newPassword, {
    message: "Passwords do not match",
    path: ["newPassword"],
  });

export const SignUp: React.FC<SignUpProps> = ({
  handleSubmit,
  formData,
  formDataChangeHandler,
}) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof formData, string>>
  >({});
  const [showPassword, setShowPassword] = useState(true);
  const [showNewPassword, setShowNewPassword] = useState(true);
  const [formattedPhone, setFormattedPhone] = useState("");

  const formatPhoneNumber = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (!digits) return "";
    if (digits.length === 1) return "+" + digits;
    if (digits.length < 5) return "+" + digits[0] + " (" + digits.slice(1);
    if (digits.length < 8)
      return (
        "+" + digits[0] + " (" + digits.slice(1, 4) + ") " + digits.slice(4)
      );
    return (
      "+" +
      digits[0] +
      " (" +
      digits.slice(1, 4) +
      ") " +
      digits.slice(4, 7) +
      "-" +
      digits.slice(7, 11)
    );
  };

  useEffect(() => {
    setFormattedPhone(formatPhoneNumber(formData.phone));
  }, [formData.phone]);

  const onPhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;

    const digitsOnly = inputVal.replace(/\D/g, "");

    const syntheticEvent = {
      ...e,
      target: { ...e.target, value: digitsOnly, name: "phone" },
    } as React.ChangeEvent<HTMLInputElement>;

    formDataChangeHandler(syntheticEvent);
    clearError("phone");

    setFormattedPhone(formatPhoneNumber(digitsOnly));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = signUpSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof typeof formData, string>> = {};
      result.error.errors.forEach(({ path, message }) => {
        const key = path[0] as keyof typeof formData;
        fieldErrors[key] = message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    handleSubmit(e);
  };

  const clearError = (field: keyof typeof formData) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const isFormValid = () => {
    const valid =
      Object.values(errors).every((error) => !error) &&
      formData.accountType.length > 0 &&
      formData.name.length > 0 &&
      formData.email.length > 0 &&
      formData.phone.length > 0 &&
      formData.password.length > 0 &&
      formData.newPassword.length > 0;
    return valid;
  };

  return (
    <form
      autoComplete="off"
      className="w-[550px] flex flex-col items-center gap-[60px]"
      onSubmit={onSubmit}
    >
      <h1 className="self-stretch text-black text-center font-inter text-[40px] font-semibold ">
        Sign Up
      </h1>

      <section className="w-full flex flex-col items-start gap-[24px] self-stretch">
        <div className="flex flex-col items-start gap-[10] self-stretch">
          <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
            Full name
          </label>
          <Input
            type="text"
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={(e) => {
              formDataChangeHandler(e);
              clearError("name");
            }}
            className={
              errors.name
                ? "px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#FF1F0F] bg-white outline-none"
                : "px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
            }
          />
          {errors.name && (
            <p className="text-[#FF1F0F] font-[Nunito] font-medium px-[16px]">
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-[10] self-stretch">
          <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
            Email
          </label>
          <Input
            type="text"
            placeholder="Enter Email"
            name="email"
            value={formData.email}
            onChange={(e) => {
              formDataChangeHandler(e);
              clearError("email");
            }}
            className={
              errors.email
                ? "px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#FF1F0F] bg-white outline-none"
                : "px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
            }
          />
          {errors.email && (
            <p className="text-[#FF1F0F] font-[Nunito] font-medium px-[16px]">
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-[10] self-stretch">
          <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
            Phone number
          </label>
          <Input
            type="tel"
            placeholder="Enter Phone Number"
            name="phone"
            value={formattedPhone}
            onChange={onPhoneChange}
            className={
              errors.phone
                ? "px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#FF1F0F] bg-white outline-none"
                : "px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
            }
          />
          {errors.phone && (
            <p className="text-[#FF1F0F] font-[Nunito] font-medium px-[16px]">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="flex flex-col items-start gap-[10] self-stretch">
          <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
            Create password
          </label>
          <div className="flex flex-row-reverse items-center w-full relative">
            <Input
              type={showPassword ? "password" : "text"}
              placeholder="Enter Password"
              name="password"
              value={formData.password}
              onChange={(e) => {
                formDataChangeHandler(e);
                clearError("password");
                clearError("newPassword");
              }}
              className={
                errors.password
                  ? "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#FF1F0F] bg-white outline-none"
                  : "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
              }
            />
            <button
              type="button"
              className="absolute mr-4"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Show password" : "Hide password"}
            >
              {!showPassword ? <EyeIcon size={16} /> : <EyeClosed size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[#FF1F0F] font-[Nunito] font-medium px-[16px]">
              {errors.password}
            </p>
          )}
        </div>
        <div className="flex flex-col items-start gap-[10] self-stretch">
          <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
            Repeat password
          </label>
          <div className="flex flex-row-reverse items-center w-full relative">
            <Input
              type={showNewPassword ? "password" : "text"}
              placeholder="Enter Password"
              name="newPassword"
              value={formData.newPassword}
              onChange={(e) => {
                formDataChangeHandler(e);
                clearError("newPassword");
              }}
              className={
                errors.newPassword
                  ? "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#FF1F0F] bg-white outline-none"
                  : "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
              }
            />
            <button
              type="button"
              className="absolute mr-4"
              onClick={() => setShowNewPassword(!showNewPassword)}
              aria-label={showNewPassword ? "Show password" : "Hide password"}
            >
              {!showNewPassword ? (
                <EyeIcon size={16} />
              ) : (
                <EyeClosed size={16} />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-[#FF1F0F] font-[Nunito] font-medium px-[16px]">
              {errors.newPassword}
            </p>
          )}
        </div>
      </section>

      <section>
        <div className="flex flex-col items-center gap-[24px] self-stretch">
          <button
            type="submit"
            disabled={!isFormValid()}
            className={
              isFormValid()
                ? "flex w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#1C63DB] text-white font-[Nunito] text-[16px] font-semibold"
                : "flex w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#D5DAE2] text-[#5f5f65] font-[Nunito] text-[16px] font-semibold cursor-not-allowed"
            }
          >
            Proceed
          </button>
          <p className="text-[14px] font-[Nunito] font-medium">
            Already have an account?{" "}
            <Link
              to="/auth"
              className="cursor-pointer text-[#1C63DB] underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </section>
    </form>
  );
};

import { ChangeEvent, FormEvent, useState } from "react";

export const NewPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    newPasswordRepeat: "",
  });
  const [passwordError, setPasswordError] = useState("");

  const formDataChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.newPasswordRepeat) {
      setPasswordError("Passwords do not match");
    }
  };

  return (
    <div className="w-full h-screen flex items-start py-0">
      <div className="w-[665px] h-full flex px-[76.5px] py-0 flex-col justify-center items-center self-center bg-[#1C63DB]">
        <aside className="p-[40px] flex items-center justify-center flex-col">
          <h1 className="text-white text-center text-[96px] font-bold">
            VITAI
          </h1>
          <h3 className="text-white text-center text-[32px] font-medium">
            The Holistic Health Assistant
          </h3>
        </aside>
      </div>
      <div className="w-full h-full flex justify-center items-center self-stretch flex-1 bg-[linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), #FFF]">
        <form
          className="w-[550px] flex flex-col items-center gap-[60px]"
          onSubmit={handleSubmit}
        >
          <h3 className="text-black text-center font-[Inter] font-semibold text-[40px]">
            Create new password
          </h3>
          <main className="flex flex-col gap-[24px] items-start self-stretch">
            <div className="flex flex-col items-start gap-[10] self-stretch">
              <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
                New Password
              </label>
              <input
                type="password"
                placeholder="Enter New Password"
                name="newPassword"
                onChange={formDataChangeHandler}
                className="px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
              />
            </div>
            <div className="flex flex-col items-start gap-[10] self-stretch">
              <label className="self-stretch text-[#5f5f65] text-[16px] font-semibold font-[Nunito]">
                Confirm new password
              </label>
              <div className="flex flex-row-reverse items-center w-full">
                <input
                  type="password"
                  placeholder="Enter New Password"
                  name="newPasswordRepeat"
                  onChange={formDataChangeHandler}
                  className={
                    passwordError
                      ? "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#FF1F0F] bg-white outline-none focus-visible:outline-none focus:duration-300 focus:ease-in"
                      : "w-full px-[16px] py-[11px] flex items-center h-[44px] self-stretch gap-[10px] rounded-[8px] border-[1px] border-[#DFDFDF] bg-white outline-none focus-visible:outline-none focus:border-[#1C63DB] focus:duration-300 focus:ease-in"
                  }
                />
              </div>
              <p className="text-[#FF1F0F] font-[Nunito] font-medium px-[16px] flex items-center justify-center gap-[10px]">
                {passwordError}
              </p>
            </div>
          </main>
          <div className="flex flex-col items-center gap-[24px] slef-stretch">
            <button
              type="submit"
              className={
                formData.newPassword.length > 8 &&
                formData.newPasswordRepeat.length > 8 &&
                !passwordError
                  ? "flex w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#1C63DB] text-white font-[Nunito] text-[16px] font-semibold"
                  : "flex w-[250px] h-[44px] p-[16px] justify-center items-center rounded-full bg-[#D5DAE2] text-[#5F5F65] font-[Nunito] text-[16px] font-semibold"
              }
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

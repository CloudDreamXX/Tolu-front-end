import { useState } from "react";
import Input from "../small/Input";
import Button from "../small/Button";
import Dropdown from "../small/Dropdown";

const SignupForm = () => {
  const [formData, setFormData] = useState({});
  const [verifyEmail, setVerifyEmail] = useState(true);
  const formDataChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("form", formData);
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="py-5 px-5 sm:py-[25px] lg:py-[35px] sm:px-[35px] border-2 border-primary/10 rounded-[20px] mt-6 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6"
    >
      <div className="lg:col-span-12 flex justify-center">
        <h5 className="text-xl md:text-[32px] bg-gradientText text-transparent bg-clip-text font-extrabold leading-none">
          Sign up
        </h5>
      </div>
      <div className="lg:col-span-6">
        <Input
          label="Full name"
          placeholder="Full Name"
          name="fullName"
          onChange={formDataChangeHandler}
        />
      </div>
      <div className="lg:col-span-6">
        <Input
          label="Last name"
          placeholder="Last Name"
          name="lastName"
          onChange={formDataChangeHandler}
        />
      </div>
      <div className="lg:col-span-6">
        <Input
          label="Nick name"
          placeholder="Nick Name"
          name="nickName"
          onChange={formDataChangeHandler}
        />
      </div>
      <div className="lg:col-span-6">
        <Dropdown
          defaultText="Select"
          label="Gender"
          options={[
            { option: "Male", value: "male" },
            { option: "Female", value: "female" },
          ]}
        />
      </div>

      <div className="lg:col-span-6">
        <Input
          label="Phone number"
          placeholder="number"
          type="tel"
          name="phoneNumber"
          onChange={formDataChangeHandler}
        />
      </div>

      <div className="lg:col-span-6">
        <Input
          label="Nationality"
          placeholder="nationality"
          name="nationality"
          onChange={formDataChangeHandler}
        />
      </div>
      <div className="lg:col-span-10">
        <Input
          label="Email address"
          placeholder="mail@gmail.com"
          name="email"
          onChange={formDataChangeHandler}
        />
      </div>
      <div className="lg:col-span-2 flex items-end">
        <Button
          text="Verify email"
          width="w-full"
          onClick={() => setVerifyEmail(false)}
        />
      </div>
      {/* <div className="lg:col-span-6">
        <Input
          label="Date"
          placeholder="Date of birth"
          name="date"
          type="date"
          onChange={formDataChangeHandler}
        />
      </div> */}
      <div
        className={`lg:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 ${
          verifyEmail ? "opacity-50" : "opacity-100"
        }`}
      >
        <div className="lg:col-span-12">
          <Input
            label="Enter OTP code"
            placeholder="code"
            name="otp-code"
            type="number"
            onChange={formDataChangeHandler}
            disabled={verifyEmail}
          />
        </div>
        <div className="lg:col-span-12">
          <Button text="Sign up" width="w-full" disabled={verifyEmail} />
        </div>
      </div>
    </form>
  );
};

export default SignupForm;

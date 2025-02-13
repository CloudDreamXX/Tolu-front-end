import { useState } from "react";
import Button from "../../components/small/Button";
import SignupForm from "../../components/forms/SignupForm";
import LoginForm from "../../components/forms/LoginForm";

const Signup = () => {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <section className="w-full flex flex-col  p-4   h-screen ">
      <div className="flex justify-end">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button
            text="Login"
            bg={`  hover:bg-gray-300 ${!showLogin ? "text-white bg-primary" : "text-black"}`}
            onClick={() => setShowLogin(false)}
          />
          <Button
            text="Sign Up"
            bg={` hover:bg-gray-300  ${showLogin ? "text-white bg-primary" : "text-black"}`}
            onClick={() => setShowLogin(true)}
          />
        </div>
      </div>
      <section className="container w-full h-[calc(100vh-80px)] items-center justify-center mx-auto flex flex-col ">
        <div className=" w-full   flex items-center  justify-center ">

          {showLogin ? <SignupForm /> : <LoginForm />}
        </div>

      </section>
    </section>
  );
};

export default Signup;

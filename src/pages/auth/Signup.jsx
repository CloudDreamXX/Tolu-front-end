import { useState } from "react";
import Button from "../../components/small/Button";
import SignupForm from "../../components/forms/SignupForm";
import LoginForm from "../../components/forms/LoginForm";

const Signup = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <section className="w-full bg-white p-4  min-h-screen lg:h-screen bg-no-repeat bg-left-top bg-contain">
      <section className="container mx-auto flex flex-col ">
        <div className="flex justify-end">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button
              text="Login"
              bg={` hover:bg-gray-300  ${showLogin ? "text-white bg-primary" : "text-black"}`}
              onClick={() => setShowLogin(true)}
            />
            <Button
              text="Sign Up"
              bg={`  hover:bg-gray-300 ${!showLogin ? "text-white bg-primary" : "text-black"}`}
              onClick={() => setShowLogin(false)}
            />
          </div>
        </div>
        <div className=" w-full  flex items-center  justify-center ">
          
          {showLogin ? <LoginForm /> : <SignupForm />}
        </div>
        
      </section>
    </section>
  );
};

export default Signup;

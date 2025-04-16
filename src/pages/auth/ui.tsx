import { useState } from "react";
import { Button } from "shared/ui/_deprecated";
import { LoginForm, SignupForm } from "widgets/auth-forms";

export const Auth = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <section className="flex flex-col w-full h-screen p-4 ">
      <div className="flex justify-end">
        <div className="flex items-center w-full gap-4 sm:w-auto">
          <Button
            text="Login"
            bg={`  hover:bg-gray-300 ${!showLogin ? "text-white bg-gray-400" : " text-black"}`}
            onClick={() => setShowLogin(false)}
          />
          <Button
            text="Sign Up"
            bg={` hover:bg-gray-300  ${showLogin ? "text-white bg-gray-400" : " text-black"}`}
            onClick={() => setShowLogin(true)}
          />
        </div>
      </div>
      <section className="container w-full h-[calc(100vh-80px)] items-center justify-center mx-auto flex flex-col ">
        <div className="flex items-center justify-center w-full ">
          {showLogin ? <SignupForm /> : <LoginForm />}
        </div>
      </section>
    </section>
  );
};
